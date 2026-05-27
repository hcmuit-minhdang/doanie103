const db = require('../config/db');

async function getCitizenProfile(req, res, next) {
  try {
    const { id } = req.params;
    // Check permission: Citizen can only view their own profile, but officials can view any
    if (req.user.role === 'citizen' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    const [rows] = await db.query('SELECT * FROM v_citizen_full_profile WHERE citizen_id = ?', [id]);
    if (rows.length === 0) {
      // In case they are a new citizen or don't have all joined relations, query citizen table directly
      const [directRows] = await db.query(
        `SELECT c.*, CONCAT(w.ward_name, ', ', d.district_name, ', ', p.province_name) as full_address
         FROM citizen c
         LEFT JOIN ward w ON c.ward_id = w.ward_id
         LEFT JOIN district d ON w.district_id = d.district_id
         LEFT JOIN province p ON d.province_id = p.province_id
         WHERE c.citizen_id = ?`,
        [id]
      );
      if (directRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy công dân!' });
      }
      return res.json({ success: true, data: directRows[0] });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}

async function getCitizenAllowances(req, res, next) {
  try {
    const { id } = req.params;
    if (req.user.role === 'citizen' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    const [rows] = await db.query('SELECT * FROM v_citizen_active_allowance WHERE citizen_id = ?', [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getCitizenDossiers(req, res, next) {
  try {
    const { id } = req.params;
    if (req.user.role === 'citizen' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    const [rows] = await db.query('SELECT * FROM dossier WHERE citizen_id = ? ORDER BY created_at DESC', [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getCitizenPayments(req, res, next) {
  try {
    const { id } = req.params;
    if (req.user.role === 'citizen' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    const [rows] = await db.query('SELECT * FROM payment_history WHERE citizen_id = ? ORDER BY payment_date DESC', [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getCitizenInsurance(req, res, next) {
  try {
    const { id } = req.params;
    if (req.user.role === 'citizen' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    const [rows] = await db.query('SELECT fn_check_insurance_validity(?) AS message', [id]);
    res.json({ success: true, message: rows[0].message });
  } catch (error) {
    next(error);
  }
}

async function getCitizenPolicy(req, res, next) {
  try {
    const { id } = req.params;
    if (req.user.role === 'citizen' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    const [rows] = await db.query('SELECT fn_get_citizen_policy_name(?) AS message', [id]);
    res.json({ success: true, message: rows[0].message });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCitizenProfile,
  getCitizenAllowances,
  getCitizenDossiers,
  getCitizenPayments,
  getCitizenInsurance,
  getCitizenPolicy
};
