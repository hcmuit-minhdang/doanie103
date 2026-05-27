# Kế Hoạch Triển Khai: Tích Hợp Upload Minh Chứng Thực Tế & Tải Biểu Mẫu

---

## 1. Yêu Cầu & Giải Pháp

Người dùng phản ánh tính năng **Tải lên tài liệu minh chứng** (file upload) hiện đang bị mock dưới dạng ô nhập văn bản (text input) và không thực sự hoạt động. 
Để giải quyết triệt để và mang lại trải nghiệm 10/10, chúng ta sẽ xây dựng tính năng tải lên tệp thực tế (PDF, JPG, PNG) hoạt động trơn tru từ Frontend đến Backend:

### Giải Pháp Kỹ Thuật:
1. **Base64 Upload Protocol**: Sử dụng phương thức tải lên dạng Base64 thông qua API JSON chuẩn. Tránh cài đặt thêm thư viện dạng multipart phức tạp, đảm bảo hoạt động cực kỳ ổn định trên mọi môi trường và hệ điều hành.
2. **Backend Storage**: Backend tiếp nhận chuỗi Base64, tự động giải mã thành tệp nhị phân ban đầu, tự động tạo thư mục `./uploads/` (nếu chưa có), lưu tệp với tên duy nhất (Sử dụng timestamp để tránh trùng lặp) và trả về URL truy cập tĩnh dạng: `http://localhost:3001/uploads/[filename]`.
3. **Frontend Dropzone & File Pickers**:
   - **Tab 1 (Nộp Hồ Sơ Mới)**: Thay thế ô nhập text cũ bằng vùng kéo thả / chọn tệp (dropzone) trực quan. Có thanh trạng thái tải lên, hiển thị hình ảnh xem trước hoặc biểu tượng PDF, tên tệp và kích thước thực.
   - **Tab 2 (Bổ sung minh chứng)**: Tạo một biểu mẫu hoàn chỉnh cho phép chọn hồ sơ cần bổ sung (từ danh sách các hồ sơ Nháp hoặc Chờ duyệt của chính công dân đó), sau đó tải tệp lên và lưu trực tiếp vào cơ sở dữ liệu thông qua API `addAttachment`.
4. **Real File Templates (Tải biểu mẫu)**: Khởi tạo các tệp biểu mẫu mẫu trong backend để người dân bấm nút "Tải xuống" ở Tab 3 có thể tải về tệp thật thay vì link rỗng.

---

## 2. Các File Thay Đổi Dự Kiến

### ⚙️ Backend (Express API)

#### [MODIFY] [dossier.controller.js](file:///f:/drive_mon_hoc/ie103/DEMO_WEB/backend/src/controllers/dossier.controller.js)
- Thêm method `uploadAttachment(req, res, next)`:
  - Đọc chuỗi `fileData` (Base64) và `fileName`.
  - Tạo thư mục `./uploads/` và `./uploads/templates/` nếu chưa có.
  - Tách phần header base64 (ví dụ: `data:application/pdf;base64,`), lưu buffer nhị phân xuống đĩa đĩa cứng.
  - Trả về đường dẫn URL tĩnh của tệp vừa lưu.
- Khởi tạo 4 tệp biểu mẫu chuẩn trong `./uploads/templates/` lúc khởi động hoặc khi có yêu cầu tải xuống để người dân tải về đơn mẫu thật.

#### [MODIFY] [dossier.routes.js](file:///f:/drive_mon_hoc/ie103/DEMO_WEB/backend/src/routes/dossier.routes.js)
- Khai báo thêm route POST `/upload-attachment` liên kết tới controller `uploadAttachment`.

#### [MODIFY] [app.js](file:///f:/drive_mon_hoc/ie103/DEMO_WEB/backend/src/app.js)
- Đảm bảo Express phục vụ thư mục tĩnh `/uploads/templates` để tải biểu mẫu.

---

### 💻 Frontend (Vite React)

#### [MODIFY] [api.ts](file:///f:/drive_mon_hoc/ie103/DEMO_WEB/frontend/src/services/api.ts)
- Bổ sung hàm gọi API `uploadAttachment` trong đối tượng `dossierApi`.

#### [MODIFY] [DossierPage.tsx](file:///f:/drive_mon_hoc/ie103/DEMO_WEB/frontend/src/pages/Dossier/DossierPage.tsx)
- Thiết kế lại Giao diện Tải file ở **Tab 1**:
  - Giao diện kéo thả tệp, xử lý sự kiện `onChange` của `<input type="file">`.
  - Đọc tệp thông qua `FileReader` dưới dạng Base64 Data URL.
  - Gọi API `uploadAttachment` ngay lập tức để tải lên server, hiển thị trạng thái "Đang tải lên..." và lưu lại URL trả về từ backend.
- Cải tiến Giao diện **Tab 2 (Bổ sung minh chứng)**:
  - Thêm một thẻ `<select>` chứa các hồ sơ hiện có của công dân để chọn hồ sơ cần bổ sung.
  - Hiển thị danh sách các minh chứng hiện có của hồ sơ đó.
  - Cung cấp nút tải tệp mới lên và gọi API `dossierApi.addAttachment(dossierId, { fileName, fileUrl })` để cập nhật trực tiếp vào CSDL.
- Cập nhật **Tab 3 (Tải biểu mẫu)**:
  - Liên kết các nút tải về tới URL tệp thật phục vụ trên backend: `http://localhost:3001/uploads/templates/[tên_biểu_mẫu].pdf`.

---

## 3. Kế Hoạch Xác Minh (Verification Plan)

### Kiểm Tra Thủ Công (Manual Verification):
1. **Nộp hồ sơ mới**:
   - Chọn một tệp hình ảnh hoặc PDF thật từ máy tính.
   - Kéo thả vào vùng upload ở Tab 1.
   - Kiểm tra xem tệp có được tải lên thành công, hiển thị đúng biểu tượng xem trước và tên tệp không.
   - Bấm "Nộp Thẩm Định Ngay".
   - Vào Trang Dashboard của Cán bộ (canbophuong), mở hồ sơ vừa nộp, kiểm tra xem cán bộ có nhìn thấy và mở được tệp minh chứng đó không.
2. **Bổ sung minh chứng**:
   - Sang Tab 2, chọn hồ sơ Bản nháp vừa tạo.
   - Chọn một tệp minh chứng bổ sung khác và tải lên.
   - Xác nhận tệp được thêm ngay vào danh sách minh chứng của hồ sơ đó ở cột bên phải.
3. **Tải biểu mẫu**:
   - Sang Tab 3, bấm vào biểu tượng Tải xuống ở một biểu mẫu bất kỳ.
   - Xác nhận trình duyệt tải về thành công một tệp mẫu thật (ví dụ: `to_khai_thuong_binh.pdf`).
