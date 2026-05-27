import React, { useState } from 'react';
import { dossierApi, citizenApi } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Search, 
  FileText, 
  Users, 
  AlertCircle, 
  MapPin, 
  CreditCard,
  HeartPulse,
  Briefcase
} from 'lucide-react';

export const LookupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'policy'>('dossier');
  
  // Search parameters
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setResult(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'dossier') {
        // Search dossier by ID
        const res = await dossierApi.get(Number(searchValue));
        if (res.data.success) {
          setResult(res.data.data);
        }
      } else {
        // Search policy by CCCD or citizen ID. First query full profile
        const [rows] = await citizenApi.getProfile(Number(searchValue)).then(r => [r.data.data]).catch(() => [null]);
        
        if (rows) {
          setResult(rows);
        } else {
          setErrorMsg('Không tìm thấy thông tin công dân ưu đãi với ID tương ứng! Vui lòng thử lại với các ID từ 1 đến 24.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Không tìm thấy thông tin phù hợp trên hệ thống! Đảm bảo thông tin tra cứu chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-8 min-h-[600px]">
      
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6 flex items-center space-x-3">
        <div className="p-2.5 bg-primary-800 text-white rounded-lg">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-primary-800">
            Tra Cứu Thông Tin An Sinh
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Xác minh tiến độ xét duyệt hồ sơ trực tuyến hoặc tra cứu diện chính sách và mức trợ cấp xã hội đang hưởng
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-premium/5 overflow-hidden">
        <button
          onClick={() => { setActiveTab('dossier'); setResult(null); setErrorMsg(null); setSearchValue(''); }}
          className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium flex items-center justify-center ${
            activeTab === 'dossier'
              ? 'border-primary-800 text-primary-800 bg-cream-100/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Tra Cứu Tiến Độ Hồ Sơ (Theo ID)
        </button>
        <button
          onClick={() => { setActiveTab('policy'); setResult(null); setErrorMsg(null); setSearchValue(''); }}
          className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium flex items-center justify-center ${
            activeTab === 'policy'
              ? 'border-primary-800 text-primary-800 bg-cream-100/30'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Tra Cứu Đối Tượng Ưu Đãi (Theo Citizen ID)
        </button>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium flex gap-3">
        <input
          type="text"
          required
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={activeTab === 'dossier' 
            ? 'Nhập mã số hồ sơ của bạn (Ví dụ: 13, 9...)' 
            : 'Nhập Citizen ID của công dân cần kiểm tra (Ví dụ: 1, 2, 18...)'}
          className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-premium"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary-800 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow transition-premium disabled:opacity-50 shrink-0"
        >
          {loading ? 'Đang tra cứu...' : 'Tìm Kiếm'}
        </button>
      </form>

      {/* Error display */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start text-sm text-rose-700 space-x-2.5 shadow-sm animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Display Section */}
      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          
          {activeTab === 'dossier' ? (
            /* Dossier Result Card */
            <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-premium space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hồ sơ công an sinh xã hội</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mt-1">Mã hồ sơ: #{result.dossier_id}</h3>
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên công dân đề nghị</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{result.citizen_name}</p>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">CCCD: {result.cccd_number}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa bàn cư trú</p>
                    <p className="text-slate-700 mt-0.5 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                      {result.ward_name}, {result.district_name}, {result.province_name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại hồ sơ đăng ký</p>
                    <p className="font-semibold text-primary-800 mt-0.5 uppercase tracking-wide text-xs">
                      {result.dossier_type === 'new_regime' ? 'Đăng ký mới' : 
                       result.dossier_type === 'adjust_regime' ? 'Điều chỉnh mức' : 'Đình chỉ trợ cấp'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày nộp hệ thống</p>
                    <p className="text-slate-700 mt-0.5">
                      {result.submitted_at ? new Date(result.submitted_at).toLocaleDateString('vi-VN') : 'Đang soạn thảo'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nội dung / Lý do đề nghị</p>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">"{result.note}"</p>
              </div>

              {result.reviewed_by && (
                <div className="p-4 bg-cream-100/30 border-l-4 border-primary-700 rounded-xl flex items-start space-x-3">
                  <Briefcase className="w-5 h-5 text-primary-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-primary-800">Kết quả thẩm định của Cơ quan LĐTBXH</p>
                    <p className="text-xs text-slate-600 mt-1 font-light">Được xem duyệt bởi Cán bộ: <span className="font-bold text-slate-700">{result.reviewer_name}</span> ({result.reviewer_role})</p>
                    <p className="text-xs text-slate-400 mt-0.5">Vào lúc: {new Date(result.reviewed_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Policy Result Card */
            <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-premium space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thông tin đối tượng ưu đãi</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mt-1">{result.full_name}</h3>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">Citizen ID: #{result.citizen_id} • CCCD: {result.cccd_number}</p>
                </div>
                <StatusBadge status={result.policy_status || 'active'} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                
                <div className="space-y-4">
                  {/* Base Profile Info */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa chỉ cư trú</p>
                      <p className="text-slate-700 mt-0.5">{result.address_detail}, {result.ward_name}, {result.district_name}, {result.province_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Briefcase className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diện chính sách bảo trợ</p>
                      <p className="font-semibold text-primary-800 mt-0.5">{result.policy_type || 'Người dân thường'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Allowance Regime Details */}
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mức trợ cấp hàng tháng</p>
                      <p className="font-bold text-lg text-slate-800 mt-0.5">
                        {result.monthly_allowance ? `${Number(result.monthly_allowance).toLocaleString('vi-VN')} VND` : '0 VND'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Chế độ: {result.regime_name || 'Không có trợ cấp'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <HeartPulse className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thẻ Bảo Hiểm Y Tế Ưu Đãi</p>
                      <p className="text-slate-700 mt-0.5">
                        {result.insurance_code ? `Mã số: ${result.insurance_code}` : 'Chưa cấp thẻ'}
                      </p>
                      {result.benefit_level && (
                        <p className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded w-max mt-0.5">
                          Hạn mức hưởng: {result.benefit_level}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {result.default_bank_account && (
                <div className="p-4 bg-slate-50 rounded-xl text-xs flex justify-between items-center font-sans">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[9px] block">Tài khoản nhận tiền mặc định</span>
                    <span className="font-semibold text-slate-700 mt-0.5">{result.default_bank}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 text-sm">{result.default_bank_account}</span>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
