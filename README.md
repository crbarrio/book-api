# Book API (NestJS + MongoDB + JWT + Google OAuth + Roles)

API REST para gestionar un catalogo de libros con autenticacion local (JWT), autenticacion con Google OAuth 2.0 y control de acceso por roles.

## Caracteristicas

- CRUD de libros.
- Registro y login local de usuarios con JWT.
- Login con Google OAuth en `GET /auth/google`.
- Emision de JWT tambien en el callback de Google (`GET /auth/google/callback`).
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
  - `GET /auth/google`
  - `GET /auth/google/callback` (solo despues de autenticacion en Google)
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
- Passport (`passport-jwt`, `passport-google-oauth20`)
- Swagger (OpenAPI)

## Requisitos Previos

- Node.js (LTS recomendada)
- npm
- Docker Desktop con Compose
- Credenciales OAuth 2.0 de Google Cloud Console

## Variables De Entorno

Define un archivo `.env` en la raiz de `book-api` con:

- `DB_USER`
- `DB_PASS`
- `MONGODB_URI`
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRATION_TIME`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` (opcional, por defecto `http://localhost:3000/auth/google/callback`)

Ejemplo:

```env
DB_USER=your_username
DB_PASS=your_password
MONGODB_URI=mongodb://your_username:your_password@localhost:27017/book-api?authSource=admin
PORT=3000
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRATION_TIME=1h
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Configuracion Google Cloud

En tu OAuth Client ID de Google, agrega:

- `Authorized redirect URI`:
  - `http://localhost:3000/auth/google/callback`

Si usas otro host/puerto, actualiza `GOOGLE_CALLBACK_URL` y la URI autorizada en Google Cloud para que coincidan exactamente.

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

## Flujo De Auth (JWT + Google) + Roles

### Opcion 1: Login Local

1. Registra un usuario en `POST /auth/register`.
2. Haz login en `POST /auth/login` y guarda `access_token`.
3. Envia el token en rutas protegidas:

```http
Authorization: Bearer <access_token>
```

### Opcion 2: Login Con Google

1. Abre en navegador `GET /auth/google`.
2. Google autentica al usuario y redirige a `GET /auth/google/callback`.
3. El callback devuelve `{ access_token }`.
4. Usa ese token Bearer para rutas protegidas.

### Promocion A Admin Para Pruebas

Para probar endpoints `ADMIN`, promueve el usuario en MongoDB.

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
  - Crea usuario local
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
  - Login local
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

- `GET /auth/google`
  - Inicia OAuth con Google
  - `302` redireccion a Google

- `GET /auth/google/callback`
  - Callback OAuth de Google
  - `200` devuelve JWT (`access_token`)
  - `401` no autorizado

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

- `302` redireccion OAuth (inicio de login Google)
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
  - revisa `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`
  - revisa MongoDB con `docker compose ps`
- Si Google devuelve `redirect_uri_mismatch`:
  - revisa `GOOGLE_CALLBACK_URL`
  - revisa la URI autorizada en Google Cloud Console
- Si cambias `DB_USER` o `DB_PASS`, actualiza tambien `MONGODB_URI`.
- Si un usuario autenticado no puede crear/editar/eliminar libros, revisa su campo `roles` en MongoDB.

## Notas

- Actualmente no hay endpoint administrativo para asignar roles; la promocion a `admin` se hace directamente en base de datos.
- En el login con Google, si el usuario no existe, se crea automaticamente usando el email de Google como `username`.
- No hay paginacion ni filtros avanzados en libros por ahora.
