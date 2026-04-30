import { vi } from 'vitest';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockReplyRepository.checkAvailabilityReply = vi.fn().mockResolvedValue(undefined);
    mockReplyRepository.verifyReplyOwner = vi.fn().mockResolvedValue(undefined);
    mockReplyRepository.deleteReply = vi.fn().mockResolvedValue(undefined);

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.checkAvailabilityReply).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(useCasePayload.replyId);
  });

  it('should throw NotFoundError when thread does not exist', async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan'));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute({
      threadId: 'thread-not-found', commentId: 'comment-123', replyId: 'reply-123', owner: 'user-123',
    })).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when comment does not exist', async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockRejectedValue(new NotFoundError('komentar tidak ditemukan'));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute({
      threadId: 'thread-123', commentId: 'comment-not-found', replyId: 'reply-123', owner: 'user-123',
    })).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when reply does not exist', async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockReplyRepository.checkAvailabilityReply = vi.fn().mockRejectedValue(new NotFoundError('balasan tidak ditemukan'));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute({
      threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-not-found', owner: 'user-123',
    })).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError when user is not the reply owner', async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockReplyRepository.checkAvailabilityReply = vi.fn().mockResolvedValue(undefined);
    mockReplyRepository.verifyReplyOwner = vi.fn().mockRejectedValue(new AuthorizationError('Anda tidak memiliki akses'));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute({
      threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123', owner: 'user-other',
    })).rejects.toThrow(AuthorizationError);
  });
});
