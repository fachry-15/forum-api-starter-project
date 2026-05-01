import NewReply from '../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../Domains/replies/entities/AddedReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId } = useCasePayload;

    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    const newReply = new NewReply(useCasePayload);
    const addedReply = await this._replyRepository.addReply(newReply);
    return new AddedReply(addedReply);
  }
}

export default AddReplyUseCase;
