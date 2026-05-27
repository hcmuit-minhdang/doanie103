import React from 'react';
import {
  FileText,
  MessageSquareCode,
  Search,
  ShieldAlert,
  ChevronRight,
  Clock,
  CalendarDays,
  Heart,
  HelpCircle,
  TrendingUp,
  FolderDot
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HomeProps {
  onOpenLogin: (role: 'citizen' | 'official') => void;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenLogin, onNavigate }) => {
  const { user } = useAuth();

  const policies = [
    { name: 'Thương binh', desc: 'Hỗ trợ trợ cấp hàng tháng, trang cấp dụng cụ chỉnh hình, ưu đãi y tế (BHYT 100%), nhà ở xã hội.' },
    { name: 'Thân nhân Liệt sĩ', desc: 'Trợ cấp thờ cúng, quà tặng các dịp lễ tết, hỗ trợ chi phí học tập cho con liệt sĩ.' },
    { name: 'Bệnh binh', desc: 'Chi trả trợ cấp dựa trên tỷ lệ suy giảm khả năng lao động, chăm sóc sức khỏe định kỳ.' },
    { name: 'Nhiễm chất độc hoá học', desc: 'Trợ cấp hàng tháng cho người tham gia kháng chiến và con đẻ bị dị dạng, dị tật.' },
    { name: 'Anh hùng LLVT', desc: 'Chế độ ưu đãi đặc biệt về sinh hoạt phí, chăm sóc điều dưỡng đặc biệt.' },
    { name: 'Hộ nghèo cần bảo trợ', desc: 'Hỗ trợ thẻ BHYT, miễn giảm học phí, cấp sinh kế hỗ trợ sản xuất và nhà tình thương.' }
  ];

  const quickLinks = [
    {
      id: 'dossier',
      title: 'Đăng Ký Hồ Sơ',
      desc: 'Nộp yêu cầu trực tuyến hưởng trợ cấp, thẻ BHYT ưu đãi mới.',
      icon: FileText,
      color: 'bg-primary-50 text-primary-800 hover:bg-primary-800 hover:text-white',
      badge: 'Trực tuyến 100%'
    },
    {
      id: 'feedback',
      title: 'Phản Ánh Kiến Nghị',
      desc: 'Gửi các vướng mắc, phản ánh về việc chi trả trợ cấp, quà tri ân.',
      icon: MessageSquareCode,
      color: 'bg-amber-50 text-amber-800 hover:bg-amber-800 hover:text-white',
      badge: 'Phản hồi trong 24h'
    },
    {
      id: 'lookup',
      title: 'Tra Cứu Tiến Độ',
      desc: 'Tra cứu trạng thái hồ sơ, mức trợ cấp đang hưởng bằng mã định danh.',
      icon: Search,
      color: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-800 hover:text-white',
      badge: 'Nhanh chóng - Tiện lợi'
    }
  ];

  const faqs = [
    { q: 'Ai có quyền nộp hồ sơ ưu đãi trực tuyến?', a: 'Tất cả công dân thuộc diện chính sách có công (Thương binh, Bệnh binh, Thân nhân liệt sĩ...) hoặc đối tượng bảo trợ xã hội đã đăng ký CCCD định danh trên hệ thống đều có thể nộp.' },
    { q: 'Thời gian xét duyệt hồ sơ mất bao lâu?', a: 'Thông thường, hồ sơ nộp trực tuyến sẽ được cán bộ phường thẩm định trong vòng 3 - 5 ngày làm việc. Nếu hợp lệ, hồ sơ sẽ được chuyển lên Phòng LĐTBXH quận phê duyệt và chi trả.' },
    { q: 'Tra cứu lịch sử nhận quà tết, quà tri ân ở đâu?', a: 'Công dân sau khi đăng nhập có thể vào mục "Tra cứu" để xem đầy đủ lịch sử quà tặng bằng tiền mặt/hiện vật trong năm.' }
  ];

  return (
    <div className="font-sans min-h-screen">

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-amber-950 text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 shadow-premium">

        {/* Dynamic Light Background Ornaments */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cream-100 via-primary-500 to-primary-950 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs sm:text-sm font-semibold tracking-wide text-cream-200 uppercase">
            <Heart className="w-4 h-4 text-rose-400 mr-1 animate-pulse" />
            Tri Ân Người Có Công - Chăm Lo Đời Sống Nhân Dân
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream-100 leading-tight">
            Cổng Dịch Vụ Công <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream-200 to-amber-300">
              An Sinh Xã Hội
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-cream-200/80 font-light leading-relaxed">
            Hệ thống quản lý, tiếp nhận hồ sơ ưu đãi, thực hiện chi trả trợ cấp hàng tháng và quà tặng tri ân tự động, minh bạch và nhanh chóng cho đối tượng chính sách.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onOpenLogin('citizen')}
                className="w-full sm:w-auto px-8 py-4 bg-cream-200 text-primary-900 font-bold rounded-xl transition-premium hover:bg-cream-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Đăng Nhập Công Dân
              </button>
              <button
                onClick={() => onOpenLogin('official')}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl transition-premium hover:bg-white/20"
              >
                Cán Bộ Nghiệp Vụ
              </button>
            </div>
          ) : (
            <div className="pt-4">
              <p className="text-sm text-cream-300 font-medium">
                Xin chào, <span className="font-bold text-white text-base">{user.name || user.username}</span>! Bạn đang đăng nhập hệ thống.
              </p>
              <button
                onClick={() => onNavigate(user.role === 'citizen' ? 'dossier' : 'admin')}
                className="mt-4 px-8 py-4 bg-cream-200 text-primary-900 font-bold rounded-xl transition-premium hover:bg-cream-300 shadow"
              >
                Đi Tới Trang Quản Lý
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Utilities Link (Tiện ích) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div
                key={link.id}
                onClick={() => {
                  if (link.id === 'dossier' && !user) {
                    onOpenLogin('citizen');
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className={`p-8 rounded-2xl bg-white border border-slate-100 shadow-premium hover:shadow-premium-hover cursor-pointer transition-premium flex flex-col justify-between group h-64`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-primary-50 rounded-xl group-hover:bg-primary-800 transition-colors shrink-0">
                      <Icon className="w-6 h-6 text-primary-800 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded">
                      {link.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-slate-800 group-hover:text-primary-800 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    {link.desc}
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-primary-800 group-hover:translate-x-1.5 transition-transform mt-4">
                  Thực hiện ngay
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brand stats and values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary-800 bg-primary-50 px-3 py-1 rounded">
              Hệ thống tối tân
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              An Sinh Số - Hành Trình Trọn Vẹn Tri Ân Người Có Công
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Chúng tôi cam kết số hóa 100% hồ sơ chính sách, tích hợp cùng dữ liệu dân cư để tự động cấp phát tiền trợ cấp, quà tết tri ân chuẩn xác. Đơn giản hóa mọi thủ tục giấy tờ, để tình cảm tri ân của Đảng và Nhà nước đến tận tay người có công nhanh nhất.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 rounded-xl bg-cream-200/30 border border-cream-300/30">
                <p className="font-serif text-3xl font-bold text-primary-800">100%</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Dữ liệu chuẩn hóa</p>
              </div>
              <div className="p-4 rounded-xl bg-cream-200/30 border border-cream-300/30">
                <p className="font-serif text-3xl font-bold text-primary-800">&lt; 24h</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Phản hồi thắc mắc</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 border border-cream-300/50 shadow-premium space-y-6 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 opacity-5">
              <FolderDot className="w-96 h-96" />
            </div>

            <h3 className="font-serif text-xl font-bold">Chiến Dịch Chăm Lo & Tri Ân Đang Diễn Ra</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-start space-x-4 shadow-sm">
                <CalendarDays className="w-8 h-8 text-primary-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold">Chiến dịch Tri ân 27/7/2026</h4>
                  <p className="text-xs text-slate-500 mt-1">Thăm viếng, phát quà tết và chi trợ cấp đặc biệt cho Thương binh, Thân nhân Liệt sĩ toàn thành phố.</p>
                  <div className="mt-2 flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-max">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Đang triển khai
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Carousel list (Diện chính sách) */}
      <section className="bg-cream-200/50 border-y border-cream-300/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary-800 bg-primary-50 px-3 py-1 rounded">
              Diện Ưu Đãi
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Các Diện Đối Tượng Chính Sách Được Thụ Hưởng
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-slate-500 font-sans">
              Chi tiết các chế độ trợ cấp ưu đãi đặc biệt theo quy định của Pháp luật đối với từng nhóm đối tượng người có công.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-3 hover:shadow-premium-hover transition-premium">
                <h3 className="font-serif text-lg font-bold text-primary-800 flex items-center">
                  <span className="w-2 h-2 bg-primary-800 rounded-full mr-2.5 shrink-0"></span>
                  {policy.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans font-light">
                  {policy.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Widget Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl font-bold">Câu Hỏi Thường Gặp (FAQ)</h2>
          <p className="text-sm text-slate-500">Các thắc mắc phổ biến của người dân khi thực hiện dịch vụ công trực tuyến.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm space-y-2">
              <h3 className="font-serif text-base font-bold text-slate-800 flex items-start">
                <HelpCircle className="w-5 h-5 mr-3 text-primary-800 shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed pl-8 font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
