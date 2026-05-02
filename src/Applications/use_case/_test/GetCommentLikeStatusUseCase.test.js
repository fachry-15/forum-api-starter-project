import { vi } from 'vitest';
import GetCommentLikeStatusUseCase from '../GetCommentLikeStatusUseCase.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('GetCommentLikeStatusUseCase', () => {
  it('should return liked=true when user has liked the comment', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.isCommentLikedByUser = vi.fn().mockResolvedValue(true);

    const useCase = new GetCommentLikeStatusUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await useCase.execute({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    });

    // Assert
    expect(result).toEqual({ liked: true });
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.isCommentLikedByUser).toHaveBeenCalledWith('comment-123', 'user-123');
  });

  it('should return liked=false when user has not liked the comment', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.isCommentLikedByUser = vi.fn().mockResolvedValue(false);

    const useCase = new GetCommentLikeStatusUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await useCase.execute({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    });

    // Assert
    expect(result).toEqual({ liked: false });
  });
});
