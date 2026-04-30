class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    // Group replies by comment_id
    const repliesByCommentId = replies.reduce((acc, reply) => {
      const { comment_id, id, username, date, content, is_delete } = reply;
      if (!acc[comment_id]) {
        acc[comment_id] = [];
      }
      acc[comment_id].push({
        id,
        content: is_delete ? '**balasan telah dihapus**' : content,
        date,
        username,
      });
      return acc;
    }, {});

    const mappedComments = comments.map(({ id, username, date, content, is_delete }) => ({
      id,
      username,
      date,
      replies: repliesByCommentId[id] || [],
      content: is_delete ? '**komentar telah dihapus**' : content,
    }));

    return {
      ...thread,
      comments: mappedComments,
    };
  }
}

export default GetThreadDetailUseCase;
