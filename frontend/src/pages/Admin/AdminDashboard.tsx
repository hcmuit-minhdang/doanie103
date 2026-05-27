import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi, dossierApi, feedbackApi, lookupApi, citizenApi } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Sidebar } from '../../components/common/Sidebar';
import { 
  FileText, 
  Users, 
  Gift, 
  MessageSquare, 
  HeartPulse, 
  Home, 
  FileSignature, 
  CreditCard, 
  Activity,
  CheckCircle,
  XCircle,
  ArrowLeftRight,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Search,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Common stats states
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab: dossiers states
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [reviewNote, setReviewNote] = useState('');
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [activeDossier, setActiveDossier] = useState<any | null>(null);

  // Tab: policy states
  const [policyCits, setPolicyCits] = useState<any[]>([]);
  const [policyObjs, setPolicyObjs] = useState<any[]>([]);
  const [targetCitizenId, setTargetCitizenId] = useState('');
  const [targetPolicyId, setTargetPolicyId] = useState('');
  const [policySearch, setPolicySearch] = useState('');

  // Tab: gifts states
  const [visits, setVisits] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [campaignReport, setCampaignReport] = useState<any>(null);

  // Tab: feedbacks states
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackReply, setFeedbackReply] = useState('');
  const [activeFeedback, setActiveFeedback] = useState<any | null>(null);

  // Tab: health states
  const [insurances, setInsurances] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState('');
  const [activeCitHealth, setActiveCitHealth] = useState('');

  // Tab: households states
  const [households, setHouseholds] = useState<any[]>([]);
  const [newMemberCitId, setNewMemberCitId] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [activeHouseholdId, setActiveHouseholdId] = useState<number | null>(null);

  // Tab: authorizations states
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [holderId, setHolderId] = useState('');
  const [proxyId, setProxyId] = useState('');
  const [authRelation, setAuthRelation] = useState('');
  const [authStart, setAuthStart] = useState('');
  const [authEnd, setAuthEnd] = useState('');

  // Tab: payments states
  const [payments, setPayments] = useState<any[]>([]);
  const [regionalAllowances, setRegionalAllowances] = useState<any[]>([]);

  // Tab: audit states
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Response notification banners
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [triggerMsg, setTriggerMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchTabData();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async () => {
    setSuccessMsg(null);
    setTriggerMsg(null);
    setErrorMsg(null);

    try {
      if (activeTab === 'dossiers') {
        const res = await dossierApi.list();
        setDossiers(res.data.data);
      } else if (activeTab === 'policy') {
        const res = await adminApi.listCitizens();
        setPolicyCits(res.data.data);
        const lRes = await lookupApi.getPolicyObjects();
        setPolicyObjs(lRes.data.data);
      } else if (activeTab === 'gifts') {
        const res = await adminApi.getVisits();
        setVisits(res.data.data);
        const cRes = await lookupApi.getCampaigns();
        setCampaigns(cRes.data.data);
      } else if (activeTab === 'feedbacks') {
        const res = await feedbackApi.list();
        setFeedbacks(res.data.data);
      } else if (activeTab === 'health') {
        const res = await adminApi.getHealthInsurance();
        setInsurances(res.data.data);
      } else if (activeTab === 'households') {
        const res = await adminApi.getHouseholds();
        setHouseholds(res.data.data);
      } else if (activeTab === 'authorizations') {
        const res = await adminApi.getAuthorizations();
        setAuthorizations(res.data.data);
      } else if (activeTab === 'payments') {
        const res = await adminApi.getPayments();
        setPayments(res.data.data);
        const rRes = await adminApi.getAllowancesByRegion();
        setRegionalAllowances(rRes.data.data);
      } else if (activeTab === 'audit') {
        const res = await adminApi.getAuditLogs();
        setAuditLogs(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu tab này. Vui lòng đăng nhập lại để làm mới phiên làm việc!');
    }
  };

  // 1. Dossier review actions
  const handleReviewDossier = async (dossierId: number, status: 'approved' | 'rejected') => {
    try {
      setSuccessMsg(null);
      setErrorMsg(null);
      setTriggerMsg(null);

      const res = await dossierApi.review(dossierId, {
        status,
        note: reviewNote
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message);
        if (res.data.triggerMessage) {
          setTriggerMsg(res.data.triggerMessage);
        }
        setReviewNote('');
        setActiveDossier(null);
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const handleTransferDossier = async (dossierId: number) => {
    try {
      const res = await dossierApi.transfer(dossierId, {
        fromAgency: Number(transferFrom),
        toAgency: Number(transferTo)
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTransferFrom('');
        setTransferTo('');
        setActiveDossier(null);
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  // 2. Policy Mapping creations
  const handleCreatePolicyMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createObjectMapping({
        citizenId: Number(targetCitizenId),
        objectId: Number(targetPolicyId),
        startDate: new Date().toISOString().split('T')[0],
        status: 'active'
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTargetCitizenId('');
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  // 3. Campaign summary report call
  const handleCampaignReport = async (campaignId: number) => {
    try {
      const res = await adminApi.getCampaignReport(campaignId);
      setCampaignReport(res.data.report);
      setSuccessMsg(res.data.message);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  // 4. Feedback resolve action
  const handleResolveFeedback = async (feedbackId: number) => {
    try {
      const res = await feedbackApi.resolve(feedbackId, feedbackReply);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setFeedbackReply('');
        setActiveFeedback(null);
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  // 5. Health Snapshot creation
  const handleHealthSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createMedicalSnapshot({
        citizenId: Number(activeCitHealth),
        healthStatus: healthStatus
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setHealthStatus('');
        setActiveCitHealth('');
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  // 6. Household member insertion
  const handleAddHouseholdMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeHouseholdId === null) return;
    try {
      const res = await adminApi.addHouseholdMember({
        householdId: activeHouseholdId,
        citizenId: Number(newMemberCitId),
        relation: newMemberRelation
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setNewMemberCitId('');
        setNewMemberRelation('');
        setActiveHouseholdId(null);
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  // 7. Authorization registry
  const handleCreateAuthorization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createAuthorization({
        policyHolderId: Number(holderId),
        proxyId: Number(proxyId),
        relation: authRelation,
        startDate: authStart,
        endDate: authEnd
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setHolderId('');
        setProxyId('');
        setAuthRelation('');
        setAuthStart('');
        setAuthEnd('');
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const handleRevokeAuthorization = async (id: number) => {
    try {
      const res = await adminApi.revokeAuthorization(id);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        fetchTabData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex bg-cream-100 min-h-screen font-sans">
      
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Dashboard Content area */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        
        {/* Banner messages */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start text-xs text-emerald-700 space-x-2.5 shadow-sm animate-in fade-in duration-300">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}
        {triggerMsg && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start text-xs text-blue-700 space-x-2.5 shadow-sm animate-in fade-in duration-300 font-sans">
            <Activity className="w-5 h-5 shrink-0 text-blue-600" />
            <div>
              <p className="font-bold">🔔 THÔNG BÁO TỰ ĐỘNG TỪ DATABASE (TRIGGER 3):</p>
              <p className="mt-0.5 italic">"{triggerMsg}"</p>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start text-xs text-rose-700 space-x-2.5 shadow-sm animate-in fade-in duration-300">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab content conditional rendering */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">HỆ THỐNG AN SINH SỐ - TỔNG QUAN</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Báo cáo trực quan các chỉ số an sinh xã hội toàn thành phố</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Đối tượng nhận trợ cấp</span>
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-800"><Users className="w-5 h-5" /></div>
                </div>
                <p className="font-serif text-3xl font-bold text-slate-800">{Number(stats.citizen.active_beneficiaries).toLocaleString('vi-VN')}</p>
                <p className="text-[10px] text-slate-400">Trên tổng số {stats.citizen.total_citizens} người có công</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ngân sách chi trả tháng</span>
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-800"><CreditCard className="w-5 h-5" /></div>
                </div>
                <p className="font-serif text-3xl font-bold text-slate-800">
                  {Number(stats.citizen.total_monthly_budget).toLocaleString('vi-VN')}đ
                </p>
                <p className="text-[10px] text-slate-400">Mức trợ cấp active trung bình</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hồ sơ chờ phê duyệt</span>
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-800"><FileText className="w-5 h-5" /></div>
                </div>
                <p className="font-serif text-3xl font-bold text-slate-800">{stats.dossier.pending_dossiers}</p>
                <p className="text-[10px] text-slate-400">Trên tổng {stats.dossier.total_dossiers} hồ sơ nộp</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ý kiến PA-KN chờ xử lý</span>
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-800"><MessageSquare className="w-5 h-5" /></div>
                </div>
                <p className="font-serif text-3xl font-bold text-slate-800">{stats.feedback.pending_feedbacks}</p>
                <p className="text-[10px] text-slate-400">Trên tổng số {stats.feedback.total_feedbacks} phản ánh</p>
              </div>

            </div>

            {/* National Welfare Operation Center Banner */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 border border-cream-300/50 shadow-premium flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Hệ thống liên thông cơ sở dữ liệu quốc gia - Đang hoạt động
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-800 mt-2">
                  Trung Tâm Điều Hành & Giám Sát An Sinh Số Thành Phố
                </h3>
                <p className="text-xs text-slate-500 font-sans max-w-2xl leading-relaxed font-light">
                  Cổng dịch vụ liên thông tự động đối soát thông tin của 27 bảng dữ liệu địa chính, nhân khẩu và tài chính. Nhật ký vận hành tự động đồng bộ hóa 100% lịch sử xét duyệt hồ sơ và giao dịch chi trả trợ cấp, đảm bảo tính bảo mật và minh bạch tuyệt đối theo chuẩn dịch vụ công cấp độ 4.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('audit')}
                className="px-6 py-3.5 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs transition-premium shrink-0 uppercase tracking-wider"
              >
                Nhật Ký Giám Sát Hệ Thống
              </button>
            </div>
          </div>
        )}

        {/* Tab: dossiers */}
        {activeTab === 'dossiers' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">THẨM ĐỊNH & PHÊ DUYỆT HỒ SƠ</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Tiếp nhận hồ sơ đăng ký chế độ ưu đãi trực tuyến, luân chuyển cơ quan hoặc duyệt hồ sơ kích hoạt chế độ.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Table list on Left */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Hồ sơ chờ xử lý</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Công Dân</th>
                        <th className="p-3.5">Loại HS</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dossiers.map(d => (
                        <tr key={d.dossier_id} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5 font-bold font-mono">#{d.dossier_id}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-700">{d.citizen_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{d.cccd_number}</p>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-500 uppercase tracking-wide">
                            {d.dossier_type === 'new_regime' ? 'Mới' : 
                             d.dossier_type === 'adjust_regime' ? 'Cập nhật' : 'Đình chỉ'}
                          </td>
                          <td className="p-3.5"><StatusBadge status={d.status} /></td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => { setActiveDossier(d); setReviewNote(d.note || ''); }}
                              className="px-2.5 py-1.5 rounded-lg bg-primary-800 text-white font-bold text-[10px] hover:bg-primary-700 transition-colors uppercase tracking-wider"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Review Panel on Right */}
              <div>
                {activeDossier ? (
                  <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6 animate-in fade-in duration-300">
                    <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-3">Chi Tiết Hồ Sơ #{activeDossier.dossier_id}</h3>
                    
                    <div className="text-xs space-y-3">
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[9px]">Công dân</span>
                        <p className="font-bold text-slate-800 mt-0.5">{activeDossier.citizen_name}</p>
                        <p className="font-mono text-slate-400 mt-0.5">CCCD: {activeDossier.cccd_number}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[9px]">Địa bàn</span>
                        <p className="text-slate-700 mt-0.5">{activeDossier.ward_name}, {activeDossier.district_name}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[9px]">Nội dung nộp</span>
                        <p className="text-slate-600 mt-0.5 italic">"{activeDossier.note}"</p>
                      </div>
                    </div>

                    {/* Review actions form */}
                    {activeDossier.status === 'submitted' && (
                      <div className="space-y-4 border-t border-slate-100 pt-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Ghi chú thẩm định
                          </label>
                          <textarea
                            rows={3}
                            value={reviewNote}
                            onChange={(e) => setReviewNote(e.target.value)}
                            placeholder="Nhập ý kiến phê duyệt hoặc từ chối..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 transition-premium"
                          ></textarea>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReviewDossier(activeDossier.dossier_id, 'rejected')}
                            className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-premium flex items-center justify-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Từ Chối
                          </button>
                          <button
                            onClick={() => handleReviewDossier(activeDossier.dossier_id, 'approved')}
                            className="flex-1 py-2.5 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition-premium flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Phê Duyệt
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Dossier Transfer Form */}
                    {activeDossier.status === 'submitted' && (
                      <div className="space-y-4 border-t border-slate-100 pt-4">
                        <div className="flex items-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                          <ArrowLeftRight className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Luân chuyển hồ sơ</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <input
                            type="number"
                            placeholder="Cơ quan nguồn..."
                            value={transferFrom}
                            onChange={(e) => setTransferFrom(e.target.value)}
                            className="px-2 py-2 border rounded-lg bg-slate-50 focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Cơ quan đích..."
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                            className="px-2 py-2 border rounded-lg bg-slate-50 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => handleTransferDossier(activeDossier.dossier_id)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                        >
                          Lưu Luân Chuyển
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-cream-100 border border-dashed border-cream-300 text-center py-12">
                    <FileText className="w-10 h-10 text-cream-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Chọn một hồ sơ bên danh sách để tiến hành thẩm định hoặc luân chuyển nghiệp vụ.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab: policy */}
        {activeTab === 'policy' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">QUẢN LÝ ĐỐI TƯỢNG CHÍNH SÁCH</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Thiết lập diện chính sách cho công dân, cập nhật thông tin cá nhân và quản lý chế độ thụ hưởng.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Mapping on Left */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-3">Cấp diện chính sách mới</h3>
                
                <form onSubmit={handleCreatePolicyMapping} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Citizen ID của Công Dân
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Nhập Citizen ID (Ví dụ: 24...)"
                      value={targetCitizenId}
                      onChange={(e) => setTargetCitizenId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Diện chính sách gán
                    </label>
                    <select
                      value={targetPolicyId}
                      onChange={(e) => setTargetPolicyId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none bg-slate-50"
                    >
                      <option value="">-- Chọn diện chính sách --</option>
                      {policyObjs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition-premium"
                  >
                    Ghi Nhận Ánh Xạ
                  </button>
                </form>
              </div>

              {/* Policy Citizens List on Right */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <h3 className="font-serif text-lg font-bold">Danh sách công dân</h3>
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Tìm kiếm công dân..."
                      value={policySearch}
                      onChange={(e) => setPolicySearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none bg-slate-50"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[480px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">Citizen ID</th>
                        <th className="p-3.5">CCCD</th>
                        <th className="p-3.5">Họ Tên</th>
                        <th className="p-3.5">Giới tính / Tuổi</th>
                        <th className="p-3.5">Phường / Xã</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {policyCits
                        .filter(c => c.full_name.toLowerCase().includes(policySearch.toLowerCase()))
                        .map(c => (
                          <tr key={c.citizen_id} className="hover:bg-cream-100/5 transition-colors">
                            <td className="p-3.5 font-bold font-mono">#{c.citizen_id}</td>
                            <td className="p-3.5 font-mono">{c.cccd_number}</td>
                            <td className="p-3.5 font-semibold text-slate-700">{c.full_name}</td>
                            <td className="p-3.5">{c.gender === 'M' ? 'Nam' : 'Nữ'}</td>
                            <td className="p-3.5">{c.ward_name}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: gifts */}
        {activeTab === 'gifts' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">QUÀ TẶNG TRI ÂN & CHIẾN DỊCH</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Tạo lập, theo dõi chiến dịch phát quà nhân dịp 27/7, Tết Nguyên Đán, kết xuất báo cáo thống kê qua stored procedure.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Campaign report control */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-3">Báo cáo chiến dịch</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Chọn chiến dịch tri ân
                  </label>
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none bg-slate-50"
                  >
                    <option value="">-- Chọn chiến dịch --</option>
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.year})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => selectedCampaign && handleCampaignReport(Number(selectedCampaign))}
                  className="w-full py-3 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition-premium"
                >
                  Kết Xuất Báo Cáo (SP)
                </button>

                {campaignReport && (
                  <div className="p-4 bg-cream-100/30 rounded-xl space-y-3 text-xs border border-cream-200">
                    <h4 className="font-serif font-bold text-primary-800 uppercase tracking-wider text-[10px]">Kết quả báo cáo chiến dịch</h4>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800">{campaignReport.campaign_name}</p>
                      <p className="text-slate-500">Năm chiến dịch: {campaignReport.campaign_year}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                        <span className="font-bold block text-base">{campaignReport.thanh_cong}</span>
                        Đã phát
                      </div>
                      <div className="p-2 bg-amber-50 text-amber-700 rounded border border-amber-100">
                        <span className="font-bold block text-base">{campaignReport.cho_phat}</span>
                        Đang chờ
                      </div>
                      <div className="p-2 bg-rose-50 text-rose-700 rounded border border-rose-100">
                        <span className="font-bold block text-base">{campaignReport.bo_lo}</span>
                        Bỏ lỡ
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 space-y-1">
                      <p>Mức phát đạt: <span className="font-bold text-slate-700">{campaignReport.ty_le_pct}%</span></p>
                      <p>Tổng tiền mặt: <span className="font-bold text-slate-700">{Number(campaignReport.tong_tien_mat).toLocaleString('vi-VN')} VND</span></p>
                      <p>Tổng gạo: <span className="font-bold text-slate-700">{Number(campaignReport.tong_gao_kg).toLocaleString('vi-VN')} kg</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* History list on Right */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Lịch sử phát quà tri ân</h3>
                
                <div className="overflow-x-auto max-h-[480px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">Chiến Dịch</th>
                        <th className="p-3.5">Công Dân</th>
                        <th className="p-3.5">Loại Quà</th>
                        <th className="p-3.5">Trị Giá</th>
                        <th className="p-3.5">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visits.map((v, idx) => (
                        <tr key={idx} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5">
                            <p className="font-semibold text-slate-700">{v.campaign_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{v.campaign_year}</p>
                          </td>
                          <td className="p-3.5 font-bold text-slate-700">{v.citizen_name}</td>
                          <td className="p-3.5">{v.gift_type}</td>
                          <td className="p-3.5 font-bold text-slate-800">{Number(v.gift_value).toLocaleString('vi-VN')}đ</td>
                          <td className="p-3.5"><StatusBadge status={v.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: feedbacks */}
        {activeTab === 'feedbacks' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">XỬ LÝ PHẢN ÁNH KIẾN NGHỊ</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Tiếp nhận và phản hồi ý kiến phản ánh từ công dân ưu đãi toàn thành phố thông qua thủ tục `sp_resolve_feedback`.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Feedback list */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Danh sách phiếu ý kiến</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Tiêu đề phản ánh</th>
                        <th className="p-3.5">Công Dân</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feedbacks.map(f => (
                        <tr key={f.feedback_ticket_id} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5 font-bold font-mono">#{f.feedback_ticket_id}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{f.title}</td>
                          <td className="p-3.5">{f.citizen_name}</td>
                          <td className="p-3.5"><StatusBadge status={f.status} /></td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => { setActiveFeedback(f); setFeedbackReply(f.reply || ''); }}
                              className="px-2.5 py-1.5 rounded-lg bg-primary-800 text-white font-bold text-[10px] hover:bg-primary-700 transition-colors"
                            >
                              Phản Hồi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reply panel */}
              <div>
                {activeFeedback ? (
                  <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6 animate-in fade-in duration-300">
                    <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-3">Phản hồi ý kiến #{activeFeedback.feedback_ticket_id}</h3>
                    
                    <div className="text-xs space-y-3">
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[9px]">Công dân gửi</span>
                        <p className="font-bold text-slate-800 mt-0.5">{activeFeedback.citizen_name}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[9px]">Tiêu đề</span>
                        <p className="font-semibold text-slate-700 mt-0.5">{activeFeedback.title}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[9px]">Nội dung</span>
                        <p className="text-slate-600 mt-0.5 italic bg-slate-50 p-2.5 rounded-lg">"{activeFeedback.content}"</p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Nội dung phản hồi chính thức
                        </label>
                        <textarea
                          rows={4}
                          value={feedbackReply}
                          onChange={(e) => setFeedbackReply(e.target.value)}
                          placeholder="Nhập nội dung trả lời..."
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 transition-premium"
                        ></textarea>
                      </div>

                      <button
                        onClick={() => handleResolveFeedback(activeFeedback.feedback_ticket_id)}
                        className="w-full py-3 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition-premium"
                      >
                        Gửi Phản Hồi Xử Lý
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-cream-100 border border-dashed border-cream-300 text-center py-12">
                    <MessageSquare className="w-10 h-10 text-cream-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Chọn một phiếu ý kiến bên trái để soạn phản hồi.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab: health */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">QUẢN LÝ Y TẾ & THẺ BHYT</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Xác thực tính hợp lệ của thẻ BHYT ưu đãi cho công dân và lưu bệnh án sức khỏe qua thủ tục.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Snapshot form */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-3">Ghi nhận bệnh án mới</h3>
                
                <form onSubmit={handleHealthSnapshot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Citizen ID của Công Dân
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Nhập Citizen ID (Ví dụ: 1...)"
                      value={activeCitHealth}
                      onChange={(e) => setActiveCitHealth(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Trạng thái sức khỏe / Bệnh án
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Nhập ghi chép sức khỏe định kỳ..."
                      value={healthStatus}
                      onChange={(e) => setHealthStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition-premium"
                  >
                    Lưu Bệnh Án
                  </button>
                </form>
              </div>

              {/* Insurance Table */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Danh sách Bảo Hiểm Y Tế</h3>
                
                <div className="overflow-x-auto max-h-[480px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">Công Dân</th>
                        <th className="p-3.5">CCCD</th>
                        <th className="p-3.5">Mã BHYT</th>
                        <th className="p-3.5">Mức hưởng (%)</th>
                        <th className="p-3.5">Mã BV Đăng Ký</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {insurances.map((ins, idx) => (
                        <tr key={idx} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5 font-bold text-slate-700">{ins.citizen_name}</td>
                          <td className="p-3.5 font-mono">{ins.cccd_number}</td>
                          <td className="p-3.5 font-mono text-primary-800 font-bold">{ins.insurance_code}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold border border-emerald-100">
                              {ins.benefit_level}%
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-500">{ins.hospital_code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: households */}
        {activeTab === 'households' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">QUẢN LÝ HỘ GIA ĐÌNH</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Tra cứu trạng thái hộ nghèo, cận nghèo toàn thành phố và thực hiện thủ tục thêm nhân khẩu vào hộ khẩu qua Stored Procedure.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Member adding Form */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-3">Thêm thành viên vào hộ</h3>
                
                <form onSubmit={handleAddHouseholdMember} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Mã Hộ Gia Đình (ID)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Nhập Household ID (Ví dụ: 8...)"
                      value={activeHouseholdId === null ? '' : activeHouseholdId}
                      onChange={(e) => setActiveHouseholdId(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Citizen ID Thành Viên Mới
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Nhập Citizen ID (Ví dụ: 24...)"
                      value={newMemberCitId}
                      onChange={(e) => setNewMemberCitId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Quan hệ với chủ hộ
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Con ruột, Cháu ruột..."
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition-premium"
                  >
                    Ghi Nhận Nhân Khẩu (SP)
                  </button>
                </form>
              </div>

              {/* Households Table */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Danh sách trạng thái hộ gia đình</h3>
                
                <div className="overflow-x-auto max-h-[480px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">Mã Hộ Sổ</th>
                        <th className="p-3.5">Chủ Hộ</th>
                        <th className="p-3.5">Điều Kiện Sống</th>
                        <th className="p-3.5">Diện CS Hộ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {households.map((h, idx) => (
                        <tr key={idx} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5 font-bold font-mono text-primary-800">{h.household_code}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{h.head_of_household}</td>
                          <td className="p-3.5 text-slate-500">{h.condition_type}</td>
                          <td className="p-3.5"><StatusBadge status={h.policy_type} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: authorizations */}
        {activeTab === 'authorizations' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">GIẤY ỦY QUYỀN NHẬN TRỢ CẤP THAY</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Quản lý các trường hợp người có công đau yếu, ủy quyền nhận tiền thay thế, được bảo vệ qua các triggers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Registry */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-3">Đăng ký ủy quyền mới</h3>
                
                <form onSubmit={handleCreateAuthorization} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        ID Chủ CS
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Holder ID..."
                        value={holderId}
                        onChange={(e) => setHolderId(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border rounded-lg bg-slate-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        ID Người nhận thay
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Proxy ID..."
                        value={proxyId}
                        onChange={(e) => setProxyId(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border rounded-lg bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Quan hệ ủy quyền
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Vợ ruột, Con trai trưởng..."
                      value={authRelation}
                      onChange={(e) => setAuthRelation(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border rounded-lg bg-slate-50 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Ngày bắt đầu
                      </label>
                      <input
                        type="date"
                        required
                        value={authStart}
                        onChange={(e) => setAuthStart(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border rounded-lg bg-slate-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Ngày hết hạn
                      </label>
                      <input
                        type="date"
                        required
                        value={authEnd}
                        onChange={(e) => setAuthEnd(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border rounded-lg bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition-premium"
                  >
                    Ghi Nhận Ủy Quyền
                  </button>
                </form>
              </div>

              {/* Authorizations Table */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Danh sách giấy ủy quyền</h3>
                
                <div className="overflow-x-auto max-h-[480px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">Chủ chính sách</th>
                        <th className="p-3.5">Người nhận thay</th>
                        <th className="p-3.5">Quan Hệ</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {authorizations.map(a => (
                        <tr key={a.authorization_id} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5 font-bold text-slate-700">{a.policy_holder_name}</td>
                          <td className="p-3.5 font-semibold text-slate-600">{a.proxy_name}</td>
                          <td className="p-3.5">{a.relation}</td>
                          <td className="p-3.5"><StatusBadge status={a.status} /></td>
                          <td className="p-3.5 text-right">
                            {a.status === 'active' && (
                              <button
                                onClick={() => handleRevokeAuthorization(a.authorization_id)}
                                className="px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 transition-colors font-bold text-[9px] uppercase tracking-wider"
                              >
                                Thu hồi
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: payments */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">CHI TRẢ TRỢ CẤP XÃ HỘI</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Tổng hợp báo cáo quyết toán chi trả tiền trợ cấp hàng tháng cho đối tượng chính sách theo từng đơn vị Phường/Xã.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Regional summary report */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Tổng hợp trợ cấp theo khu vực</h3>
                
                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">Khu vực xã/phường</th>
                        <th className="p-3.5 text-center">Số người nhận</th>
                        <th className="p-3.5 text-right">Tổng chi trả tháng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {regionalAllowances.map((r, idx) => (
                        <tr key={idx} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5 font-bold text-slate-700">{r.ward_name}</td>
                          <td className="p-3.5 text-center font-semibold text-slate-600">{r.total_beneficiaries}</td>
                          <td className="p-3.5 text-right font-bold text-primary-800">
                            {Number(r.total_monthly_amount).toLocaleString('vi-VN')} VND
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly payment report */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
                <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Lịch sử chi trả theo tháng</h3>
                
                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="p-3.5">Khu vực</th>
                        <th className="p-3.5">Tháng / Năm</th>
                        <th className="p-3.5 text-right">Tổng chi trả</th>
                        <th className="p-3.5 text-right">Giao dịch thành công</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((p, idx) => (
                        <tr key={idx} className="hover:bg-cream-100/5 transition-colors">
                          <td className="p-3.5 font-semibold text-slate-700">{p.ward_name}</td>
                          <td className="p-3.5 font-mono">{p.payment_month}/{p.payment_year}</td>
                          <td className="p-3.5 text-right font-bold text-primary-800">
                            {Number(p.total_paid).toLocaleString('vi-VN')} VND
                          </td>
                          <td className="p-3.5 text-right font-semibold text-emerald-700">
                            {p.success_count} / {p.total_transactions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: audit */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="border-b border-cream-300 pb-5">
              <h2 className="font-serif text-3xl font-bold">NHẬT KÝ HỆ THỐNG & GIÁM SÁT (AUDIT)</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Lịch sử thao tác an toàn của cán bộ được ghi tự động qua các trigger (Trừ, Cộng, Đổi địa chỉ, Duyệt hồ sơ...).</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden">
              <h3 className="font-serif text-lg font-bold border-b border-slate-100 pb-4 mb-4">Nhật ký kiểm toán an toàn</h3>
              
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                      <th className="p-3.5">Thời gian</th>
                      <th className="p-3.5">Cán Bộ</th>
                      <th className="p-3.5">Hành Động</th>
                      <th className="p-3.5">Bảng Thao Tác</th>
                      <th className="p-3.5">Mã Dòng</th>
                      <th className="p-3.5">Địa Chỉ IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.audit_log_id} className="hover:bg-cream-100/5 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500">
                          {new Date(log.created_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-700">{log.official_name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{log.official_role}</p>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                            log.action === 'INSERT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {log.action_label}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">{log.table_name}</td>
                        <td className="p-3.5 font-bold font-mono">#{log.record_id}</td>
                        <td className="p-3.5 font-mono text-slate-500">{log.ip_address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
