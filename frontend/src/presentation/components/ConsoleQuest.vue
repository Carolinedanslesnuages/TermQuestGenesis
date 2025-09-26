<template>
  <div class="console-quest">
    <!-- Quest Header -->
    <header class="console-quest__header" v-if="isQuestActive">
      <div class="quest-info">
        <h2 class="quest-title">{{ currentQuestTitle }}</h2>
        <div class="quest-progress">
          <span class="progress-text">Progress: {{ progress.completed }}/{{ progress.total }}</span>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${progress.percentage}%` }"
            ></div>
          </div>
          <span class="progress-percentage">{{ progress.percentage }}%</span>
        </div>
      </div>
    </header>

    <!-- Current Step Info -->
    <section class="console-quest__step" v-if="isQuestActive && !isQuestCompleted">
      <div class="step-info">
        <h3 class="step-title">
          <span class="step-number">Step {{ getCurrentStep()?.number }}:</span>
          {{ currentStepTitle }}
        </h3>
        <p class="step-description">{{ currentStepDescription }}</p>
      </div>
    </section>

    <!-- Terminal Container -->
    <div class="console-quest__terminal">
      <!-- Terminal Header -->
      <div class="terminal-header">
        <div class="terminal-controls">
          <span class="control control--close"></span>
          <span class="control control--minimize"></span>
          <span class="control control--maximize"></span>
        </div>
        <div class="terminal-title">
          {{ session?.connected ? 'Terminal - Connected' : 'Terminal - Disconnected' }}
        </div>
      </div>

      <!-- Terminal Content -->
      <div class="terminal-content" ref="terminalContent">
        <!-- Terminal Output -->
        <div class="terminal-output">
          <div 
            v-for="(line, index) in terminalOutput" 
            :key="index"
            :class="`output-line output-line--${line.type}`"
          >
            {{ line.content }}
          </div>
        </div>

        <!-- Command Input -->
        <div class="terminal-input" v-if="session?.connected">
          <span class="terminal-prompt">{{ session.prompt }}</span>
          <input
            ref="commandInput"
            v-model="currentCommand"
            @keydown="handleKeyDown"
            @keyup="handleKeyUp"
            class="command-input"
            :disabled="isProcessingCommand"
            autofocus
          />
          <span class="terminal-cursor" v-if="showCursor">_</span>
        </div>

        <!-- Processing indicator -->
        <div v-if="isProcessingCommand" class="processing-indicator">
          <span class="spinner">⣾</span>
          <span>Processing command...</span>
        </div>
      </div>
    </div>

    <!-- Quest Actions -->
    <div class="console-quest__actions" v-if="isQuestActive">
      <button 
        @click="resetQuest" 
        class="action-button action-button--secondary"
        :disabled="isProcessingCommand"
      >
        <span class="button-icon">🔄</span>
        Reset Quest
      </button>
      
      <button 
        v-if="!isQuestCompleted"
        @click="showHint"
        class="action-button action-button--info"
        :disabled="isProcessingCommand"
      >
        <span class="button-icon">💡</span>
        Hint
      </button>

      <button 
        v-if="isQuestCompleted"
        @click="completeQuest"
        class="action-button action-button--success"
        :disabled="isProcessingCommand"
      >
        <span class="button-icon">🏆</span>
        Complete Quest
      </button>
    </div>

    <!-- Quest Start Screen -->
    <div v-if="!isQuestActive" class="console-quest__start">
      <div class="start-screen">
        <h2 class="start-title">Terminal Quest System</h2>
        <p class="start-description">
          Ready to begin your infiltration mission? You'll use real Linux commands 
          in a simulated environment to complete objectives.
        </p>
        <button 
          @click="startFirstMission" 
          class="action-button action-button--primary"
        >
          <span class="button-icon">🚀</span>
          Start First Mission
        </button>
      </div>
    </div>

    <!-- Quest Completion Screen -->
    <div v-if="isQuestCompleted" class="console-quest__completion">
      <div class="completion-screen">
        <h2 class="completion-title">Mission Accomplished!</h2>
        <p class="completion-message">{{ currentQuest?.completionMessage }}</p>
        <div class="completion-stats">
          <div class="stat">
            <span class="stat-label">Steps Completed:</span>
            <span class="stat-value">{{ progress.completed }}/{{ progress.total }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Success Rate:</span>
            <span class="stat-value">{{ progress.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useTerminalQuest } from '@application/terminal/useTerminalQuest';
import { useToastStore } from '@store/toastStore';
import type { TerminalOutputLine } from '@domain/quests/terminalQuest';

// Composables
const {
  currentQuest,
  session,
  startQuest,
  processQuestCommand,
  resetQuest: resetQuestState,
  getCurrentStep,
  getProgress,
  isQuestActive,
  isQuestCompleted,
  currentQuestTitle,
  currentStepTitle,
  currentStepDescription,
} = useTerminalQuest();

const toastStore = useToastStore();

// Component state
const currentCommand = ref('');
const isProcessingCommand = ref(false);
const historyIndex = ref(-1);
const showCursor = ref(true);
const terminalContent = ref<HTMLElement>();
const commandInput = ref<HTMLInputElement>();

// Computed properties
const progress = computed(() => getProgress());

const terminalOutput = computed((): TerminalOutputLine[] => {
  return session.value?.output || [];
});

// Methods
const startFirstMission = (): void => {
  startQuest('first-mission');
  
  // Show welcome toast
  toastStore.showSuccess(
    'Mission started! Follow the steps and use Linux commands.',
    'mission-start'
  );

  // Focus terminal input after starting
  nextTick(() => {
    focusInput();
  });
};

const resetQuest = (): void => {
  resetQuestState();
  toastStore.showInfo('Quest reset. Ready to start again!', 'quest-reset');
  nextTick(() => {
    focusInput();
  });
};

const showHint = (): void => {
  const currentStep = getCurrentStep();
  if (currentStep) {
    const hintCommand = currentStep.expectedCommands[0];
    toastStore.showInfo(
      `Hint: Try using "${hintCommand}"`,
      `hint-${currentStep.id}`
    );
  }
};

const completeQuest = (): void => {
  toastStore.showSuccess(
    'Congratulations! Mission completed successfully!',
    'quest-complete'
  );
  
  // Emit completion event for parent components
  emit('questCompleted', {
    questId: currentQuest.value?.id,
    steps: progress.value.completed,
    total: progress.value.total,
  });
};

const processCommand = async (): Promise<void> => {
  if (!currentCommand.value.trim() || isProcessingCommand.value) {
    return;
  }

  isProcessingCommand.value = true;
  const command = currentCommand.value;
  currentCommand.value = '';

  try {
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = processQuestCommand(command);

    // Show step completion feedback
    if (result.stepCompleted) {
      toastStore.showSuccess(
        result.questValidation.message || 'Step completed!',
        `step-${getCurrentStep()?.id}`
      );
    } else if (!result.questValidation.isValid && result.questValidation.message) {
      // Show error feedback for quest steps
      toastStore.showError(
        result.questValidation.message,
        'step-error'
      );
    }

    // Show quest completion
    if (result.questCompleted) {
      toastStore.showSuccess(
        'Mission accomplished! All objectives completed!',
        'mission-complete'
      );
    }

    // Scroll to bottom
    await nextTick();
    scrollToBottom();

  } catch (error) {
    console.error('Error processing command:', error);
    toastStore.showError('Command processing failed', 'command-error');
  } finally {
    isProcessingCommand.value = false;
    focusInput();
  }
};

const handleKeyDown = (event: KeyboardEvent): void => {
  if (!session.value) return;

  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      processCommand();
      break;
      
    case 'ArrowUp':
      event.preventDefault();
      navigateHistory(-1);
      break;
      
    case 'ArrowDown':
      event.preventDefault();
      navigateHistory(1);
      break;
      
    case 'Tab':
      event.preventDefault();
      // TODO: Implement tab completion
      break;
  }
};

const handleKeyUp = (event: KeyboardEvent): void => {
  // Reset cursor blink
  showCursor.value = true;
};

const navigateHistory = (direction: number): void => {
  if (!session.value || session.value.history.length === 0) return;

  const newIndex = historyIndex.value + direction;
  
  if (newIndex >= -1 && newIndex < session.value.history.length) {
    historyIndex.value = newIndex;
    
    if (newIndex === -1) {
      currentCommand.value = '';
    } else {
      currentCommand.value = session.value.history[session.value.history.length - 1 - newIndex];
    }
  }
};

const scrollToBottom = (): void => {
  if (terminalContent.value) {
    terminalContent.value.scrollTop = terminalContent.value.scrollHeight;
  }
};

const focusInput = (): void => {
  if (commandInput.value) {
    commandInput.value.focus();
  }
};

// Cursor blinking effect
let cursorInterval: number;

onMounted(() => {
  // Set up cursor blinking
  cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value;
  }, 530);

  // Focus input on mount
  focusInput();
});

onUnmounted(() => {
  if (cursorInterval) {
    clearInterval(cursorInterval);
  }
});

// Events
interface Emits {
  questCompleted: [data: { questId: string | undefined; steps: number; total: number }];
}

const emit = defineEmits<Emits>();
</script>

<style scoped>
.console-quest {
  background: #0a0a0a;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  min-height: 100vh;
  padding: 20px;
}

/* Quest Header */
.console-quest__header {
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.quest-title {
  color: #00ffff;
  font-size: 24px;
  margin: 0 0 12px 0;
  text-shadow: 0 0 10px #00ffff;
}

.quest-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  color: #00ff00;
  font-size: 14px;
  min-width: 100px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00ffff);
  transition: width 0.3s ease;
}

.progress-percentage {
  color: #ffff00;
  font-size: 14px;
  min-width: 40px;
}

/* Current Step */
.console-quest__step {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.step-title {
  color: #ffff00;
  font-size: 18px;
  margin: 0 0 8px 0;
}

.step-number {
  color: #00ff00;
}

.step-description {
  color: #8b949e;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

/* Terminal */
.console-quest__terminal {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.terminal-header {
  background: #161b22;
  border-bottom: 1px solid #30363d;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control--close {
  background: #ff5f56;
}

.control--minimize {
  background: #ffbd2e;
}

.control--maximize {
  background: #27ca3f;
}

.terminal-title {
  color: #8b949e;
  font-size: 12px;
}

.terminal-content {
  padding: 16px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

.terminal-output {
  margin-bottom: 8px;
}

.output-line {
  margin: 2px 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.output-line--command {
  color: #00ff00;
}

.output-line--output {
  color: #e6edf3;
}

.output-line--error {
  color: #ff6b6b;
}

.output-line--success {
  color: #51cf66;
}

.output-line--prompt {
  color: #00ffff;
}

.terminal-input {
  display: flex;
  align-items: center;
  gap: 4px;
}

.terminal-prompt {
  color: #00ff00;
  font-weight: bold;
}

.command-input {
  background: transparent;
  border: none;
  color: #00ff00;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  flex: 1;
}

.command-input:disabled {
  opacity: 0.6;
}

.terminal-cursor {
  color: #00ff00;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.processing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffff00;
  margin-top: 8px;
}

.spinner {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Quest Actions */
.console-quest__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.action-button {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #e6edf3;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-size: 14px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.action-button:hover:not(:disabled) {
  background: #21262d;
  border-color: #f0f6fc;
  transform: translateY(-1px);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button--primary {
  background: #238636;
  border-color: #238636;
  color: #ffffff;
}

.action-button--primary:hover:not(:disabled) {
  background: #2ea043;
}

.action-button--secondary {
  border-color: #f85149;
  color: #f85149;
}

.action-button--secondary:hover:not(:disabled) {
  background: #f85149;
  color: #ffffff;
}

.action-button--success {
  background: #238636;
  border-color: #238636;
  color: #ffffff;
}

.action-button--success:hover:not(:disabled) {
  background: #2ea043;
}

.action-button--info {
  border-color: #1f6feb;
  color: #1f6feb;
}

.action-button--info:hover:not(:disabled) {
  background: #1f6feb;
  color: #ffffff;
}

/* Start Screen */
.console-quest__start {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.start-screen {
  text-align: center;
  max-width: 500px;
}

.start-title {
  color: #00ffff;
  font-size: 32px;
  margin: 0 0 16px 0;
  text-shadow: 0 0 20px #00ffff;
}

.start-description {
  color: #8b949e;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

/* Completion Screen */
.console-quest__completion {
  background: #0d1117;
  border: 2px solid #238636;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
}

.completion-screen {
  text-align: center;
}

.completion-title {
  color: #51cf66;
  font-size: 28px;
  margin: 0 0 16px 0;
  text-shadow: 0 0 15px #51cf66;
}

.completion-message {
  color: #e6edf3;
  font-size: 16px;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.completion-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  color: #8b949e;
  font-size: 12px;
}

.stat-value {
  color: #00ff00;
  font-size: 18px;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .console-quest {
    padding: 12px;
  }
  
  .quest-progress {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .console-quest__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .completion-stats {
    flex-direction: column;
    gap: 16px;
  }
}
</style>