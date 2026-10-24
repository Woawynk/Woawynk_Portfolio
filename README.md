# Hướng Dẫn Tùy Chỉnh IT Portfolio Website

Website Portfolio đã được xây dựng tại file [`index.html`](file:///c:/Users/HOA08/Desktop/Portfolio/index.html) với đầy đủ các phần cốt lõi và giao diện chuẩn ngành IT.

---

## 1. Cấu Trúc Các Phần Trong Portfolio

Dựa theo bài viết tham khảo trên Viblo và tiêu chuẩn tuyển dụng IT:

1. **Hero Header (Mở đầu):**
   - Lời chào ngắn gọn, định danh nghề nghiệp (`Full-Stack Software Engineer`, `React & Node.js Developer`).
   - Hiệu ứng gõ chữ (Typing Effect) phong cách terminal.
   - Thẻ code tương tác mô phỏng file `developer.ts` thể hiện tư duy lập trình viên.
   - Nút gọi hành động (Call To Action): *Xem dự án*, *Tải CV*, *Liên hệ*.

2. **About Me (Giới thiệu bản thân):**
   - Tóm tắt định hướng, triết lý viết code sạch (`Clean Architecture`), khả năng nghiên cứu sâu và tinh thần làm việc nhóm.

3. **Skills & Tech Stack (Năng lực kỹ thuật):**
   - Phân loại rõ ràng 4 nhóm: **Front-end**, **Back-end**, **Database**, **DevOps & Tools**.
   - Thanh tiến độ năng lực kỹ thuật và danh sách badges công nghệ phổ biến.

4. **Featured Projects (Dự án tiêu biểu):**
   - Bộ lọc phân loại (`Fullstack`, `Frontend`, `Backend & AI`).
   - Mỗi card dự án gồm: Tiêu đề, mô tả bài toán, điểm nổi bật kỹ thuật, danh sách công nghệ và link tới **GitHub Repository / Live Demo**.

5. **Experience & Education (Kinh nghiệm & Học vấn):**
   - Dòng thời gian (Timeline) thể hiện quá trình thực tập, dự án freelance, học vấn chuyên ngành CNTT và các chứng chỉ (AWS, IELTS, chứng chỉ khóa học).

6. **Interactive CLI / Terminal (Tính năng đặc trưng IT):**
   - Cho phép nhà tuyển dụng hoặc người xem gõ lệnh trực tiếp (`help`, `about`, `skills`, `projects`, `contact`) ngay trên trình duyệt.

7. **Contact Form & Social Links (Liên hệ):**
   - Form gửi thư điện tử, email, số điện thoại, link LinkedIn, GitHub và bài viết blog/Viblo.

---

## 2. Cách Xem Trực Tiếp Trên Trình Duyệt

- Bạn chỉ cần nhấp đúp vào file [`index.html`](file:///c:/Users/HOA08/Desktop/Portfolio/index.html) để mở trực tiếp trong trình duyệt (Chrome, Edge, Firefox, v.v.).
- Hoặc nếu dùng VS Code, có thể cài extension **Live Server** và nhấn **Go Live**.

---

## 3. Cách Tùy Chỉnh Thông Tin Cá Nhân

Trong file [`index.html`](file:///c:/Users/HOA08/Desktop/Portfolio/index.html):
- **Tên & Chức danh:** Tìm `Nguyễn Văn A` và thay bằng tên bạn.
- **Link GitHub, LinkedIn, Viblo:** Tìm các thuộc tính `href="https://github.com"` và dán link profile cá nhân của bạn vào.
- **Dự án:** Thay đổi tên dự án, ảnh mô tả hoặc công nghệ phù hợp với những đồ án môn học hoặc dự án thực tế bạn đã làm.
- **File CV:** Thay link ở nút `Tải CV` thành đường dẫn tới file PDF CV của bạn (ví dụ: `cv-nguyen-van-a.pdf`).
