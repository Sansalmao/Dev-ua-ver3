# Backend UA WG LACNOG
 
Backend de la plataforma de comunidades de práctica: autenticación, roles,
comunidades por perfil/etapa y retos. Construido con **Astro (server) + Prisma
(driver adapter libSQL) + Turso/SQLite + JWT**.
 
---
 
## Requisitos
 
- Node.js **>= 22.12**
- npm
## Puesta en marcha local
 
```bash
# 1. Dependencias (todas están en package.json)
npm install
 
# 2. Variables de entorno
cp .env.example .env
#   Para desarrollo deja DATABASE_URL="file:./dev.db" y define JWT_SECRET.
#   Generar el secret:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
 
# 3. Base de datos
npx prisma generate                     # genera el cliente (Prisma 7)
npx prisma migrate dev                  # aplica las migraciones
node prisma/seed.js                     # datos de prueba
node prisma/seed-challenges.js          # retos de prueba (opcional)
 
# 4. Levantar
npm run dev                             # http://localhost:4321
 
# 5. Verificar
curl http://localhost:4321/api/health           # → {"status":"ok"}
curl http://localhost:4321/api/debug/sentry-check # dispara un error de prueba en Sentry
```

> **Prisma 7:** el cliente es "Rust-free", por lo que usa el driver adapter
> libSQL (ver `src/lib/prisma.js`). No declares `driverAdapters` en
> `previewFeatures`: en la v7 es GA y rompería la validación del schema.

## Monitoreo con Sentry

- El DSN es público y ya viene por defecto; el `SENTRY_AUTH_TOKEN` (secreto,
  para subir source maps) se define solo como variable de entorno.
- Config de runtime en `sentry.client.config.js` y `sentry.server.config.js`.
- Verificación: `GET /api/debug/sentry-check` lanza un error a propósito.
  Bórralo cuando confirmes que aparece en el dashboard.
 
Usuarios sembrados (contraseña **`password123`**):
 
| Email | Rol | Estado |
| ----- | --- | ------ |
| admin@ua.edu | Admin de plataforma | — |
| helena.cruz@ua.edu | Profesor | VERIFIED (tiene comunidades) |
| daniel.reyes@ua.edu | Profesor | PENDING (para probar aprobación) |
| martin.solis@ua.edu … | Estudiantes | — |
 
## Pasar a Turso (producción)
 
`turso dev` da una réplica local; para la nube, en `.env`:
 
```
TURSO_DATABASE_URL="libsql://tu-base.turso.io"
TURSO_AUTH_TOKEN="tu-token"
```
 
Si esas dos variables están presentes, tienen prioridad sobre `DATABASE_URL`.
**No hay que cambiar código**: `src/lib/prisma.js` resuelve la conexión solo.
