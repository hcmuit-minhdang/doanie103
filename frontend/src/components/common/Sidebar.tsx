import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  Gift, 
  MessageSquare, 
  HeartPulse, 
  Home, 
  FileSignature, 
  CreditCard, 
  Activity 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'dossiers', label: 'Xét Duyệt Hồ Sơ', icon: FileCheck },
    { id: 'policy', label: 'Đối Tượng Chính Sách', icon: Users },
    { id: 'gifts', label: 'Quà Tặng Tri Ân', icon: Gift },
    { id: 'feedbacks', label: 'Xử Lý Phản Ánh', icon: MessageSquare },
    { id: 'health', label: 'Quản Lý Y Tế (BHYT)', icon: HeartPulse },
    { id: 'households', label: 'Hộ Gia Đình', icon: Home },
    { id: 'authorizations', label: 'Giấy Ủy Quyền', icon: FileSignature },
    { id: 'payments', label: 'Chi Trả Trợ Cấp', icon: CreditCard },
    { id: 'audit', label: 'Giám Sát Hệ Thống', icon: Activity, requireAdmin: true },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (item.requireAdmin) {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <aside className="w-64 bg-cream-200 border-r border-cream-300 min-h-screen pt-8 font-sans flex flex-col justify-between">
      <div>
        
        {/* Header Title inside Sidebar */}
        <div className="px-6 pb-6 border-b border-cream-300">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-primary-800">
            Quản Trị An Sinh
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 tracking-widest font-sans uppercase">
            Hệ thống nghiệp vụ
          </p>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-4 space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-premium tracking-wide ${
                  isActive
                    ? 'bg-primary-800 text-cream-100 shadow-md shadow-primary-900/10'
                    : 'text-slate-600 hover:bg-cream-300 hover:text-primary-800'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 shrink-0 ${
                  isActive ? 'text-cream-200' : 'text-slate-400 group-hover:text-primary-800'
                }`} />
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Footer Details */}
      <div className="p-4 border-t border-cream-300 bg-cream-300/20 text-center text-[10px] text-slate-400 font-sans tracking-wide">
        <p className="font-medium text-slate-500">Phiên bản 1.0.0 (Build 2026)</p>
        <p className="mt-0.5">Sở LĐTBXH TP. Hồ Chí Minh</p>
      </div>

    </aside>
  );
};
