const db = require('../config/db');

async function getDashboardStats(req, res, next) {
  try {
    const [resultSets] = await db.query('CALL sp_get_dashboard_stats()');
    
    // Check if resultSets has the expected arrays
    if (resultSets && resultSets.length >= 4) {
      const dossierStats = resultSets[0][0] || {};
      const citizenStats = resultSets[1][0] || {};
      const feedbackStats = resultSets[2][0] || {};
      const paymentStats = resultSets[3][0] || {};

      res.json({
        success: true,
        data: {
          dossier: dossierStats,
          citizen: citizenStats,
          feedback: feedbackStats,
          payment: paymentStats
        }
      });
    } else {
      res.status(500).json({ success: false, message: 'Invalid stats response from database' });
    }
  } catch (error) {
    next(error);
  }
}

// 1. Citizens Management
async function getCitizens(req, res, next) {
  try {
    const { search } = req.query;
    let query = `
      SELECT c.*, CONCAT(w.ward_name, ', ', d.district_name, ', ', p.province_name) as full_address,
             w.ward_name, d.district_name, p.province_name
      FROM citizen c
      LEFT JOIN ward w ON c.ward_id = w.ward_id
      LEFT JOIN district d ON w.district_id = d.district_id
      LEFT JOIN province p ON d.province_id = p.province_id
    `;
    const params = [];
    if (search) {
      query += ' WHERE c.full_name LIKE ? OR c.cccd_number LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY c.citizen_id DESC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function updateCitizen(req, res, next) {
  try {
    const { id } = req.params;
    const { fullName, dob, gender, wardId, addressDetail } = req.body;
    const officerId = req.user.id;

    const [result] = await db.query('CALL sp_update_citizen_info(?, ?, ?, ?, ?, ?, ?)', [
      id,
      fullName || null,
      dob || null,
      gender || null,
      wardId || null,
      addressDetail || null,
      officerId
    ]);

    res.json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

// 2. Policy Management
async function getPolicyDistribution(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_policy_object_distribution');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getObjectMappings(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT om.*, c.full_name as citizen_name, c.cccd_number, po.object_name 
       FROM object_mapping om
       JOIN citizen c ON om.citizen_id = c.citizen_id
       JOIN policy_object po ON om.object_id = po.object_id
       ORDER BY om.start_date DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function createObjectMapping(req, res, next) {
  try {
    const { citizenId, objectId, startDate, endDate, status } = req.body;
    if (!citizenId || !objectId || !startDate) {
      return res.status(400).json({ success: false, message: 'Citizen ID, Object ID and Start Date are required' });
    }

    const [result] = await db.query(
      'INSERT INTO object_mapping (citizen_id, object_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [citizenId, objectId, startDate, endDate || null, status || 'active']
    );

    res.status(201).json({
      success: true,
      message: 'Đã thêm ánh xạ diện chính sách thành công!',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    next(error);
  }
}

// 3. Gifts & Tri ân
async function getCampaigns(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM campaign ORDER BY year DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getCampaignReport(req, res, next) {
  try {
    const { id } = req.params;
    const [resultSets] = await db.query('CALL sp_get_campaign_summary_report(?)', [id]);
    res.json({
      success: true,
      report: resultSets[0][0],
      message: resultSets[1][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

async function getVisits(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_visit_gift_history ORDER BY campaign_year DESC, citizen_name');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

// 4. Health insurance
async function getHealthInsurance(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT hi.*, c.full_name as citizen_name, c.cccd_number 
       FROM health_insurance hi
       JOIN citizen c ON hi.citizen_id = c.citizen_id`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function createMedicalSnapshot(req, res, next) {
  try {
    const { citizenId, healthStatus } = req.body;
    if (!citizenId || !healthStatus) {
      return res.status(400).json({ success: false, message: 'Citizen ID and health status are required' });
    }

    const [result] = await db.query('CALL sp_insert_medical_snapshot(?, ?)', [citizenId, healthStatus]);
    res.status(201).json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

// 5. Household
async function getHouseholds(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_household_policy_status');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function addHouseholdMember(req, res, next) {
  try {
    const { householdId, citizenId, relation } = req.body;
    if (!householdId || !citizenId || !relation) {
      return res.status(400).json({ success: false, message: 'Household ID, Citizen ID, and Relation are required' });
    }

    const [result] = await db.query('CALL sp_add_household_member(?, ?, ?)', [
      householdId,
      citizenId,
      relation
    ]);
    res.json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

// 6. Authorization
async function getAuthorizations(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_authorization_full ORDER BY authorization_id DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function createAuthorization(req, res, next) {
  try {
    const { policyHolderId, proxyId, relation, documentUrl, startDate, endDate } = req.body;
    if (!policyHolderId || !proxyId || !relation || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Policy Holder ID, Proxy ID, Relation, Start Date, and End Date are required' });
    }

    const [result] = await db.query('CALL sp_create_authorization(?, ?, ?, ?, ?, ?)', [
      policyHolderId,
      proxyId,
      relation,
      documentUrl || '',
      startDate,
      endDate
    ]);

    res.status(201).json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

async function revokeAuthorization(req, res, next) {
  try {
    const { id } = req.params;
    const officerId = req.user.id;

    const [result] = await db.query('CALL sp_revoke_authorization(?, ?)', [id, officerId]);
    res.json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

// 7. Payments
async function getPayments(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_payment_monthly_report');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getAllowancesByRegion(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_allowance_summary_by_region');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

// 8. Audit logs
async function getAuditLogs(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_audit_log_detail ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
  getCitizens,
  updateCitizen,
  getPolicyDistribution,
  getObjectMappings,
  createObjectMapping,
  getCampaigns,
  getCampaignReport,
  getVisits,
  getHealthInsurance,
  createMedicalSnapshot,
  getHouseholds,
  addHouseholdMember,
  getAuthorizations,
  createAuthorization,
  revokeAuthorization,
  getPayments,
  getAllowancesByRegion,
  getAuditLogs
};
