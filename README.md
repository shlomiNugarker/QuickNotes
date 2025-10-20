# QuickNotes - Mini SaaS Application

A full-stack note-taking application demonstrating service scaling, load balancing, Redis caching, and containerization.

## Tech Stack

**Frontend:** React + Vite + TypeScript + TailwindCSS
**Backend:** NestJS + TypeORM + PostgreSQL + Redis
**Infrastructure:** Docker Compose + NGINX Load Balancer

---

## Setup Instructions

### Prerequisites
- Docker & Docker Compose

### Quick Start

```bash
# 1. Setup environment
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:8080
# API: http://localhost:3000
# Health: http://localhost:3000/health
# Metrics: http://localhost:3000/metrics
```

### Development Mode (with hot reload)

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Useful Commands

```bash
docker-compose logs -f         # View all logs
docker-compose down            # Stop services
docker-compose ps              # Check service status
docker-compose down -v         # Remove all containers/volumes
```

---

## API Endpoints

**Base URL:** `http://localhost:3000`

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | `{ "email", "password" }` |
| POST | `/auth/login` | Login user | `{ "email", "password" }` |

**Response:** `{ "access_token": "...", "user": {...} }`

### Notes (Protected - requires JWT token)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/notes` | Get all notes | - |
| GET | `/notes?tags=tag1,tag2` | Search by tags (cached) | - |
| GET | `/notes/:id` | Get single note | - |
| POST | `/notes` | Create note | `{ "title", "content", "tags": [] }` |
| PUT | `/notes/:id` | Update note | `{ "title", "content", "tags": [] }` |
| DELETE | `/notes/:id` | Delete note | - |

**Authentication:** Add header `Authorization: Bearer <token>`

### Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/metrics` | Prometheus metrics |

---

## Architecture Overview

### Components

- **Frontend (NGINX):** Serves React SPA on port 8080
- **Load Balancer (NGINX):** Routes requests to API instances on port 3000
- **API Instances (x2):** NestJS applications running on internal port 3000
- **PostgreSQL:** Primary database for users and notes
- **Redis:** Caching layer for tag-based search queries (5 min TTL)

### Request Flow

```
Browser → Frontend :8080 → Load Balancer :3000 → API-1 or API-2 → PostgreSQL/Redis
```

### Scaling
- 2 API instances behind NGINX load balancer (round-robin)
- Stateless JWT authentication enables horizontal scaling
- Redis cache invalidation on note create/update/delete

---

## Architecture Decisions & Tradeoffs

### 1. Two API Instances + Load Balancer
**Why:** High availability and load distribution. If one instance fails, the other continues serving.
**Tradeoff:** 2x resource usage, more complex logging.

### 2. Redis Caching
**Why:** Tag-based searches can be expensive. Redis provides sub-ms response times for cached queries.
**Tradeoff:** Cache invalidation complexity, additional infrastructure component.

### 3. JWT Authentication
**Why:** Stateless auth works perfectly with multiple API instances. No session replication needed.
**Tradeoff:** Cannot revoke tokens before expiration.

### 4. PostgreSQL + TypeORM
**Why:** Production-proven reliability, TypeScript type safety.
**Tradeoff:** Using `synchronize: true` for development (production should use migrations).

### 5. NGINX for Frontend
**Why:** 10x better performance than Node.js for serving static files.
**Tradeoff:** Additional configuration file.

### 6. Monorepo Structure
**Why:** Simplified development workflow, single Docker Compose file.
**Tradeoff:** Larger repository size.

### 7. Docker Multi-Stage Builds
**Why:** Smaller production images, better security (no build dependencies).
**Tradeoff:** Longer build times.

### 8. Vite over CRA
**Why:** 10-100x faster dev server, instant HMR.
**Tradeoff:** Different configuration from Create React App.

---

## Environment Variables

See `.env.example` for all configuration options.

**Important:** Change `JWT_SECRET` and database passwords in production!

---

## Project Structure

```
QuickNotes/
├── nestjs/              # NestJS Backend
│   ├── src/
│   │   ├── auth/       # JWT authentication
│   │   ├── notes/      # Notes CRUD + Redis caching
│   │   ├── health/     # Health checks + Prometheus metrics
│   │   └── entities/   # TypeORM entities (User, Note)
│   ├── Dockerfile
│   └── Dockerfile.dev
├── react/              # React Frontend
│   ├── src/
│   │   ├── pages/      # Login, Register, Dashboard
│   │   ├── components/ # UI components
│   │   ├── services/   # API services
│   │   └── context/    # Auth context
│   ├── Dockerfile
│   └── nginx.conf
├── nginx/              # Load balancer config
│   └── nginx.conf
├── docker-compose.yml  # Production setup
├── docker-compose.override.yml  # Dev mode (hot reload)
├── Makefile            # Convenience commands
└── .env.example        # Environment template
```

---

## Notes

- **Cache TTL:** Redis caches search results for 5 minutes per user/query
- **Health Checks:** All services have automated health monitoring
- **Hot Reload:** Use `docker-compose.override.yml` for development with live code updates
- **Metrics:** Prometheus-compatible metrics available at `/metrics`
