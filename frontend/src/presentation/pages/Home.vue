<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="home__hero">
      <div class="home__hero-content">
        <h1 class="home__title">TermQuestGenesis</h1>
        <p class="home__subtitle">
          A modern quest management system built with Clean Architecture
          principles
        </p>
        <div class="home__stats">
          <div class="home__stat">
            <span class="home__stat-number">{{ userStore.getUserCount }}</span>
            <span class="home__stat-label">Users</span>
          </div>
          <div class="home__stat">
            <span class="home__stat-number">{{
              questStore.getQuestCount
            }}</span>
            <span class="home__stat-label">Quests</span>
          </div>
          <div class="home__stat">
            <span class="home__stat-number">{{ activeQuestsCount }}</span>
            <span class="home__stat-label">Active</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="home__actions">
      <h2 class="home__section-title">Quick Actions</h2>
      <div class="home__action-grid">
        <router-link to="/users" class="home__action-card">
          <div class="home__action-icon">👥</div>
          <h3>Manage Users</h3>
          <p>View and manage system users</p>
        </router-link>

        <router-link to="/quests" class="home__action-card">
          <div class="home__action-icon">⚡</div>
          <h3>Manage Quests</h3>
          <p>Create and track quests</p>
        </router-link>

        <div class="home__action-card home__action-card--disabled">
          <div class="home__action-icon">📊</div>
          <h3>Analytics</h3>
          <p>Coming soon...</p>
        </div>

        <div class="home__action-card home__action-card--disabled">
          <div class="home__action-icon">⚙️</div>
          <h3>Settings</h3>
          <p>Coming soon...</p>
        </div>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="home__recent">
      <h2 class="home__section-title">Recent Quests</h2>

      <div v-if="questStore.isLoading" class="home__loading">
        Loading recent quests...
      </div>

      <div v-else-if="questStore.hasError" class="home__error">
        Error loading quests: {{ questStore.error }}
      </div>

      <div v-else-if="!questStore.hasQuests" class="home__empty">
        No quests found.
        <router-link to="/quests">Create your first quest!</router-link>
      </div>

      <div v-else class="home__quest-grid">
        <QuestCard
          v-for="quest in recentQuests"
          :key="quest.id"
          :quest="quest"
          :show-actions="false"
          @select="selectQuest"
        />
      </div>

      <div class="home__view-all" v-if="questStore.hasQuests">
        <router-link to="/quests" class="home__view-all-link">
          View All Quests →
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { useQuestStore } from "@/store/questStore";
import QuestCard from "@presentation/quests/QuestCard.vue";
import type { Quest } from "@domain/quests/quest";

const router = useRouter();
const userStore = useUserStore();
const questStore = useQuestStore();

// Computed properties
const activeQuestsCount = computed(() => {
  return questStore.quests.filter((quest) => quest.status === "active").length;
});

const recentQuests = computed(() => {
  return questStore.quests
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);
});

// Methods
const selectQuest = (quest: Quest) => {
  questStore.selectQuest(quest);
  router.push(`/quests/${quest.id}`);
};

// Load data on component mount
onMounted(async () => {
  try {
    await Promise.all([userStore.loadUsers(), questStore.loadQuests()]);
  } catch (error) {
    console.error("Error loading home page data:", error);
  }
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.home__hero {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 40px;
}

.home__hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.home__title {
  font-size: 3em;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.home__subtitle {
  font-size: 1.2em;
  margin: 0 0 40px 0;
  opacity: 0.9;
}

.home__stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.home__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home__stat-number {
  font-size: 2.5em;
  font-weight: 700;
  line-height: 1;
}

.home__stat-label {
  font-size: 0.9em;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.home__section-title {
  font-size: 1.8em;
  margin: 0 0 24px 0;
  color: #333;
}

.home__actions {
  margin-bottom: 50px;
}

.home__action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.home__action-card {
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  background: white;
  display: block;
}

.home__action-card:hover:not(.home__action-card--disabled) {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.home__action-card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.home__action-icon {
  font-size: 2.5em;
  margin-bottom: 12px;
}

.home__action-card h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2em;
}

.home__action-card p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

.home__recent {
  margin-bottom: 40px;
}

.home__loading,
.home__error,
.home__empty {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.home__error {
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 8px;
}

.home__quest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.home__view-all {
  text-align: center;
}

.home__view-all-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #1976d2;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.home__view-all-link:hover {
  background-color: #1565c0;
}

@media (max-width: 768px) {
  .home__title {
    font-size: 2em;
  }

  .home__stats {
    gap: 20px;
  }

  .home__action-grid {
    grid-template-columns: 1fr;
  }

  .home__quest-grid {
    grid-template-columns: 1fr;
  }
}
</style>
