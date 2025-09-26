<template>
  <div class="user-list">
    <h2>Users</h2>
    
    <div v-if="loading" class="loading">
      Loading users...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && users.length === 0" class="no-users">
      No users found.
    </div>

    <div v-if="users.length > 0" class="users-grid">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="user-card"
      >
        <h3>{{ user.username }}</h3>
        <p>{{ user.email }}</p>
        <small>Created: {{ formatDate(user.createdAt) }}</small>
      </div>
    </div>

    <button @click="loadUsers" class="refresh-btn">
      Refresh
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUsers } from '@application/users/useUsers';

const { users, loading, error, loadUsers } = useUsers();

onMounted(() => {
  loadUsers();
});

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.loading, .error, .no-users {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
}

.user-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-card p {
  margin: 5px 0;
  color: #666;
}

.refresh-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-btn:hover {
  background: #0056b3;
}
</style>