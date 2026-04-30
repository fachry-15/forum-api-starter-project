import NewThread from '../NewThread.js';

describe('NewThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = { title: 'sebuah thread', body: 'sebuah body' };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = { title: 123, body: 'sebuah body', owner: 'user-123' };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = { title: 'sebuah thread', body: 'sebuah body', owner: 'user-123' };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
