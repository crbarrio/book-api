# Book API (NestJS + MongoDB + JWT + Roles)

API REST para gestionar un catalogo de libros con autenticacion JWT y control de acceso por roles.

## Caracteristicas

- CRUD de libros.
- Registro y login de usuarios con JWT.
- Passwords hasheadas con `bcrypt`.
- Autorizacion por roles (`USER`, `ADMIN`) con `RolesGuard` y decorador `@Roles(...)`.
- Endpoints de escritura de libros restringidos a `ADMIN`.
- Validacion global con `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`).
- Documentacion Swagger en `/api-docs`.
- Persistencia en MongoDB con Mongoose.

## Roles Implementados

El sistema define estos roles en `src/users/schemas/user.schema.ts`:

- `UserRole.USER = 'user'`
- `UserRole.ADMIN = 'admin'`

Comportamiento actual:

- Todo usuario nuevo se crea con rol por defecto `user`.
- Las rutas `POST /books`, `PUT /books/:id` y `DELETE /books/:id` requieren rol `admin`.
- Si el token no existe o no es valido, la API responde `401`.
- Si el token es valido pero el usuario no tiene rol requerido, la API responde `403`.

## Matriz De Acceso

- Publico:
  - `GET /`
  - `GET /books`
  - `GET /books/:id`
  - `POST /auth/login`
  - `POST /auth/register`
- Usuario autenticado (`user`):
  - Sin endpoints exclusivos por ahora
- Solo `admin`:
  - `POST /books`
  - `PUT /books/:id`
  - `DELETE /books/:id`

## Stack Tecnologico

- Node.js + npm
- NestJS
- MongoDB
- Docker + Docker Compose
- Passport (`passport-jwt`)
- Swagger (OpenAPI)

## Requisitos Previos

- Node.js (LTS recomendada)
- npm
- Docker Desktop con Compose

## Variables De Entorno

Define un archivo `.env` en la raiz de `book-api` con:

- `DB_USER`
- `DB_PASS`
- `MONGODB_URI`
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRATION_TIME`

Ejemplo:

```env
DB_USER=your_username
DB_PASS=your_password
MONGODB_URI=mongodb://your_username:your_password@localhost:27017/book-api?authSource=admin
PORT=3000
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRATION_TIME=1h
```

## Puesta En Marcha

1. Levanta MongoDB:

```bash
docker compose up -d
```

2. Instala dependencias:

```bash
npm install
```

3. Inicia la API:

```bash
npm run start:dev
```

4. Verifica:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Flujo De Auth + Roles

1. Registra un usuario en `POST /auth/register`.
2. Haz login en `POST /auth/login` y guarda `access_token`.
3. Envia el token en rutas protegidas:

```http
Authorization: Bearer <access_token>
```

4. Para probar endpoints `ADMIN`, promueve el usuario en MongoDB.

Ejemplo con `mongosh` dentro del contenedor:

```bash
docker exec -it mongodb mongosh -u <DB_USER> -p <DB_PASS> --authenticationDatabase admin
```

Y luego:

```javascript
use('book-api');
db.users.updateOne(
  { username: 'janedoe' },
  { $set: { roles: ['admin'] } }
);
```

## Endpoints

### Health

- `GET /` -> `Hello World!`

### Auth

- `POST /auth/register`
  - Crea usuario
  - `201` creado
  - `409` username duplicado

Body ejemplo:

```json
{
  "username": "janedoe",
  "password": "passwordSegura123"
}
```

- `POST /auth/login`
  - Devuelve JWT
  - `200` OK
  - `401` credenciales invalidas

Body ejemplo:

```json
{
  "username": "janedoe",
  "password": "passwordSegura123"
}
```

Respuesta ejemplo:

```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni..."
}
```

### Books

- `GET /books` (publico)
- `GET /books/:id` (publico)
- `POST /books` (JWT + rol `admin`)
- `PUT /books/:id` (JWT + rol `admin`)
- `DELETE /books/:id` (JWT + rol `admin`)

## Estructura Del Recurso Book

- `title` *(string, requerido)*
- `author` *(string, requerido)*
- `year` *(number, opcional, >= 1000 y <= anio actual)*
- `isbn` *(string, opcional, unico)*
- `createdAt`, `updatedAt` *(auto, timestamps)*

## Codigos De Error Comunes

- `400` payload invalido
- `401` no autenticado
- `403` autenticado pero sin permisos
- `404` recurso no encontrado
- `409` conflicto (ISBN o username duplicado)

## Scripts Utiles

- `npm run start`
- `npm run start:dev`
- `npm run start:prod`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:cov`
- `npm run test:e2e`

## Detener Servicios

```bash
docker compose down
```

## Troubleshooting

- Si falla `npm run start:dev`:
  - revisa que exista `.env`
  - revisa `JWT_SECRET` y `JWT_EXPIRATION_TIME`
  - revisa MongoDB con `docker compose ps`
- Si cambias `DB_USER` o `DB_PASS`, actualiza tambien `MONGODB_URI`.
- Si un usuario autenticado no puede crear/editar/eliminar libros, revisa su campo `roles` en MongoDB.

## Notas

- Actualmente no hay endpoint administrativo para asignar roles; la promocion a `admin` se hace directamente en base de datos.
- No hay paginacion ni filtros avanzados en libros por ahora.
