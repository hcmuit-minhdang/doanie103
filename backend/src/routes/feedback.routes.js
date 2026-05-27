const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, feedbackController.getFeedbacks);
router.post('/', verifyToken, requireRole(['citizen']), feedbackController.createFeedback);
router.put('/:id/resolve', verifyToken, requireRole(['admin', 'service', 'officer']), feedbackController.resolveFeedback);

module.exports = router;
