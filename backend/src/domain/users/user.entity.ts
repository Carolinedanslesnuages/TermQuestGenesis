import { v4 as uuidv4 } from 'uuid';

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly username: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    email: string,
    username: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(email: string, username: string): User {
    const now = new Date();
    return new User(uuidv4(), email, username, now, now);
  }

  update(email?: string, username?: string): User {
    return new User(
      this.id,
      email ?? this.email,
      username ?? this.username,
      this.createdAt,
      new Date(),
    );
  }
}