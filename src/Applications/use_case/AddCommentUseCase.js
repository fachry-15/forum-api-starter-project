import NewComment from '../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);

    const newComment = new NewComment(useCasePayload);
    const addedComment = await this._commentRepository.addComment(newComment);
    return new AddedComment(addedComment);
  }
}

export default AddCommentUseCase;
