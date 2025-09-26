<template>
  <div class="not-found">
    <div class="not-found__content">
      <div class="not-found__icon">🔍</div>
      <h1 class="not-found__title">Page Not Found</h1>
      <p class="not-found__message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="not-found__actions">
        <router-link
          to="/"
          class="not-found__button not-found__button--primary"
        >
          Go Home
        </router-link>
        <button
          @click="goBack"
          class="not-found__button not-found__button--secondary"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.not-found__content {
  text-align: center;
  max-width: 500px;
}

.not-found__icon {
  font-size: 4em;
  margin-bottom: 24px;
}

.not-found__title {
  font-size: 2.5em;
  margin: 0 0 16px 0;
  color: #333;
  font-weight: 700;
}

.not-found__message {
  font-size: 1.1em;
  color: #666;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.not-found__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.not-found__button {
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 1em;
}

.not-found__button--primary {
  background-color: #1976d2;
  color: white;
}

.not-found__button--primary:hover {
  background-color: #1565c0;
}

.not-found__button--secondary {
  background-color: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.not-found__button--secondary:hover {
  background-color: #1976d2;
  color: white;
}

@media (max-width: 480px) {
  .not-found__title {
    font-size: 2em;
  }

  .not-found__actions {
    flex-direction: column;
    align-items: center;
  }

  .not-found__button {
    width: 200px;
  }
}
</style>
