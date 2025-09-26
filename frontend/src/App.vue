<template>
  <div id="app">
    <header class="app-header">
      <h1>TermQuest Genesis</h1>
      <nav>
        <button @click="currentView = 'users'" :class="{ active: currentView === 'users' }">
          Users
        </button>
        <button @click="currentView = 'quests'" :class="{ active: currentView === 'quests' }">
          Quests
        </button>
      </nav>
    </header>

    <main class="app-main">
      <UserList v-if="currentView === 'users'" />
      <QuestList v-if="currentView === 'quests'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserList from '@presentation/users/UserList.vue';
import QuestList from '@presentation/quests/QuestList.vue';

const currentView = ref<'users' | 'quests'>('users');
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #343a40;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  font-size: 1.5rem;
}

.app-header nav {
  display: flex;
  gap: 10px;
}

.app-header nav button {
  background: transparent;
  color: white;
  border: 2px solid #6c757d;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.app-header nav button:hover {
  border-color: #007bff;
  background: #007bff;
}

.app-header nav button.active {
  border-color: #007bff;
  background: #007bff;
}

.app-main {
  flex: 1;
  background: #f8f9fa;
}
</style>