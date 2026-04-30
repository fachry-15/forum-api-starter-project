import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);

    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(newComment);
  }
}

export default AddCommentUseCase;
