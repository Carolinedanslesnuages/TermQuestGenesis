# TermQuestGenesis Frontend

A modern Vue 3 frontend application built with TypeScript and Clean Architecture principles for the TermQuestGenesis quest management system.

## 🏗️ Architecture

This frontend follows Clean Architecture principles with clear separation of concerns across well-defined layers:

```
src/
├── domain/          # Business models and interfaces
│   ├── users/       # User domain models
│   │   └── user.ts  # User interfaces and types
│   └── quests/      # Quest domain models
│       └── quest.ts # Quest interfaces and types
├── application/     # Application logic and composables
│   ├── users/       # User composables
│   │   └── useUsers.ts
│   └── quests/      # Quest composables
│       └── useQuests.ts
├── infrastructure/ # External services and APIs
│   ├── users/      # User API client
│   │   └── userApi.ts
│   └── quests/     # Quest API client
│       └── questApi.ts
├── presentation/   # Vue components and UI
│   ├── components/ # Shared components
│   │   └── Layout.vue
│   ├── pages/      # Page components
│   │   ├── Home.vue
│   │   └── NotFound.vue
│   ├── users/      # User-specific components
│   │   ├── UserList.vue
│   │   └── UserCard.vue
│   └── quests/     # Quest-specific components
│       ├── QuestList.vue
│       └── QuestCard.vue
├── store/          # Pinia state management
│   ├── index.ts    # Store exports
│   ├── userStore.ts
│   └── questStore.ts
├── router/         # Vue Router configuration
│   └── index.ts
├── App.vue         # Root application component
└── main.ts         # Application entry point
```

## 🚀 Features

### ✅ Complete Implementation

- **Clean Architecture**: Well-organized codebase with clear separation of concerns
- **Type Safety**: Full TypeScript support across all layers
- **State Management**: Pinia stores for centralized state management
- **Routing**: Vue Router with navigation guards and route-based titles
- **Responsive Design**: Mobile-first responsive components
- **Component Library**: Reusable UI components with consistent styling
- **API Integration**: Ready-to-use API clients for backend communication

### 🎨 User Interface

- **Modern Design**: Clean and intuitive user interface
- **Component-Based**: Modular, reusable Vue 3 components
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Interactive Elements**: Cards, forms, navigation with smooth transitions
- **Loading States**: Proper loading and error handling throughout the app

### 🔧 Developer Experience

- **Hot Reload**: Fast development with Vite's hot module replacement
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Type Checking**: TypeScript compiler integration
- **Path Aliases**: Clean imports using @ aliases for better organization

## 🛠️ Technology Stack

- **Vue 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Static type checking and enhanced developer experience
- **Pinia**: Modern state management for Vue
- **Vue Router**: Official router for Vue.js
- **Vite**: Fast build tool and development server
- **Axios**: Promise-based HTTP client for API calls
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3001`

## 🎯 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality
- **`npm run lint:style`** - Run Stylelint for CSS/SCSS files

## 🗂️ Project Structure Details

### Domain Layer (`src/domain/`)

Contains business models and interfaces that represent the core entities of the application.

- **`users/user.ts`**: User entity interfaces including `User`, `CreateUserData`, and `UpdateUserData`
- **`quests/quest.ts`**: Quest entity interfaces with status types and CRUD data interfaces

### Application Layer (`src/application/`)

Houses the application logic through Vue composables that orchestrate business operations.

- **`users/useUsers.ts`**: User management composable with reactive state and operations
- **`quests/useQuests.ts`**: Quest management composable with filtering and status management

### Infrastructure Layer (`src/infrastructure/`)

Handles external concerns like API communication and data persistence.

- **`users/userApi.ts`**: HTTP client for user-related API endpoints
- **`quests/questApi.ts`**: HTTP client for quest-related API endpoints

### Presentation Layer (`src/presentation/`)

Contains all UI components, pages, and user interface logic.

- **`components/`**: Shared UI components used across the application
- **`pages/`**: Full-page components representing different routes
- **`users/`** & **`quests/`**: Feature-specific components

### Store (`src/store/`)

Pinia stores for centralized state management.

- **`userStore.ts`**: User state management with actions and getters
- **`questStore.ts`**: Quest state management with filtering and status operations

## 🎨 Component Usage Examples

### Using the UserCard Component

```vue
<template>
  <UserCard
    :user="user"
    :show-actions="true"
    :loading="false"
    @edit="handleEditUser"
    @delete="handleDeleteUser"
  />
</template>
```

### Using the QuestCard Component

```vue
<template>
  <QuestCard
    :quest="quest"
    :show-actions="true"
    @edit="handleEditQuest"
    @delete="handleDeleteQuest"
    @status-change="handleStatusChange"
  />
</template>
```

### Using Stores in Components

```vue
<script setup lang="ts">
import { useUserStore } from '@store/userStore'
import { useQuestStore } from '@store/questStore'

const userStore = useUserStore()
const questStore = useQuestStore()

// Load data
await userStore.loadUsers()
await questStore.loadQuests()
</script>
```

## 🔌 API Integration

The frontend is designed to work with the TermQuestGenesis backend API. API clients are configured to make requests to the following endpoints:

- **Users**: `/users/*`
- **Quests**: `/quests/*`

### Environment Configuration

Configure the API base URL through environment variables or by modifying the API client base URLs in the infrastructure layer.

## 🚧 Development Guidelines

### Adding New Features

1. **Domain First**: Define interfaces in the domain layer
2. **Infrastructure**: Implement API clients if needed
3. **Application**: Create composables for business logic
4. **Presentation**: Build UI components
5. **Store**: Add state management if global state is needed

### Code Style

- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use ESLint and Prettier configurations
- Implement proper error handling
- Add loading states for async operations

### Component Guidelines

- Keep components focused and single-purpose
- Use props for data input and events for output
- Implement proper TypeScript interfaces for props
- Add responsive styling with mobile-first approach

## 🔄 Integration with Backend

This frontend is designed to integrate seamlessly with the TermQuestGenesis NestJS backend. The API clients match the backend's REST endpoints and data structures.

### Data Flow

1. **User Interaction** → Presentation Layer
2. **Business Logic** → Application Layer (Composables)
3. **API Calls** → Infrastructure Layer (API Clients)
4. **State Updates** → Store Layer (Pinia Stores)
5. **UI Updates** → Presentation Layer (Reactive Components)

## 📱 Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add TypeScript types for all new code
3. Test components in different screen sizes
4. Run linting before committing
5. Update documentation for new features

## 📄 License

This project is part of the TermQuestGenesis system and follows the same license as the main project.