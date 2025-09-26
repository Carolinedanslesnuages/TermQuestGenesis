<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard">
    <!-- Header Section -->
    <header class="dashboard__header">
      <div class="dashboard__terminal-header">
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-command">player-stats --dashboard</span>
        </div>
        <div class="terminal-line">
          <span class="terminal-output"
            >Welcome back, {{ currentUser?.username || "Player" }}!</span
          >
        </div>
      </div>
    </header>

    <!-- Stats Overview -->
    <section class="dashboard__stats">
      <div class="stats-grid">
        <div class="stat-card stat-card--level">
          <div class="stat-card__header">
            <span class="stat-card__icon">⭐</span>
            <span class="stat-card__label">Level</span>
          </div>
          <div class="stat-card__value">{{ playerProfile?.level || 1 }}</div>
          <div class="stat-card__detail">
            {{ playerProfile?.experience || 0 }} /
            {{ playerProfile?.experienceToNextLevel || 100 }} XP
          </div>
        </div>

        <div class="stat-card stat-card--quests">
          <div class="stat-card__header">
            <span class="stat-card__icon">🎯</span>
            <span class="stat-card__label">Total Quests</span>
          </div>
          <div class="stat-card__value">
            {{ playerStats?.totalQuests || 0 }}
          </div>
          <div class="stat-card__detail">
            {{ playerStats?.completedQuests || 0 }} completed
          </div>
        </div>

        <div class="stat-card stat-card--completion">
          <div class="stat-card__header">
            <span class="stat-card__icon">📊</span>
            <span class="stat-card__label">Completion Rate</span>
          </div>
          <div class="stat-card__value">
            {{ Math.round(playerStats?.completionRate || 0) }}%
          </div>
          <div class="stat-card__detail">
            {{ playerStats?.currentStreak || 0 }} day streak
          </div>
        </div>

        <div class="stat-card stat-card--active">
          <div class="stat-card__header">
            <span class="stat-card__icon">⚡</span>
            <span class="stat-card__label">Active Quests</span>
          </div>
          <div class="stat-card__value">
            {{ playerStats?.activeQuests || 0 }}
          </div>
          <div class="stat-card__detail">In progress</div>
        </div>
      </div>
    </section>

    <!-- Progress Bar -->
    <section class="dashboard__progress">
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">Experience Progress</span>
          <span class="progress-value">
            {{ playerProfile?.experience || 0 }} /
            {{ playerProfile?.experienceToNextLevel || 100 }} XP
          </span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
          <div class="progress-bar__segments">
            <div
              v-for="i in 10"
              :key="i"
              class="progress-segment"
              :class="{
                'progress-segment--filled':
                  i <= Math.floor(progressPercentage / 10),
              }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quest Lists -->
    <section class="dashboard__quests">
      <div class="quest-columns">
        <!-- Active Quests -->
        <div class="quest-column">
          <div class="quest-column__header">
            <h3 class="quest-column__title">
              <span class="terminal-prompt">></span>
              Active Quests
            </h3>
            <span class="quest-column__count">{{ activeQuests.length }}</span>
          </div>
          <div class="quest-list" v-if="activeQuests.length > 0">
            <QuestCard
              v-for="quest in activeQuests"
              :key="quest.id"
              :quest="quest"
              :show-actions="false"
              @select="selectQuest"
              class="quest-card--compact"
            />
          </div>
          <div class="quest-list--empty" v-else>
            <div class="empty-state">
              <span class="empty-state__icon">📝</span>
              <p class="empty-state__message">No active quests</p>
              <router-link to="/quests" class="empty-state__action">
                Browse Quests
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Completed -->
        <div class="quest-column">
          <div class="quest-column__header">
            <h3 class="quest-column__title">
              <span class="terminal-prompt">></span>
              Recently Completed
            </h3>
            <span class="quest-column__count">{{
              completedQuests.length
            }}</span>
          </div>
          <div class="quest-list" v-if="completedQuests.length > 0">
            <QuestCard
              v-for="quest in completedQuests.slice(0, 3)"
              :key="quest.id"
              :quest="quest"
              :show-actions="false"
              @select="selectQuest"
              class="quest-card--compact"
            />
          </div>
          <div class="quest-list--empty" v-else>
            <div class="empty-state">
              <span class="empty-state__icon">🏆</span>
              <p class="empty-state__message">No completed quests yet</p>
              <router-link to="/quests" class="empty-state__action">
                Start a Quest
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="dashboard__actions">
      <div class="action-buttons">
        <router-link to="/quests" class="action-button action-button--primary">
          <span class="action-button__icon">🎯</span>
          <span class="action-button__text">Browse Quests</span>
        </router-link>
        <router-link
          to="/profile"
          class="action-button action-button--secondary"
        >
          <span class="action-button__icon">👤</span>
          <span class="action-button__text">View Profile</span>
        </router-link>
        <button
          @click="showTestToast"
          class="action-button action-button--tertiary"
        >
          <span class="action-button__icon">🔔</span>
          <span class="action-button__text">Test Notification</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { useQuestStore } from "@/store/questStore";
import { useToastStore } from "@/store/toastStore";
import QuestCard from "@presentation/quests/QuestCard.vue";
import type { Quest } from "@domain/quests/quest";
import type { PlayerProfile, PlayerStats } from "@domain/users/user";

const router = useRouter();
const userStore = useUserStore();
const questStore = useQuestStore();
const toastStore = useToastStore();

// Mock data for demonstration - in a real app, this would come from an API
const playerProfile = ref<PlayerProfile>({
  userId: "1",
  level: 7,
  experience: 750,
  experienceToNextLevel: 1000,
  totalQuestsCompleted: 12,
  activeQuestsCount: 3,
  achievements: [],
  joinedAt: new Date("2024-01-15"),
  lastActiveAt: new Date(),
});

const playerStats = ref<PlayerStats>({
  totalQuests: 15,
  completedQuests: 12,
  activeQuests: 3,
  draftQuests: 0,
  completionRate: 80,
  averageTimeToComplete: 24,
  longestStreak: 7,
  currentStreak: 3,
});

// Computed properties
const currentUser = computed(() => userStore.users[0]); // Mock current user
const activeQuests = computed(() =>
  questStore.quests.filter((quest) => quest.status === "active"),
);
const completedQuests = computed(() =>
  questStore.quests.filter((quest) => quest.status === "completed"),
);
const progressPercentage = computed(() => {
  if (!playerProfile.value) return 0;
  return (
    (playerProfile.value.experience /
      playerProfile.value.experienceToNextLevel) *
    100
  );
});

// Methods
const selectQuest = (quest: Quest) => {
  questStore.selectQuest(quest);
  router.push(`/quests/${quest.id}`);
};

const showTestToast = () => {
  const messages = [
    "Quest completed successfully!",
    "New achievement unlocked!",
    "Level up! You reached level 8",
    "Daily streak maintained!",
  ];
  const commands = [
    "complete-quest",
    "unlock-achievement",
    "level-up",
    "streak-check",
  ];
  const types = ["success", "info", "success", "warning"] as const;

  const randomIndex = Math.floor(Math.random() * messages.length);
  toastStore.addToast({
    message: messages[randomIndex],
    type: types[randomIndex],
    command: commands[randomIndex],
    duration: 4000,
  });
};

// Load data on mount
onMounted(async () => {
  try {
    await Promise.all([userStore.loadUsers(), questStore.loadQuests()]);

    // Show welcome toast
    setTimeout(() => {
      toastStore.showSuccess(
        "Dashboard loaded successfully!",
        "init-dashboard",
      );
    }, 500);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    toastStore.showError("Failed to load dashboard data", "load-error");
  }
});
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #0a0a0a;
  color: #00ff00;
  font-family: "Courier New", monospace;
  min-height: 100vh;
}

/* Terminal Header */
.dashboard__header {
  margin-bottom: 32px;
  padding: 20px;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
}

.terminal-line {
  margin-bottom: 8px;
}

.terminal-prompt {
  color: #00ff00;
  margin-right: 8px;
}

.terminal-command {
  color: #ffff00;
}

.terminal-output {
  color: #00ffff;
  font-size: 18px;
  font-weight: bold;
}

/* Stats Grid */
.dashboard__stats {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

.stat-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-card__icon {
  font-size: 20px;
}

.stat-card__label {
  color: #999;
  font-size: 14px;
}

.stat-card__value {
  font-size: 32px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 8px;
}

.stat-card__detail {
  color: #666;
  font-size: 12px;
}

/* Progress Section */
.dashboard__progress {
  margin-bottom: 32px;
}

.progress-section {
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-label {
  color: #00ff00;
  font-weight: bold;
}

.progress-value {
  color: #ffff00;
}

.progress-bar {
  position: relative;
  background: #222;
  border: 1px solid #444;
  border-radius: 4px;
  height: 24px;
  overflow: hidden;
}

.progress-bar__fill {
  background: linear-gradient(90deg, #00ff00, #00cc00);
  height: 100%;
  transition: width 0.5s ease;
  position: relative;
}

.progress-bar__segments {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.progress-segment {
  flex: 1;
  border-right: 1px solid #333;
  position: relative;
}

.progress-segment:last-child {
  border-right: none;
}

.progress-segment--filled::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: rgba(0, 255, 0, 0.2);
}

/* Quest Columns */
.dashboard__quests {
  margin-bottom: 32px;
}

.quest-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.quest-column {
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.quest-column__header {
  background: #1a1a1a;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.quest-column__title {
  color: #00ff00;
  font-size: 16px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quest-column__count {
  background: #333;
  color: #ffff00;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.quest-list {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.quest-list--empty {
  padding: 40px 20px;
}

.empty-state {
  text-align: center;
  color: #666;
}

.empty-state__icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-state__message {
  margin-bottom: 16px;
  font-size: 16px;
}

.empty-state__action {
  color: #00ff00;
  text-decoration: none;
  border: 1px solid #00ff00;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
  transition: all 0.3s ease;
}

.empty-state__action:hover {
  background: #00ff00;
  color: #000;
}

/* Action Buttons */
.dashboard__actions {
  margin-bottom: 32px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  border-color: #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  transform: translateY(-2px);
}

.action-button--primary {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

.action-button--secondary {
  border-color: #ffff00;
  color: #ffff00;
}

.action-button--secondary:hover {
  border-color: #ffff00;
  box-shadow: 0 0 15px rgba(255, 255, 0, 0.3);
}

.action-button--tertiary {
  border-color: #00ffff;
  color: #00ffff;
}

.action-button--tertiary:hover {
  border-color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.action-button__icon {
  font-size: 18px;
}

.action-button__text {
  font-weight: bold;
}

/* Compact Quest Cards */
:deep(.quest-card--compact) {
  background: #1a1a1a;
  border-color: #444;
  margin-bottom: 12px;
}

:deep(.quest-card--compact:hover) {
  border-color: #00ff00;
}

:deep(.quest-card--compact .quest-card__title) {
  color: #00ff00;
  font-size: 14px;
}

:deep(.quest-card--compact .quest-card__description) {
  color: #999;
  font-size: 12px;
}

:deep(.quest-card--compact .quest-card__status) {
  font-size: 10px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quest-columns {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }

  .progress-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard {
    padding: 12px;
  }
}
</style>
