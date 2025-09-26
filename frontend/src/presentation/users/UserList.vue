<template>
  <div class="user-list">
    <h2>Users</h2>

    <div v-if="loading" class="loading">Loading users...</div>

    <div v-else-if="error" class="error">Error: {{ error }}</div>

    <div v-else-if="!hasUsers" class="empty">No users found.</div>

    <div v-else class="users">
      <div v-for="user in users" :key="user.id" class="user-item">
        <div class="user-info">
          <h3>{{ user.username }}</h3>
          <p>{{ user.email }}</p>
          <small>Created: {{ formatDate(user.createdAt) }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUsers } from "@application/users/useUsers";

// Use the users composable
const { users, loading, error, hasUsers, loadUsers } = useUsers();

// Load users on component mount
onMounted(() => {
  loadUsers();
});

// Helper function to format dates
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}

.error {
  color: #d32f2f;
  padding: 20px;
  background-color: #ffebee;
  border-radius: 4px;
  margin: 10px 0;
}

.empty {
  text-align: center;
  color: #666;
  padding: 20px;
}

.users {
  display: grid;
  gap: 16px;
}

.user-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.user-info h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.user-info p {
  margin: 0 0 8px 0;
  color: #666;
}

.user-info small {
  color: #999;
}
</style>
