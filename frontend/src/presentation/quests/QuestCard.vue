<template>
  <div class="quest-card" :class="{ 'quest-card--selected': isSelected }">
    <div class="quest-card__header">
      <h3 class="quest-card__title">{{ quest.title }}</h3>
      <div class="quest-card__status-badge">
        <span
          class="quest-card__status"
          :class="`quest-card__status--${quest.status}`"
        >
          {{ quest.status.toUpperCase() }}
        </span>
      </div>
    </div>

    <div class="quest-card__body">
      <p class="quest-card__description">{{ quest.description }}</p>

      <div class="quest-card__metadata">
        <small class="quest-card__creator">
          Created by: {{ quest.createdById }}
        </small>
        <small class="quest-card__created">
          Created: {{ formatDate(quest.createdAt) }}
        </small>
        <small
          class="quest-card__updated"
          v-if="quest.updatedAt !== quest.createdAt"
        >
          Updated: {{ formatDate(quest.updatedAt) }}
        </small>
      </div>
    </div>

    <div class="quest-card__actions" v-if="showActions">
      <button
        class="quest-card__action quest-card__action--edit"
        @click="$emit('edit', quest)"
        :disabled="loading"
      >
        Edit
      </button>
      <button
        class="quest-card__action quest-card__action--delete"
        @click="$emit('delete', quest)"
        :disabled="loading"
      >
        Delete
      </button>
      <button
        class="quest-card__action quest-card__action--status"
        @click="$emit('status-change', quest)"
        :disabled="loading"
      >
        Change Status
      </button>
    </div>

    <div class="quest-card__footer" v-if="$slots.footer">
      <slot name="footer" :quest="quest"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quest } from "@domain/quests/quest";

interface Props {
  quest: Quest;
  showActions?: boolean;
  loading?: boolean;
  isSelected?: boolean;
}

interface Emits {
  edit: [quest: Quest];
  delete: [quest: Quest];
  "status-change": [quest: Quest];
  select: [quest: Quest];
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
.quest-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  cursor: pointer;
}

.quest-card:hover {
  border-color: #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quest-card--selected {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.quest-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.quest-card__title {
  margin: 0;
  color: #333;
  font-size: 1.1em;
  font-weight: 600;
  flex: 1;
  margin-right: 12px;
}

.quest-card__status-badge {
  flex-shrink: 0;
}

.quest-card__status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quest-card__status--draft {
  background-color: #f5f5f5;
  color: #666;
}

.quest-card__status--active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.quest-card__status--completed {
  background-color: #e8f5e8;
  color: #388e3c;
}

.quest-card__status--archived {
  background-color: #fff3e0;
  color: #f57c00;
}

.quest-card__body {
  margin-bottom: 16px;
}

.quest-card__description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}

.quest-card__metadata {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quest-card__creator,
.quest-card__created,
.quest-card__updated {
  color: #999;
  font-size: 0.8em;
}

.quest-card__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.quest-card__action {
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.2s ease;
}

.quest-card__action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quest-card__action--edit {
  color: #1976d2;
  border-color: #1976d2;
}

.quest-card__action--edit:hover:not(:disabled) {
  background-color: #1976d2;
  color: white;
}

.quest-card__action--delete {
  color: #d32f2f;
  border-color: #d32f2f;
}

.quest-card__action--delete:hover:not(:disabled) {
  background-color: #d32f2f;
  color: white;
}

.quest-card__action--status {
  color: #f57c00;
  border-color: #f57c00;
}

.quest-card__action--status:hover:not(:disabled) {
  background-color: #f57c00;
  color: white;
}

.quest-card__footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 12px;
}
</style>
