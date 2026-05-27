const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

// Require admin or relevant official roles
const adminRoles = requireRole(['admin', 'officer', 'reviewer', 'service', 'report']);

router.get('/stats', verifyToken, adminRoles, adminController.getDashboardStats);

// 1. Citizens
router.get('/citizens', verifyToken, adminRoles, adminController.getCitizens);
router.put('/citizens/:id', verifyToken, requireRole(['admin', 'officer']), adminController.updateCitizen);

// 2. Policy objects
router.get('/policy-objects', verifyToken, adminRoles, adminController.getPolicyDistribution);
router.get('/object-mappings', verifyToken, adminRoles, adminController.getObjectMappings);
router.post('/object-mappings', verifyToken, requireRole(['admin', 'officer']), adminController.createObjectMapping);

// 3. Gifts
router.get('/campaigns', verifyToken, adminRoles, adminController.getCampaigns);
router.get('/campaigns/:id/report', verifyToken, requireRole(['admin', 'report', 'officer']), adminController.getCampaignReport);
router.get('/visits', verifyToken, adminRoles, adminController.getVisits);

// 4. Health insurance
router.get('/health', verifyToken, adminRoles, adminController.getHealthInsurance);
router.post('/health/snapshot', verifyToken, requireRole(['admin', 'officer']), adminController.createMedicalSnapshot);

// 5. Households
router.get('/households', verifyToken, adminRoles, adminController.getHouseholds);
router.post('/households/member', verifyToken, requireRole(['admin', 'officer']), adminController.addHouseholdMember);

// 6. Authorizations
router.get('/authorizations', verifyToken, adminRoles, adminController.getAuthorizations);
router.post('/authorizations', verifyToken, requireRole(['admin', 'officer']), adminController.createAuthorization);
router.put('/authorizations/:id/revoke', verifyToken, requireRole(['admin', 'officer']), adminController.revokeAuthorization);

// 7. Payments
router.get('/payments', verifyToken, adminRoles, adminController.getPayments);
router.get('/allowances-by-region', verifyToken, adminRoles, adminController.getAllowancesByRegion);

// 8. Audit logs
router.get('/audit-logs', verifyToken, requireRole(['admin']), adminController.getAuditLogs);

module.exports = router;
