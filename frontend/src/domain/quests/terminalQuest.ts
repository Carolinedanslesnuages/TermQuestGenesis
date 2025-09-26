/**
 * Terminal quest step interface
 * Represents a single step in a terminal quest
 */
export interface QuestStep {
  /**
   * Unique identifier for the step
   */
  id: string;

  /**
   * Step number (for ordering)
   */
  number: number;

  /**
   * Title of the step
   */
  title: string;

  /**
   * Description of what the user needs to do
   */
  description: string;

  /**
   * Expected commands that should complete this step
   */
  expectedCommands: string[];

  /**
   * Alternative commands that should also work
   */
  alternativeCommands?: string[];

  /**
   * Whether this step has been completed
   */
  completed: boolean;

  /**
   * Success message to show when step is completed
   */
  successMessage: string;

  /**
   * Error message to show for common mistakes
   */
  errorMessage?: string;

  /**
   * Validator function for complex step validation
   */
  validator?: (command: string, filesystem: VirtualFilesystem) => ValidationResult;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  shouldAdvance?: boolean;
}

/**
 * Terminal quest interface
 * Represents a complete terminal-based quest with multiple steps
 */
export interface TerminalQuest {
  /**
   * Unique identifier for the quest
   */
  id: string;

  /**
   * Quest title
   */
  title: string;

  /**
   * Quest description
   */
  description: string;

  /**
   * List of steps to complete
   */
  steps: QuestStep[];

  /**
   * Current step index
   */
  currentStepIndex: number;

  /**
   * Whether the entire quest is completed
   */
  completed: boolean;

  /**
   * Starting filesystem state
   */
  initialFilesystem: VirtualFilesystem;

  /**
   * Welcome message shown at quest start
   */
  welcomeMessage: string;

  /**
   * Completion message shown when quest is finished
   */
  completionMessage: string;
}

/**
 * Virtual filesystem interface
 * Represents the simulated filesystem state
 */
export interface VirtualFilesystem {
  /**
   * Current working directory
   */
  currentDirectory: string;

  /**
   * Directory structure with files and folders
   */
  directories: Record<string, VirtualDirectory>;

  /**
   * Command history
   */
  history: string[];
}

/**
 * Virtual directory interface
 */
export interface VirtualDirectory {
  /**
   * Directory name
   */
  name: string;

  /**
   * Full path to this directory
   */
  path: string;

  /**
   * Files in this directory
   */
  files: Record<string, VirtualFile>;

  /**
   * Subdirectories
   */
  subdirectories: Record<string, VirtualDirectory>;

  /**
   * Parent directory path (null for root)
   */
  parentPath: string | null;
}

/**
 * Virtual file interface
 */
export interface VirtualFile {
  /**
   * File name
   */
  name: string;

  /**
   * File content
   */
  content: string;

  /**
   * File permissions (simplified)
   */
  permissions: string;

  /**
   * Whether the file is hidden (starts with .)
   */
  hidden: boolean;

  /**
   * File size in bytes
   */
  size: number;

  /**
   * Creation timestamp
   */
  createdAt: Date;

  /**
   * Modification timestamp
   */
  modifiedAt: Date;
}

/**
 * Command execution result
 */
export interface CommandResult {
  /**
   * Command output to display
   */
  output: string;

  /**
   * Whether command executed successfully
   */
  success: boolean;

  /**
   * Error message if command failed
   */
  error?: string;

  /**
   * Whether filesystem state was modified
   */
  filesystemChanged: boolean;

  /**
   * New filesystem state (if changed)
   */
  newFilesystem?: VirtualFilesystem;
}

/**
 * Terminal session state
 */
export interface TerminalSession {
  /**
   * Current prompt string
   */
  prompt: string;

  /**
   * Command history
   */
  history: string[];

  /**
   * Current history index (for up/down arrow navigation)
   */
  historyIndex: number;

  /**
   * Terminal output lines
   */
  output: TerminalOutputLine[];

  /**
   * Whether terminal is connected/active
   */
  connected: boolean;

  /**
   * Current filesystem state
   */
  filesystem: VirtualFilesystem;
}

/**
 * Terminal output line
 */
export interface TerminalOutputLine {
  /**
   * Line content
   */
  content: string;

  /**
   * Line type for styling
   */
  type: 'command' | 'output' | 'error' | 'success' | 'prompt';

  /**
   * Timestamp when line was added
   */
  timestamp: Date;
}