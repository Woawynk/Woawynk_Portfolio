-- =========================================================================
-- FILE SQL KHỞI TẠO CƠ SỞ DỮ LIỆU SUPABASE CHO PORTFOLIO CỦA HUỲNH THÁI HOÀ
-- Hướng dẫn: Mở Supabase -> Chọn dự án -> Vào mục "SQL Editor" -> Dán toàn bộ file này -> Nhấn "Run"
-- =========================================================================

-- 1. TẠO BẢNG PROJECTS (LƯU TRỮ DỰ ÁN & TRƯỜNG PIN)
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(100) PRIMARY KEY,
  title TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  badge VARCHAR(100),
  tag VARCHAR(100),
  icon VARCHAR(50) DEFAULT 'folder-code',
  is_pinned BOOLEAN DEFAULT FALSE,
  short_desc TEXT,
  problem TEXT,
  role TEXT,
  tech_details TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TẠO BẢNG APP_CONFIG (LƯU MÃ BĂM SHA-256 CỦA ADMIN PIN)
CREATE TABLE IF NOT EXISTS app_config (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL
);

-- 3. BẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN TRUY CẬP CHO GITHUB PAGES (ANON KEY)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Cấp quyền Đọc, Thêm, Sửa, Xóa cho Client sử dụng ANON KEY
CREATE POLICY "Cho phép đọc projects công khai" ON projects FOR SELECT USING (true);
CREATE POLICY "Cho phép quản lý projects qua Anon Key" ON projects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép đọc app_config công khai" ON app_config FOR SELECT USING (true);
CREATE POLICY "Cho phép cập nhật app_config qua Anon Key" ON app_config FOR ALL USING (true) WITH CHECK (true);

-- 4. KHỞI TẠO MÃ BĂM MẶC ĐỊNH (MÃ PIN 1234)
INSERT INTO app_config (key, value)
VALUES ('admin_pin_hash', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4')
ON CONFLICT (key) DO NOTHING;

-- 5. NẠP 6 DỰ ÁN MẪU KHỚP 100% VỚI CV CỦA HUỲNH THÁI HOÀ (3 DỰ ÁN ĐẦU TIÊN CÓ IS_PINNED = TRUE)
INSERT INTO projects (
  id, title, category, badge, tag, icon, is_pinned,
  short_desc, problem, role, tech_details, tech_stack, github_url, demo_url
) VALUES 
(
  'proj-1',
  'AI Arena Vietnam 2026 - "Audition: Viet Phuc Remix"',
  'ai',
  'AI Arena 2026 · Điểm: 86.75',
  'AI & Supabase',
  'sparkles',
  true,
  'Ứng dụng AI hướng tới Gen-Z giúp khám phá và cách điệu trang phục cổ phong Việt Nam theo bối cảnh sự kiện và phong cách cá nhân.',
  'Người trẻ yêu thích trang phục truyền thống Việt Nam nhưng gặp rào cản trong việc tra cứu ngữ cảnh văn hóa, cách phối đồ phù hợp với từng dịp lễ hội hoặc phong cách hiện đại. Cần một giải pháp AI trực quan, tương tác nhanh và đảm bảo tính chính xác về văn hóa.',
  'AI Backend Developer & Database Engineer: Thiết kế kiến trúc Cơ sở dữ liệu cốt lõi trên Supabase (PostgreSQL) để lưu trữ hiệu quả ngữ cảnh văn hóa và hồ sơ người dùng. Xây dựng dịch vụ backend và áp dụng framework Prompt 5 bước (5-step structured prompt) giúp tối đa hóa độ chính xác, tính nhất quán và khả năng thích ứng ngữ cảnh của LLM.',
  'Tích hợp mô hình ngôn ngữ lớn (LLM Integration) qua Google AI Studio API, xây dựng backend service bằng Python / Node.js, thiết kế cơ sở dữ liệu quan hệ với Supabase (PostgreSQL), tối ưu kỹ thuật Prompt Engineering nâng cao. Dự án đạt điểm số chính thức 86.75/100 từ Hội đồng Giám khảo Quốc gia.',
  '["Python", "Node.js", "Supabase (PostgreSQL)", "Prompt Engineering", "LLM Integration", "Google AI Studio"]'::jsonb,
  'https://github.com/woawynk',
  ''
),
(
  'proj-2',
  'RescueRoute – Emergency Vehicle Routing',
  'ai',
  'Đồ án Cơ sở AI (HCMUS)',
  'Dijkstra & Genetic',
  'navigation',
  true,
  'Ứng dụng web định tuyến tìm lộ trình di chuyển tối ưu cho xe cấp cứu trong điều kiện giao thông đô thị biến thiên.',
  'Trong các đô thị lớn, xe cấp cứu thường xuyên đối mặt với tình trạng tắc đường, đèn tín hiệu và rào cản bất ngờ. Thuật toán tìm đường thông thường chỉ tính khoảng cách hình học ngắn nhất mà bỏ qua yếu tố thời gian thực và mật độ lưu thông.',
  'Algorithm & Software Engineer: Trực tiếp hiện thực hóa 2 giải thuật tìm đường Dijkstra và Genetic Algorithm (Giải thuật di truyền). Thiết kế hàm chi phí tùy biến (Custom Cost Function) kết hợp các chỉ số thực tế để cân bằng tối ưu giữa tốc độ thực thi và độ tối ưu của cung đường. Xây dựng framework tự động đo lường hiệu năng (Automated Benchmarking).',
  'Lập trình thuật toán bằng Python, xây dựng giao diện ứng dụng web tương tác, mô hình hóa ma trận trọng số chi phí đồ thị giao thông. Thiết lập hệ thống benchmark tự động để so sánh và đánh giá hiệu năng thuật toán trong nhiều kịch bản nghẽn mạng khác nhau.',
  '["Python", "Web Development", "Dijkstra''s Algorithm", "Genetic Algorithm", "Benchmarking"]'::jsonb,
  'https://github.com/woawynk',
  ''
),
(
  'proj-3',
  'Smart File Organizer',
  'software',
  'Personal Project',
  'Python Automation',
  'folder-archive',
  true,
  'Công cụ Desktop tự động phân loại, sắp xếp và tối ưu hóa tệp tin hệ thống theo cấu trúc thư mục và định dạng mở rộng.',
  'Thư mục công việc và tải về trên máy tính thường xuyên bị quá tải, lộn xộn sau thời gian dài sử dụng, gây mất thời gian tra cứu và giảm hiệu suất làm việc hàng ngày của lập trình viên.',
  'Solo Developer: Thiết kế và phát triển toàn bộ công cụ tự động hóa desktop bằng Python. Xử lý các thao tác hệ thống tệp tin cấp hệ điều hành (di chuyển, đổi tên, phân luồng theo đuôi file và cây thư mục) một cách an toàn và sạch sẽ, giúp tự động hóa các tác vụ lặp lại và nâng cao hiệu quả làm việc.',
  'Sử dụng Python Scripting và các module hệ điều hành (OS File System Operations, Pathlib, Shutil). Xử lý an toàn các ngoại lệ về xung đột tên file, quyền truy cập tệp và tối ưu tốc độ quét dữ liệu dung lượng lớn.',
  '["Python", "OS File System Operations", "Scripting", "Automation"]'::jsonb,
  'https://github.com/woawynk',
  ''
),
(
  'proj-4',
  'Xử Lý & Biến Đổi Ảnh Bằng Ma Trận',
  'ai',
  'Toán ứng dụng CNTT (HCMUS)',
  'Python & Matrix',
  'image',
  false,
  'Áp dụng đại số tuyến tính và phép toán ma trận để phân tích, biến đổi hình học và xử lý ảnh số không dùng thư viện xử lý ảnh có sẵn.',
  'Hiểu rõ cơ chế bản chất của ảnh số (Digital Image) dưới dạng Tensor dữ liệu đa chiều, thay vì chỉ sử dụng các hàm có sẵn của OpenCV. Cần tự xây dựng các thuật toán biến đổi hình học và lọc ma trận từ đầu.',
  'Lập trình các phép biến đổi ảnh: Phép quay không gian (Rotation matrix), phép co giãn (Scaling), biến đổi tương phản Affine và thiết kế nhân tích chập (Convolution Kernel) để lọc làm mịn hoặc tách biên (Edge detection).',
  'Toàn bộ thuật toán được hiện thực bằng Python thuần kết hợp NumPy để xử lý vector hóa dữ liệu ma trận ảnh 2D/3D. Đây là nền tảng toán học nền móng cho Computer Vision và mạng nơ-ron tích chập (CNN).',
  '["Linear Algebra", "Matrix Convolution", "Tensor", "Python", "NumPy"]'::jsonb,
  'https://github.com/woawynk',
  ''
),
(
  'proj-5',
  'Mô Phỏng Game Bài Poker Bằng C++',
  'software',
  'Cơ sở lập trình (HCMUS)',
  'C++ OOP & Logic',
  'gamepad-2',
  false,
  'Xây dựng trò chơi bài Poker hoàn chỉnh bằng C++ với thuật toán xáo bài ngẫu nhiên và phân loại sức mạnh lá bài.',
  'Cần xử lý logic so sánh xếp hạng các bộ bài (Straight Flush, Four of a Kind, Full House, Flush...) với hàng chục tổ hợp điều kiện phức tạp của luật chơi Poker quốc tế.',
  'Xây dựng toàn bộ kiến trúc giải thuật: Thuật toán xáo bài Fisher-Yates, cấu trúc dữ liệu lưu trữ lá bài và hàm đánh giá điểm số của từng bộ bài để xác định người chiến thắng tự động.',
  'Ứng dụng C++ hướng đối tượng (OOP), quản lý bộ nhớ con trỏ chặt chẽ, mảng 2 chiều và cấu trúc struct/class. Rèn luyện tư duy thuật toán và kỹ năng lập trình không lỗi logic.',
  '["C++", "OOP", "Algorithm", "Game Logic"]'::jsonb,
  'https://github.com/woawynk',
  ''
),
(
  'proj-6',
  'Thiết Kế Mạch Arduino & Mô Hình 3D',
  'system',
  'Vật lý cho CNTT (HCMUS)',
  'IoT & Hardware',
  'circuit-board',
  false,
  'Thiết kế vỏ phần cứng 3D bằng Fusion 360, lập trình vi điều khiển Arduino đọc cảm biến và truyền dữ liệu qua MQTT.',
  'Kết nối thế giới vật lý với hệ thống phần mềm: Cần tạo ra một thiết bị phần cứng hoàn chỉnh có vỏ bảo vệ chuẩn kích thước, đọc tín hiệu cảm biến thời gian thực và gửi về máy chủ.',
  'Thiết kế mô hình vỏ hộp 3D bằng phần mềm Autodesk Fusion 360, lắp ráp mạch điện tử với Arduino, lập trình đọc dữ liệu cảm biến và gửi gói tin qua giao thức MQTT.',
  'Lập trình C/C++ nhúng trên Arduino, sử dụng giao thức nhẹ MQTT phù hợp cho thiết bị IoT băng thông thấp. Nắm vững nền tảng để triển khai mô hình Edge AI (AI trên thiết bị biên) trong tương lai.',
  '["Arduino C++", "Autodesk Fusion 360", "MQTT Protocol", "IoT Hardware"]'::jsonb,
  'https://github.com/woawynk',
  ''
)
ON CONFLICT (id) DO NOTHING;
