# Free Concert Tickets System

A full-stack concert reservation system that allows users to reserve seats for free concerts and administrators to manage concerts.

##### Run with Docker ############
Move docker-compose.yaml to the parent directory and run it from there.
Follow the instructions in the parent directory's README.md.
##################################

## Project Structure

```
Test DataWow/
│
├── docker-compose.yaml        # Run entire system
├── README.md                  # Main documentation
│
├── free-concerts-backend/
│   ├── Dockerfile
│   └── README.md
│
└── free-concerts-frontend/
    ├── Dockerfile
    └── README.md
```
## System Architecture

```
┌───────────────┐
│   Frontend    │
│  Next.js App  │
│   Port 3000   │
└───────┬───────┘
        │ HTTP
        ▼
┌───────────────┐
│   Backend     │
│   NestJS API  │
│   Port 3001   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  PostgreSQL   │
│   Database    │
│   Port 5432   │
└───────────────┘
```

## Prerequisites

Install the following tools:

- **Docker**
- **Docker Compose**
- **Git**

Check installation:
```bash
docker -v
docker compose version
```

## Running the Application (Recommended)

The easiest way to run the entire system is using Docker Compose.

### 1. Clone the repository
```bash
git clone <repository-url>
cd Test DataWow
```

### 2. Run all services
```bash
docker compose up --build
```

This will start:

| Service     | Port | Description          |
|-------------|------|----------------------|
| Frontend    | 3000 | Next.js application  |
| Backend     | 3001 | NestJS API          |
| PostgreSQL  | 5432 | Database            |

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Stop containers
```bash
docker compose down
```

## Docker Services Overview

The `docker-compose.yaml` orchestrates three containers:

- **PostgreSQL**: Database used by the backend with data persisted using Docker volumes
- **Backend**: NestJS REST API that connects to PostgreSQL container
- **Frontend**: Next.js web application that communicates with backend API

## Development Without Docker

If you want to run services manually:

### Backend
See full documentation: [`free-concerts-backend/README.md`](free-concerts-backend/README.md)

```bash
cd free-concerts-backend
npm install
npm run start:dev
```
Backend runs at: http://localhost:3001

### Frontend
See full documentation: [`free-concerts-frontend/README.md`](free-concerts-frontend/README.md)

```bash
cd free-concerts-frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

## Environment Configuration

Environment variables are configured inside each service:

### Backend (.env)
```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=concerts
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_USER_EMAIL=john.doe@example.com
```

## Useful Docker Commands

- **Rebuild containers**: `docker compose up --build`
- **Run in background**: `docker compose up -d`
- **Stop containers**: `docker compose down`
- **Remove volumes**: `docker compose down -v`

## Application Architecture

The system follows a layered architecture for the backend and a custom hooks architecture for the frontend.

### Backend Architecture (NestJS)
```
Controller Layer
    ↓
Service Layer
    ↓
Repository Layer (TypeORM)
    ↓
Database (PostgreSQL)
```

#### Layers
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic such as reservation processing, seat validation, and history tracking
- **Repositories**: Use TypeORM repositories to perform database operations
- **Entities**: Define database tables and relationships

### Frontend Architecture (Next.js)
```
UI Components
      ↓
Custom Hooks
      ↓
API Layer
      ↓
Backend REST API
```

#### Components
- **UI Components**: Responsible for UI rendering (Concert cards, Admin dashboards, Reservation history tables)
- **Custom Hooks**: Encapsulate business logic (`useAdminConcerts`, `useUserConcerts`, `useHistory`)
- **API Layer**: Centralized Axios instance for communicating with the backend

## Libraries & Packages

### Backend Libraries
| Library              | Role                          |
|----------------------|-------------------------------|
| **NestJS**          | Backend application framework |
| **TypeORM**         | ORM for database communication |
| **PostgreSQL (pg)** | Database driver              |
| **class-validator** | Request validation           |
| **class-transformer**| DTO transformation          |
| **Jest**            | Unit testing framework       |
| **Supertest**       | API testing                  |

### Frontend Libraries
| Library          | Role                    |
|------------------|-------------------------|
| **Next.js**     | React framework        |
| **React**       | UI library             |
| **TypeScript**  | Static typing          |
| **TailwindCSS** | Styling framework      |
| **Axios**       | HTTP client            |
| **Zod**         | Form validation        |
| **React Icons** | UI icons               |

## Running Unit Tests

Unit tests are implemented in the backend using Jest.

### Run all tests
```bash
cd free-concerts-backend
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:cov
```

Example output:
```
Test Suites: 13 passed
Tests:       89 passed
Coverage:    ~57%
```

The tests cover:
- Controllers
- Services
- DTO validation
- Error handling
- Reservation logic

## Key Features

### User Features
- View available concerts
- Reserve concert seats
- Cancel reservations
- View reservation history

### Admin Features
- Create concerts
- Delete concerts
- Monitor seat availability
- View reservation statistics

## Technologies Used

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL

### Frontend
- Next.js
- React
- TypeScript
- TailwindCSS

### DevOps
- Docker
- Docker Compose

---

**Full-Stack Concert Reservation System** built using modern web technologies including NestJS, Next.js, and PostgreSQL.