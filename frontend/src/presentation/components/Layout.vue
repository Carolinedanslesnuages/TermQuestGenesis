<template>
  <div class="layout">
    <!-- Header/Navigation -->
    <header class="layout__header">
      <nav class="layout__nav">
        <div class="layout__nav-brand">
          <router-link to="/" class="layout__brand-link">
            <h1 class="layout__brand-title">TermQuestGenesis</h1>
          </router-link>
        </div>

        <div
          class="layout__nav-menu"
          :class="{ 'layout__nav-menu--open': isMenuOpen }"
        >
          <router-link to="/" class="layout__nav-link" @click="closeMenu">
            Home
          </router-link>
          <router-link
            to="/dashboard"
            class="layout__nav-link"
            @click="closeMenu"
          >
            Dashboard
          </router-link>
          <router-link to="/quests" class="layout__nav-link" @click="closeMenu">
            Quests
          </router-link>
          <router-link
            to="/profile"
            class="layout__nav-link"
            @click="closeMenu"
          >
            Profile
          </router-link>
          <router-link to="/users" class="layout__nav-link" @click="closeMenu">
            Users
          </router-link>
        </div>

        <button
          class="layout__menu-toggle"
          @click="toggleMenu"
          :class="{ 'layout__menu-toggle--open': isMenuOpen }"
        >
          <span class="layout__menu-toggle-bar"></span>
          <span class="layout__menu-toggle-bar"></span>
          <span class="layout__menu-toggle-bar"></span>
        </button>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="layout__main">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Toast Container -->
    <div class="layout__toast-container">
      <ConsoleToast
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :toast="toast"
        @close="toastStore.removeToast(toast.id)"
      />
    </div>

    <!-- Footer -->
    <footer class="layout__footer">
      <div class="layout__footer-content">
        <p class="layout__footer-text">
          © 2024 TermQuestGenesis. Built with Vue 3 + TypeScript + Clean
          Architecture.
        </p>
        <div class="layout__footer-links">
          <a
            href="https://github.com/Carolinedanslesnuages/TermQuestGenesis"
            target="_blank"
            class="layout__footer-link"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToastStore } from "@/store/toastStore";
import ConsoleToast from "./ConsoleToast.vue";

const toastStore = useToastStore();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__header {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.layout__nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.layout__nav-brand {
  flex-shrink: 0;
}

.layout__brand-link {
  text-decoration: none;
  color: inherit;
}

.layout__brand-title {
  margin: 0;
  font-size: 1.5em;
  font-weight: 700;
  color: #1976d2;
}

.layout__nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.layout__nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.layout__nav-link:hover {
  color: #1976d2;
  background-color: #f5f5f5;
}

.layout__nav-link.router-link-active {
  color: #1976d2;
  background-color: #e3f2fd;
}

.layout__menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.layout__menu-toggle-bar {
  width: 20px;
  height: 2px;
  background-color: #666;
  margin: 2px 0;
  transition: all 0.3s ease;
}

.layout__menu-toggle--open .layout__menu-toggle-bar:nth-child(1) {
  transform: rotate(45deg) translate(4px, 4px);
}

.layout__menu-toggle--open .layout__menu-toggle-bar:nth-child(2) {
  opacity: 0;
}

.layout__menu-toggle--open .layout__menu-toggle-bar:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -4px);
}

.layout__main {
  flex: 1;
  background-color: #fafafa;
}

.layout__footer {
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0;
}

.layout__footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.layout__footer-text {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

.layout__footer-links {
  display: flex;
  gap: 16px;
}

.layout__footer-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 0.9em;
}

.layout__footer-link:hover {
  text-decoration: underline;
}

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .layout__menu-toggle {
    display: flex;
  }

  .layout__nav-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    flex-direction: column;
    padding: 20px;
    gap: 16px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .layout__nav-menu--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .layout__nav-link {
    width: 100%;
    text-align: center;
    padding: 12px 16px;
  }

  .layout__footer-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .layout__nav {
    padding: 0 16px;
  }

  .layout__brand-title {
    font-size: 1.2em;
  }

  .layout__main {
    padding: 0;
  }
}

/* Toast Container */
.layout__toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  pointer-events: none;
}

.layout__toast-container > * {
  pointer-events: auto;
}

@media (max-width: 768px) {
  .layout__toast-container {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>
