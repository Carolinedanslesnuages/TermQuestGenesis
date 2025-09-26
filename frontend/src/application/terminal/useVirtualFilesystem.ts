import { ref, reactive } from 'vue';
import type {
  VirtualFilesystem,
  VirtualDirectory,
  VirtualFile,
  CommandResult,
} from '@domain/quests/terminalQuest';

/**
 * Virtual Filesystem composable
 * Manages simulated filesystem operations for terminal quests
 */
export function useVirtualFilesystem() {
  
  /**
   * Create a new virtual file
   */
  const createFile = (
    name: string,
    content: string = '',
    hidden: boolean = false
  ): VirtualFile => {
    const now = new Date();
    return {
      name,
      content,
      permissions: '-rw-r--r--',
      hidden,
      size: content.length,
      createdAt: now,
      modifiedAt: now,
    };
  };

  /**
   * Create a new virtual directory
   */
  const createDirectory = (
    name: string,
    path: string,
    parentPath: string | null = null
  ): VirtualDirectory => {
    return {
      name,
      path,
      files: {},
      subdirectories: {},
      parentPath,
    };
  };

  /**
   * Create initial filesystem state for the first mission
   */
  const createInitialFilesystem = (): VirtualFilesystem => {
    const root = createDirectory('/', '/');
    const home = createDirectory('user', '/home/user', '/');
    
    // Add hidden secret file
    home.files['.secret.txt'] = createFile('.secret.txt', 'Mission briefing: Infiltration successful. Proceed with data extraction.', true);
    
    // Add some normal files for realism
    home.files['readme.txt'] = createFile('readme.txt', 'Welcome to the system. Use standard Unix commands to navigate.');
    
    root.subdirectories['home'] = createDirectory('home', '/home', '/');
    root.subdirectories['home'].subdirectories['user'] = home;

    return {
      currentDirectory: '/home/user',
      directories: {
        '/': root,
        '/home': root.subdirectories['home'],
        '/home/user': home,
      },
      history: [],
    };
  };

  /**
   * Normalize path by resolving . and .. components
   */
  const normalizePath = (path: string, currentDir: string): string => {
    let resolvedPath: string;
    
    if (path.startsWith('/')) {
      resolvedPath = path;
    } else {
      resolvedPath = currentDir === '/' ? `/${path}` : `${currentDir}/${path}`;
    }

    // Split into components and resolve . and ..
    const components = resolvedPath.split('/').filter(c => c.length > 0);
    const resolved: string[] = [];

    for (const component of components) {
      if (component === '.') {
        // Skip current directory references
        continue;
      } else if (component === '..') {
        // Go up one directory
        if (resolved.length > 0) {
          resolved.pop();
        }
      } else {
        resolved.push(component);
      }
    }

    return resolved.length === 0 ? '/' : '/' + resolved.join('/');
  };

  /**
   * Get directory by path
   */
  const getDirectory = (filesystem: VirtualFilesystem, path: string): VirtualDirectory | null => {
    const normalizedPath = normalizePath(path, filesystem.currentDirectory);
    return filesystem.directories[normalizedPath] || null;
  };

  /**
   * List files and directories in a path
   */
  const listDirectory = (
    filesystem: VirtualFilesystem,
    path: string = filesystem.currentDirectory,
    showHidden: boolean = false
  ): string[] => {
    const directory = getDirectory(filesystem, path);
    if (!directory) {
      return [];
    }

    const items: string[] = [];

    // Add subdirectories
    Object.keys(directory.subdirectories).forEach(name => {
      items.push(`${name}/`);
    });

    // Add files
    Object.values(directory.files).forEach(file => {
      if (showHidden || !file.hidden) {
        items.push(file.name);
      }
    });

    return items.sort();
  };

  /**
   * Check if path exists
   */
  const pathExists = (filesystem: VirtualFilesystem, path: string): boolean => {
    const normalizedPath = normalizePath(path, filesystem.currentDirectory);
    return filesystem.directories.hasOwnProperty(normalizedPath);
  };

  /**
   * Check if file exists in directory
   */
  const fileExists = (filesystem: VirtualFilesystem, fileName: string, dirPath?: string): boolean => {
    const targetDir = dirPath || filesystem.currentDirectory;
    const directory = getDirectory(filesystem, targetDir);
    return directory ? directory.files.hasOwnProperty(fileName) : false;
  };

  /**
   * Get file content
   */
  const getFileContent = (filesystem: VirtualFilesystem, fileName: string, dirPath?: string): string | null => {
    const targetDir = dirPath || filesystem.currentDirectory;
    const directory = getDirectory(filesystem, targetDir);
    const file = directory?.files[fileName];
    return file ? file.content : null;
  };

  /**
   * Create a new directory in the filesystem
   */
  const makeDirectory = (filesystem: VirtualFilesystem, dirName: string): VirtualFilesystem => {
    const currentDir = getDirectory(filesystem, filesystem.currentDirectory);
    if (!currentDir) {
      return filesystem;
    }

    const newPath = filesystem.currentDirectory === '/' 
      ? `/${dirName}` 
      : `${filesystem.currentDirectory}/${dirName}`;

    const newDir = createDirectory(dirName, newPath, filesystem.currentDirectory);
    
    // Create new filesystem state
    const newFilesystem: VirtualFilesystem = {
      ...filesystem,
      directories: {
        ...filesystem.directories,
        [newPath]: newDir,
      },
    };

    // Update parent directory to include the new subdirectory
    const parentDir = getDirectory(newFilesystem, filesystem.currentDirectory);
    if (parentDir) {
      parentDir.subdirectories[dirName] = newDir;
    }

    return newFilesystem;
  };

  /**
   * Change current directory
   */
  const changeDirectory = (filesystem: VirtualFilesystem, path: string): VirtualFilesystem => {
    const normalizedPath = normalizePath(path, filesystem.currentDirectory);
    
    if (pathExists(filesystem, normalizedPath)) {
      return {
        ...filesystem,
        currentDirectory: normalizedPath,
      };
    }
    
    return filesystem;
  };

  /**
   * Create a file in the filesystem
   */
  const touchFile = (filesystem: VirtualFilesystem, fileName: string): VirtualFilesystem => {
    const currentDir = getDirectory(filesystem, filesystem.currentDirectory);
    if (!currentDir) {
      return filesystem;
    }

    const newFile = createFile(fileName);
    const newFilesystem = { ...filesystem };
    const updatedDir = { ...currentDir };
    updatedDir.files = { ...updatedDir.files, [fileName]: newFile };
    
    newFilesystem.directories = {
      ...newFilesystem.directories,
      [filesystem.currentDirectory]: updatedDir,
    };

    return newFilesystem;
  };

  /**
   * Write content to a file
   */
  const writeToFile = (filesystem: VirtualFilesystem, fileName: string, content: string): VirtualFilesystem => {
    const currentDir = getDirectory(filesystem, filesystem.currentDirectory);
    if (!currentDir) {
      return filesystem;
    }

    const existingFile = currentDir.files[fileName];
    const newFile = existingFile 
      ? { ...existingFile, content, size: content.length, modifiedAt: new Date() }
      : createFile(fileName, content);

    const newFilesystem = { ...filesystem };
    const updatedDir = { ...currentDir };
    updatedDir.files = { ...updatedDir.files, [fileName]: newFile };
    
    newFilesystem.directories = {
      ...newFilesystem.directories,
      [filesystem.currentDirectory]: updatedDir,
    };

    return newFilesystem;
  };

  /**
   * Remove a file from the filesystem
   */
  const removeFile = (filesystem: VirtualFilesystem, fileName: string): VirtualFilesystem => {
    const currentDir = getDirectory(filesystem, filesystem.currentDirectory);
    if (!currentDir || !currentDir.files[fileName]) {
      return filesystem;
    }

    const newFilesystem = { ...filesystem };
    const updatedDir = { ...currentDir };
    updatedDir.files = { ...updatedDir.files };
    delete updatedDir.files[fileName];
    
    newFilesystem.directories = {
      ...newFilesystem.directories,
      [filesystem.currentDirectory]: updatedDir,
    };

    return newFilesystem;
  };

  return {
    createInitialFilesystem,
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
  };
}