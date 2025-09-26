<template>
  <Transition name="console-toast" appear>
    <div
      v-if="toast.visible"
      class="console-toast"
      :class="[
        `console-toast--${toast.type}`,
        { 'console-toast--typing': isTyping },
      ]"
    >
      <div class="console-toast__header">
        <span class="console-toast__prompt">$</span>
        <span class="console-toast__command" v-if="toast.command">
          {{ toast.command }}
        </span>
        <span class="console-toast__cursor" v-if="isTyping">_</span>
      </div>
      <div class="console-toast__content">
        <span class="console-toast__icon">{{ getIcon(toast.type) }}</span>
        <span class="console-toast__message">{{ displayedMessage }}</span>
        <span class="console-toast__cursor" v-if="isTyping && !toast.command"
          >_</span
        >
      </div>
      <button
        class="console-toast__close"
        @click="$emit('close')"
        v-if="!isTyping"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Toast } from "@domain/notifications/toast";

interface Props {
  toast: Toast;
}

interface Emits {
  close: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const displayedMessage = ref("");
const isTyping = ref(true);
const typingSpeed = 50; // milliseconds per character

// Computed property for typing animation
const typeMessage = () => {
  const message = props.toast.message;
  let index = 0;

  const typeNext = () => {
    if (index < message.length) {
      displayedMessage.value += message[index];
      index++;
      setTimeout(typeNext, typingSpeed);
    } else {
      isTyping.value = false;
      // Auto-dismiss after typing is complete if duration is set
      if (props.toast.duration > 0) {
        setTimeout(() => {
          emit("close");
        }, props.toast.duration);
      }
    }
  };

  typeNext();
};

const getIcon = (type: string): string => {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✗";
    case "warning":
      return "⚠";
    case "info":
      return "ℹ";
    default:
      return ">";
  }
};

onMounted(() => {
  typeMessage();
});
</script>

<style scoped>
.console-toast {
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #00ff00;
  font-family: "Courier New", monospace;
  font-size: 14px;
  line-height: 1.4;
  margin: 8px 0;
  max-width: 600px;
  min-width: 300px;
  padding: 12px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.console-toast__header {
  margin-bottom: 4px;
  opacity: 0.8;
}

.console-toast__prompt {
  color: #00ff00;
  margin-right: 8px;
}

.console-toast__command {
  color: #ffff00;
}

.console-toast__content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.console-toast__icon {
  font-weight: bold;
  min-width: 16px;
}

.console-toast__message {
  flex: 1;
  word-break: break-word;
}

.console-toast__cursor {
  animation: blink 1s infinite;
  color: #00ff00;
  font-weight: bold;
}

.console-toast__close {
  background: none;
  border: 1px solid #666;
  border-radius: 2px;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  height: 24px;
  position: absolute;
  right: 8px;
  top: 8px;
  width: 24px;
  transition: all 0.2s ease;
}

.console-toast__close:hover {
  background: #333;
  color: #fff;
}

/* Type-specific styling */
.console-toast--success {
  border-color: #00ff00;
}

.console-toast--success .console-toast__icon,
.console-toast--success .console-toast__message {
  color: #00ff00;
}

.console-toast--error {
  border-color: #ff0000;
}

.console-toast--error .console-toast__icon,
.console-toast--error .console-toast__message {
  color: #ff0000;
}

.console-toast--warning {
  border-color: #ffff00;
}

.console-toast--warning .console-toast__icon,
.console-toast--warning .console-toast__message {
  color: #ffff00;
}

.console-toast--info {
  border-color: #00ffff;
}

.console-toast--info .console-toast__icon,
.console-toast--info .console-toast__message {
  color: #00ffff;
}

/* Animations */
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.console-toast-enter-active {
  transition: all 0.3s ease-out;
}

.console-toast-leave-active {
  transition: all 0.3s ease-in;
}

.console-toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.console-toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

/* Typing animation state */
.console-toast--typing .console-toast__close {
  display: none;
}
</style>
