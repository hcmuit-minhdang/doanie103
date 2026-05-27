# Tài Liệu Bàn Giao: Tích Hợp Minh Chứng Thực Tế & Tải Biểu Mẫu Chuẩn

Hệ thống đã được nâng cấp thành công để hỗ trợ quy trình nộp hồ sơ an sinh xã hội hoàn chỉnh từ việc **Tải file minh chứng thật** (PDF, PNG, JPG) cho đến **Bổ túc hồ sơ trực tiếp** và **Tải các biểu mẫu chuẩn** trực tiếp từ Server Backend.

---

## 🛠️ Những Thay Đổi Đã Thực Hiện

### 1. ⚙️ Tích Hợp Backend (API Tải File)
- **API `POST /api/dossiers/upload-attachment`**:
  - Đọc chuỗi nhị phân mã hóa dạng Base64 từ Frontend.
  - Tự động tạo thư mục `./uploads/` trên máy chủ nếu chưa tồn tại.
  - Giải mã và ghi tệp nhị phân gốc xuống đĩa đĩa cứng bằng tên tệp duy nhất (kèm timestamp để chống ghi đè).
  - Trả về đường dẫn truy cập tĩnh chuẩn: `http://localhost:3001/uploads/[tên_tệp]`.
- **Bộ Khởi Tạo Templates (`initTemplates`)**:
  - Tự động sinh 4 biểu mẫu an sinh xã hội chuẩn dưới định dạng `.pdf` và `.docx` thực tế trong thư mục `./uploads/templates/` lúc server khởi chạy.
  - Nhờ đó, người dân có thể tải về tài liệu hành chính thực sự thay vì các link rỗng!

### 2. 💻 Hoàn Thiện Frontend (Trải Nghiệm Kéo Thả File)
- **Tab 1: Nộp hồ sơ mới (Dropzone trực quan)**:
  - Loại bỏ các ô nhập text thủ công cho `fileName` và `fileUrl`.
  - Thay thế bằng **Vùng Kéo Thả & Chọn tệp (Dropzone)** chuẩn dịch vụ công cao cấp.
  - Tích hợp thanh chờ tải lên (loading spinner) trong quá trình mã hóa base64 & tải lên server.
  - Hiển thị dấu check thành công xanh lục kèm tên tệp đính kèm và nút "Gỡ bỏ tệp" (Trash) nếu muốn thay đổi tệp khác.
- **Tab 2: Bổ sung minh chứng (Quy trình hoàn chỉnh)**:
  - Cho phép người dân chọn hồ sơ đang có (Nháp / Chờ duyệt) bằng thẻ `<select>`.
  - Tự động gọi API `GET /api/dossiers/:id` để lấy toàn bộ thông tin chi tiết và danh sách minh chứng hiện tại.
  - Cung cấp vùng tải tệp minh chứng bổ sung. Khi tải tệp lên, hệ thống gọi API `POST /api/dossiers/:id/attachments` để lưu trực tiếp vào cơ sở dữ liệu MySQL và cập nhật danh sách hiển thị thời gian thực!
- **Tab 3: Tải biểu mẫu chuẩn (Liên kết thật)**:
  - Cập nhật liên kết ở nút tải xuống trỏ trực tiếp tới tệp biểu mẫu thật phục vụ trên Backend.

---

## 📸 Giao Diện Người Dùng Mới

### Tab 1: Kéo thả và tải file minh chứng khi nộp đơn mới
```
[ 📁 Chọn hoặc Kéo thả minh chứng vào đây ]
  - Giấy chứng nhận bệnh tật, biên bản giám định (PDF, PNG, JPG)
  [ Chọn tệp từ máy tính ]
```
*(Khi tải tệp lên thành công, hệ thống hiển thị biểu tượng Check 🟢 kèm huy hiệu tệp `📄 [tên_file.pdf]` và nút gỡ bỏ)*

### Tab 2: Chọn hồ sơ và bổ sung minh chứng
1. Chọn hồ sơ từ menu thả xuống:
   `Mã HS: #13 - Đăng ký mới (Bản nháp)`
2. Hiển thị danh sách tệp đính kèm hiện tại của hồ sơ đó.
3. Vùng tải tệp bổ túc tệp mới ngay lập tức.

---

## 🧪 Quy Trình Thử Nghiệm Đề Xuất (Test Plan)

1. **Đăng nhập** với tư cách **Công dân** (ví dụ CCCD: `079090123456` / Mật khẩu: `123456`).
2. Vào trang **Đăng ký hồ sơ** (`http://localhost:5173/dossier/new`).
3. **Tab 1 (Nộp hồ sơ)**: 
   - Điền lý do, chọn loại yêu cầu.
   - Chọn một file ảnh hoặc PDF bất kỳ từ máy tính của bạn và tải lên.
   - Bấm **"Lưu Bản Nháp (Draft)"**.
4. **Tab 2 (Bổ sung minh chứng)**:
   - Chọn hồ sơ Bản nháp bạn vừa lưu ở dropdown.
   - Bạn sẽ thấy tên file đính kèm trước đó ở phần "Danh sách tệp minh chứng hiện tại".
   - Tiếp tục chọn tải lên một file bổ sung khác. 
   - Kiểm tra xem file thứ 2 có tự động xuất hiện trong danh sách đính kèm không.
5. **Tab 3 (Tải biểu mẫu)**:
   - Bấm vào biểu tượng Tải xuống bên phải một biểu mẫu bất kỳ và kiểm tra tệp tin được tải về máy của bạn!
