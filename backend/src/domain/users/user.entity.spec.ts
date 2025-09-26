import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  describe('create', () => {
    it('should create a new user entity with timestamps', () => {
      const user = UserEntity.create('1', 'test@example.com', 'testuser');

      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(user.username).toBe('testuser');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt).toEqual(user.updatedAt);
    });
  });

  describe('update', () => {
    it('should update user with new updatedAt timestamp', async () => {
      const originalUser = UserEntity.create(
        '1',
        'test@example.com',
        'testuser',
      );

      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
      const updatedUser = originalUser.update(
        'newemail@example.com',
        'newusername',
      );

      expect(updatedUser.id).toBe('1');
      expect(updatedUser.email).toBe('newemail@example.com');
      expect(updatedUser.username).toBe('newusername');
      expect(updatedUser.createdAt).toEqual(originalUser.createdAt);
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        originalUser.updatedAt.getTime(),
      );
    });

    it('should keep original values when not provided', () => {
      const originalUser = UserEntity.create(
        '1',
        'test@example.com',
        'testuser',
      );
      const updatedUser = originalUser.update();

      expect(updatedUser.email).toBe('test@example.com');
      expect(updatedUser.username).toBe('testuser');
    });
  });
});
