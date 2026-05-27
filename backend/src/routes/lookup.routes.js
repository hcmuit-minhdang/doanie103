const express = require('express');
const router = express.Router();
const lookupController = require('../controllers/lookup.controller');

router.get('/provinces', lookupController.getProvinces);
router.get('/districts/:provinceId', lookupController.getDistricts);
router.get('/wards/:districtId', lookupController.getWards);
router.get('/policy-objects', lookupController.getPolicyObjects);
router.get('/allowance-regimes', lookupController.getAllowanceRegimes);
router.get('/banks', lookupController.getBanks);
router.get('/campaigns', lookupController.getCampaigns);

module.exports = router;
