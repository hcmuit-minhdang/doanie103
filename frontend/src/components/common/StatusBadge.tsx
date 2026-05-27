import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const currentStatus = status || 'N/A';
  const s = currentStatus.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = currentStatus;

  if (s === 'approved' || s === 'done' || s === 'success' || s === 'active' || s === 'resolved' || s === 'đã duyệt' || s === 'thành công' || s === 'đang hiệu lực') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = s === 'approved' || s === 'đã duyệt' ? 'Đã duyệt' : 
            s === 'done' || s === 'success' || s === 'thành công' ? 'Thành công' :
            s === 'active' || s === 'đang hiệu lực' ? 'Đang hiệu lực' : 'Đã giải quyết';
  } else if (s === 'submitted' || s === 'pending' || s === 'chờ duyệt' || s === 'chờ xử lý' || s === 'in_progress') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    label = s === 'submitted' || s === 'chờ duyệt' ? 'Chờ duyệt' : 
            s === 'in_progress' ? 'Đang xử lý' : 'Đang chờ';
  } else if (s === 'rejected' || s === 'failed' || s === 'missed' || s === 'stopped' || s === 'từ chối' || s === 'lỗi' || s === 'đình chỉ' || s === 'revoked') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    label = s === 'rejected' || s === 'từ chối' ? 'Từ chối' : 
            s === 'failed' || s === 'lỗi' ? 'Thất bại' :
            s === 'missed' ? 'Bỏ lỡ' : 
            s === 'revoked' ? 'Đã thu hồi' : 'Đã dừng';
  } else if (s === 'draft' || s === 'bản nháp') {
    styles = 'bg-slate-100 text-slate-600 border-slate-200';
    label = 'Bản nháp';
  } else if (s === 'expired' || s === 'hết hạn') {
    styles = 'bg-slate-100 text-slate-500 border-slate-200 line-through';
    label = 'Hết hạn';
  } else if (s === 'open') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    label = 'Mở';
  } else if (s === 'closed') {
    styles = 'bg-slate-100 text-slate-500 border-slate-200';
    label = 'Đóng';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
};
