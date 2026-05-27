const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function loginCitizen(req, res, next) {
  try {
    const { cccd, password } = req.body;

    if (!cccd) {
      return res.status(400).json({ success: false, message: 'CCCD number is required' });
    }

    // Query citizen in database
    const [rows] = await db.query('SELECT * FROM citizen WHERE cccd_number = ?', [cccd]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Công dân không tồn tại trên hệ thống!' });
    }

    const citizen = rows[0];

    // For demo, we accept any password or '123456'
    // Since citizen does not have password in DB, we default to '123456'
    if (password !== '123456') {
      return res.status(401).json({ success: false, message: 'Sai mật khẩu!' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: citizen.citizen_id,
        cccd: citizen.cccd_number,
        name: citizen.full_name,
        role: 'citizen'
      },
      process.env.JWT_SECRET || 'ie103_jwt_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: citizen.citizen_id,
        cccd: citizen.cccd_number,
        name: citizen.full_name,
        role: 'citizen'
      }
    });
  } catch (error) {
    next(error);
  }
}

async function loginOfficial(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Query official in database
    const [rows] = await db.query('SELECT * FROM official WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Cán bộ không tồn tại!' });
    }

    const official = rows[0];

    // Check password: in demo we support both '123456' and their DB password_hash value
    const isValid = password === '123456' || password === official.password_hash || password === 'Officer@123' || password === 'Admin@123' || password === 'Reviewer@123' || password === 'Service@123' || password === 'Report@123';
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không đúng!' });
    }

    // All official users get mapped to 'admin' for demo simplicity, unlocking all dashboard tabs and features for every staff member
    let mappedRole = 'admin';

    // Generate JWT
    const token = jwt.sign(
      {
        id: official.official_id,
        username: official.username,
        role: mappedRole,
        originalRole: official.role,
        agencyId: official.agency_id
      },
      process.env.JWT_SECRET || 'ie103_jwt_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: official.official_id,
        username: official.username,
        role: mappedRole,
        originalRole: official.role,
        agencyId: official.agency_id
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  loginCitizen,
  loginOfficial,
  getMe
};
