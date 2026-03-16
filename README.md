# Free Concerts App
run with docker follow by folder run_with_docker

# Free Concerts Backend

A NestJS-based REST API for managing concert reservations, built with TypeScript, TypeORM, and PostgreSQL.

## 🚀 Features

- **Concert Management**: Create, view, and delete concerts
- **Reservation System**: Book and cancel concert reservations
- **User Authentication**: Simple email-based login system
- **Reservation History**: Track all reservation activities
- **Seat Management**: Automatic seat availability tracking
- **Comprehensive Validation**: Robust input validation with clear error messages
- **Full Test Coverage**: Complete unit test suite with 89 tests

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

## 🛠️ Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd free-concerts-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=concerts
TYPEORM_SYNC=false

# Application Configuration
PORT=3001
NODE_ENV=development
```

### 4. Database Setup
Ensure PostgreSQL is running and create the database:
```sql
CREATE DATABASE free_concerts;
```

### 5. Run Database Migrations
The application will automatically run migrations and seed data on startup.

### 6. Start the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3001`

## 🏗️ Architecture Overview

### **Layered Architecture Pattern**

```
┌─────────────────────────────────────────────────────────────┐
│                    Controllers Layer                        │
│  (HTTP Request Handling, Input Validation, Response)        │
├─────────────────────────────────────────────────────────────┤
│                     Services Layer                         │
│      (Business Logic, Use Cases, Data Processing)           │
├─────────────────────────────────────────────────────────────┤
│                Repository Layer                             │
│         (Data Access, Database Operations)                  │
├─────────────────────────────────────────────────────────────┤
│                 Database Layer                              │
│           (PostgreSQL, TypeORM Entities)                    │
└─────────────────────────────────────────────────────────────┘
```

### **Module Structure**

```
src/
├── concerts/                 # Concert management module
│   ├── admin-concerts.controller.ts    # Admin concert operations
│   ├── user-concerts.controller.ts     # User-facing concert operations
│   ├── concerts.service.ts             # Concert business logic
│   ├── create-concert.dto.ts           # Concert creation validation
│   └── concert.entity.ts               # Concert data model
├── reservations/             # Reservation management module
│   ├── reservations.controller.ts      # Reservation operations
│   ├── reservations.service.ts         # Reservation business logic
│   ├── create-reservation.dto.ts       # Reservation validation
│   └── reservation.entity.ts           # Reservation data model
├── reservation-history/       # History tracking module
│   ├── reservation-history.controller.ts
│   ├── reservation-history.service.ts
│   └── reservation-history.entity.ts
├── user/                     # User management module
│   ├── user.controller.ts              # User operations
│   ├── user.service.ts                 # User business logic
│   ├── login.dto.ts                    # Login validation
│   └── user.entity.ts                  # User data model
├── seeder/                   # Database seeding module
│   └── seeder.service.ts               # Initial data population
├── database/                 # Database configuration
│   └── data-source.ts                 # TypeORM configuration
├── app.module.ts             # Root application module
└── main.ts                   # Application bootstrap
```

### **Design Patterns**

- **Dependency Injection**: NestJS's built-in DI container
- **Repository Pattern**: TypeORM repositories for data access
- **DTO Pattern**: Data Transfer Objects for request/response validation
- **Service Layer Pattern**: Business logic separation from controllers
- **Entity Relationship Mapping**: TypeORM for database entities

## 📚 Key Libraries & Packages

### **Core Framework**
- **@nestjs/core** (v10.x): Main NestJS framework
- **@nestjs/common** (v10.x): Common NestJS decorators and utilities
- **@nestjs/platform-express** (v10.x): Express.js adapter
- **@nestjs/typeorm** (v10.x): TypeORM integration for NestJS
- **@nestjs/mapped-types** (v2.x): DTO mapping utilities

### **Database & ORM**
- **typeorm** (v0.3.x): Object-Relational Mapping library
- **pg** (v8.x): PostgreSQL client for Node.js
- **reflect-metadata** (v0.1.x): TypeScript reflection metadata

### **Validation & Serialization**
- **class-validator** (v0.14.x): Class-based validation decorators
- **class-transformer** (v0.5.x): Object transformation utilities

### **Testing Framework**
- **@nestjs/testing** (v10.x): NestJS testing utilities
- **jest** (v29.x): JavaScript testing framework
- **@types/jest** (v29.x): TypeScript definitions for Jest
- **supertest** (v6.x): HTTP assertion library for API testing

### **Development Tools**
- **typescript** (v5.x): TypeScript compiler
- **@types/node** (v20.x): TypeScript definitions for Node.js
- **ts-node** (v10.x): TypeScript execution environment
- **nodemon** (v3.x): Auto-restart development server

### **Role of Each Library**

| Library | Purpose | Key Features |
|---------|---------|--------------|
| **NestJS** | Core framework | Modular architecture, DI container, decorators |
| **TypeORM** | Database ORM | Entity mapping, migrations, repository pattern |
| **class-validator** | Input validation | Decorator-based validation, custom error messages |
| **Jest** | Testing framework | Unit tests, mocking, coverage reports |
| **PostgreSQL** | Database | Relational database, ACID compliance |

## 🧪 Running Unit Tests

### **Run All Tests**
```bash
npm test
```

### **Run Tests in Watch Mode**
```bash
npm run test:watch
```

### **Run Tests with Coverage**
```bash
npm run test:cov
```

### **Run Specific Test File**
```bash
npm test -- src/concerts/concerts.service.spec.ts
```

### **Test Results Summary**
```
Test Suites: 13 passed, 13 total
Tests:       89 passed, 89 total
Coverage:    57.07% statements, 71.05% branches
```

### **Test Coverage Areas**
- ✅ **Controllers**: All HTTP endpoints tested
- ✅ **Services**: Business logic and use cases covered
- ✅ **DTOs**: Input validation scenarios tested
- ✅ **Entities**: Data model relationships verified
- ✅ **Error Handling**: Exception scenarios covered

## 📡 API Endpoints

### **Health Check**
- `GET /` - Application health status

### **Concert Management**
- `GET /concerts/:id` - Get concert by ID
- `POST /admin/concerts` - Create new concert
- `GET /admin/concerts` - List all concerts
- `GET /admin/concerts/seats-summary` - Get seats availability summary
- `DELETE /admin/concerts/:id` - Delete concert

### **Reservations**
- `POST /reservations` - Create reservation
- `PATCH /reservations/:id/cancel` - Cancel reservation

### **User Management**
- `POST /user/login` - User login

### **History**
- `GET /reservation-history` - Get reservation history

## 🔧 Validation System

The application uses a comprehensive validation system with:

- **Fail-fast validation**: Required field checks first
- **Clear error messages**: User-friendly validation feedback
- **Structured responses**: Consistent error format
- **Type safety**: TypeScript integration throughout

### **Validation Example**
```json
// Invalid Request Response
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "totalSeats",
      "message": "Total seats must be at least 1"
    }
  ]
}
```

## 🚀 Development Workflow

### **Adding New Features**
1. Create/update entities in `src/*/entities/`
2. Add DTOs for validation in `src/*/dto/`
3. Implement business logic in services
4. Add controller endpoints
5. Write comprehensive unit tests
6. Update documentation

### **Code Quality Standards**
- TypeScript strict mode enabled
- Comprehensive error handling
- Input validation on all endpoints
- 100% test coverage for new features
- Consistent code formatting

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3001` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | `free_concerts` |
| `NODE_ENV` | Environment mode | `development` |

## 🐛 Troubleshooting

### **Common Issues**

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Migration Issues**
   - Drop and recreate database
   - Check migration files in `src/database/migrations/`

3. **Port Already in Use**
   - Kill process using port 3001: `netstat -ano | findstr :3001`
   - Change PORT in environment variables

4. **Test Failures**
   - Ensure database is clean
   - Check test environment configuration
   - Run `npm run test:cov` for detailed coverage report

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**
