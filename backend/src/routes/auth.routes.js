const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/login/citizen', authController.loginCitizen);
router.post('/login/official', authController.loginOfficial);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
