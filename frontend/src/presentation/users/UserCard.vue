<template>
  <div class="user-card" :class="{ 'user-card--selected': isSelected }">
    <div class="user-card__header">
      <h3 class="user-card__username">{{ user.username }}</h3>
      <div class="user-card__actions" v-if="showActions">
        <button
          class="user-card__action user-card__action--edit"
          @click="$emit('edit', user)"
          :disabled="loading"
        >
          Edit
        </button>
        <button
          class="user-card__action user-card__action--delete"
          @click="$emit('delete', user)"
          :disabled="loading"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="user-card__body">
      <p class="user-card__email">{{ user.email }}</p>
      <div class="user-card__metadata">
        <small class="user-card__created">
          Created: {{ formatDate(user.createdAt) }}
        </small>
        <small
          class="user-card__updated"
          v-if="user.updatedAt !== user.createdAt"
        >
          Updated: {{ formatDate(user.updatedAt) }}
        </small>
      </div>
    </div>

    <div class="user-card__footer" v-if="$slots.footer">
      <slot name="footer" :user="user"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "@domain/users/user";

interface Props {
  user: User;
  showActions?: boolean;
  loading?: boolean;
  isSelected?: boolean;
}

interface Emits {
  edit: [user: User];
  delete: [user: User];
  select: [user: User];
}

withDefaults(defineProps<Props>(), {
  showActions: true,
  loading: false,
  isSelected: false,
});

defineEmits<Emits>();

// Helper function to format dates
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.user-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  cursor: pointer;
}

.user-card:hover {
  border-color: #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-card--selected {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.user-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-card__username {
  margin: 0;
  color: #333;
  font-size: 1.1em;
  font-weight: 600;
}

.user-card__actions {
  display: flex;
  gap: 8px;
}

.user-card__action {
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.2s ease;
}

.user-card__action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.user-card__action--edit {
  color: #1976d2;
  border-color: #1976d2;
}

.user-card__action--edit:hover:not(:disabled) {
  background-color: #1976d2;
  color: white;
}

.user-card__action--delete {
  color: #d32f2f;
  border-color: #d32f2f;
}

.user-card__action--delete:hover:not(:disabled) {
  background-color: #d32f2f;
  color: white;
}

.user-card__body {
  margin-bottom: 12px;
}

.user-card__email {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.95em;
}

.user-card__metadata {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-card__created,
.user-card__updated {
  color: #999;
  font-size: 0.8em;
}

.user-card__footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 12px;
}
</style>
