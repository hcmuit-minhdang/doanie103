import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Xin chào! Tôi là Trợ lý ảo An Sinh Xã Hội. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const faqs = [
    { q: 'Đối tượng chính sách là gì?', a: 'Đối tượng chính sách gồm 7 nhóm chính: Thương binh, Liệt sĩ & thân nhân, Bệnh binh, Người hoạt động kháng chiến nhiễm chất độc hóa học (CĐHH), Anh hùng LLVT, Người có công giúp đỡ cách mạng và Hộ nghèo/Cận nghèo cần bảo trợ xã hội.' },
    { q: 'Thủ tục nộp hồ sơ trực tuyến?', a: 'Để nộp hồ sơ, bạn đăng nhập bằng CCCD, chọn "Nộp Hồ Sơ" -> "Đăng ký hồ sơ mới", chọn diện chính sách mong muốn, đính kèm file minh chứng và nhấn "Gửi hồ sơ". Cán bộ phường sẽ thẩm định trực tiếp trên hệ thống.' },
    { q: 'Lịch sử phát quà tết ưu đãi?', a: 'Chiến dịch thăm hỏi phát quà được tổ chức định kỳ dịp 27/7, Tết Nguyên Đán... Quà tặng bao gồm Tiền mặt (từ 1.000.000 đến 3.500.000đ) hoặc Gạo, Hiện vật khác, được ghi nhận tự động vào Visit Log.' },
    { q: 'Thẻ BHYT ưu đãi hưởng bao nhiêu %?', a: 'Người có công và đối tượng bảo trợ xã hội được cấp thẻ BHYT ưu đãi với mức hưởng từ 70% đến 100% tại các bệnh viện đã đăng ký. Bạn có thể tra cứu thẻ của mình qua cổng BHYT.' }
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Pre-programmed bot replies
    setTimeout(() => {
      let botResponse = 'Cảm ơn câu hỏi của bạn. Để được hỗ trợ chuyên sâu, bạn có thể gọi hotline 1900 1588 hoặc nộp phiếu Phản ánh & Kiến nghị tại mục tương ứng ở thanh menu.';

      const lower = text.toLowerCase();
      if (lower.includes('đối tượng') || lower.includes('ai') || lower.includes('nhóm')) {
        botResponse = faqs[0].a;
      } else if (lower.includes('nộp') || lower.includes('hồ sơ') || lower.includes('thủ tục')) {
        botResponse = faqs[1].a;
      } else if (lower.includes('quà') || lower.includes('tết') || lower.includes('chiến dịch')) {
        botResponse = faqs[2].a;
      } else if (lower.includes('bhyt') || lower.includes('y tế') || lower.includes('bảo hiểm')) {
        botResponse = faqs[3].a;
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">

      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-800 text-white shadow-premium-hover hover:bg-primary-700 transition-premium transform hover:scale-105 active:scale-95 focus:outline-none"
          title="Hỗ trợ trực tuyến"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[500px] rounded-2xl bg-white shadow-premium-hover border border-slate-100 flex flex-col focus:outline-none overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="p-4 bg-primary-800 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cream-200" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold tracking-wide text-cream-100">Trợ Lý Ảo</h4>
                <p className="text-[10px] text-emerald-300 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-ping"></span>
                  Trực tuyến - Sẵn sàng
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/80 hover:text-white" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-cream-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary-200 text-primary-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                        ? 'bg-primary-800 text-white rounded-tr-none'
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                      }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-light mt-1 block px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Quick FAQ Chips */}
          {messages.length === 1 && (
            <div className="p-3 border-t border-slate-100 bg-white space-y-1.5">
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase px-1">Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-1.5">
                {faqs.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(faq.q)}
                    className="px-2.5 py-1.5 text-xs text-primary-800 hover:text-white bg-primary-50 hover:bg-primary-800 rounded-full border border-primary-100 transition-premium truncate max-w-full"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-premium"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-primary-800 hover:bg-primary-700 text-white shadow-sm transition-premium flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
