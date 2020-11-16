const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth');
const roomController = require('../../controllers/room/room');

router
  .post(
    '/rooms',
    authMiddleware.ensureAuth,
    authMiddleware.isAdmin,
    roomController.createRoom
  )
  .get(
    '/rooms/new',
    authMiddleware.ensureAuth,
    authMiddleware.isAdmin,
    roomController.getNewRoomForm
  );

module.exports = router;
