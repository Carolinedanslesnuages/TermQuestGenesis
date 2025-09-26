import { ref, reactive } from 'vue';
import type {
  VirtualFilesystem,
  CommandResult,
  TerminalSession,
  TerminalOutputLine,
} from '@domain/quests/terminalQuest';
import { useVirtualFilesystem } from './useVirtualFilesystem';

/**
 * Shell command processor composable
 * Handles command parsing and execution in the virtual environment
 */
export function useShell() {
  const {
    listDirectory,
    pathExists,
    fileExists,
    getFileContent,
    makeDirectory,
    changeDirectory,
    touchFile,
    writeToFile,
    removeFile,
    getDirectory,
    normalizePath,
  } = useVirtualFilesystem();

  /**
   * Create initial terminal session
   */
  const createTerminalSession = (filesystem: VirtualFilesystem): TerminalSession => {
    return {
      prompt: 'user@hackbox:~$',
      history: [],
      historyIndex: -1,
      output: [
        {
          content: 'Welcome to the secure system. Connection established.',
          type: 'success',
          timestamp: new Date(),
        },
        {
          content: 'Type commands to navigate and complete your mission.',
          type: 'output',
          timestamp: new Date(),
        },
      ],
      connected: true,
      filesystem,
    };
  };

  /**
   * Update terminal prompt based on current directory
   */
  const updatePrompt = (session: TerminalSession): void => {
    const currentDir = session.filesystem.currentDirectory;
    const shortDir = currentDir === '/home/user' ? '~' : currentDir;
    session.prompt = `user@hackbox:${shortDir}$`;
  };

  /**
   * Parse command and arguments
   */
  const parseCommand = (input: string): { command: string; args: string[] } => {
    const parts = input.trim().split(/\s+/);
    return {
      command: parts[0] || '',
      args: parts.slice(1),
    };
  };

  /**
   * Execute ls command
   */
  const executeLs = (args: string[], filesystem: VirtualFilesystem): CommandResult => {
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
    
    // Get target directory (default to current)
    const targetPath = args.find(arg => !arg.startsWith('-')) || filesystem.currentDirectory;
    
    const items = listDirectory(filesystem, targetPath, showHidden);
    
    if (items.length === 0) {
      return {
        output: '',
        success: true,
        filesystemChanged: false,
      };
    }

    let output: string;
    if (longFormat) {
      // Simulate long format output
      const lines = items.map(item => {
        const isDir = item.endsWith('/');
        const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
        const size = isDir ? '4096' : '1024';
        const date = 'Nov 15 10:30';
        const name = item;
        return `${permissions} 1 user user ${size.padStart(8)} ${date} ${name}`;
      });
      output = lines.join('\n');
    } else {
      // Simple format - just list items
      output = items.join('  ');
    }

    return {
      output,
      success: true,
      filesystemChanged: false,
    };
  };

  /**
   * Execute pwd command
   */
  const executePwd = (filesystem: VirtualFilesystem): CommandResult => {
    return {
      output: filesystem.currentDirectory,
      success: true,
      filesystemChanged: false,
    };
  };

  /**
   * Execute cd command
   */
  const executeCd = (args: string[], filesystem: VirtualFilesystem): CommandResult => {
    const targetPath = args[0] || '/home/user'; // Default to home if no argument
    
    const newFilesystem = changeDirectory(filesystem, targetPath);
    
    if (newFilesystem.currentDirectory === filesystem.currentDirectory && targetPath !== filesystem.currentDirectory) {
      return {
        output: `cd: ${targetPath}: No such file or directory`,
        success: false,
        error: 'Directory not found',
        filesystemChanged: false,
      };
    }

    return {
      output: '',
      success: true,
      filesystemChanged: true,
      newFilesystem,
    };
  };

  /**
   * Execute cat command
   */
  const executeCat = (args: string[], filesystem: VirtualFilesystem): CommandResult => {
    if (args.length === 0) {
      return {
        output: 'cat: missing file operand',
        success: false,
        error: 'Missing filename',
        filesystemChanged: false,
      };
    }

    const fileName = args[0];
    const content = getFileContent(filesystem, fileName);
    
    if (content === null) {
      return {
        output: `cat: ${fileName}: No such file or directory`,
        success: false,
        error: 'File not found',
        filesystemChanged: false,
      };
    }

    return {
      output: content,
      success: true,
      filesystemChanged: false,
    };
  };

  /**
   * Execute mkdir command
   */
  const executeMkdir = (args: string[], filesystem: VirtualFilesystem): CommandResult => {
    if (args.length === 0) {
      return {
        output: 'mkdir: missing operand',
        success: false,
        error: 'Missing directory name',
        filesystemChanged: false,
      };
    }

    const dirName = args[0];
    
    // Check if directory already exists
    const targetPath = filesystem.currentDirectory === '/' 
      ? `/${dirName}` 
      : `${filesystem.currentDirectory}/${dirName}`;
    
    if (pathExists(filesystem, targetPath)) {
      return {
        output: `mkdir: cannot create directory '${dirName}': File exists`,
        success: false,
        error: 'Directory already exists',
        filesystemChanged: false,
      };
    }

    const newFilesystem = makeDirectory(filesystem, dirName);

    return {
      output: '',
      success: true,
      filesystemChanged: true,
      newFilesystem,
    };
  };

  /**
   * Execute touch command
   */
  const executeTouch = (args: string[], filesystem: VirtualFilesystem): CommandResult => {
    if (args.length === 0) {
      return {
        output: 'touch: missing file operand',
        success: false,
        error: 'Missing filename',
        filesystemChanged: false,
      };
    }

    const fileName = args[0];
    const newFilesystem = touchFile(filesystem, fileName);

    return {
      output: '',
      success: true,
      filesystemChanged: true,
      newFilesystem,
    };
  };

  /**
   * Execute echo command
   */
  const executeEcho = (args: string[], filesystem: VirtualFilesystem): CommandResult => {
    const input = args.join(' ');
    
    // Check for redirection
    const redirectMatch = input.match(/^(.*?)\s*>\s*(.+)$/);
    
    if (redirectMatch) {
      const [, content, fileName] = redirectMatch;
      const cleanContent = content.replace(/^["']|["']$/g, ''); // Remove quotes
      const cleanFileName = fileName.trim();
      
      const newFilesystem = writeToFile(filesystem, cleanFileName, cleanContent);
      
      return {
        output: '',
        success: true,
        filesystemChanged: true,
        newFilesystem,
      };
    }

    // Regular echo without redirection
    const cleanContent = input.replace(/^["']|["']$/g, '');
    return {
      output: cleanContent,
      success: true,
      filesystemChanged: false,
    };
  };

  /**
   * Execute rm command
   */
  const executeRm = (args: string[], filesystem: VirtualFilesystem): CommandResult => {
    if (args.length === 0) {
      return {
        output: 'rm: missing operand',
        success: false,
        error: 'Missing filename',
        filesystemChanged: false,
      };
    }

    const fileName = args[0];
    
    if (!fileExists(filesystem, fileName)) {
      return {
        output: `rm: cannot remove '${fileName}': No such file or directory`,
        success: false,
        error: 'File not found',
        filesystemChanged: false,
      };
    }

    const newFilesystem = removeFile(filesystem, fileName);

    return {
      output: '',
      success: true,
      filesystemChanged: true,
      newFilesystem,
    };
  };

  /**
   * Execute ssh simulation command
   */
  const executeSsh = (args: string[]): CommandResult => {
    return {
      output: 'Connection to remote system established.\nAuthentication successful.\nWelcome to the target server.',
      success: true,
      filesystemChanged: false,
    };
  };

  /**
   * Execute unknown command
   */
  const executeUnknown = (command: string): CommandResult => {
    return {
      output: `${command}: command not found`,
      success: false,
      error: 'Unknown command',
      filesystemChanged: false,
    };
  };

  /**
   * Execute a command in the virtual shell
   */
  const executeCommand = (input: string, filesystem: VirtualFilesystem): CommandResult => {
    const { command, args } = parseCommand(input);

    if (!command) {
      return {
        output: '',
        success: true,
        filesystemChanged: false,
      };
    }

    switch (command.toLowerCase()) {
      case 'ls':
        return executeLs(args, filesystem);
      case 'pwd':
        return executePwd(filesystem);
      case 'cd':
        return executeCd(args, filesystem);
      case 'cat':
        return executeCat(args, filesystem);
      case 'mkdir':
        return executeMkdir(args, filesystem);
      case 'touch':
        return executeTouch(args, filesystem);
      case 'echo':
        return executeEcho(args, filesystem);
      case 'rm':
        return executeRm(args, filesystem);
      case 'ssh':
        return executeSsh(args);
      case 'clear':
        return {
          output: '',
          success: true,
          filesystemChanged: false,
        };
      default:
        return executeUnknown(command);
    }
  };

  /**
   * Add command to history
   */
  const addToHistory = (session: TerminalSession, command: string): void => {
    if (command.trim() && command !== session.history[session.history.length - 1]) {
      session.history.push(command);
      session.filesystem.history.push(command);
    }
    session.historyIndex = session.history.length;
  };

  /**
   * Add output line to terminal
   */
  const addOutputLine = (session: TerminalSession, content: string, type: TerminalOutputLine['type'] = 'output'): void => {
    session.output.push({
      content,
      type,
      timestamp: new Date(),
    });
  };

  /**
   * Process a command in the terminal session
   */
  const processCommand = (session: TerminalSession, input: string): CommandResult => {
    // Add command to history
    addToHistory(session, input);

    // Add command line to output
    addOutputLine(session, `${session.prompt} ${input}`, 'command');

    // Execute the command
    const result = executeCommand(input, session.filesystem);

    // Update filesystem if changed
    if (result.filesystemChanged && result.newFilesystem) {
      session.filesystem = result.newFilesystem;
      updatePrompt(session);
    }

    // Add output if any
    if (result.output) {
      addOutputLine(session, result.output, result.success ? 'output' : 'error');
    }

    return result;
  };

  return {
    createTerminalSession,
    processCommand,
    executeCommand,
    updatePrompt,
    addOutputLine,
  };
}