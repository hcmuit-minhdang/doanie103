const db = require('../config/db');

async function getFeedbacks(req, res, next) {
  try {
    let query = 'SELECT * FROM v_feedback_detail';
    const params = [];

    // Filter by role if citizen
    if (req.user.role === 'citizen') {
      query += ' WHERE citizen_id = ?';
      params.push(req.user.id);
    } else {
      // Officials can filter by status, search by citizen name, etc.
      const filters = [];
      if (req.query.status) {
        filters.push('status = ?');
        params.push(req.query.status);
      }
      if (req.query.search) {
        filters.push('(citizen_name LIKE ? OR title LIKE ?)');
        params.push(`%${req.query.search}%`, `%${req.query.search}%`);
      }
      if (filters.length > 0) {
        query += ' WHERE ' + filters.join(' AND ');
      }
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function createFeedback(req, res, next) {
  try {
    const { title, content } = req.body;
    const citizenId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const [result] = await db.query(
      'INSERT INTO feedback_ticket (citizen_id, title, content, status) VALUES (?, ?, ?, "open")',
      [citizenId, title, content]
    );

    res.status(201).json({
      success: true,
      message: 'Đã gửi phản ánh kiến nghị thành công!',
      feedbackTicketId: result.insertId
    });
  } catch (error) {
    next(error);
  }
}

async function resolveFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const officerId = req.user.id;

    if (!reply) {
      return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    const [result] = await db.query('CALL sp_resolve_feedback(?, ?, ?)', [id, officerId, reply]);
    res.json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFeedbacks,
  createFeedback,
  resolveFeedback
};
