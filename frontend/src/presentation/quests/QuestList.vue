<template>
  <div class="quest-list">
    <h2>Quests</h2>
    
    <div class="filter-section">
      <label>Filter by status:</label>
      <select v-model="selectedStatus" @change="handleStatusFilter">
        <option value="">All</option>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      Loading quests...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && quests.length === 0" class="no-quests">
      No quests found.
    </div>

    <div v-if="quests.length > 0" class="quests-grid">
      <div 
        v-for="quest in quests" 
        :key="quest.id" 
        class="quest-card"
        :class="`status-${quest.status}`"
      >
        <h3>{{ quest.title }}</h3>
        <p>{{ quest.description }}</p>
        <div class="quest-meta">
          <span class="status">{{ quest.status.toUpperCase() }}</span>
          <small>Created: {{ formatDate(quest.createdAt) }}</small>
        </div>
      </div>
    </div>

    <button @click="loadQuests" class="refresh-btn">
      Refresh
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuests } from '@application/quests/useQuests';
import { QuestStatus } from '@domain/quests/quest.model';

const { quests, loading, error, loadQuests, loadQuestsByStatus } = useQuests();
const selectedStatus = ref('');

onMounted(() => {
  loadQuests();
});

const handleStatusFilter = () => {
  if (selectedStatus.value) {
    loadQuestsByStatus(selectedStatus.value as QuestStatus);
  } else {
    loadQuests();
  }
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.quest-list {
  padding: 20px;
}

.filter-section {
  margin: 20px 0;
}

.filter-section label {
  margin-right: 10px;
}

.filter-section select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.loading, .error, .no-quests {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}

.quests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.quest-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
}

.quest-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.quest-card p {
  margin: 10px 0;
  color: #666;
}

.quest-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.status-draft .status {
  background: #f8f9fa;
  color: #6c757d;
}

.status-active .status {
  background: #d4edda;
  color: #155724;
}

.status-completed .status {
  background: #d1ecf1;
  color: #0c5460;
}

.status-archived .status {
  background: #f8d7da;
  color: #721c24;
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