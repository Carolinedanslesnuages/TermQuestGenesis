export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(email: string, username: string): User {
    const now = new Date();
    return new User(
      generateId(), // In a real implementation, this would be handled by infrastructure
      email,
      username,
      now,
      now
    );
  }

  updateUsername(newUsername: string): User {
    return new User(
      this.id,
      this.email,
      newUsername,
      this.createdAt,
      new Date()
    );
  }
}

// Placeholder for ID generation - would be moved to infrastructure layer
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}