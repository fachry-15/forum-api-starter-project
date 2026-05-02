class LikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    const isLiked = await this._commentRepository.isCommentLikedByUser(commentId, owner);

    if (isLiked) {
      await this._commentRepository.unlikeComment(commentId, owner);
    } else {
      await this._commentRepository.likeComment(commentId, owner);
    }
  }
}

export default LikeCommentUseCase;
