/**
 * Main frontend exports
 * Centralized exports for the TermQuestGenesis frontend application
 */

// Re-export main application components
export { default as App } from "./App.vue";

// Re-export stores
export * from "./store";

// Re-export router
export { default as router } from "./router";

// Re-export presentation components
export * from "./presentation";

// Re-export domain models
export * from "./domain/users/user";
export * from "./domain/quests/quest";

// Re-export application composables
export { useUsers } from "./application/users/useUsers";
export { useQuests } from "./application/quests/useQuests";

// Re-export API clients
export { UserApi } from "./infrastructure/users/userApi";
export { QuestApi } from "./infrastructure/quests/questApi";
