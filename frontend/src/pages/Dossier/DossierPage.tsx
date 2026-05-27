import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dossierApi, lookupApi, citizenApi } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  FileText, 
  Upload, 
  FileDown, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  FileSignature,
  Loader2,
  Paperclip,
  Trash2
} from 'lucide-react';

export const DossierPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'attachments' | 'templates'>('create');
  
  // States for new dossier
  const [dossierType, setDossierType] = useState<'new_regime' | 'adjust_regime' | 'stop_regime'>('new_regime');
  const [note, setNote] = useState('');
  const [policyObjects, setPolicyObjects] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [dossiersList, setDossiersList] = useState<any[]>([]);

  // Tab: attachments states
  const [selectedDossierId, setSelectedDossierId] = useState<number | ''>('');
  const [selectedDossierDetail, setSelectedDossierDetail] = useState<any | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Messages
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLookupData();
    if (user?.role === 'citizen') {
      fetchCitizenDossiers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedDossierId) {
      fetchDossierDetail(Number(selectedDossierId));
    } else {
      setSelectedDossierDetail(null);
    }
  }, [selectedDossierId]);

  const fetchLookupData = async () => {
    try {
      const res = await lookupApi.getPolicyObjects();
      setPolicyObjects(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedPolicy(res.data.data[0].id);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchCitizenDossiers = async () => {
    try {
      if (!user) return;
      const res = await citizenApi.getDossiers(user.id);
      setDossiersList(res.data.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchDossierDetail = async (id: number) => {
    try {
      const res = await dossierApi.get(id);
      setSelectedDossierDetail(res.data.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'create' | 'supplement') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (limit to 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setErrorMsg(`Dung lượng tệp "${file.name}" quá lớn (${(file.size / 1024 / 1024).toFixed(2)} MB). Vui lòng chọn tệp nhỏ hơn 10 MB.`);
      return;
    }

    setUploadingFile(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await dossierApi.uploadAttachment({
            fileName: file.name,
            fileData: base64Data
          });
          if (res.data.success) {
            const uploadedUrl = res.data.fileUrl;
            
            if (target === 'create') {
              setFileName(file.name);
              setFileUrl(uploadedUrl);
              setSuccessMsg(`Tải lên tệp minh chứng "${file.name}" thành công!`);
            } else if (target === 'supplement') {
              if (!selectedDossierId) return;
              const attachRes = await dossierApi.addAttachment(Number(selectedDossierId), {
                fileName: file.name,
                fileUrl: uploadedUrl
              });
              if (attachRes.data.success) {
                setSuccessMsg(`Bổ sung minh chứng "${file.name}" cho hồ sơ #${selectedDossierId} thành công!`);
                fetchDossierDetail(Number(selectedDossierId));
              }
            }
          }
        } catch (err: any) {
          setErrorMsg(err.response?.data?.message || err.message || 'Lỗi khi tải file lên server!');
        } finally {
          setUploadingFile(false);
        }
      };
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi đọc file!');
      setUploadingFile(false);
    }
  };

  const handleSubmitDossier = async (autoSubmit: boolean) => {
    if (!user) return;
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      // Package attachments if provided
      const attachments = fileName ? [{ fileName, fileUrl: fileUrl || 'https://drive.google.com/mock-file.pdf' }] : [];

      const res = await dossierApi.create({
        citizenId: user.id,
        dossierType,
        note: `[Chính sách: ${policyObjects.find(p => String(p.id) === String(selectedPolicy))?.name || 'N/A'}] - ${note}`,
        autoSubmit,
        attachments
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setNote('');
        setFileName('');
        setFileUrl('');
        fetchCitizenDossiers();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Lỗi khi tạo hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (dossierId: number) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await dossierApi.submit(dossierId);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        fetchCitizenDossiers();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const templates = [
    { title: 'Tờ khai đăng ký chế độ ưu đãi Thương binh', size: '240 KB', ext: 'PDF', file: 'to_khai_thuong_binh.pdf' },
    { title: 'Đơn xin hỗ trợ kinh phí sửa chữa nhà tình nghĩa', size: '185 KB', ext: 'DOCX', file: 'don_xin_nha_tinh_nghia.docx' },
    { title: 'Giấy ủy quyền nhận trợ cấp an sinh xã hội', size: '120 KB', ext: 'PDF', file: 'giay_uy_quyen_an_sinh.pdf' },
    { title: 'Đơn xin cấp thẻ bảo hiểm y tế ưu đãi', size: '98 KB', ext: 'PDF', file: 'don_xin_cap_the_bhyt.pdf' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-8 min-h-[600px]">
      
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6 flex items-center space-x-3">
        <div className="p-2.5 bg-primary-800 text-white rounded-lg">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-primary-800">
            Dịch Vụ Đăng Ký & Quản Lý Hồ Sơ
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Soạn hồ sơ ưu đãi, đính kèm minh chứng và nộp thẩm định trực tuyến
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-premium/5 overflow-hidden">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium flex items-center justify-center ${
            activeTab === 'create'
              ? 'border-primary-800 text-primary-800 bg-cream-100/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nộp Hồ Sơ Ưu Đãi Mới
        </button>
        <button
          onClick={() => setActiveTab('attachments')}
          className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium flex items-center justify-center ${
            activeTab === 'attachments'
              ? 'border-primary-800 text-primary-800 bg-cream-100/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-4 h-4 mr-2" />
          Bổ Sung Minh Chứng
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium flex items-center justify-center ${
            activeTab === 'templates'
              ? 'border-primary-800 text-primary-800 bg-cream-100/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Tải Biểu Mẫu Chuẩn
        </button>
      </div>

      {/* Display messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start text-sm text-emerald-700 space-x-2.5 shadow-sm animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start text-sm text-rose-700 space-x-2.5 shadow-sm animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: Form on Left, History on Right (for Citizens) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Pane */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'create' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
              <h3 className="font-serif text-lg font-bold flex items-center">
                <FileSignature className="w-5 h-5 mr-2.5 text-primary-800" />
                Phiếu Đề Nghị Hưởng Chế Độ Ưu Đãi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Loại yêu cầu hồ sơ
                  </label>
                  <select
                    value={dossierType}
                    onChange={(e: any) => setDossierType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 transition-premium"
                  >
                    <option value="new_regime">Đăng ký mới (Đăng ký hưởng chế độ lần đầu)</option>
                    <option value="adjust_regime">Điều chỉnh mức (Cập nhật tỷ lệ suy giảm, điều chỉnh chế độ)</option>
                    <option value="stop_regime">Đình chỉ trợ cấp (Ngưng nhận do mất sức hoặc lý do khác)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Diện chính sách đề xuất
                  </label>
                  <select
                    value={selectedPolicy}
                    onChange={(e) => setSelectedPolicy(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 transition-premium"
                  >
                    {policyObjects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Lý do / Nội dung chi tiết đính kèm
                </label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi rõ lý do làm hồ sơ, quá trình cống hiến, bệnh trạng hiện tại..."
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 transition-premium"
                ></textarea>
              </div>

              {/* Dropzone file upload */}
              <div className="border border-dashed border-slate-200 p-6 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3 relative">
                {uploadingFile ? (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <Loader2 className="w-10 h-10 text-primary-800 animate-spin" />
                    <p className="text-sm font-semibold text-slate-700">Đang mã hóa & tải lên máy chủ...</p>
                  </div>
                ) : fileName ? (
                  <div className="flex flex-col items-center justify-center py-2 space-y-2 w-full">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700 font-serif">Minh chứng đính kèm thành công</p>
                      <div className="mt-1 flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-mono bg-white border px-3 py-1.5 rounded-full w-max mx-auto shadow-sm">
                        <Paperclip className="w-3.5 h-3.5 text-primary-800" />
                        <span className="truncate max-w-[200px]">{fileName}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFileName(''); setFileUrl(''); }}
                      className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center space-x-1 transition-colors pt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Gỡ bỏ tệp</span>
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full space-y-3 py-4">
                    <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary-800 transition-colors" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Chọn hoặc Kéo thả minh chứng vào đây</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Giấy chứng nhận bệnh tật, biên bản giám định (PDF, PNG, JPG)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'create')}
                      className="hidden"
                    />
                    <div className="px-4 py-2 border rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-xs font-bold text-slate-700">
                      Chọn tệp từ máy tính
                    </div>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSubmitDossier(false)}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm transition-premium hover:bg-slate-50 disabled:opacity-50"
                >
                  Lưu Bản Nháp (Draft)
                </button>
                <button
                  onClick={() => handleSubmitDossier(true)}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-primary-800 hover:bg-primary-700 text-white font-bold text-sm shadow transition-premium disabled:opacity-50"
                >
                  Nộp Thẩm Định Ngay
                </button>
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold">Bổ Sung Minh Chứng Cho Hồ Sơ Hiện Có</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Chọn một hồ sơ Bản nháp hoặc Chờ duyệt để bổ sung các minh chứng y khoa/pháp lý cần thiết.</p>
              </div>

              {/* Dossier Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Chọn hồ sơ an sinh cần bổ sung
                  </label>
                  <select
                    value={selectedDossierId}
                    onChange={(e) => setSelectedDossierId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 transition-premium"
                  >
                    <option value="">-- Chọn hồ sơ của bạn --</option>
                    {dossiersList.map((d) => (
                      <option key={d.dossier_id} value={d.dossier_id}>
                        Mã HS: #{d.dossier_id} - {d.dossier_type === 'new_regime' ? 'Đăng ký mới' : d.dossier_type === 'adjust_regime' ? 'Cập nhật' : 'Đình chỉ'} ({d.status === 'draft' ? 'Bản nháp' : d.status === 'submitted' ? 'Chờ duyệt' : d.status === 'approved' ? 'Đã duyệt' : 'Từ chối'})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDossierDetail ? (
                  <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-5 animate-in fade-in duration-300">
                    <div className="flex justify-between items-start border-b pb-3 border-slate-200/60 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wide">Chi tiết hồ sơ #{selectedDossierDetail.dossier_id}</h4>
                        <p className="text-slate-500 italic mt-1 font-light">"{selectedDossierDetail.note}"</p>
                      </div>
                      <StatusBadge status={selectedDossierDetail.status} />
                    </div>

                    {/* Attachment List */}
                    <div className="space-y-2">
                      <h5 className="font-semibold text-xs text-slate-600 flex items-center">
                        <Paperclip className="w-3.5 h-3.5 mr-1 text-primary-800" />
                        Danh sách tệp minh chứng hiện tại ({selectedDossierDetail.attachments?.length || 0})
                      </h5>
                      {(!selectedDossierDetail.attachments || selectedDossierDetail.attachments.length === 0) ? (
                        <p className="text-[11px] text-slate-400 italic">Hồ sơ này chưa có tệp minh chứng đính kèm.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedDossierDetail.attachments.map((att: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg border bg-white flex items-center justify-between text-xs">
                              <span className="font-mono text-slate-600 truncate max-w-[160px]">{att.file_name || att.fileName}</span>
                              <a
                                href={att.file_url || att.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-primary-800 hover:underline font-bold shrink-0"
                              >
                                Xem tệp
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upload picker for supplement */}
                    {['draft', 'submitted'].includes(selectedDossierDetail.status) && (
                      <div className="border border-dashed border-slate-200 p-6 rounded-xl bg-white flex flex-col items-center justify-center text-center space-y-3">
                        {uploadingFile ? (
                          <div className="flex flex-col items-center justify-center py-2 space-y-2">
                            <Loader2 className="w-8 h-8 text-primary-800 animate-spin" />
                            <p className="text-xs font-semibold text-slate-700">Đang tải tệp bổ sung lên...</p>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center w-full space-y-2">
                            <Upload className="w-8 h-8 text-slate-400 hover:text-primary-800 transition-colors" />
                            <div>
                              <p className="text-xs font-semibold text-slate-700">Tải tệp minh chứng bổ sung</p>
                              <p className="text-[10px] text-slate-400">Đính kèm thêm tệp PDF hoặc ảnh chụp bổ túc hồ sơ</p>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'supplement')}
                              className="hidden"
                            />
                            <div className="px-3 py-1.5 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-[10px] font-bold text-slate-700">
                              Chọn tệp...
                            </div>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 border border-dashed rounded-2xl bg-slate-50 text-center py-12 text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs">Vui lòng chọn hồ sơ ở danh sách trên để xem chi tiết và bổ sung minh chứng.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
              <h3 className="font-serif text-lg font-bold">Danh Sách Biểu Mẫu Pháp Lý Chuẩn</h3>
              <p className="text-xs text-slate-500 font-sans">Tải xuống các biểu mẫu hành chính tiêu chuẩn, điền đầy đủ thông tin và ký xác nhận trước khi scan nộp minh chứng.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-primary-100 hover:bg-cream-100/10 transition-premium flex items-center justify-between group">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-slate-700 group-hover:text-primary-800">{t.title}</h4>
                      <p className="text-[10px] text-slate-400">{t.size} • Định dạng: <span className="font-bold text-slate-500">{t.ext}</span></p>
                    </div>
                    <a
                      href={`http://localhost:3001/uploads/templates/${t.file}`}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-50 hover:bg-primary-800 hover:text-white transition-premium border border-slate-100"
                    >
                      <FileDown className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dossiers List (Right Sidebar for Citizen view) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
            <h3 className="font-serif text-lg font-bold flex items-center border-b border-slate-100 pb-3">
              <History className="w-5 h-5 mr-2 text-primary-800" />
              Lịch Sử Hồ Sơ Của Bạn
            </h3>

            {dossiersList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Bạn chưa có hồ sơ nào nộp trên hệ thống.</p>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {dossiersList.map((d) => (
                  <div key={d.dossier_id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-cream-100/5 transition-premium space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Mã HS: #{d.dossier_id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-700 mt-0.5">
                          {d.dossier_type === 'new_regime' ? 'Đăng ký mới' : 
                           d.dossier_type === 'adjust_regime' ? 'Điều chỉnh mức' : 'Đình chỉ trợ cấp'}
                        </h4>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed font-light">
                      "{d.note}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-sans">
                      <span>{new Date(d.created_at).toLocaleDateString('vi-VN')}</span>
                      
                      {/* Submit action if draft */}
                      {d.status === 'draft' && (
                        <button
                          onClick={() => handleManualSubmit(d.dossier_id)}
                          className="px-2.5 py-1 rounded bg-primary-800 text-white font-bold text-[9px] hover:bg-primary-700 transition-colors uppercase tracking-wider"
                        >
                          Nộp ngay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
