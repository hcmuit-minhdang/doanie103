function errorHandler(err, req, res, next) {
  console.error('Error occurred:', err);

  // Default error status and message
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle MySQL errors
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    status = 400;
    if (err.sqlMessage && err.sqlMessage.includes('object_mapping')) {
      message = 'Công dân này đã được gán diện chính sách này trước đó rồi! Vui lòng không gán trùng lặp.';
    } else if (err.sqlMessage && err.sqlMessage.includes('citizen_allowance')) {
      message = 'Công dân này đã đang được hưởng chế độ trợ cấp này rồi!';
    } else if (err.sqlMessage && err.sqlMessage.includes('authorization')) {
      message = 'Giấy ủy quyền này đã tồn tại trên hệ thống hoặc đã được đăng ký trước đó!';
    } else {
      message = 'Dữ liệu này đã tồn tại trên hệ thống! Vui lòng tránh nhập trùng lặp.';
    }
  } else if (err.sqlState) {
    status = 400;
    // Check if there is a custom trigger message set in the error
    if (err.sqlMessage) {
      message = err.sqlMessage;
    }
  }

  res.status(status).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

module.exports = errorHandler;
