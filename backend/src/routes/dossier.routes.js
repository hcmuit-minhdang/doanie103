const express = require('express');
const router = express.Router();
const dossierController = require('../controllers/dossier.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, dossierController.getDossiers);
router.get('/pending', verifyToken, requireRole(['admin', 'reviewer', 'officer']), dossierController.getPendingDossiers);
router.get('/:id', verifyToken, dossierController.getDossierById);
router.post('/', verifyToken, dossierController.createDossier);
router.put('/:id/submit', verifyToken, requireRole(['citizen']), dossierController.submitDossier);
router.put('/:id/review', verifyToken, requireRole(['admin', 'reviewer']), dossierController.reviewDossier);
router.post('/:id/transfer', verifyToken, requireRole(['admin', 'officer', 'reviewer']), dossierController.transferDossier);
router.post('/upload-attachment', verifyToken, dossierController.uploadAttachment);
router.post('/:id/attachments', verifyToken, dossierController.addAttachment);

module.exports = router;
