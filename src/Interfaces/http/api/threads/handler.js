import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

class PostThreadHandler {
  constructor(container) {
    this._container = container;
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
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

      const addedThread = await addThreadUseCase.execute({
        title: req.body.title,
        body: req.body.body,
        owner,
      });

      return res.status(201).json({
        status: 'success',
        data: { addedThread },
      });
    } catch (error) {
      next(error);
    }
  }
}

class PostCommentHandler {
  constructor(container) {
    this._container = container;
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
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

      const addedComment = await addCommentUseCase.execute({
        content: req.body.content,
        threadId,
        owner,
      });

      return res.status(201).json({
        status: 'success',
        data: { addedComment },
      });
    } catch (error) {
      next(error);
    }
  }
}

class DeleteCommentHandler {
  constructor(container) {
    this._container = container;
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
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

      await deleteCommentUseCase.execute({ threadId, commentId, owner });

      return res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

class GetThreadDetailHandler {
  constructor(container) {
    this._container = container;
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
    try {
      const { threadId } = req.params;

      const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
      const thread = await getThreadDetailUseCase.execute(threadId);

      return res.status(200).json({
        status: 'success',
        data: { thread },
      });
    } catch (error) {
      next(error);
    }
  }
}

class PostReplyHandler {
  constructor(container) {
    this._container = container;
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
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

      const addedReply = await addReplyUseCase.execute({
        content: req.body.content,
        commentId,
        threadId,
        owner,
      });

      return res.status(201).json({
        status: 'success',
        data: { addedReply },
      });
    } catch (error) {
      next(error);
    }
  }
}

class DeleteReplyHandler {
  constructor(container) {
    this._container = container;
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
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

export {
  PostThreadHandler,
  PostCommentHandler,
  DeleteCommentHandler,
  GetThreadDetailHandler,
  PostReplyHandler,
  DeleteReplyHandler,
};
