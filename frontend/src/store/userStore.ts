import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, CreateUserData, UpdateUserData } from "@domain/users/user";
import { UserApi } from "@infrastructure/users/userApi";

/**
 * Pinia store for user management
 * Provides centralized state management for users with actions and getters
 */
export const useUserStore = defineStore("user", () => {
  // State
  const users = ref<User[]>([]);
  const selectedUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters (computed properties)
  const getUserCount = computed(() => users.value.length);
  const hasUsers = computed(() => users.value.length > 0);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== null);

  // Actions
  const loadUsers = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      users.value = await UserApi.getAllUsers();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load users";
      console.error("Error loading users:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadUserById = async (id: string): Promise<User | null> => {
    loading.value = true;
    error.value = null;

    try {
      const user = await UserApi.getUserById(id);
      if (user) {
        selectedUser.value = user;
      }
      return user;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load user";
      console.error("Error loading user:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData: CreateUserData): Promise<User | null> => {
    loading.value = true;
    error.value = null;

    try {
      const newUser = await UserApi.createUser(userData);
      users.value.push(newUser);
      return newUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create user";
      console.error("Error creating user:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (
    id: string,
    userData: UpdateUserData,
  ): Promise<User | null> => {
    loading.value = true;
    error.value = null;

    try {
      const updatedUser = await UserApi.updateUser(id, userData);
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      if (selectedUser.value?.id === id) {
        selectedUser.value = updatedUser;
      }
      return updatedUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update user";
      console.error("Error updating user:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await UserApi.deleteUser(id);
      users.value = users.value.filter((user) => user.id !== id);
      if (selectedUser.value?.id === id) {
        selectedUser.value = null;
      }
      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete user";
      console.error("Error deleting user:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  const selectUser = (user: User | null): void => {
    selectedUser.value = user;
  };

  const findUserById = (id: string): User | undefined => {
    return users.value.find((user) => user.id === id);
  };

  return {
    // State
    users,
    selectedUser,
    loading,
    error,

    // Getters
    getUserCount,
    hasUsers,
    isLoading,
    hasError,

    // Actions
    loadUsers,
    loadUserById,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    selectUser,
    findUserById,
  };
});
