/**
 * Toast notification types
 * Represents different kinds of console-style feedback messages
 */
export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Toast notification interface
 * Represents a terminal-style toast notification
 */
export interface Toast {
  /**
   * Unique identifier for the toast
   */
  id: string;

  /**
   * Toast message content
   */
  message: string;

  /**
   * Type of toast (affects styling and icon)
   */
  type: ToastType;

  /**
   * Duration in milliseconds before auto-dismiss (0 = no auto-dismiss)
   */
  duration: number;

  /**
   * Whether the toast is currently visible
   */
  visible: boolean;

  /**
   * Timestamp when the toast was created
   */
  createdAt: Date;

  /**
   * Optional command prefix for terminal styling
   */
  command?: string;
}

/**
 * Toast creation data interface
 * Used when creating a new toast notification
 */
export interface CreateToastData {
  message: string;
  type?: ToastType;
  duration?: number;
  command?: string;
}
