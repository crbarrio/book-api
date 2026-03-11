# Book API (NestJS + MongoDB + JWT)

API REST para gestionar un catalogo de libros, con autenticacion JWT para operaciones protegidas.

## Caracteristicas

- CRUD completo de libros (`create`, `read`, `update`, `delete`).
- Registro e inicio de sesion de usuarios:
	- `POST /auth/register`
	- `POST /auth/login`
- Proteccion con JWT en rutas sensibles:
	- `POST /books`
	- `PUT /books/:id`
	- `DELETE /books/:id`
- Password hasheado con `bcrypt`.
- Campo `password` oculto por defecto en Mongo (`select: false`).
- Validacion global con `ValidationPipe`:
	- elimina propiedades no permitidas (`whitelist`)
	- rechaza propiedades extra (`forbidNonWhitelisted`)
	- transforma tipos automaticamente (`transform`)
- Documentacion interactiva con Swagger en `/api-docs`.
- Persistencia con MongoDB usando Mongoose.
- Manejo de errores de dominio:
	- `404 Not Found` cuando un libro no existe
	- `409 Conflict` cuando existe conflicto de datos (ej: ISBN o username duplicado)

## Stack tecnologico

- Node.js + npm
- NestJS
- MongoDB
- Docker + Docker Compose
- Passport + JWT
- Swagger (OpenAPI)

## Requisitos previos

Antes de ejecutar el proyecto necesitas:

- Node.js (recomendado: LTS reciente)
- npm
- Docker Desktop (con Docker Compose habilitado)

## Configuracion

El proyecto usa variables de entorno en `book-api/.env`:

- `DB_USER` (usuario root de Mongo en Docker)
- `DB_PASS` (password root de Mongo en Docker)
- `MONGODB_URI` (URI de conexion a MongoDB)
- `PORT` (puerto de la API)
- `JWT_SECRET` (clave secreta para firmar/verificar tokens)
- `JWT_EXPIRATION_TIME` (tiempo de expiracion del token, ejemplo: `1h`, `30m`, `7d`)

Ejemplo:

```env
DB_USER=your_username
DB_PASS=your_password
MONGODB_URI=mongodb://your_username:your_password@localhost:27017/book-api?authSource=admin
PORT=3000
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRATION_TIME=1h
```

## Puesta en marcha

> Importante: primero levanta MongoDB y despues inicia la API.

1. Entra al proyecto:

```bash
cd book-api
```

2. Levanta MongoDB:

```bash
docker compose up -d
```

3. Instala dependencias:

```bash
npm install
```

4. Inicia la API en desarrollo:

```bash
npm run start:dev
```

5. URLs utiles:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Flujo rapido de autenticacion

1. Registrar usuario con `POST /auth/register`.
2. Iniciar sesion con `POST /auth/login` para obtener `access_token`.
3. Enviar el token en rutas protegidas:

```http
Authorization: Bearer <access_token>
```

En Swagger puedes usar el boton `Authorize` para cargar el token Bearer.

## Endpoints

### Health

- `GET /`
	- Respuesta: `Hello World!`

### Auth

- `POST /auth/register`
	- Registra un nuevo usuario
	- `201` usuario registrado
	- `409` username ya existente

Body de ejemplo:

```json
{
	"username": "janedoe",
	"password": "passwordSegura123"
}
```

- `POST /auth/login`
	- Devuelve JWT
	- `200` login correcto
	- `401` credenciales invalidas

Body de ejemplo:

```json
{
	"username": "janedoe",
	"password": "passwordSegura123"
}
```

Respuesta de ejemplo:

```json
{
	"access_token": "eyJhbGciOiJIUzI1Ni..."
}
```

### Books

- `GET /books`
	- Lista todos los libros (publico)

- `GET /books/:id`
	- Obtiene un libro por ID (publico)

- `POST /books`
	- Crea un libro (requiere JWT)
	- `201` creado

- `PUT /books/:id`
	- Actualiza un libro (requiere JWT)
	- `200` actualizado

- `DELETE /books/:id`
	- Elimina un libro (requiere JWT)
	- `204` sin contenido

## Estructura del recurso Book

Campos:

- `title` *(string, requerido)*
- `author` *(string, requerido)*
- `year` *(number, opcional, >= 1000 y <= anio actual)*
- `isbn` *(string, opcional, unico, ISBN valido)*

Campos automaticos (Mongoose timestamps):

- `createdAt`
- `updatedAt`

## Validaciones y errores comunes

- `400 Bad Request`:
	- campos obligatorios faltantes
	- tipos invalidos
	- propiedades extra no permitidas por DTO
- `401 Unauthorized`:
	- token ausente/invalido en rutas protegidas
	- credenciales invalidas en login
- `404 Not Found`:
	- libro no encontrado
- `409 Conflict`:
	- ISBN duplicado
	- username duplicado

## Scripts utiles

Dentro de `book-api`:

- `npm run start` -> arranque normal
- `npm run start:dev` -> desarrollo con watch
- `npm run start:prod` -> ejecutar build de produccion
- `npm run build` -> compilar proyecto
- `npm run lint` -> ejecutar linter
- `npm run test` -> unit tests
- `npm run test:cov` -> cobertura
- `npm run test:e2e` -> pruebas e2e

## Detener servicios

Para detener MongoDB:

```bash
docker compose down
```

## Troubleshooting

- Si `npm run start:dev` falla al arrancar:
	- verifica que exista `.env`
	- verifica `JWT_SECRET` y `JWT_EXPIRATION_TIME`
	- verifica que MongoDB este arriba (`docker compose ps`)
- Si cambias credenciales de Mongo (`DB_USER`/`DB_PASS`), actualiza tambien `MONGODB_URI`.

## Notas

- Esta API no incluye actualmente paginacion, filtros ni busqueda avanzada.
