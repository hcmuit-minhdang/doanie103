import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { feedbackApi } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  MessageSquarePlus, 
  Send, 
  Search, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  
  // States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Messages
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'citizen') {
      fetchFeedbacks();
    }
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const res = await feedbackApi.list();
      setFeedbackList(res.data.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await feedbackApi.create({ title, content });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTitle('');
        setContent('');
        fetchFeedbacks();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Lỗi khi gửi phản ánh!');
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbackList.filter(fb => 
    fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fb.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-8 min-h-[600px]">
      
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6 flex items-center space-x-3">
        <div className="p-2.5 bg-primary-800 text-white rounded-lg">
          <MessageSquarePlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-primary-800">
            Phản Ánh & Kiến Nghị
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Gửi các ý kiến đóng góp, thắc mắc về cấp phát quà tặng, trợ cấp xã hội và nhận phản hồi trực tiếp từ cơ quan chức năng
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
          <Send className="w-4 h-4 mr-2" />
          Gửi Ý Kiến Phản Ánh Mới
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium flex items-center justify-center ${
            activeTab === 'history'
              ? 'border-primary-800 text-primary-800 bg-cream-100/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4 mr-2" />
          Lịch Sử Giải Quyết ({feedbackList.length})
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

      {/* Content panes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'create' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
              <h3 className="font-serif text-lg font-bold">Soạn Phiếu Phản Ánh - Kiến Nghị</h3>
              
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tiêu đề phản ánh
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Vướng mắc về thời gian nhận chi trả quà Tết 2026..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-premium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nội dung kiến nghị chi tiết
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ghi nhận chi tiết phản ánh của bạn (địa điểm, thời gian, sự việc diễn ra...)"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-premium"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-primary-800 hover:bg-primary-700 text-white font-bold text-sm shadow transition-premium disabled:opacity-50 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Đang gửi...' : 'Gửi Phản Ánh'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Search filter */}
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-premium flex items-center space-x-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phiếu phản ánh bằng từ khóa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm border-none bg-transparent focus:outline-none"
                />
              </div>

              {/* Feedbacks list */}
              {filteredFeedbacks.length === 0 ? (
                <div className="p-12 text-center bg-white border border-slate-100 rounded-2xl">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Không tìm thấy ý kiến phản ánh nào khớp với bộ lọc.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedbacks.map((fb) => (
                    <div key={fb.feedback_ticket_id} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Mã phản ánh: #{fb.feedback_ticket_id}
                          </span>
                          <h4 className="font-serif text-base font-bold text-slate-800 mt-0.5">
                            {fb.title}
                          </h4>
                        </div>
                        <StatusBadge status={fb.status} />
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed font-sans font-light">
                        "{fb.content}"
                      </div>

                      {/* Display response reply if resolved */}
                      {fb.reply && (
                        <div className="p-4 bg-cream-100/30 border-l-4 border-primary-700 rounded-xl text-xs text-slate-700 leading-relaxed font-sans mt-3 space-y-2">
                          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-primary-800">
                            <UserCheck className="w-4 h-4" />
                            <span>Phản hồi từ Cán bộ {fb.resolver_name || 'Hệ thống'}</span>
                          </div>
                          <p className="italic">"{fb.reply}"</p>
                          <div className="flex items-center text-[9px] text-slate-400 font-light mt-1">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            <span>Đã phản hồi ngày: {new Date(fb.resolved_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                        Ngày tạo: {new Date(fb.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informative Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 border border-cream-300/50 shadow-premium space-y-4">
            <h3 className="font-serif text-base font-bold text-primary-800">Quy Trình Xử Lý Phản Ánh</h3>
            
            <ul className="space-y-4 text-xs text-slate-600 font-sans leading-relaxed">
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold shrink-0 mr-3 text-[10px]">1</span>
                <div>
                  <p className="font-semibold text-slate-800">Tiếp nhận thông tin</p>
                  <p className="text-slate-500 mt-0.5">Hệ thống ghi nhận và chuyển tới cán bộ phụ trách xã/phường ngay khi bạn gửi phiếu.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold shrink-0 mr-3 text-[10px]">2</span>
                <div>
                  <p className="font-semibold text-slate-800">Xác minh & Phản hồi</p>
                  <p className="text-slate-500 mt-0.5">Cán bộ chuyên môn kiểm tra thực tế, đối chiếu dữ liệu sổ sách an sinh và phản hồi nội dung.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold shrink-0 mr-3 text-[10px]">3</span>
                <div>
                  <p className="font-semibold text-slate-800">Đóng phiếu khảo sát</p>
                  <p className="text-slate-500 mt-0.5">Khi vấn đề của bạn đã được giải quyết triệt để, phiếu sẽ chuyển trạng thái đóng (Resolved).</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
