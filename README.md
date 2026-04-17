# Booking System

A full-stack **property booking** demo: REST APIs for users, rental properties, and reservations, backed by **PostgreSQL**, with a **React** UI to exercise the endpoints during development.

## What it does

- **Users** — Create and manage guests with name, email, and phone.
- **Properties** — Listings with title, location, price per night, and a free-text availability field.
- **Bookings** — Link a user to a property for a date range; the API rejects invalid ranges and **overlapping** reservations for the same property.
- **Availability check** — Query whether a property is free for a given window (see API routes below).

## Repository layout

| Folder | Role |
|--------|------|
| [`node-server/`](node-server/) | **Primary API** — Node.js, **Express**, **TypeORM**, `pg`. Hand-rolled routes, services, and centralized HTTP error handling. |
| [`nest-server/`](nest-server/) | **Alternate API** — **NestJS** implementation of the same domain (modules, DI, cache interceptor). Useful to compare frameworks. |
| [`frontend/`](frontend/) | **React + Vite** “API explorer” — tabs for users, properties, and bookings; sends `fetch` requests and shows JSON responses. |

Both `node-server` and `nest-server` expect a PostgreSQL database (default name `booking_app`). TypeORM `synchronize` is enabled for local development (schema is inferred from entities; **turn this off and use migrations in production**).

## Tech stack

- **Runtime:** Node.js  
- **Languages:** TypeScript  
- **APIs:** Express (`node-server`) or NestJS (`nest-server`)  
- **ORM:** TypeORM  
- **Database:** PostgreSQL  
- **Caching:** `apicache` on GET requests (`node-server`); `@nestjs/cache-manager` (`nest-server`)  
- **Frontend:** React 19, Vite 8  

## Features (high level)

- RESTful CRUD for **users**, **properties**, and **bookings**
- **Conflict detection** when creating a booking if another booking overlaps the same property and dates
- **Availability endpoint** for a property between two query dates
- **CORS** enabled on the APIs for browser clients
- **GET response caching** (short TTL) to reduce repeated read load during development
- **Structured errors** (`node-server`: `HttpError` + middleware → JSON status bodies)

## Data model

- **User** — id, name, email, phone_number; one-to-many **bookings**
- **Property** — id, title, location, price_per_night, availability; one-to-many **bookings**
- **Booking** — id, user, property, start_date, end_date (many-to-one to user and property)

Entities for the Express app live in [`node-server/src/entities/entities.ts`](node-server/src/entities/entities.ts).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally  
- A database named `booking_app` (or change the config in the app you run)

Connection defaults are defined in code (host `localhost`, port `5432`). For a public repo, prefer moving credentials to environment variables and documenting them in `.env.example` (not committed).

## Quick start — Express API + explorer UI

### 1. Database

Create the database and ensure the user/password in [`node-server/src/data-source.ts`](node-server/src/data-source.ts) match your Postgres instance.

### 2. API (`node-server`)

```bash
cd node-server
npm install
npm run start:dev
```

Default URL: `http://localhost:3000`

### 3. Frontend (`frontend`)

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). Requests use the `/api` prefix, which **Vite proxies** to `http://localhost:3000` (see [`frontend/vite.config.ts`](frontend/vite.config.ts)).

Optional: point the UI at a different API with `VITE_API_URL`, e.g. `VITE_API_URL=http://localhost:3000` (no `/api` rewrite in that case).

## Quick start — Nest API (optional)

```bash
cd nest-server
npm install
```

Configure the database in the Nest `DatabaseModule` / providers to match your Postgres, then:

```bash
npm run start:dev
```

Use the same PostgreSQL database name if you want a single DB; do not run two apps that both `synchronize` against the same schema carelessly—prefer running only one of `node-server` or `nest-server` against that DB at a time, or disable synchronize and use migrations.

## API reference (Express `node-server`)

Base path: mount points below are relative to the Express app root (e.g. `http://localhost:3000/user`).

| Method | Path | Description |
|--------|------|---------------|
| GET | `/` | Health-style root |
| POST, GET, GET, PATCH, DELETE | `/user`, `/user/:id` | User CRUD |
| POST, GET, GET, PATCH, DELETE | `/property`, `/property/:id` | Property CRUD |
| GET | `/property/availiability/:id?startDate=&endDate=` | Returns whether the property is available for the range (`true`/`false`). **Note:** path spelling matches the implementation (`availiability`). |
| POST, GET, GET, PATCH, DELETE | `/booking`, `/booking/:id` | Booking CRUD |

**Create booking (JSON body example):**

```json
{
  "user_id": 1,
  "property_id": 1,
  "start_date": "2026-07-01",
  "end_date": "2026-07-05"
}
```

The Nest `nest-server` exposes analogous routes under its module structure; see that project’s controllers for exact paths and DTOs.

## Scripts summary

| Location | Command | Purpose |
|----------|---------|---------|
| `node-server` | `npm run start:dev` | Express + TypeORM with `tsx watch` |
| `node-server` | `npm run build` / `npm start` | Production build + run |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Production bundle |
| `nest-server` | `npm run start:dev` | Nest watch mode |

## License

This is a personal / portfolio project. Add a `LICENSE` file if you want explicit terms on GitHub.
