import { vi } from 'vitest';
import LikeCommentUseCase from '../LikeCommentUseCase.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('LikeCommentUseCase', () => {
  it('should like a comment when the user has not yet liked it', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.isCommentLikedByUser = vi.fn().mockResolvedValue(false);
    mockCommentRepository.likeComment = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.unlikeComment = vi.fn();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeCommentUseCase.execute({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    });

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.isCommentLikedByUser).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.likeComment).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.unlikeComment).not.toHaveBeenCalled();
  });

  it('should unlike a comment when the user has already liked it', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.isCommentLikedByUser = vi.fn().mockResolvedValue(true);
    mockCommentRepository.likeComment = vi.fn();
    mockCommentRepository.unlikeComment = vi.fn().mockResolvedValue(undefined);

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeCommentUseCase.execute({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    });

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.isCommentLikedByUser).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.unlikeComment).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.likeComment).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when thread does not exist', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan'));

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      likeCommentUseCase.execute({ threadId: 'thread-not-found', commentId: 'comment-123', owner: 'user-123' })
    ).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith('thread-not-found');
  });

  it('should throw NotFoundError when comment does not exist', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockRejectedValue(new NotFoundError('komentar tidak ditemukan'));

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      likeCommentUseCase.execute({ threadId: 'thread-123', commentId: 'comment-not-found', owner: 'user-123' })
    ).rejects.toThrow(NotFoundError);
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith('comment-not-found');
  });
});
