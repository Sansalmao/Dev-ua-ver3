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
# 1. Dependencias
npm install
npm install prisma @prisma/client @libsql/client @prisma/adapter-libsql bcryptjs jsonwebtoken
 
# 2. Variables de entorno
cp .env.example .env
#   Para desarrollo, deja:
#     DATABASE_URL="file:./dev.db"
#     JWT_SECRET="<genera una cadena larga>"
#   Generar el secret:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
 
# 3. Base de datos
npx prisma migrate dev --name init     # crea el esquema
node prisma/seed.js                     # datos de prueba
node prisma/seed-challenges.js          # retos de prueba (opcional)
 
# 4. Levantar
npm run dev                             # http://localhost:4321
 
# 5. Verificar
curl http://localhost:4321/api/health   # → {"status":"ok"}
```
 
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
