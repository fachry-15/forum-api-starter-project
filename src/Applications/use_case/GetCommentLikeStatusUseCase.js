class GetCommentLikeStatusUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    const liked = await this._commentRepository.isCommentLikedByUser(commentId, owner);

    return { liked };
  }
}

export default GetCommentLikeStatusUseCase;
