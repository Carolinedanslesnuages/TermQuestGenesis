<template>
  <div class="quest-detail">
    <!-- Terminal Header -->
    <header class="quest-detail__header">
      <div class="terminal-header">
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-command"
            >quest --info {{ $route.params.id }}</span
          >
        </div>
        <div class="terminal-line" v-if="quest">
          <span class="terminal-output"
            >Quest details loaded: "{{ quest.title }}"</span
          >
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="questStore.isLoading" class="quest-detail__loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading quest details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="questStore.hasError" class="quest-detail__error">
      <div class="error-message">
        <span class="error-icon">❌</span>
        <p>{{ questStore.error }}</p>
        <button @click="loadQuestData" class="retry-button">Retry</button>
      </div>
    </div>

    <!-- Quest Not Found -->
    <div v-else-if="!quest" class="quest-detail__not-found">
      <div class="not-found-message">
        <span class="not-found-icon">🔍</span>
        <h2>Quest Not Found</h2>
        <p>The quest you're looking for doesn't exist or has been removed.</p>
        <router-link to="/quests" class="back-button"
          >Back to Quests</router-link
        >
      </div>
    </div>

    <!-- Quest Content -->
    <div v-else class="quest-detail__content">
      <!-- Quest Info -->
      <section class="quest-info">
        <div class="quest-card">
          <div class="quest-card__header">
            <div class="quest-title-section">
              <h1 class="quest-title">{{ quest.title }}</h1>
              <div class="quest-meta">
                <span class="quest-id">ID: {{ quest.id }}</span>
                <span class="quest-creator">By: {{ quest.createdById }}</span>
              </div>
            </div>
            <div class="quest-status-section">
              <div
                class="quest-status"
                :class="`quest-status--${quest.status}`"
              >
                <span class="status-icon">{{
                  getStatusIcon(quest.status)
                }}</span>
                <span class="status-text">{{
                  quest.status.toUpperCase()
                }}</span>
              </div>
            </div>
          </div>

          <div class="quest-card__body">
            <div class="quest-description">
              <h3 class="section-title">
                <span class="terminal-prompt">></span>
                Description
              </h3>
              <p class="description-text">{{ quest.description }}</p>
            </div>

            <div class="quest-timestamps">
              <div class="timestamp-item">
                <span class="timestamp-label">Created:</span>
                <span class="timestamp-value">{{
                  formatDate(quest.createdAt)
                }}</span>
              </div>
              <div
                class="timestamp-item"
                v-if="quest.updatedAt !== quest.createdAt"
              >
                <span class="timestamp-label">Updated:</span>
                <span class="timestamp-value">{{
                  formatDate(quest.updatedAt)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quest Actions -->
      <section class="quest-actions">
        <div class="actions-panel">
          <h3 class="actions-title">
            <span class="terminal-prompt">></span>
            Quest Actions
          </h3>

          <div class="action-buttons">
            <!-- Complete Button (main action) -->
            <button
              v-if="quest.status === 'active'"
              @click="completeQuest"
              :disabled="isProcessing"
              class="action-button action-button--complete"
            >
              <span class="action-button__icon">✅</span>
              <span class="action-button__text">Complete Quest</span>
              <div class="action-button__glow" v-if="!isProcessing"></div>
            </button>

            <!-- Start Button -->
            <button
              v-if="quest.status === 'draft'"
              @click="startQuest"
              :disabled="isProcessing"
              class="action-button action-button--start"
            >
              <span class="action-button__icon">🚀</span>
              <span class="action-button__text">Start Quest</span>
            </button>

            <!-- Reactivate Button -->
            <button
              v-if="quest.status === 'completed'"
              @click="reactivateQuest"
              :disabled="isProcessing"
              class="action-button action-button--reactivate"
            >
              <span class="action-button__icon">🔄</span>
              <span class="action-button__text">Reactivate</span>
            </button>

            <!-- Archive Button -->
            <button
              v-if="quest.status !== 'archived'"
              @click="archiveQuest"
              :disabled="isProcessing"
              class="action-button action-button--archive"
            >
              <span class="action-button__icon">📦</span>
              <span class="action-button__text">Archive</span>
            </button>

            <!-- Edit Button -->
            <button
              @click="editQuest"
              :disabled="isProcessing"
              class="action-button action-button--edit"
            >
              <span class="action-button__icon">✏️</span>
              <span class="action-button__text">Edit Quest</span>
            </button>

            <!-- Delete Button -->
            <button
              @click="deleteQuest"
              :disabled="isProcessing"
              class="action-button action-button--delete"
            >
              <span class="action-button__icon">🗑️</span>
              <span class="action-button__text">Delete Quest</span>
            </button>
          </div>

          <!-- Processing Indicator -->
          <div v-if="isProcessing" class="processing-indicator">
            <div class="processing-spinner"></div>
            <span class="processing-text">Processing...</span>
          </div>
        </div>
      </section>

      <!-- Navigation -->
      <section class="quest-navigation">
        <div class="nav-buttons">
          <router-link to="/dashboard" class="nav-button nav-button--dashboard">
            <span class="nav-button__icon">📊</span>
            <span class="nav-button__text">Dashboard</span>
          </router-link>
          <router-link to="/quests" class="nav-button nav-button--quests">
            <span class="nav-button__icon">📋</span>
            <span class="nav-button__text">All Quests</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuestStore } from "@/store/questStore";
import { useToastStore } from "@/store/toastStore";
import type { QuestStatus } from "@domain/quests/quest";

const route = useRoute();
const router = useRouter();
const questStore = useQuestStore();
const toastStore = useToastStore();

const isProcessing = ref(false);

// Computed properties
const quest = computed(() => {
  const questId = route.params.id as string;
  return questStore.findQuestById(questId) || questStore.selectedQuest;
});

// Methods
const loadQuestData = async () => {
  const questId = route.params.id as string;
  try {
    await questStore.loadQuestById(questId);
    if (!questStore.selectedQuest) {
      toastStore.showError("Quest not found", "quest-not-found");
    }
  } catch (error) {
    console.error("Error loading quest:", error);
    toastStore.showError("Failed to load quest details", "load-error");
  }
};

const completeQuest = async () => {
  if (!quest.value) return;

  isProcessing.value = true;
  try {
    const result = await questStore.updateQuest(quest.value.id, {
      status: "completed",
    });
    if (result) {
      toastStore.showSuccess(
        `Quest "${quest.value.title}" completed successfully! +100 XP earned!`,
        "quest-complete",
      );
      // Simulate XP gain notification
      setTimeout(() => {
        toastStore.showInfo(
          "Achievement progress updated!",
          "achievement-update",
        );
      }, 1500);
    } else {
      toastStore.showError("Failed to complete quest", "complete-error");
    }
  } catch (error) {
    console.error("Error completing quest:", error);
    toastStore.showError("Failed to complete quest", "complete-error");
  } finally {
    isProcessing.value = false;
  }
};

const startQuest = async () => {
  if (!quest.value) return;

  isProcessing.value = true;
  try {
    const result = await questStore.updateQuest(quest.value.id, {
      status: "active",
    });
    if (result) {
      toastStore.showSuccess(
        `Quest "${quest.value.title}" started! Good luck!`,
        "quest-start",
      );
    } else {
      toastStore.showError("Failed to start quest", "start-error");
    }
  } catch (error) {
    console.error("Error starting quest:", error);
    toastStore.showError("Failed to start quest", "start-error");
  } finally {
    isProcessing.value = false;
  }
};

const reactivateQuest = async () => {
  if (!quest.value) return;

  isProcessing.value = true;
  try {
    const result = await questStore.updateQuest(quest.value.id, {
      status: "active",
    });
    if (result) {
      toastStore.showSuccess(
        `Quest "${quest.value.title}" reactivated!`,
        "quest-reactivate",
      );
    } else {
      toastStore.showError("Failed to reactivate quest", "reactivate-error");
    }
  } catch (error) {
    console.error("Error reactivating quest:", error);
    toastStore.showError("Failed to reactivate quest", "reactivate-error");
  } finally {
    isProcessing.value = false;
  }
};

const archiveQuest = async () => {
  if (!quest.value) return;

  if (!confirm(`Are you sure you want to archive "${quest.value.title}"?`)) {
    return;
  }

  isProcessing.value = true;
  try {
    const result = await questStore.updateQuest(quest.value.id, {
      status: "archived",
    });
    if (result) {
      toastStore.showWarning(
        `Quest "${quest.value.title}" archived`,
        "quest-archive",
      );
    } else {
      toastStore.showError("Failed to archive quest", "archive-error");
    }
  } catch (error) {
    console.error("Error archiving quest:", error);
    toastStore.showError("Failed to archive quest", "archive-error");
  } finally {
    isProcessing.value = false;
  }
};

const editQuest = () => {
  // In a real app, this would navigate to an edit form
  toastStore.showInfo("Edit functionality coming soon!", "edit-quest");
};

const deleteQuest = async () => {
  if (!quest.value) return;

  if (
    !confirm(
      `Are you sure you want to delete "${quest.value.title}"? This action cannot be undone.`,
    )
  ) {
    return;
  }

  isProcessing.value = true;
  try {
    const result = await questStore.deleteQuest(quest.value.id);
    if (result) {
      toastStore.showSuccess(
        `Quest "${quest.value.title}" deleted`,
        "quest-delete",
      );
      router.push("/quests");
    } else {
      toastStore.showError("Failed to delete quest", "delete-error");
    }
  } catch (error) {
    console.error("Error deleting quest:", error);
    toastStore.showError("Failed to delete quest", "delete-error");
  } finally {
    isProcessing.value = false;
  }
};

const getStatusIcon = (status: QuestStatus): string => {
  switch (status) {
    case "draft":
      return "📝";
    case "active":
      return "⚡";
    case "completed":
      return "✅";
    case "archived":
      return "📦";
    default:
      return "❓";
  }
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString();
};

// Load quest data on mount
onMounted(() => {
  loadQuestData();
});
</script>

<style scoped>
.quest-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #0a0a0a;
  color: #00ff00;
  font-family: "Courier New", monospace;
  min-height: 100vh;
}

/* Terminal Header */
.quest-detail__header {
  margin-bottom: 32px;
  padding: 20px;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
}

.terminal-header .terminal-line {
  margin-bottom: 8px;
}

.terminal-prompt {
  color: #00ff00;
  margin-right: 8px;
}

.terminal-command {
  color: #ffff00;
  word-break: break-all;
}

.terminal-output {
  color: #00ffff;
  font-size: 16px;
}

/* Loading State */
.quest-detail__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top: 3px solid #00ff00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error State */
.quest-detail__error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-message {
  text-align: center;
  color: #ff0000;
}

.error-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.retry-button {
  background: #333;
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  margin-top: 16px;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #ff0000;
  color: #000;
}

/* Not Found State */
.quest-detail__not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.not-found-message {
  text-align: center;
}

.not-found-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.back-button {
  display: inline-block;
  background: #333;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-family: inherit;
  margin-top: 16px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #00ff00;
  color: #000;
}

/* Quest Content */
.quest-detail__content {
  display: grid;
  gap: 32px;
}

/* Quest Info */
.quest-card {
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
}

.quest-card__header {
  background: #1a1a1a;
  padding: 24px;
  border-bottom: 1px solid #333;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: center;
}

.quest-title {
  color: #00ff00;
  font-size: 28px;
  margin: 0 0 12px 0;
  font-weight: bold;
  word-break: break-word;
}

.quest-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.quest-id,
.quest-creator {
  color: #999;
  font-size: 12px;
  padding: 4px 8px;
  background: #222;
  border-radius: 4px;
}

.quest-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: bold;
  white-space: nowrap;
}

.quest-status--draft {
  background: rgba(153, 153, 153, 0.2);
  border: 1px solid #999;
  color: #999;
}

.quest-status--active {
  background: rgba(255, 255, 0, 0.2);
  border: 1px solid #ffff00;
  color: #ffff00;
}

.quest-status--completed {
  background: rgba(0, 255, 0, 0.2);
  border: 1px solid #00ff00;
  color: #00ff00;
}

.quest-status--archived {
  background: rgba(255, 165, 0, 0.2);
  border: 1px solid #ffa500;
  color: #ffa500;
}

.quest-card__body {
  padding: 24px;
}

.section-title {
  color: #00ff00;
  font-size: 18px;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.description-text {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 24px;
  font-size: 16px;
}

.quest-timestamps {
  display: grid;
  gap: 8px;
}

.timestamp-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: #1a1a1a;
  border-radius: 4px;
}

.timestamp-label {
  color: #999;
}

.timestamp-value {
  color: #00ff00;
}

/* Quest Actions */
.actions-panel {
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
}

.actions-title {
  color: #00ff00;
  font-size: 20px;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border: 1px solid;
  border-radius: 8px;
  background: #1a1a1a;
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button__glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: glow 2s infinite;
}

@keyframes glow {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.action-button--complete {
  border-color: #00ff00;
  color: #00ff00;
}

.action-button--complete:hover:not(:disabled) {
  background: #00ff00;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  transform: translateY(-2px);
}

.action-button--start {
  border-color: #ffff00;
  color: #ffff00;
}

.action-button--start:hover:not(:disabled) {
  background: #ffff00;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
  transform: translateY(-2px);
}

.action-button--reactivate {
  border-color: #00ffff;
  color: #00ffff;
}

.action-button--reactivate:hover:not(:disabled) {
  background: #00ffff;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  transform: translateY(-2px);
}

.action-button--archive {
  border-color: #ffa500;
  color: #ffa500;
}

.action-button--archive:hover:not(:disabled) {
  background: #ffa500;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 165, 0, 0.5);
  transform: translateY(-2px);
}

.action-button--edit {
  border-color: #999;
  color: #999;
}

.action-button--edit:hover:not(:disabled) {
  background: #999;
  color: #000;
  box-shadow: 0 0 20px rgba(153, 153, 153, 0.5);
  transform: translateY(-2px);
}

.action-button--delete {
  border-color: #ff0000;
  color: #ff0000;
}

.action-button--delete:hover:not(:disabled) {
  background: #ff0000;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  transform: translateY(-2px);
}

.action-button__icon {
  font-size: 18px;
}

.processing-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background: #1a1a1a;
  border-radius: 8px;
  color: #ffff00;
}

.processing-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #333;
  border-top: 2px solid #ffff00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.processing-text {
  font-weight: bold;
}

/* Navigation */
.nav-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #111;
  color: #00ff00;
  text-decoration: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.nav-button:hover {
  border-color: #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  transform: translateY(-2px);
}

.nav-button--dashboard {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

.nav-button--quests {
  border-color: #ffff00;
  color: #ffff00;
}

.nav-button--quests:hover {
  border-color: #ffff00;
  box-shadow: 0 0 15px rgba(255, 255, 0, 0.3);
}

.nav-button__icon {
  font-size: 18px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quest-card__header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .quest-meta {
    justify-content: center;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .nav-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .quest-detail {
    padding: 12px;
  }

  .quest-card__header,
  .quest-card__body,
  .actions-panel {
    padding: 16px;
  }

  .quest-title {
    font-size: 24px;
  }
}
</style>
