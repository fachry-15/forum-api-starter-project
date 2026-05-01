import { vi } from 'vitest';
import AddReplyUseCase from '../AddReplyUseCase.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Nilai kembalian mock dibuat sebagai objek mentah yang berbeda dari expected value,
    // sehingga kita bisa memastikan use case benar-benar memproses hasil dari dependensi.
    const mockRepositoryResult = {
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockResolvedValue(undefined);
    mockReplyRepository.addReply = vi.fn().mockResolvedValue(mockRepositoryResult);

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new NewReply({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
  });

  it('should throw NotFoundError when thread does not exist', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
      commentId: 'comment-123',
      threadId: 'thread-not-found',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan'));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(useCasePayload.threadId);
  });

  it('should throw NotFoundError when comment does not exist', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
      commentId: 'comment-not-found',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = vi.fn().mockResolvedValue(undefined);
    mockCommentRepository.checkAvailabilityComment = vi.fn().mockRejectedValue(new NotFoundError('komentar tidak ditemukan'));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
  });
});
