const express = require('express');
const router = express.Router();
const citizenController = require('../controllers/citizen.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/:id', verifyToken, citizenController.getCitizenProfile);
router.get('/:id/allowances', verifyToken, citizenController.getCitizenAllowances);
router.get('/:id/dossiers', verifyToken, citizenController.getCitizenDossiers);
router.get('/:id/payments', verifyToken, citizenController.getCitizenPayments);
router.get('/:id/insurance', verifyToken, citizenController.getCitizenInsurance);
router.get('/:id/policy', verifyToken, citizenController.getCitizenPolicy);

module.exports = router;
