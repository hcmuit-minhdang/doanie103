const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'ie103_jwt_secret_key_2026', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const hasRole = Array.isArray(roles)
      ? roles.some(role => req.user.role && req.user.role.toLowerCase().includes(role.toLowerCase()))
      : req.user.role && req.user.role.toLowerCase().includes(roles.toLowerCase());

    if (!hasRole) {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn không có đủ quyền hạn cán bộ để thực hiện hành động này hoặc truy cập dữ liệu mục này!' });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  requireRole
};
