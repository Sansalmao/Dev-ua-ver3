# Guía de instalación — UA WG LACNOG

Esta guía cubre el camino completo: clonar el repositorio, levantarlo en
local, y desplegarlo en producción (Render o Vercel). Para el mapa del
proyecto, las reglas de negocio y las trampas conocidas del código, ver
`README.md` — este documento es específicamente el checklist de puesta en
marcha.

---

## 1. Requisitos previos

- Node.js ≥ 22.12 (ver `engines` en `package.json` — algunas plataformas
  avisan si se usa una versión menor).
- npm (incluido con Node).
- Una cuenta de Cloudflare (para Turnstile — ver sección 4).
- Opcional para producción: cuenta de Turso (base de datos) y cuenta de
  Sentry (monitoreo de errores).

---

## 2. Clonar e instalar

```bash
git clone <url-del-repo>
cd <carpeta-del-proyecto>
npm install
```

Durante la instalación aparece un aviso de `npm warn allow-scripts` sobre
`@prisma/engines`, `@sentry/cli`, `esbuild` y `prisma`: es normal, son los
postinstall que generan binarios nativos. No es necesario ejecutar
`npm approve-scripts` de forma manual.

---

## 3. Variables de entorno

```bash
cp .env.example .env
```

En `.env` es necesario completar, como mínimo, estas dos (el resto tiene
valores de prueba que ya funcionan en local):

| Variable | Cómo se genera |
|---|---|
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `TURNSTILE_SECRET_KEY` | Se puede dejar el valor de prueba (`1x000...AA`) para desarrollo local |

El resto de las variables (`DATABASE_URL`, `PUBLIC_TURNSTILE_SITE_KEY`, etc.)
ya vienen con valores de desarrollo funcionales en `.env.example` — el
detalle de cada una está documentado en los comentarios de ese mismo
archivo.

**Nota:** `.env` nunca se commitea (está en `.gitignore`). Las variables de
producción se configuran aparte, directamente en la plataforma de
despliegue (ver sección 6) — copiar el `.env` local a producción no
funciona, ya que ni Render ni Vercel leen ese archivo.

---

## 4. Cloudflare Turnstile

El registro usa Turnstile como verificación anti-bot (`AuthModal.astro` +
`src/lib/turnstile.js`). Las llaves van de a pares — no deben mezclarse una
de prueba con una real:

- **Desarrollo** (ya incluidas en `.env.example`, no requieren cambios):
  - Site key: `1x00000000000000000000AA`
  - Secret: `1x0000000000000000000000000000000AA`
  - Estas llaves siempre pasan la verificación, en cualquier dominio, y
    sirven para probar el flujo de registro sin necesidad de una cuenta de
    Cloudflare.

- **Producción**: se crea un widget en
  [dash.cloudflare.com → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
  y se anotan las dos llaves reales. Al crear el widget, es necesario
  agregar el dominio de producción (el de Vercel, Render, o el dominio
  propio) a la lista de dominios permitidos — si el dominio no figura en esa
  lista, el widget falla con "No es posible conectarse al sitio web" aunque
  las llaves estén correctamente puestas en las variables de entorno.

---

## 5. Base de datos y arranque local

```bash
# Regenerar el cliente de Prisma (necesario tras clonar o tras cambios en schema.prisma)
npx prisma generate

# Crear las tablas en la base local (dev.db, SQLite)
npx prisma migrate dev

# Poblar con datos de prueba (usuarios, comunidades, retos)
npx prisma db seed

# Levantar el servidor de desarrollo
npm run dev
```

La verificación de que el servidor arrancó correctamente se hace con:

```bash
curl http://localhost:4321/api/health
# → {"status":"ok"}
```

El login se puede probar con cualquier usuario del seed (los emails están
en `prisma/seed.js`) usando la contraseña `password123`.

---

## 6. Despliegue en producción

El proyecto es Astro con `output: "server"` — no es un sitio estático, así
que en cualquier plataforma se despliega como servicio/función con
servidor, no como Static Site.

El adapter de Astro (`astro.config.mjs`) determina el formato de salida del
build y es específico de cada plataforma: el proyecto no puede estar
configurado para Render y Vercel al mismo tiempo. Cambiar de plataforma de
destino implica cambiar el adapter antes de desplegar.

### 6.1 Vercel

Requiere el adapter `@astrojs/vercel`:

```javascript
// astro.config.mjs
import vercel from "@astrojs/vercel";
// ...
export default defineConfig({
  output: "server",
  adapter: vercel(),
  // ...
});
```

```bash
npm install @astrojs/vercel
npm uninstall @astrojs/node
```

Las variables de entorno se configuran en Project Settings → Environment
Variables (Vercel no lee el `.env` del repositorio): `DATABASE_URL` (o
`TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`, que tienen prioridad),
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (dominio real, con `https://`),
`TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY` y, para subir source
maps, `SENTRY_AUTH_TOKEN`. Cualquier cambio o agregado de variables requiere
un nuevo deploy para tomar efecto.

Un error **404: NOT_FOUND de la plataforma** (distinto de un 404 de la
aplicación) al visitar el sitio desplegado suele indicar que el adapter
configurado no es el de Vercel — sin él, Vercel no tiene cómo enrutar las
páginas SSR.

### 6.2 Render

Requiere el adapter `@astrojs/node`:

```javascript
// astro.config.mjs
import node from "@astrojs/node";
// ...
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  // ...
});
```

```bash
npm install @astrojs/node
npm uninstall @astrojs/vercel
```

El despliegue se hace como **Web Service** (Node), con:

```
Build:  npm install && npx prisma generate && npm run build
Start:  node ./dist/server/entry.mjs
```

Variables del servicio: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (dominio real), `TURNSTILE_SECRET_KEY`,
`PUBLIC_TURNSTILE_SITE_KEY` y, para source maps, `SENTRY_AUTH_TOKEN`.

### 6.3 Sentry (opcional, aplica a ambas plataformas)

Si `sourceMapsUploadOptions` en `astro.config.mjs` referencia un `project`
que no existe en la cuenta de Sentry, o si el `SENTRY_AUTH_TOKEN` no tiene
permisos sobre ese org/proyecto, el build muestra errores del tipo
`Project not found` al subir sourcemaps. Esto no interrumpe el deploy, pero
conviene resolverlo:

1. Confirmar que `SENTRY_ORG`/el `project` de la config coincidan con los
   *slugs* exactos (no el nombre visible) que aparecen en la URL del
   proyecto en sentry.io.
2. Generar o rotar el token en Sentry → Settings → Auth Tokens, con scope de
   `project:releases`.
3. Si por el momento no es necesario tener sourcemaps, la subida se puede
   desactivar sin remover Sentry del todo, en `astro.config.mjs`:
   ```javascript
   sentry({
     sourceMapsUploadOptions: { enabled: false },
   }),
   ```

---

## 7. Después del primer deploy

- El campo `isAdmin: true` se otorga de forma manual (vía `prisma studio`
  contra la base de producción) — no existe endpoint público para esto, de
  forma intencional.
- `npx prisma db seed` está pensado solo para desarrollo. Contra una base de
  Turso de producción (con `TURSO_DATABASE_URL` seteada), ejecutarlo
  escribiría datos de prueba reales.
- Antes de tocar `@astrojs/mdx` (fijado en `7.0.2` de forma intencional) o
  el schema de Prisma, conviene revisar la sección "Trampas conocidas" de
  `README.md`.
