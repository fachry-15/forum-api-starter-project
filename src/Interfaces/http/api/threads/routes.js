import express from 'express';
import {
  PostThreadHandler,
  PostCommentHandler,
  DeleteCommentHandler,
  GetThreadDetailHandler,
  PostReplyHandler,
  DeleteReplyHandler,
} from './handler.js';

const routes = (container) => {
  const router = express.Router();

  router.post('/', new PostThreadHandler(container).handle);
  router.get('/:threadId', new GetThreadDetailHandler(container).handle);
  router.post('/:threadId/comments', new PostCommentHandler(container).handle);
  router.delete('/:threadId/comments/:commentId', new DeleteCommentHandler(container).handle);
  router.post('/:threadId/comments/:commentId/replies', new PostReplyHandler(container).handle);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', new DeleteReplyHandler(container).handle);

  return router;
};

export default routes;
