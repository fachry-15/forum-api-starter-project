import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.split(' ')[1];
      const tokenManager = this._container.getInstance('AuthenticationTokenManager');
      await tokenManager.verifyAccessToken(token);

      const payload = await tokenManager.decodePayload(token);
      const owner = payload.id;

      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

      const useCasePayload = {
        title: req.body.title,
        body: req.body.body,
        owner,
      };

      const addedThread = await addThreadUseCase.execute(useCasePayload);

      return res.status(201).json({
        status: 'success',
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async postCommentHandler(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.split(' ')[1];
      const tokenManager = this._container.getInstance('AuthenticationTokenManager');
      await tokenManager.verifyAccessToken(token);

      const payload = await tokenManager.decodePayload(token);
      const owner = payload.id;
      const { threadId } = req.params;

      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

      const useCasePayload = {
        content: req.body.content,
        threadId,
        owner,
      };

      const addedComment = await addCommentUseCase.execute(useCasePayload);

      return res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.split(' ')[1];
      const tokenManager = this._container.getInstance('AuthenticationTokenManager');
      await tokenManager.verifyAccessToken(token);

      const payload = await tokenManager.decodePayload(token);
      const owner = payload.id;
      const { threadId, commentId } = req.params;

      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

      const useCasePayload = {
        threadId,
        commentId,
        owner,
      };

      await deleteCommentUseCase.execute(useCasePayload);

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  async getThreadDetailHandler(req, res, next) {
    try {
      const { threadId } = req.params;

      const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
      const thread = await getThreadDetailUseCase.execute(threadId);

      return res.status(200).json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async postReplyHandler(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.split(' ')[1];
      const tokenManager = this._container.getInstance('AuthenticationTokenManager');
      await tokenManager.verifyAccessToken(token);

      const payload = await tokenManager.decodePayload(token);
      const owner = payload.id;
      const { threadId, commentId } = req.params;

      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

      const useCasePayload = {
        content: req.body.content,
        commentId,
        threadId,
        owner,
      };

      const addedReply = await addReplyUseCase.execute(useCasePayload);

      return res.status(201).json({
        status: 'success',
        data: {
          addedReply,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.split(' ')[1];
      const tokenManager = this._container.getInstance('AuthenticationTokenManager');
      await tokenManager.verifyAccessToken(token);

      const payload = await tokenManager.decodePayload(token);
      const owner = payload.id;
      const { threadId, commentId, replyId } = req.params;

      const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
      await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });

      return res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }
}
export default ThreadsHandler;

