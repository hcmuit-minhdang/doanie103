const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Setup optional Cloudinary storage for persistent free uploads
let cloudinary;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  try {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  } catch (err) {
    console.warn('Cloudinary package not installed. Run "npm install cloudinary" to use Cloudinary.');
  }
}

async function getDossiers(req, res, next) {
  try {
    let query = 'SELECT * FROM v_dossier_detail';
    const params = [];

    // Filter by role if citizen
    if (req.user.role === 'citizen') {
      query += ' WHERE citizen_id = ?';
      params.push(req.user.id);
    } else {
      // Officials can filter by status, citizen name, etc.
      const filters = [];
      if (req.query.status) {
        filters.push('status = ?');
        params.push(req.query.status);
      }
      if (req.query.type) {
        filters.push('dossier_type = ?');
        params.push(req.query.type);
      }
      if (req.query.search) {
        filters.push('(citizen_name LIKE ? OR cccd_number LIKE ?)');
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

async function getPendingDossiers(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM v_pending_dossiers ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function getDossierById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM v_dossier_detail WHERE dossier_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Dossier not found' });
    }

    const dossier = rows[0];
    if (req.user.role === 'citizen' && String(req.user.id) !== String(dossier.citizen_id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    // Fetch attachments
    const [attachments] = await db.query('SELECT * FROM attachment WHERE dossier_id = ?', [id]);
    dossier.attachments = attachments;

    // Fetch transfers
    const [transfers] = await db.query(
      `SELECT dt.*, a1.agency_name as from_agency_name, a2.agency_name as to_agency_name 
       FROM dossier_transfer dt
       JOIN agency a1 ON dt.from_agency = a1.agency_id
       JOIN agency a2 ON dt.to_agency = a2.agency_id
       WHERE dt.dossier_id = ? 
       ORDER BY dt.transfer_date DESC`,
      [id]
    );
    dossier.transfers = transfers;

    res.json({ success: true, data: dossier });
  } catch (error) {
    next(error);
  }
}

async function createDossier(req, res, next) {
  try {
    const { citizenId, dossierType, note, autoSubmit, attachments } = req.body;
    const resolvedCitizenId = req.user.role === 'citizen' ? req.user.id : citizenId;

    if (!resolvedCitizenId || !dossierType) {
      return res.status(400).json({ success: false, message: 'Citizen ID and Dossier Type are required' });
    }

    // Call stored procedure sp_create_dossier
    const [result] = await db.query('CALL sp_create_dossier(?, ?, ?, ?)', [
      resolvedCitizenId,
      dossierType,
      note || '',
      autoSubmit === true || autoSubmit === 'true'
    ]);

    const outData = result[0][0];
    const newDossierId = outData.dossier_id;

    // Insert attachments if provided
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      for (const att of attachments) {
        await db.query(
          'INSERT INTO attachment (dossier_id, file_name, file_url) VALUES (?, ?, ?)',
          [newDossierId, att.fileName || att.file_name, att.fileUrl || att.file_url || '']
        );
      }
    }

    res.status(201).json({
      success: true,
      message: outData.Thong_Bao,
      dossierId: newDossierId
    });
  } catch (error) {
    next(error);
  }
}

async function submitDossier(req, res, next) {
  try {
    const { id } = req.params;
    const citizenId = req.user.id; // Only citizen themselves can submit draft

    const [result] = await db.query('CALL sp_submit_dossier(?, ?)', [id, citizenId]);
    res.json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

async function reviewDossier(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const officerId = req.user.id;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid review status (approved or rejected)' });
    }

    // We can set session variable for trigger to capture ip
    await db.query('SET @app_client_ip = ?', [req.ip || '127.0.0.1']);

    const [result] = await db.query('CALL sp_review_dossier(?, ?, ?, ?)', [
      id,
      officerId,
      status,
      note || ''
    ]);

    // Query trigger_msg
    const [triggerMsgRows] = await db.query('SELECT @trigger_msg AS msg');

    res.json({
      success: true,
      message: result[0][0].Thong_Bao,
      triggerMessage: triggerMsgRows[0].msg
    });
  } catch (error) {
    next(error);
  }
}

async function transferDossier(req, res, next) {
  try {
    const { id } = req.params;
    const { fromAgency, toAgency } = req.body;

    if (!fromAgency || !toAgency) {
      return res.status(400).json({ success: false, message: 'Source and target agencies are required' });
    }

    const [result] = await db.query('CALL sp_transfer_dossier(?, ?, ?)', [id, fromAgency, toAgency]);
    res.json({
      success: true,
      message: result[0][0].Thong_Bao
    });
  } catch (error) {
    next(error);
  }
}

async function addAttachment(req, res, next) {
  try {
    const { id } = req.params;
    const { fileName, fileUrl } = req.body;

    if (!fileName) {
      return res.status(400).json({ success: false, message: 'File name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO attachment (dossier_id, file_name, file_url) VALUES (?, ?, ?)',
      [id, fileName, fileUrl || '']
    );

    res.status(201).json({
      success: true,
      message: 'Attachment added successfully',
      attachmentId: result.insertId
    });
  } catch (error) {
    next(error);
  }
}

// Populate mock templates
function initTemplates() {
  try {
    const templatesDir = path.join(__dirname, '..', '..', 'uploads', 'templates');
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    
    const sampleFiles = [
      { name: 'to_khai_thuong_binh.pdf', content: 'Mau to khai dang ky che do uu dai Thuong binh - Cong dich vu cong An sinh xa hoi' },
      { name: 'don_xin_nha_tinh_nghia.docx', content: 'Mau don xin ho tro kinh phi sua chua nha tinh nghia - Cong dich vu cong An sinh xa hoi' },
      { name: 'giay_uy_quyen_an_sinh.pdf', content: 'Giay uy quyen nhan tro cap an sinh xa hoi - Cong dich vu cong An sinh xa hoi' },
      { name: 'don_xin_cap_the_bhyt.pdf', content: 'Mau don xin cap the bao hiem y te uu dai - Cong dich vu cong An sinh xa hoi' }
    ];

    for (const file of sampleFiles) {
      const filePath = path.join(templatesDir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.content, 'utf8');
      }
    }
  } catch (err) {
    console.error('Error initializing templates:', err);
  }
}
initTemplates();

async function uploadAttachment(req, res, next) {
  try {
    const { fileName, fileData } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ success: false, message: 'File name and file data are required' });
    }

    // If Cloudinary is configured, upload to Cloudinary instead
    if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      let uploadStr = fileData;
      if (!fileData.startsWith('data:')) {
        const ext = path.extname(fileName).toLowerCase();
        let mimeType = 'application/pdf';
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          mimeType = `image/${ext.replace('.', '') === 'jpg' ? 'jpeg' : ext.replace('.', '')}`;
        }
        uploadStr = `data:${mimeType};base64,${fileData}`;
      }

      const uploadResponse = await cloudinary.uploader.upload(uploadStr, {
        folder: 'social_welfare_attachments',
        resource_type: 'auto',
        public_id: `${Date.now()}-${path.basename(fileName, path.extname(fileName)).replace(/[^a-zA-Z0-9]/g, '_')}`
      });

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully to Cloudinary',
        fileName: fileName,
        fileUrl: uploadResponse.secure_url
      });
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean up file data (remove prefix if base64 data url)
    let base64Content = fileData;
    if (fileData.includes(';base64,')) {
      base64Content = fileData.split(';base64,')[1];
    }

    const buffer = Buffer.from(base64Content, 'base64');
    
    // Generate a unique filename using timestamp
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const uniqueFileName = `${Date.now()}-${baseName.replace(/[^a-zA-Z0-9]/g, '_')}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save file
    fs.writeFileSync(filePath, buffer);

    // Form static URL dynamically based on request host
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${uniqueFileName}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      fileName: uniqueFileName,
      fileUrl
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDossiers,
  getPendingDossiers,
  getDossierById,
  createDossier,
  submitDossier,
  reviewDossier,
  transferDossier,
  addAttachment,
  uploadAttachment
};
