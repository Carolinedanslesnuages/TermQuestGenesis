# TermQuestGenesis

A modern quest management system built with Clean Architecture principles, featuring a NestJS backend and Vue 3 frontend.

## 📋 Project Overview

TermQuestGenesis is designed to manage users and quests with a clean, maintainable architecture that separates concerns across well-defined layers. This project serves as a foundation for a quest-based application system.

## 🏗️ Architecture

This project follows Clean Architecture principles with clear separation of concerns:

### Backend (NestJS + TypeScript)
```
backend/src/
├── domain/          # Business entities and interfaces
│   ├── users/       # User domain logic
│   └── quests/      # Quest domain logic
├── application/     # Use cases and business logic
│   ├── users/       # User services
│   └── quests/      # Quest services
├── infrastructure/  # External concerns (database, APIs)
│   ├── database/    # Prisma configuration
│   ├── users/       # User repository implementations
│   └── quests/      # Quest repository implementations
└── presentation/    # Controllers and API endpoints
    ├── users/       # User controllers
    └── quests/      # Quest controllers
```

### Frontend (Vue 3 + TypeScript)
```
frontend/src/
├── domain/          # Business models and interfaces
│   ├── users/       # User models
│   └── quests/      # Quest models
├── application/     # Application logic and composables
│   ├── users/       # User composables
│   └── quests/      # Quest composables
├── infrastructure/  # External services and APIs
│   ├── users/       # User API client
│   └── quests/      # Quest API client
└── presentation/    # Vue components and UI
    ├── users/       # User components
    └── quests/      # Quest components
```

## 🚀 Features

- **User Management**: Create and manage users with email and username
- **Quest System**: Create and manage quests with different statuses (draft, active, completed, archived)
- **Clean Architecture**: Well-organized codebase with clear separation of concerns
- **Type Safety**: Full TypeScript support across backend and frontend
- **API Documentation**: Swagger/OpenAPI documentation for the backend API
- **Responsive UI**: Modern Vue 3 interface with composition API

## 🛠️ Technology Stack

### Backend
- **NestJS**: Modern Node.js framework with decorators and dependency injection
- **TypeScript**: Type-safe JavaScript development
- **Prisma ORM**: Modern database toolkit with type-safe queries
- **Swagger**: API documentation and testing
- **Class Validator**: Request validation
- **RxJS**: Reactive programming support

### Frontend
- **Vue 3**: Modern reactive JavaScript framework
- **TypeScript**: Type-safe development
- **Composition API**: New Vue 3 composition API
- **Pinia**: State management
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

The backend API will be available at `http://localhost:3000` with Swagger documentation at `http://localhost:3000/api`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend application will be available at `http://localhost:3001`.

### Docker Setup (Recommended)

For a complete setup with PostgreSQL database:

```bash
# Clone the repository
git clone <repository-url>
cd TermQuestGenesis

# Start all services with Docker Compose
docker compose up -d

# View running services
docker compose ps

# Stop all services
docker compose down
```

This will start:
- **Backend API**: `http://localhost:3000`
- **Frontend App**: `http://localhost:3001`
- **PostgreSQL Database**: `localhost:5432`

## 🎯 Available Scripts

### Backend Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user

### Quests
- `GET /quests` - Get all quests
- `GET /quests/:id` - Get quest by ID
- `GET /quests?status=active` - Get quests by status
- `GET /quests/user/:userId` - Get quests by user
- `POST /quests` - Create new quest

## 📋 Data Models

### User
```typescript
{
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Quest
```typescript
{
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚧 Development Status

This is the initial project scaffold. The following are implemented:

✅ **Complete Project Structure**
- Clean Architecture folder structure for both backend and frontend
- TypeScript configuration with path aliases
- Package.json files with all necessary dependencies

✅ **Backend Foundation**
- Domain entities for Users and Quests
- Repository interfaces following dependency inversion
- Application services with business logic
- Infrastructure layer with in-memory repositories
- Presentation layer with REST controllers
- Swagger API documentation setup

✅ **Frontend Foundation**
- Domain models matching backend entities
- Infrastructure layer with API clients
- Application layer with Vue composables
- Presentation layer with Vue components
- Clean component architecture with proper separation

✅ **Development Infrastructure**
- Docker containerization for backend and frontend
- Docker Compose setup with PostgreSQL database
- GitHub Actions CI/CD pipeline for automated testing and building

## 🔄 Next Steps

The current implementation provides a solid foundation for development. Future enhancements might include:

- Database integration (PostgreSQL/MongoDB)
- User authentication and authorization
- Advanced quest features (deadlines, rewards, dependencies)
- Real-time updates with WebSockets
- Unit and integration tests

## 🤝 Contributing

This project follows Clean Architecture principles. When contributing:

1. Keep business logic in the domain layer
2. Use dependency injection for external dependencies
3. Follow the established folder structure
4. Write type-safe TypeScript code
5. Add appropriate error handling

## 📄 License

This project is licensed under the MIT License.