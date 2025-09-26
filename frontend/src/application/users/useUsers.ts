import { ref } from 'vue';
import type { User, CreateUserRequest } from '@domain/users/user.model';
import { UserApi } from '@infrastructure/users/user.api';

const userApi = new UserApi();

export function useUsers() {
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadUsers = async () => {
    try {
      loading.value = true;
      error.value = null;
      users.value = await userApi.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load users';
    } finally {
      loading.value = false;
    }
  };

  const loadUser = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;
      currentUser.value = await userApi.getById(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load user';
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userRequest: CreateUserRequest) => {
    try {
      loading.value = true;
      error.value = null;
      const newUser = await userApi.create(userRequest);
      users.value.push(newUser);
      return newUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create user';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    currentUser,
    loading,
    error,
    loadUsers,
    loadUser,
    createUser,
  };
}