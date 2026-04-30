import NewComment from '../NewComment.js';

describe('NewComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = { content: 'sebuah komentar', threadId: 'thread-123' };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = { content: 123, threadId: 'thread-123', owner: 'user-123' };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = { content: 'sebuah komentar', threadId: 'thread-123', owner: 'user-123' };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
