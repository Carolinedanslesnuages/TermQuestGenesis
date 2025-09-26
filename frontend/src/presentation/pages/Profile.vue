<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="profile">
    <!-- Terminal Header -->
    <header class="profile__header">
      <div class="terminal-header">
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-command">cat ~/.profile</span>
        </div>
        <div class="terminal-line">
          <span class="terminal-output">Player Profile Loaded</span>
        </div>
      </div>
    </header>

    <!-- Profile Content -->
    <div class="profile__content">
      <!-- Avatar and Basic Info -->
      <section class="profile__info">
        <div class="profile-card">
          <div class="profile-card__avatar">
            <div
              class="avatar"
              :class="`avatar--level-${playerProfile?.level || 1}`"
            >
              <span class="avatar__level">{{ playerProfile?.level || 1 }}</span>
              <div class="avatar__image">
                {{ playerProfile?.avatar || "👤" }}
              </div>
            </div>
          </div>

          <div class="profile-card__details">
            <h2 class="profile-card__name">
              {{ currentUser?.username || "Player" }}
            </h2>
            <p class="profile-card__email">
              {{ currentUser?.email || "player@example.com" }}
            </p>

            <div class="profile-card__stats">
              <div class="stat-item">
                <span class="stat-label">Level</span>
                <span class="stat-value">{{ playerProfile?.level || 1 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Experience</span>
                <span class="stat-value"
                  >{{ playerProfile?.experience || 0 }} XP</span
                >
              </div>
              <div class="stat-item">
                <span class="stat-label">Joined</span>
                <span class="stat-value">{{
                  formatDate(playerProfile?.joinedAt || new Date())
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience Progress -->
      <section class="profile__progress">
        <div class="progress-section">
          <div class="progress-header">
            <h3 class="progress-title">
              <span class="terminal-prompt">></span>
              Experience Progress
            </h3>
            <span class="progress-info">
              {{ playerProfile?.experience || 0 }} /
              {{ playerProfile?.experienceToNextLevel || 100 }} XP
            </span>
          </div>

          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :style="{ width: `${progressPercentage}%` }"
            >
              <div class="progress-bar__glow"></div>
            </div>
            <div class="progress-bar__text">
              {{ Math.round(progressPercentage) }}%
            </div>
          </div>

          <div class="progress-details">
            <span class="xp-to-next"
              >{{
                (playerProfile?.experienceToNextLevel || 100) -
                (playerProfile?.experience || 0)
              }}
              XP to next level</span
            >
          </div>
        </div>
      </section>

      <!-- Achievements/Badges -->
      <section class="profile__achievements">
        <div class="achievements-section">
          <div class="achievements-header">
            <h3 class="achievements-title">
              <span class="terminal-prompt">></span>
              Achievements
            </h3>
            <span class="achievements-count"
              >{{ achievements.length }} earned</span
            >
          </div>

          <div class="achievements-grid" v-if="achievements.length > 0">
            <div
              v-for="achievement in achievements"
              :key="achievement.id"
              class="achievement-badge"
              :class="{ 'achievement-badge--earned': achievement.earned }"
              @click="showAchievementDetails(achievement)"
            >
              <div class="achievement-badge__icon">{{ achievement.icon }}</div>
              <div class="achievement-badge__name">{{ achievement.name }}</div>
              <div class="achievement-badge__date" v-if="achievement.earned">
                {{ formatDate(achievement.earnedAt!) }}
              </div>
            </div>
          </div>

          <div class="achievements-empty" v-else>
            <div class="empty-state">
              <span class="empty-state__icon">🏆</span>
              <p class="empty-state__message">No achievements yet</p>
              <p class="empty-state__hint">Complete quests to earn badges!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Detailed Stats -->
      <section class="profile__stats">
        <div class="stats-section">
          <div class="stats-header">
            <h3 class="stats-title">
              <span class="terminal-prompt">></span>
              Detailed Statistics
            </h3>
          </div>

          <div class="stats-grid">
            <div class="stat-block">
              <div class="stat-block__header">Quest Statistics</div>
              <div class="stat-list">
                <div class="stat-row">
                  <span class="stat-name">Total Quests:</span>
                  <span class="stat-val">{{
                    playerStats?.totalQuests || 0
                  }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">Completed:</span>
                  <span class="stat-val">{{
                    playerStats?.completedQuests || 0
                  }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">Active:</span>
                  <span class="stat-val">{{
                    playerStats?.activeQuests || 0
                  }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">Completion Rate:</span>
                  <span class="stat-val"
                    >{{ Math.round(playerStats?.completionRate || 0) }}%</span
                  >
                </div>
              </div>
            </div>

            <div class="stat-block">
              <div class="stat-block__header">Performance</div>
              <div class="stat-list">
                <div class="stat-row">
                  <span class="stat-name">Current Streak:</span>
                  <span class="stat-val"
                    >{{ playerStats?.currentStreak || 0 }} days</span
                  >
                </div>
                <div class="stat-row">
                  <span class="stat-name">Longest Streak:</span>
                  <span class="stat-val"
                    >{{ playerStats?.longestStreak || 0 }} days</span
                  >
                </div>
                <div class="stat-row">
                  <span class="stat-name">Avg. Completion Time:</span>
                  <span class="stat-val"
                    >{{ playerStats?.averageTimeToComplete || 0 }}h</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <section class="profile__actions">
        <div class="action-buttons">
          <router-link
            to="/dashboard"
            class="action-button action-button--primary"
          >
            <span class="action-button__icon">📊</span>
            <span class="action-button__text">Back to Dashboard</span>
          </router-link>
          <button
            @click="exportProfile"
            class="action-button action-button--secondary"
          >
            <span class="action-button__icon">💾</span>
            <span class="action-button__text">Export Profile</span>
          </button>
          <button
            @click="shareProfile"
            class="action-button action-button--tertiary"
          >
            <span class="action-button__icon">🔗</span>
            <span class="action-button__text">Share Profile</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/store/userStore";
import { useQuestStore } from "@/store/questStore";
import { useToastStore } from "@/store/toastStore";
import type { PlayerProfile, PlayerStats } from "@domain/users/user";

const userStore = useUserStore();
const questStore = useQuestStore();
const toastStore = useToastStore();

// Mock data for demonstration
const playerProfile = ref<PlayerProfile>({
  userId: "1",
  level: 7,
  experience: 750,
  experienceToNextLevel: 1000,
  totalQuestsCompleted: 12,
  activeQuestsCount: 3,
  achievements: [],
  avatar: "🚀",
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

const achievements = ref([
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first quest",
    icon: "🎯",
    earned: true,
    earnedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Quest Master",
    description: "Complete 10 quests",
    icon: "👑",
    earned: true,
    earnedAt: new Date("2024-02-15"),
  },
  {
    id: "3",
    name: "Streak Champion",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    earned: true,
    earnedAt: new Date("2024-03-01"),
  },
  {
    id: "4",
    name: "Speed Runner",
    description: "Complete 5 quests in one day",
    icon: "🏃",
    earned: false,
    earnedAt: undefined,
  },
]);

// Computed properties
const currentUser = computed(() => userStore.users[0]); // Mock current user
const progressPercentage = computed(() => {
  if (!playerProfile.value) return 0;
  return (
    (playerProfile.value.experience /
      playerProfile.value.experienceToNextLevel) *
    100
  );
});

// Methods
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

const showAchievementDetails = (achievement: any) => {
  if (achievement.earned) {
    toastStore.showInfo(
      `${achievement.name}: ${achievement.description}`,
      "achievement-info",
    );
  } else {
    toastStore.showWarning(
      `Achievement locked: ${achievement.description}`,
      "achievement-locked",
    );
  }
};

const exportProfile = () => {
  const profileData = {
    user: currentUser.value,
    profile: playerProfile.value,
    stats: playerStats.value,
    achievements: achievements.value.filter((a) => a.earned),
  };

  const dataStr = JSON.stringify(profileData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${currentUser.value?.username || "player"}-profile.json`;
  link.click();

  URL.revokeObjectURL(url);
  toastStore.showSuccess("Profile exported successfully!", "export-profile");
};

const shareProfile = async () => {
  const shareData = {
    title: `${currentUser.value?.username || "Player"}'s TermQuest Profile`,
    text: `Check out my TermQuest profile! Level ${playerProfile.value?.level}, ${playerStats.value?.completedQuests} quests completed!`,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      toastStore.showSuccess("Profile shared successfully!", "share-profile");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
        fallbackShare();
      }
    }
  } else {
    fallbackShare();
  }
};

const fallbackShare = () => {
  navigator.clipboard.writeText(window.location.href);
  toastStore.showInfo("Profile URL copied to clipboard!", "copy-url");
};

// Load data on mount
onMounted(async () => {
  try {
    await Promise.all([userStore.loadUsers(), questStore.loadQuests()]);

    toastStore.showSuccess("Profile loaded successfully!", "load-profile");
  } catch (error) {
    console.error("Error loading profile data:", error);
    toastStore.showError("Failed to load profile data", "load-error");
  }
});
</script>

<style scoped>
.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #0a0a0a;
  color: #00ff00;
  font-family: "Courier New", monospace;
  min-height: 100vh;
}

/* Terminal Header */
.profile__header {
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
}

.terminal-output {
  color: #00ffff;
  font-size: 16px;
  font-weight: bold;
}

/* Profile Content */
.profile__content {
  display: grid;
  gap: 32px;
}

/* Profile Info Section */
.profile__info {
  grid-column: 1 / -1;
}

.profile-card {
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 32px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: center;
}

.profile-card__avatar {
  display: flex;
  justify-content: center;
}

.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #00ff00;
  background: linear-gradient(45deg, #111, #222);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.avatar--level-7 {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.avatar__level {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ffd700;
  color: #000;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.avatar__image {
  font-size: 48px;
}

.profile-card__details {
  min-width: 0;
}

.profile-card__name {
  color: #00ff00;
  font-size: 32px;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.profile-card__email {
  color: #999;
  margin: 0 0 24px 0;
  font-size: 16px;
}

.profile-card__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
}

.stat-label {
  display: block;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  color: #00ff00;
  font-size: 20px;
  font-weight: bold;
}

/* Progress Section */
.progress-section {
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.progress-title {
  color: #00ff00;
  font-size: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-info {
  color: #ffff00;
  font-size: 14px;
}

.progress-bar {
  position: relative;
  background: #222;
  border: 1px solid #444;
  border-radius: 8px;
  height: 32px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar__fill {
  background: linear-gradient(90deg, #00ff00, #00cc00);
  height: 100%;
  transition: width 0.8s ease;
  position: relative;
  border-radius: 6px;
}

.progress-bar__glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

.progress-bar__text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

.progress-details {
  text-align: center;
}

.xp-to-next {
  color: #999;
  font-size: 14px;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Achievements Section */
.achievements-section {
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 24px;
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.achievements-title {
  color: #00ff00;
  font-size: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.achievements-count {
  background: #333;
  color: #ffff00;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.achievement-badge {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.achievement-badge--earned {
  opacity: 1;
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

.achievement-badge:hover {
  transform: translateY(-4px);
  border-color: #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.achievement-badge__icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.achievement-badge__name {
  color: #00ff00;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
}

.achievement-badge__date {
  color: #666;
  font-size: 10px;
}

.achievements-empty {
  padding: 40px;
  text-align: center;
}

.empty-state__icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-state__message {
  color: #666;
  font-size: 18px;
  margin-bottom: 8px;
}

.empty-state__hint {
  color: #999;
  font-size: 14px;
}

/* Stats Section */
.stats-section {
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 24px;
}

.stats-header {
  margin-bottom: 24px;
}

.stats-title {
  color: #00ff00;
  font-size: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.stat-block {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
}

.stat-block__header {
  color: #ffff00;
  font-weight: bold;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
}

.stat-list {
  display: grid;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-name {
  color: #999;
}

.stat-val {
  color: #00ff00;
  font-weight: bold;
}

/* Action Buttons */
.profile__actions {
  grid-column: 1 / -1;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
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
  transform: translateY(-2px);
}

.action-button--primary {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

.action-button--primary:hover {
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
}

.action-button--secondary {
  border-color: #ffff00;
  color: #ffff00;
}

.action-button--secondary:hover {
  box-shadow: 0 0 20px rgba(255, 255, 0, 0.4);
}

.action-button--tertiary {
  border-color: #00ffff;
  color: #00ffff;
}

.action-button--tertiary:hover {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
}

.action-button__icon {
  font-size: 18px;
}

.action-button__text {
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .progress-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .action-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile {
    padding: 12px;
  }

  .profile-card {
    padding: 20px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .avatar__image {
    font-size: 32px;
  }

  .profile-card__name {
    font-size: 24px;
  }
}
</style>
