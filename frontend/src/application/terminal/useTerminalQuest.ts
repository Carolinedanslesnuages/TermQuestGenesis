import { ref, reactive, computed } from 'vue';
import type {
  TerminalQuest,
  QuestStep,
  ValidationResult,
  VirtualFilesystem,
  TerminalSession,
} from '@domain/quests/terminalQuest';
import { useVirtualFilesystem } from './useVirtualFilesystem';
import { useShell } from './useShell';

/**
 * Terminal Quest composable
 * Manages quest progression and step validation
 */
export function useTerminalQuest() {
  const { createInitialFilesystem } = useVirtualFilesystem();
  const { createTerminalSession, processCommand } = useShell();

  // Current quest state
  const currentQuest = ref<TerminalQuest | null>(null);
  const session = ref<TerminalSession | null>(null);

  /**
   * Create the first mission quest
   */
  const createFirstMissionQuest = (): TerminalQuest => {
    const initialFs = createInitialFilesystem();
    
    return {
      id: 'first-mission',
      title: 'System Infiltration - First Mission',
      description: 'Infiltrate the target system and complete reconnaissance tasks using Linux commands.',
      currentStepIndex: 0,
      completed: false,
      initialFilesystem: initialFs,
      welcomeMessage: 'Mission briefing: You have successfully infiltrated the target system. Use Linux commands to navigate and complete your objectives.',
      completionMessage: 'Excellent work, agent! Mission completed successfully. All objectives achieved.',
      steps: [
        {
          id: 'step-1',
          number: 1,
          title: 'Establish Connection',
          description: 'Connect to the system using SSH simulation',
          expectedCommands: ['ssh', 'ssh user@target'],
          alternativeCommands: ['ssh target', 'ssh user@hackbox'],
          completed: false,
          successMessage: 'Connection established successfully!',
          errorMessage: 'Use the ssh command to establish connection'
        },
        {
          id: 'step-2',
          number: 2,
          title: 'List Directory Contents',
          description: 'List files in the current directory',
          expectedCommands: ['ls'],
          completed: false,
          successMessage: 'Directory contents listed!',
          errorMessage: 'Use the ls command to list files'
        },
        {
          id: 'step-3',
          number: 3,
          title: 'Find Hidden Files',
          description: 'Display all files including hidden ones',
          expectedCommands: ['ls -a'],
          alternativeCommands: ['ls -la', 'ls -al'],
          completed: false,
          successMessage: 'Hidden files revealed!',
          errorMessage: 'Use ls -a to show hidden files (files starting with .)'
        },
        {
          id: 'step-4',
          number: 4,
          title: 'Read Secret File',
          description: 'Display the contents of the hidden secret file',
          expectedCommands: ['cat .secret.txt'],
          completed: false,
          successMessage: 'Secret intelligence gathered!',
          errorMessage: 'Use cat to read the .secret.txt file',
          validator: (command: string, filesystem: VirtualFilesystem) => {
            const isValidCommand = command.trim() === 'cat .secret.txt';
            return {
              isValid: isValidCommand,
              message: isValidCommand ? 'Mission briefing retrieved!' : 'Read the .secret.txt file using cat',
              shouldAdvance: isValidCommand
            };
          }
        },
        {
          id: 'step-5',
          number: 5,
          title: 'Check Current Location',
          description: 'Print the current working directory path',
          expectedCommands: ['pwd'],
          completed: false,
          successMessage: 'Current location confirmed!',
          errorMessage: 'Use pwd to print the working directory'
        },
        {
          id: 'step-6',
          number: 6,
          title: 'Create Operations Folder',
          description: 'Create a new directory called "hackzone"',
          expectedCommands: ['mkdir hackzone'],
          completed: false,
          successMessage: 'Operations folder created!',
          errorMessage: 'Use mkdir to create the hackzone directory',
          validator: (command: string, filesystem: VirtualFilesystem) => {
            const isValidCommand = command.trim() === 'mkdir hackzone';
            return {
              isValid: isValidCommand,
              message: isValidCommand ? 'Hackzone directory created!' : 'Create a directory named "hackzone" using mkdir',
              shouldAdvance: isValidCommand
            };
          }
        },
        {
          id: 'step-7',
          number: 7,
          title: 'Enter Operations Folder',
          description: 'Change directory to the hackzone folder',
          expectedCommands: ['cd hackzone'],
          completed: false,
          successMessage: 'Entered operations folder!',
          errorMessage: 'Use cd to change to the hackzone directory',
          validator: (command: string, filesystem: VirtualFilesystem) => {
            const isValidCommand = command.trim() === 'cd hackzone';
            const inHackzone = filesystem.currentDirectory.endsWith('/hackzone');
            return {
              isValid: isValidCommand && inHackzone,
              message: inHackzone ? 'Now in hackzone directory!' : 'Change to the hackzone directory using cd',
              shouldAdvance: isValidCommand
            };
          }
        },
        {
          id: 'step-8',
          number: 8,
          title: 'Create Exploit Script',
          description: 'Create an empty file called "exploit.sh"',
          expectedCommands: ['touch exploit.sh'],
          completed: false,
          successMessage: 'Exploit script file created!',
          errorMessage: 'Use touch to create the exploit.sh file'
        },
        {
          id: 'step-9',
          number: 9,
          title: 'Write Script Content',
          description: 'Write "run" into the exploit.sh file',
          expectedCommands: ['echo "run" > exploit.sh', "echo 'run' > exploit.sh"],
          alternativeCommands: ['echo run > exploit.sh'],
          completed: false,
          successMessage: 'Script content written!',
          errorMessage: 'Use echo with redirection to write "run" to exploit.sh',
          validator: (command: string, filesystem: VirtualFilesystem) => {
            const validCommands = ['echo "run" > exploit.sh', "echo 'run' > exploit.sh", 'echo run > exploit.sh'];
            const isValidCommand = validCommands.some(cmd => command.trim() === cmd);
            return {
              isValid: isValidCommand,
              message: isValidCommand ? 'Script payload written!' : 'Write "run" to exploit.sh using echo and redirection (>)',
              shouldAdvance: isValidCommand
            };
          }
        },
        {
          id: 'step-10',
          number: 10,
          title: 'Verify Script Content',
          description: 'Display the contents of exploit.sh to verify',
          expectedCommands: ['cat exploit.sh'],
          completed: false,
          successMessage: 'Script verified successfully!',
          errorMessage: 'Use cat to display the contents of exploit.sh'
        },
        {
          id: 'step-11',
          number: 11,
          title: 'Clean Up Evidence',
          description: 'Delete the exploit.sh file to cover tracks',
          expectedCommands: ['rm exploit.sh'],
          completed: false,
          successMessage: 'Evidence cleaned up successfully!',
          errorMessage: 'Use rm to delete the exploit.sh file',
          validator: (command: string, filesystem: VirtualFilesystem) => {
            const isValidCommand = command.trim() === 'rm exploit.sh';
            return {
              isValid: isValidCommand,
              message: isValidCommand ? 'All traces removed!' : 'Remove exploit.sh using rm command',
              shouldAdvance: isValidCommand
            };
          }
        }
      ]
    };
  };

  /**
   * Start a new quest
   */
  const startQuest = (questId?: string): void => {
    // For now, we only have the first mission
    const quest = createFirstMissionQuest();
    currentQuest.value = quest;
    session.value = createTerminalSession(quest.initialFilesystem);
  };

  /**
   * Validate if a command completes the current step
   */
  const validateCurrentStep = (command: string): ValidationResult => {
    if (!currentQuest.value || !session.value) {
      return { isValid: false, message: 'No active quest' };
    }

    const currentStep = getCurrentStep();
    if (!currentStep || currentStep.completed) {
      return { isValid: false, message: 'No active step' };
    }

    // Use custom validator if available
    if (currentStep.validator) {
      return currentStep.validator(command, session.value.filesystem);
    }

    // Default validation - check against expected commands
    const trimmedCommand = command.trim().toLowerCase();
    const expectedCommands = [
      ...currentStep.expectedCommands.map(cmd => cmd.toLowerCase()),
      ...(currentStep.alternativeCommands || []).map(cmd => cmd.toLowerCase())
    ];

    const isValid = expectedCommands.includes(trimmedCommand);
    
    return {
      isValid,
      message: isValid ? currentStep.successMessage : currentStep.errorMessage,
      shouldAdvance: isValid
    };
  };

  /**
   * Process command and check quest progression
   */
  const processQuestCommand = (input: string): { 
    commandResult: any; 
    questValidation: ValidationResult;
    stepCompleted: boolean;
    questCompleted: boolean;
  } => {
    if (!session.value || !currentQuest.value) {
      return {
        commandResult: { output: 'No active quest session', success: false, filesystemChanged: false },
        questValidation: { isValid: false, message: 'No active quest' },
        stepCompleted: false,
        questCompleted: false
      };
    }

    // Process the command in the shell
    const commandResult = processCommand(session.value, input);

    // Validate against current quest step
    const questValidation = validateCurrentStep(input);

    let stepCompleted = false;
    let questCompleted = false;

    // If command is valid for current step, complete it
    if (questValidation.isValid && questValidation.shouldAdvance) {
      const currentStep = getCurrentStep();
      if (currentStep && !currentStep.completed) {
        currentStep.completed = true;
        stepCompleted = true;

        // Move to next step
        currentQuest.value.currentStepIndex++;

        // Check if quest is completed
        if (currentQuest.value.currentStepIndex >= currentQuest.value.steps.length) {
          currentQuest.value.completed = true;
          questCompleted = true;
        }
      }
    }

    return {
      commandResult,
      questValidation,
      stepCompleted,
      questCompleted
    };
  };

  /**
   * Get current step
   */
  const getCurrentStep = (): QuestStep | null => {
    if (!currentQuest.value) return null;
    return currentQuest.value.steps[currentQuest.value.currentStepIndex] || null;
  };

  /**
   * Get quest progress
   */
  const getProgress = () => {
    if (!currentQuest.value) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = currentQuest.value.steps.filter(step => step.completed).length;
    const total = currentQuest.value.steps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  /**
   * Reset quest
   */
  const resetQuest = (): void => {
    if (currentQuest.value) {
      currentQuest.value.currentStepIndex = 0;
      currentQuest.value.completed = false;
      currentQuest.value.steps.forEach(step => {
        step.completed = false;
      });
      session.value = createTerminalSession(currentQuest.value.initialFilesystem);
    }
  };

  // Computed properties
  const isQuestActive = computed(() => currentQuest.value !== null);
  const isQuestCompleted = computed(() => currentQuest.value?.completed || false);
  const currentQuestTitle = computed(() => currentQuest.value?.title || '');
  const currentStepTitle = computed(() => getCurrentStep()?.title || '');
  const currentStepDescription = computed(() => getCurrentStep()?.description || '');

  return {
    // State
    currentQuest,
    session,
    
    // Actions
    startQuest,
    processQuestCommand,
    resetQuest,
    getCurrentStep,
    getProgress,
    
    // Computed
    isQuestActive,
    isQuestCompleted,
    currentQuestTitle,
    currentStepTitle,
    currentStepDescription,
  };
}