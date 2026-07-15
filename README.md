# UA WG LACNOG — Plataforma web unificada

Aplicación **Astro SSR** que sirve, desde un solo origen, el contenido de los
módulos, la API y las pantallas de la plataforma (dashboard y consola admin).

**Stack:** Astro 7 (`output: "server"`) · Better Auth · Prisma 7 + driver adapter
libSQL · Turso · Tailwind v4 (solo en piezas nuevas) · Sentry · Cloudflare
Turnstile.

---

## 1. Levantar el entorno local

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
cp .env.example .env
#    Editar .env (ver sección 2). Mínimo: BETTER_AUTH_SECRET y TURNSTILE_SECRET_KEY.

# 3. Base de datos local
npx prisma generate          # genera el cliente (OBLIGATORIO en Prisma 7)
npx prisma migrate dev       # aplica las migraciones a dev.db
node prisma/seed.js          # datos de prueba (NO correr contra producción)

# 4. Arrancar
npm run dev                  # http://localhost:4321

# 5. Verificar
curl http://localhost:4321/api/health     # → {"status":"ok"}
```

> **Si `npm run dev` falla con un error de Prisma**, casi siempre falta
> `npx prisma generate`. En Prisma 7 el cliente es "Rust-free" y no funciona sin
> generarse ni sin el driver adapter.

---

## 2. Variables de entorno

| Variable | ¿Obligatoria? | Para qué |
|---|---|---|
| `DATABASE_URL` | Sí (local) | SQLite local, p. ej. `file:./dev.db` |
| `TURSO_DATABASE_URL` | Sí (prod) | Turso. **Tiene prioridad** sobre `DATABASE_URL` |
| `TURSO_AUTH_TOKEN` | Sí (prod) | Token de Turso |
| `BETTER_AUTH_SECRET` | **Sí** | Firma de sesiones. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Sí | URL base pública de la app |
| `TURNSTILE_SECRET_KEY` | **Sí** | Verificación anti-bot en el servidor |
| `PUBLIC_TURNSTILE_SITE_KEY` | **Sí** | Widget de Turnstile en el navegador |
| `SENTRY_DSN` | No | Público. Ya hay uno por defecto |
| `SENTRY_AUTH_TOKEN` | No | **Secreto.** Solo para subir source maps en el build |

> Astro solo expone al navegador las variables con prefijo **`PUBLIC_`**.
> Cualquier otra vive únicamente en el servidor.

### Llaves de Turnstile

Las de prueba de Cloudflare **van de a pares** y no se mezclan con las reales:

| Entorno | Site key (pública) | Secret (servidor) |
|---|---|---|
| Desarrollo | `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` |
| Producción | la de tu dashboard | la de tu dashboard |

Al pasar a producción hay que cambiar **las dos**: una secret real rechaza el
token que genera una site key de prueba.

---

## 3. Base de datos

### Local
```bash
npx prisma migrate dev --name <nombre>   # crear + aplicar migración
npx prisma studio                        # inspeccionar datos
```

### Turso (producción)
Prisma Migrate **no** se conecta a Turso remoto: el motor habla con un archivo
local, no con el protocolo de Turso. El esquema se aplica con SQL:

```bash
# Tras crear una migración local, aplicá ese mismo SQL a Turso:
node apply-turso-schema.mjs prisma/migrations/<la-más-reciente>/migration.sql

# Verificar qué hay del otro lado:
node check-turso.mjs
```

> **No corras `prisma/seed.js` con las variables `TURSO_*` puestas**: metería los
> usuarios de prueba en la base de producción.

---

## 4. Reglas de negocio (auditoría v2.2)

Todas se validan **en el servidor**. Ninguna depende de lo que envía el cliente.

| Regla | Dónde vive |
|---|---|
| Un profesor nace `PENDING`; un admin lo verifica | `auth-server.js` (hook) + `/api/admin/teachers/:id/verify` |
| Solo un profesor **VERIFIED** crea comunidades | `requireVerifiedTeacher` en `POST /api/communities` |
| Una comunidad nace siempre en `CONCEPTOS_CLAVE` | `POST /api/communities` ignora `stage` del body |
| Un usuario tiene **una** solicitud `PENDING` a la vez | `POST /api/communities/:id/join-requests` |
| Un profesor con comunidad propia no puede solicitar unirse | ídem |
| Un profesor tiene **máximo 2** membresías aprobadas | ídem |
| El profesor dueño ve los retos de su comunidad sin ser miembro | `getUserCommunityContext` (F-C1) |
| Los retos se filtran por etapa | `GET /api/communities/:id/challenges` |
| Solo el **dueño** promueve/gradúa su comunidad | `/promote`, `/graduate` |
| `MEMBER` solo ve su propia fila en miembros | RBAC server-side en `GET /api/communities/:id/members` |
| `isAdmin` nunca se acepta del cliente | hook `before` de Better Auth |

**Nomenclatura (F-A2):** el modelo usa `requesterId`/`requester`, **nunca**
`studentId`. Los enums viajan en MAYÚSCULA (`PROFESOR`, `CONCEPTOS_CLAVE`,
`PENDING`); traducirlos a etiqueta legible es tarea del front.

---

## 5. Mapa del proyecto

```
src/
  pages/
    index.astro              Landing + grilla de módulos (prerender)
    dashboard.astro          Dashboard (SSR, requiere sesión)
    admin.astro              Consola admin (SSR, requiere isAdmin)
    modulos/[slug].astro     Módulo de contenido (prerender)
    api/                     Endpoints REST
  components/                AuthModal, ProfileModal, NavBar, paneles…
  layouts/                   BaseLayout, ModuleLayout, DashboardLayout
  data/modulos/**/*.mdx      Contenido de los módulos
  lib/
    prisma.js                Cliente Prisma (adapter libSQL: local o Turso)
    auth-server.js           Configuración de Better Auth
    auth.js                  requireUser / requireRole / requireAdmin / …
    api-client.ts            ÚNICA capa de llamadas del front a la API
    community-context.js     Comunidades propias ∪ membresías
    turnstile.js             Verificación anti-bot
  middleware.ts              Resuelve la sesión → Astro.locals.user
```

---

## 6. Trampas conocidas (leer antes de tocar)

**`@astrojs/mdx` está fijado en `7.0.2` — sin `^`. No lo actualices.**
La `7.0.3` tiene una regresión que **escapa el HTML de Shiki**: los bloques de
código de los módulos salen vacíos. Solo pasa en archivos `.mdx`.

**`define:vars` envuelve el script en un IIFE.** Las funciones no quedan en
`window`, así que un `onclick="foo()"` del markup falla con *"foo is not
defined"*. En `dashboard.astro` y `admin.astro` los handlers se exponen a mano
con `Object.assign(window, {...})`. Si agregás un handler inline, sumalo ahí.

**`src/lib/prisma.js` tiene una anotación JSDoc `@type` que no es decorativa.**
Sin ella, `globalThis.__prisma` contagia `any` a todo el cliente y aparecen
decenas de errores `ts(7006)`. Y **no escribas esa etiqueta en la prosa** del
comentario: TypeScript la parsea y anula la anotación real.

**Páginas con `prerender = true`** (landing y módulos) se renderizan en el build:
ahí `Astro.locals.user` **no existe**. La sesión se resuelve en el cliente con
`getSession()`.

**El progreso de módulos es doble:** `localStorage` (invitados) + tabla
`TopicProgress` (registrados). `ProfileModal` los fusiona por unión al iniciar
sesión, así el invitado que se registra no pierde su avance.

---

## 7. Monitoreo

Sentry se configura en `sentry.client.config.js` y `sentry.server.config.js`
(runtime) y en `astro.config.mjs` (solo source maps).

> En `@sentry/astro` v10 **no** se pasan `dsn`/`enableLogs`/`sendDefaultPii`
> dentro de la integración: está deprecado. Van en los archivos de config.

---

## 8. Despliegue (Render)

Es **una sola** aplicación SSR: va como **Web Service** (Node), no como Static
Site.

```
Build:  npm install && npx prisma generate && npm run build
Start:  node ./dist/server/entry.mjs
```

Variables del servicio: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (dominio real), `TURNSTILE_SECRET_KEY`,
`PUBLIC_TURNSTILE_SITE_KEY` y, si querés source maps, `SENTRY_AUTH_TOKEN`.

### Antes de publicar

- [ ] Llaves de Turnstile **reales** (site key **y** secret).
- [ ] `BETTER_AUTH_SECRET` propio de producción.
- [ ] `BETTER_AUTH_URL` apuntando al dominio real.
- [ ] Esquema aplicado en Turso (`apply-turso-schema.mjs`).
- [ ] Revisar `security.checkOrigin` en `astro.config.mjs` (hoy en `false`).
- [ ] Crear el usuario admin a mano (`isAdmin: true`): no hay endpoint público.
- [ ] Ver `docs/checklist-cierre.md` (pruebas T3.10 / T4.5 / T4.10).
