import express from 'express';
import ThreadsHandler from './handler.js';

const routes = (container) => {
  const router = express.Router();
  const handler = new ThreadsHandler(container);

  router.post('/', handler.postThreadHandler);
  router.post('/:threadId/comments', handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', handler.deleteCommentHandler);

  return router;
};

export default routes;
