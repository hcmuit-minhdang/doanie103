import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, LogOut, User as UserIcon, LogIn, Bell, Menu, X, Landmark } from 'lucide-react';

interface HeaderProps {
  onOpenLogin: (role: 'citizen' | 'official') => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    onNavigate('home');
  };

  const navItems = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'dossier', label: 'Nộp Hồ Sơ', requireAuth: 'citizen' },
    { id: 'feedback', label: 'Phản Ánh Kiến Nghị', requireAuth: 'citizen' },
    { id: 'lookup', label: 'Tra Cứu' },
    { id: 'admin', label: 'Dashboard Cán Bộ', requireAuth: 'official' },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (!item.requireAuth) return true;
    if (item.requireAuth === 'citizen') {
      return user?.role === 'citizen' || !user;
    }
    if (item.requireAuth === 'official') {
      return user && user.role !== 'citizen';
    }
    return false;
  });

  return (
    <header className="sticky top-0 z-40 bg-primary-800 text-white shadow-premium border-b border-primary-900 transition-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur border border-white/20 transition-all hover:bg-white/20">
              <Landmark className="w-8 h-8 text-cream-200" />
            </div>
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-wide text-cream-100 uppercase">
                An Sinh Xã Hội
              </div>
              <div className="text-[10px] sm:text-xs text-cream-300 font-sans tracking-widest uppercase">
                Cổng Dịch Vụ Công Trực Tuyến
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {visibleNavItems.map((item) => {
              // Highlight active page
              const isActive = currentPage === item.id || (item.id === 'admin' && currentPage.startsWith('admin'));
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.requireAuth === 'citizen' && !user) {
                      onOpenLogin('citizen');
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium tracking-wide transition-premium ${
                    isActive
                      ? 'bg-white/15 text-cream-100 font-semibold border-b-2 border-cream-400'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Menu / Login Action */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-premium border border-transparent hover:border-white/10 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-cream-200 text-primary-800 flex items-center justify-center font-bold shadow">
                    {user.name ? user.name[0] : (user.username ? user.username[0].toUpperCase() : 'U')}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs text-cream-300 font-medium font-sans uppercase tracking-wider">
                      {user.role === 'citizen' ? 'Công dân' : user.originalRole || 'Cán bộ'}
                    </div>
                    <div className="text-sm font-semibold max-w-[120px] truncate text-cream-100">
                      {user.name || user.username}
                    </div>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-premium border border-slate-100 py-1.5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Đăng nhập bởi</p>
                      <p className="text-sm font-semibold truncate text-primary-900">{user.name || user.username}</p>
                      {user.cccd && <p className="text-xs font-mono text-slate-500 mt-0.5">{user.cccd}</p>}
                    </div>

                    {user.role !== 'citizen' && (
                      <button
                        onClick={() => { setDropdownOpen(false); onNavigate('admin'); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-cream-100 hover:text-primary-800 transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-3 text-slate-400" />
                        Dashboard Cán bộ
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => onOpenLogin('citizen')}
                  className="flex items-center px-4 py-2 rounded-lg bg-cream-200 text-primary-800 font-semibold text-sm transition-premium hover:bg-cream-300 shadow hover:shadow-md"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Công Dân Đăng Nhập
                </button>
                <button
                  onClick={() => onOpenLogin('official')}
                  className="flex items-center px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium text-sm transition-premium hover:bg-white/25"
                >
                  Cán Bộ
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-900 border-t border-primary-950 px-4 py-3 space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.requireAuth === 'citizen' && !user) {
                    onOpenLogin('citizen');
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive ? 'bg-primary-950 text-cream-100 font-semibold' : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-white/10 mt-3 pb-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1.5 bg-white/5 rounded-lg">
                  <p className="text-xs text-cream-300 uppercase tracking-wider">{user.role === 'citizen' ? 'Công dân' : user.originalRole}</p>
                  <p className="text-sm font-semibold truncate text-white">{user.name || user.username}</p>
                </div>
                {user.role !== 'citizen' && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onNavigate('admin'); }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/5"
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Dashboard Cán bộ
                  </button>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-rose-300 hover:bg-rose-950/30"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin('citizen'); }}
                  className="flex items-center justify-center py-2.5 rounded-lg bg-cream-200 text-primary-800 font-bold text-sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Công dân
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin('official'); }}
                  className="flex items-center justify-center py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-sm"
                >
                  Cán bộ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
