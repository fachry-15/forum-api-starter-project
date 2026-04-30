import express from 'express';
import ThreadsHandler from './handler.js';

const routes = (container) => {
  const router = express.Router();
  const handler = new ThreadsHandler(container);

  router.post('/', handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadDetailHandler);
  router.post('/:threadId/comments', handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', handler.deleteCommentHandler);
  router.post('/:threadId/comments/:commentId/replies', handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', handler.deleteReplyHandler);

  return router;
};

export default routes;
