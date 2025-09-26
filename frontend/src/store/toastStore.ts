import { defineStore } from "pinia";
import { ref } from "vue";
import type { Toast, CreateToastData } from "@domain/notifications/toast";

/**
 * Pinia store for toast notification management
 * Provides centralized state management for console-style toast notifications
 */
export const useToastStore = defineStore("toast", () => {
  // State
  const toasts = ref<Toast[]>([]);

  // Actions
  const addToast = (data: CreateToastData): Toast => {
    const toast: Toast = {
      id: generateId(),
      message: data.message,
      type: data.type || "info",
      duration: data.duration || 5000,
      visible: true,
      createdAt: new Date(),
      command: data.command,
    };

    toasts.value.push(toast);

    // Auto-remove after duration if specified
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration + 2000); // Add extra time for typing animation
    }

    return toast;
  };

  const removeToast = (id: string): void => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      // First hide the toast (triggers exit animation)
      toasts.value[index].visible = false;
      // Then remove it from the array after animation
      setTimeout(() => {
        const currentIndex = toasts.value.findIndex((toast) => toast.id === id);
        if (currentIndex !== -1) {
          toasts.value.splice(currentIndex, 1);
        }
      }, 300);
    }
  };

  const clearAllToasts = (): void => {
    toasts.value.forEach((toast) => {
      toast.visible = false;
    });
    setTimeout(() => {
      toasts.value = [];
    }, 300);
  };

  // Convenience methods for different toast types
  const showSuccess = (message: string, command?: string): Toast => {
    return addToast({ message, type: "success", command });
  };

  const showError = (message: string, command?: string): Toast => {
    return addToast({ message, type: "error", command });
  };

  const showWarning = (message: string, command?: string): Toast => {
    return addToast({ message, type: "warning", command });
  };

  const showInfo = (message: string, command?: string): Toast => {
    return addToast({ message, type: "info", command });
  };

  // Helper function to generate unique IDs
  const generateId = (): string => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  return {
    // State
    toasts,

    // Actions
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
});
