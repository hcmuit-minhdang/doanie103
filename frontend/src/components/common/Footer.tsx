import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-950 text-white pt-16 pb-8 border-t-4 border-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10 pb-12">

          {/* Brand/Portal Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream-200 uppercase tracking-wide">
              Hệ Thống An Sinh Xã Hội
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans font-light">
              Cổng dịch vụ trực tuyến về chính sách ưu đãi người có công và bảo trợ xã hội. Đảm bảo hỗ trợ, chăm lo toàn diện, minh bạch và hiệu quả cho người dân và gia đình có công với Cách mạng.
            </p>
          </div>

          {/* Hotline / Support */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream-200 uppercase tracking-wide">
              Đường Dây Nóng
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300 text-sm">
                <Phone className="w-4 h-4 mr-3 text-cream-300 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Tổng đài hỗ trợ chính sách</p>
                  <p className="text-xs text-cream-200">0363249026 (8h00 - 17h00)</p>
                </div>
              </li>
              <li className="flex items-center text-slate-300 text-sm">
                <HelpCircle className="w-4 h-4 mr-3 text-cream-300 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Giải đáp khiếu nại</p>
                  <p className="text-xs text-cream-200">0363249026 (Admin của Website)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream-200 uppercase tracking-wide">
              Liên Hệ
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-cream-300 shrink-0 mt-1" />
                <span>Thôn cành lá, Xã cành cây, Huyện gió mây, Tỉnh đồi núi</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-cream-300 shrink-0" />
                <a href="mailto:minhdanghoccode@gmail.com" className="hover:text-cream-200 transition-colors">
                  minhdanghoccode@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream-200 uppercase tracking-wide">
              Liên Kết Hữu Ích
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="https://chinhphu.vn" target="_blank" rel="noreferrer" className="flex items-center hover:text-cream-200 transition-colors group">
                  Cổng Thông tin Điện tử Chính phủ
                  <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-500 group-hover:text-cream-200 transition-colors" />
                </a>
              </li>
              <li>
                <a href="https://molisa.gov.vn" target="_blank" rel="noreferrer" className="flex items-center hover:text-cream-200 transition-colors group">
                  Bộ Lao động - Thương binh & Xã hội
                  <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-500 group-hover:text-cream-200 transition-colors" />
                </a>
              </li>
              <li>
                <a href="https://baohiemxahoi.gov.vn" target="_blank" rel="noreferrer" className="flex items-center hover:text-cream-200 transition-colors group">
                  Bảo hiểm Xã hội Việt Nam
                  <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-500 group-hover:text-cream-200 transition-colors" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-slate-400 font-sans">
          <p>© 2026 Sở Lao động - Thương binh và Xã hội TP. Hồ Chí Minh. Bảo lưu mọi quyền.</p>
          <p className="mt-2 sm:mt-0 font-light">Thiết kế bởi Minh Dang và nhóm 2 IE103</p>
        </div>
      </div>
    </footer>
  );
};
