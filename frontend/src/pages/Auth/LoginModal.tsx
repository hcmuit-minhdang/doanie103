import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Key, User, ShieldAlert, LogIn, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole: 'citizen' | 'official';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, defaultRole }) => {
  const { loginCitizen, loginOfficial } = useAuth();
  const [role, setRole] = useState<'citizen' | 'official'>(defaultRole);
  const [usernameOrCccd, setUsernameOrCccd] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync role state when modal defaultRole changes
  React.useEffect(() => {
    setRole(defaultRole);
    setError(null);
    setUsernameOrCccd('');
    setPassword('');
  }, [defaultRole, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (role === 'citizen') {
        await loginCitizen(usernameOrCccd, password);
      } else {
        await loginOfficial(usernameOrCccd, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userVal: string, passVal: string, isCitizen: boolean) => {
    setError(null);
    setLoading(true);
    try {
      if (isCitizen) {
        await loginCitizen(userVal, passVal);
      } else {
        await loginOfficial(userVal, passVal);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const citizenDemos = [
    { cccd: '079090123456', name: 'Lê Thanh Hùng (Thương binh)', pass: '123456' },
    { cccd: '010806543210', name: 'Trần Thị Lan (Thân nhân LS)', pass: '123456' },
    { cccd: '079095000012', name: 'Nguyễn Hoàng Long (Bệnh binh)', pass: '123456' }
  ];

  const officialDemos = [
    { username: 'canbophuong', role: 'Cán bộ Xã/Phường', pass: '123456' },
    { username: 'canbophong', role: 'Chuyên viên Quận/Phòng', pass: '123456' },
    { username: 'lanhdaoso', role: 'Lãnh đạo cấp Sở', pass: '123456' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-primary-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <LogIn className="w-5 h-5 text-cream-200" />
            <h3 className="font-serif text-lg font-bold tracking-wide">
              {role === 'citizen' ? 'ĐĂNG NHẬP CỔNG CÔNG DÂN' : 'HỆ THỐNG CÁN BỘ NGHIỆP VỤ'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => { setRole('citizen'); setError(null); }}
            className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium ${
              role === 'citizen'
                ? 'border-primary-800 text-primary-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Dành Cho Công Dân
          </button>
          <button
            onClick={() => { setRole('official'); setError(null); }}
            className={`flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-premium ${
              role === 'official'
                ? 'border-primary-800 text-primary-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Dành Cho Cán Bộ
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start text-xs text-rose-700 space-x-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {role === 'citizen' ? 'Số CCCD định danh (12 số)' : 'Tên đăng nhập cán bộ'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameOrCccd}
                  onChange={(e) => setUsernameOrCccd(e.target.value)}
                  placeholder={role === 'citizen' ? 'Ví dụ: 079090123456' : 'Ví dụ: canbophuong'}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Mật khẩu hệ thống
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-premium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-premium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold tracking-wider uppercase px-1">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Tài khoản Demo (Click để đăng nhập nhanh):</span>
            </div>
            
            {role === 'citizen' ? (
              <div className="grid grid-cols-1 gap-2">
                {citizenDemos.map((demo, i) => (
                  <button
                    key={i}
                    disabled={loading}
                    onClick={() => handleQuickLogin(demo.cccd, demo.pass, true)}
                    className="p-3 text-left rounded-xl border border-slate-100 hover:border-primary-200 bg-slate-50 hover:bg-cream-100 text-xs transition-premium group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 group-hover:text-primary-800">{demo.name}</span>
                      <span className="font-mono text-slate-400 group-hover:text-slate-600 bg-white px-2 py-0.5 rounded border">
                        {demo.cccd}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {officialDemos.map((demo, i) => (
                  <button
                    key={i}
                    disabled={loading}
                    onClick={() => handleQuickLogin(demo.username, demo.pass, false)}
                    className="p-3 text-left rounded-xl border border-slate-100 hover:border-primary-200 bg-slate-50 hover:bg-cream-100 text-xs transition-premium group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 group-hover:text-primary-800">{demo.role}</span>
                      <span className="font-mono text-slate-400 group-hover:text-slate-600 bg-white px-2 py-0.5 rounded border">
                        {demo.username}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
