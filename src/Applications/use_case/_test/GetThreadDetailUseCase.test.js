import { vi } from 'vitest';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly with replies', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'komentar yang dihapus',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        username: 'johndoe',
        date: '2021-08-08T07:59:48.766Z',
        content: 'balasan yang dihapus',
        is_delete: true,
        comment_id: 'comment-1',
      },
      {
        id: 'reply-2',
        username: 'dicoding',
        date: '2021-08-08T08:07:01.522Z',
        content: 'sebuah balasan',
        is_delete: false,
        comment_id: 'comment-1',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByThreadId = vi.fn().mockResolvedValue(mockReplies);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);

    expect(threadDetail).toEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          replies: [
            {
              id: 'reply-1',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T07:59:48.766Z',
              username: 'johndoe',
            },
            {
              id: 'reply-2',
              content: 'sebuah balasan',
              date: '2021-08-08T08:07:01.522Z',
              username: 'dicoding',
            },
          ],
          content: 'sebuah comment',
        },
        {
          id: 'comment-2',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          replies: [],
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });

  it('should throw NotFoundError when thread does not exist', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan'));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(getThreadDetailUseCase.execute('thread-not-found')).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-not-found');
  });

  it('should return thread with empty comments and replies when none exist', async () => {
    // Arrange
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue([]);
    mockReplyRepository.getRepliesByThreadId = vi.fn().mockResolvedValue([]);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith('thread-123');
    expect(threadDetail).toEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    });
  });
});
