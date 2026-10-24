# Portfolio Cá Nhân - Huỳnh Thái Hoà (HCMUS - AI Engineer)

Website Portfolio chuẩn IT dành cho sinh viên ngành Công nghệ Tri thức - ĐH Khoa học Tự nhiên (HCMUS), định hướng **AI Engineer / Software Engineer**.

---

## 🌟 Tính Năng Nổi Bật

1. **Khung Tiêu Điểm Top 3 Dự Án (Pinned Showcase)**
   - Đánh dấu tối đa **3 dự án tâm đắc nhất** lên một khung vinh danh riêng biệt với viền ánh kim và huy hiệu `★ TOP FEATURED`.
   - Giới hạn chặt chẽ: chỉ cho phép ghim tối đa 3 dự án cùng một lúc.

2. **Dữ Liệu Động Đồng Bộ Supabase Cloud**
   - Dữ liệu dự án và trạng thái ghim được lưu lâu dài trên **Supabase PostgreSQL**.
   - Hỗ trợ **GitHub Pages** trực tiếp qua `SUPABASE_URL` + `SUPABASE_ANON_KEY` (Row Level Security).
   - Hỗ trợ chạy local bằng Node.js Server qua biến môi trường duy nhất `DATABASE_URL`.

3. **Bảo Mật Băm SHA-256 Cho Creator Mode**
   - Mã PIN admin được băm SHA-256, lưu trong bảng `app_config` trên Supabase.
   - Mọi điểm vào Creator Mode (nút badge, phím tắt `Ctrl+Shift+A`, lệnh `admin` trong CLI) đều yêu cầu xác thực.
   - Đổi PIN trực tiếp trên giao diện → tự đồng bộ mã băm mới lên Cloud.

---

## 🚀 Thiết Lập GitHub Pages + Supabase (Khuyên Dùng)

### Bước 1: Khởi tạo Database
1. Đăng nhập [supabase.com](https://supabase.com) → tạo Project mới (miễn phí).
2. Vào **SQL Editor** → mở file [`supabase_schema.sql`](./supabase_schema.sql), copy toàn bộ và nhấn **Run**.
   *(Tự tạo bảng, bật RLS, seed 6 đồ án HCMUS và PIN mặc định `1234`).*

### Bước 2: Điền key vào `script.js`
1. Trong Supabase → **Project Settings → API**, copy:
   - **Project URL**
   - **anon public Key**
2. Mở [`script.js`](./script.js) tại dòng 14–20 và điền vào:
```javascript
const SUPABASE_URL = "https://your-project.supabase.co"; // ← URL của bạn
const SUPABASE_ANON_KEY = "your-anon-key";              // ← Anon key của bạn
```
3. Push code lên GitHub → bật **GitHub Pages** (Settings → Pages → branch `main`).

> [!IMPORTANT]
> `SUPABASE_ANON_KEY` (anon/public key) **an toàn để để trong code frontend** vì đã được bảo vệ bởi Row Level Security (RLS) ở Supabase. Không để `service_role` key vào đây.

---

## 💻 Chạy Local Bằng Node.js (Tùy Chọn)

```bash
# 1. Cài dependencies
npm install

# 2. Điền DATABASE_URL vào file .env
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

# 3. Chạy server
npm start
# → Mở http://localhost:3000
```

---

## 🔑 Creator Mode & Mã PIN

| Cách vào | Mô tả |
|----------|-------|
| Bấm badge **`HR View`** | Nhập PIN để chuyển sang Creator Mode |
| Phím tắt `Ctrl+Shift+A` | Tắt/mở Creator Mode |
| Gõ `admin` trong Terminal `[~]` | Yêu cầu PIN, xác thực băm SHA-256 |

- **PIN mặc định:** `1234`
- **Đổi PIN:** Vào Creator Mode → Trang Dự án → nút **`Đổi mã PIN`** → hệ thống lưu mã băm mới lên Supabase tự động.
