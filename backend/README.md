# TermQuestGenesis Backend

A robust NestJS backend application built with Clean Architecture principles, TypeScript, and PostgreSQL integration via TypeORM.

## 🏗️ Architecture

This backend follows Clean Architecture with clear separation of concerns:

- **Domain Layer**: Business entities and core interfaces
- **Application Layer**: Use cases and business logic services  
- **Infrastructure Layer**: Database repositories, external APIs, and data persistence
- **Presentation Layer**: REST controllers and API endpoints

## 🛠️ Technology Stack

- **NestJS**: Modern Node.js framework with decorators and dependency injection
- **TypeScript**: Type-safe JavaScript development
- **PostgreSQL**: Robust relational database
- **TypeORM**: Object-relational mapping with migration support
- **Swagger**: API documentation and testing
- **Jest**: Testing framework with comprehensive coverage

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database Configuration**
   Copy the example environment file and configure your database:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=termquestgenesis
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   NODE_ENV=development
   PORT=3000
   ```

3. **Database Migration**
   Run the initial migration to create the database schema:
   ```bash
   npm run migration:run
   ```

4. **Start the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

## 🗄️ Database Schema

The application uses explicit migrations for schema management (synchronize is disabled for production safety).

### Tables Created

- **users**: User accounts with email and username
- **quests**: Quest management with status tracking and user relationships

### Migration Commands

```bash
# Run pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Generate a new migration (after entity changes)
npm run migration:generate -- src/migrations/MigrationName
```

## 🚀 API Documentation

The API is documented using Swagger/OpenAPI. Once the application is running, visit:
- **Swagger UI**: `http://localhost:3000/api`
- **JSON Schema**: `http://localhost:3000/api-json`

### Available Endpoints

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Quests
- `GET /quests` - Get all quests (with optional status filter)
- `GET /quests/:id` - Get quest by ID
- `GET /quests/user/:userId` - Get quests by user
- `POST /quests` - Create new quest
- `PUT /quests/:id` - Update quest
- `DELETE /quests/:id` - Delete quest

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🏃‍♂️ Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Build

```bash
# Build for production
npm run build
```

## 🐳 Docker Support

The application includes Docker support via the docker-compose.yml in the root directory:

```bash
# Start with Docker Compose (from project root)
docker compose up -d

# View logs
docker compose logs backend

# Stop services
docker compose down
```

## 🔒 Production Considerations

- **Environment Variables**: Ensure all sensitive configuration is via environment variables
- **Migrations**: Always use explicit migrations instead of synchronize:true
- **Logging**: Adjust logging levels based on environment
- **Security**: Implement authentication and authorization as needed
- **Monitoring**: Add health checks and monitoring endpoints

## 📁 Project Structure

```
src/
├── domain/              # Business entities and interfaces
│   ├── users/           # User domain logic
│   └── quests/          # Quest domain logic
├── application/         # Use cases and business logic
│   ├── users/           # User services
│   └── quests/          # Quest services  
├── infrastructure/      # External concerns
│   ├── database/        # TypeORM configuration
│   ├── users/           # User repository implementations
│   └── quests/          # Quest repository implementations
├── presentation/        # Controllers and API endpoints
│   ├── users/           # User controllers
│   └── quests/          # Quest controllers
└── migrations/          # Database migration scripts
```

## 🤝 Contributing

1. Follow the Clean Architecture principles
2. Write comprehensive tests for new features
3. Use TypeScript strictly
4. Follow existing code style and patterns
5. Create migrations for any schema changes
6. Update API documentation for endpoint changes

## 📄 License

This project is licensed under the MIT License.