const db = require('../config/db');

async function getProvinces(req, res, next) {
  try {
    const [rows] = await db.query('SELECT province_id as id, province_name as name FROM province ORDER BY province_name');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getDistricts(req, res, next) {
  try {
    const { provinceId } = req.params;
    const [rows] = await db.query('SELECT district_id as id, district_name as name FROM district WHERE province_id = ? ORDER BY district_name', [provinceId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getWards(req, res, next) {
  try {
    const { districtId } = req.params;
    const [rows] = await db.query('SELECT ward_id as id, ward_name as name FROM ward WHERE district_id = ? ORDER BY ward_name', [districtId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getPolicyObjects(req, res, next) {
  try {
    const [rows] = await db.query('SELECT object_id as id, object_name as name, description FROM policy_object');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getAllowanceRegimes(req, res, next) {
  try {
    const [rows] = await db.query('SELECT regime_id as id, regime_name as name, base_amount as baseAmount, description FROM allowance_regime');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getBanks(req, res, next) {
  try {
    const [rows] = await db.query('SELECT bank_id as id, bank_code as code, bank_name as name FROM bank');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getCampaigns(req, res, next) {
  try {
    const [rows] = await db.query('SELECT campaign_id as id, campaign_name as name, year FROM campaign ORDER BY year DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProvinces,
  getDistricts,
  getWards,
  getPolicyObjects,
  getAllowanceRegimes,
  getBanks,
  getCampaigns
};
