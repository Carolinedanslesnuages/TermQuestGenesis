import { ref, reactive, computed } from "vue";
import type { Ref } from "vue";
import { UserApi } from "@infrastructure/users/userApi";
import type { User, CreateUserData, UpdateUserData } from "@domain/users/user";

/**
 * User management state interface
 */
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

/**
 * User management composable
 * Provides a Vue composable for managing users with reactive state
 */
export function useUsers() {
  // Reactive state
  const state = reactive<UserState>({
    users: [],
    loading: false,
    error: null,
  });

  // Selected user for operations
  const selectedUser: Ref<User | null> = ref(null);

  // Computed properties
  const userCount = computed(() => state.users.length);
  const hasUsers = computed(() => state.users.length > 0);
  const isLoading = computed(() => state.loading);
  const hasError = computed(() => state.error !== null);

  /**
   * Load all users from the API
   */
  const loadUsers = async (): Promise<void> => {
    state.loading = true;
    state.error = null;

    try {
      state.users = await UserApi.getAllUsers();
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to load users";
      console.error("Error loading users:", error);
    } finally {
      state.loading = false;
    }
  };

  /**
   * Load a specific user by ID
   * @param id - The user ID to load
   */
  const loadUserById = async (id: string): Promise<User | null> => {
    state.loading = true;
    state.error = null;

    try {
      const user = await UserApi.getUserById(id);
      selectedUser.value = user;
      return user;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to load user";
      console.error("Error loading user:", error);
      return null;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Create a new user
   * @param userData - The user data to create
   */
  const createUser = async (userData: CreateUserData): Promise<User | null> => {
    state.loading = true;
    state.error = null;

    try {
      const newUser = await UserApi.createUser(userData);
      state.users.push(newUser);
      return newUser;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to create user";
      console.error("Error creating user:", error);
      return null;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Update an existing user
   * @param id - The user ID to update
   * @param userData - Partial user data to update
   */
  const updateUser = async (
    id: string,
    userData: UpdateUserData,
  ): Promise<User | null> => {
    state.loading = true;
    state.error = null;

    try {
      const updatedUser = await UserApi.updateUser(id, userData);
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
      if (selectedUser.value?.id === id) {
        selectedUser.value = updatedUser;
      }
      return updatedUser;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to update user";
      console.error("Error updating user:", error);
      return null;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Delete a user by ID
   * @param id - The user ID to delete
   */
  const deleteUser = async (id: string): Promise<boolean> => {
    state.loading = true;
    state.error = null;

    try {
      await UserApi.deleteUser(id);
      state.users = state.users.filter((user) => user.id !== id);
      if (selectedUser.value?.id === id) {
        selectedUser.value = null;
      }
      return true;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to delete user";
      console.error("Error deleting user:", error);
      return false;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    state.error = null;
  };

  /**
   * Find user by ID in current state
   * @param id - The user ID to find
   */
  const findUserById = (id: string): User | undefined => {
    return state.users.find((user) => user.id === id);
  };

  /**
   * Set selected user
   * @param user - The user to select
   */
  const selectUser = (user: User | null): void => {
    selectedUser.value = user;
  };

  return {
    // State
    users: computed(() => state.users),
    selectedUser: computed(() => selectedUser.value),
    loading: isLoading,
    error: computed(() => state.error),

    // Computed
    userCount,
    hasUsers,
    hasError,

    // Actions
    loadUsers,
    loadUserById,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    findUserById,
    selectUser,
  };
}
