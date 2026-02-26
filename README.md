# Book API (NestJS + MongoDB)

API REST para gestionar un catálogo de libros, construida con NestJS y MongoDB.

## Características de la API

- CRUD completo de libros (`create`, `read`, `update`, `delete`).
- Validación global de payloads con `ValidationPipe`:
	- elimina propiedades no permitidas (`whitelist`),
	- rechaza propiedades extra (`forbidNonWhitelisted`),
	- transforma tipos automáticamente (`transform`).
- Documentación interactiva con Swagger en `/api-docs`.
- Persistencia con MongoDB usando Mongoose.
- Manejo de errores de dominio:
	- `404 Not Found` cuando un libro no existe,
	- `409 Conflict` cuando el `isbn` ya existe.
- Esquema de libro con:
	- `title` y `author` obligatorios,
	- `year` opcional (mínimo `1000`, no puede ser futuro),
	- `isbn` opcional y único,
	- `timestamps` (`createdAt`, `updatedAt`).

## Stack tecnológico

- Node.js + npm
- NestJS
- MongoDB
- Docker + Docker Compose
- Swagger (OpenAPI)

## Requisitos previos

Antes de ejecutar el proyecto necesitas:

- Node.js (recomendado: versión LTS reciente)
- npm
- Docker Desktop (con Docker Compose habilitado)

## Configuración

El proyecto usa variables de entorno en `book-api/.env`:

- `MONGODB_URI` (URI de conexión a MongoDB)
- `PORT` (puerto de la API)
- `DB_USER` (usuario root de Mongo en Docker)
- `DB_PASS` (password root de Mongo en Docker)

Valores actuales de ejemplo:

```env
MONGODB_URI=mongodb://localhost:27017/book-api-nestjs
PORT=3000
DB_USER=dbuser
DB_PASS=userpassword
```

## Puesta en marcha (orden obligatorio)

> **Importante:** primero debes levantar el contenedor de base de datos con Docker y **después** arrancar el servicio de API.

1. Entra en el proyecto de la API:

```bash
cd book-api
```

2. Arranca MongoDB en Docker:

```bash
docker compose up -d
```

3. Instala dependencias:

```bash
npm install
```

4. Arranca la API en desarrollo:

```bash
npm run start:dev
```

5. Accede a:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Endpoints disponibles

### Health

- `GET /`  
	Devuelve un mensaje de prueba (`Hello World!`).

### Books

- `GET /books`  
	Lista todos los libros.

- `GET /books/:id`  
	Obtiene un libro por id.

- `POST /books`  
	Crea un libro. Código esperado: `201`.

- `PUT /books/:id`  
	Actualiza un libro por id. Código esperado: `200`.

- `DELETE /books/:id`  
	Elimina un libro por id. Código esperado: `204`.

## Estructura del recurso Book

Campos:

- `title` *(string, requerido)*
- `author` *(string, requerido)*
- `year` *(number, opcional, >= 1000 y <= año actual)*
- `isbn` *(string, opcional, único)*

Campos automáticos (Mongoose timestamps):

- `createdAt`
- `updatedAt`

## Validaciones y comportamiento de errores

- Si faltan campos obligatorios o hay tipos incorrectos, la API responde `400 Bad Request`.
- Si se envían propiedades no definidas en DTO, la API las rechaza (`400`).
- Si el libro no existe en `GET /books/:id`, `PUT /books/:id` o `DELETE /books/:id`, responde `404`.
- Si se intenta crear un libro con un `isbn` duplicado, responde `409`.

## Scripts útiles

Dentro de `book-api`:

- `npm run start` → arranque normal
- `npm run start:dev` → desarrollo con watch
- `npm run start:prod` → ejecutar build de producción
- `npm run build` → compilar proyecto
- `npm run lint` → ejecutar linter
- `npm run test` → unit tests
- `npm run test:cov` → cobertura
- `npm run test:e2e` → pruebas e2e

## Detener servicios

Para detener MongoDB en Docker:

```bash
docker compose down
```

## Notas

- Esta API no incluye actualmente paginación, filtros ni búsqueda avanzada.
- Si cambias credenciales de Mongo en Docker, revisa también `MONGODB_URI` para mantener la conexión de la API.
