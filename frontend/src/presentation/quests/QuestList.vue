<template>
  <div class="quest-list">
    <h2>Quests</h2>

    <div v-if="loading" class="loading">Loading quests...</div>

    <div v-else-if="error" class="error">Error: {{ error }}</div>

    <div v-else-if="!hasQuests" class="empty">No quests found.</div>

    <div v-else class="quests">
      <div v-for="quest in quests" :key="quest.id" class="quest-item">
        <div class="quest-info">
          <h3>{{ quest.title }}</h3>
          <p>{{ quest.description }}</p>
          <div class="quest-meta">
            <span class="status" :class="`status-${quest.status}`">
              {{ quest.status.toUpperCase() }}
            </span>
            <small>Created: {{ formatDate(quest.createdAt) }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useQuests } from "@application/quests/useQuests";

// Use the quests composable
const { quests, loading, error, hasQuests, loadQuests } = useQuests();

// Load quests on component mount
onMounted(() => {
  loadQuests();
});

// Helper function to format dates
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.quest-list {
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

.quests {
  display: grid;
  gap: 16px;
}

.quest-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.quest-info h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.quest-info p {
  margin: 0 0 12px 0;
  color: #666;
}

.quest-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-draft {
  background-color: #f5f5f5;
  color: #666;
}

.status-active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-completed {
  background-color: #e8f5e8;
  color: #388e3c;
}

.status-archived {
  background-color: #fff3e0;
  color: #f57c00;
}

.quest-meta small {
  color: #999;
}
</style>
