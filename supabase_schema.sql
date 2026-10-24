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

-- 5. NẠP 6 DỰ ÁN MẪU HCMUS CỦA HUỲNH THÁI HOÀ (3 DỰ ÁN ĐẦU TIÊN CÓ IS_PINNED = TRUE)
INSERT INTO projects (
  id, title, category, badge, tag, icon, is_pinned,
  short_desc, problem, role, tech_details, tech_stack, github_url, demo_url
) VALUES 
(
  'proj-1',
  'Tìm Đường Đi Tối Ưu Cho Xe Cấp Cứu',
  'ai',
  'Cơ sở Trí tuệ Nhân tạo',
  'Đồ án AI',
  'navigation',
  true,
  'Xây dựng giải thuật định tuyến tìm lộ trình di chuyển nhanh nhất cho xe cứu thương trong đô thị với nhiều ràng buộc kẹt xe.',
  'Trong các đô thị lớn, xe cấp cứu thường xuyên bị chậm trễ do ùn tắc giao thông, đèn đỏ và sự cố đột xuất. Các thuật toán định tuyến thông thường chỉ tìm đường ngắn nhất về khoảng cách địa lý mà không phản ánh đúng thời gian thực.',
  'Phân tích đồ thị mạng lưới đường sá, thiết kế ma trận trọng số chi phí di chuyển (Cost matrix) kết hợp độ dài quãng đường và mật độ phương tiện. Tối ưu hàm Heuristic định hướng đường đi để giảm số lượng đỉnh cần duyệt.',
  'Ứng dụng thuật toán Dijkstra và A* Search trên đồ thị có trọng số biến thiên. Mô hình hóa bài toán bằng Python, tối ưu tốc độ tính toán ma trận với NumPy. Đạt kết quả tối ưu thời gian tìm đường nhanh hơn 30% so với duyệt thông thường.',
  '["A* Algorithm", "Dijkstra", "Weight Matrix", "Python", "NumPy"]'::jsonb,
  'https://github.com',
  ''
),
(
  'proj-2',
  'Xử Lý & Biến Đổi Ảnh Bằng Ma Trận',
  'ai',
  'Toán ứng dụng CNTT',
  'Python & Matrix',
  'image',
  true,
  'Áp dụng đại số tuyến tính và phép toán ma trận để phân tích, biến đổi hình học và xử lý ảnh số không dùng thư viện xử lý ảnh có sẵn.',
  'Hiểu rõ cơ chế bản chất của ảnh số dưới dạng Tensor dữ liệu đa chiều, thay vì chỉ sử dụng các hàm có sẵn của OpenCV. Cần tự xây dựng các thuật toán biến đổi hình học và lọc ma trận từ đầu.',
  'Lập trình các phép biến đổi ảnh: Phép quay không gian (Rotation matrix), phép co giãn (Scaling), biến đổi tương phản Affine và thiết kế nhân tích chập (Convolution Kernel) để lọc làm mịn hoặc tách biên (Edge detection).',
  'Toàn bộ thuật toán được hiện thực bằng Python thuần kết hợp NumPy để xử lý vector hóa dữ liệu ma trận ảnh 2D/3D. Đây là nền tảng toán học nền móng cho Computer Vision và mạng nơ-ron tích chập (CNN).',
  '["Linear Algebra", "Matrix Convolution", "Tensor", "Python", "NumPy"]'::jsonb,
  'https://github.com',
  ''
),
(
  'proj-3',
  'App Mobile Hỗ Trợ Du Lịch',
  'software',
  'Tư duy tính toán',
  'Dart Mobile App',
  'smartphone',
  true,
  'Ứng dụng di động giúp gợi ý lộ trình tham quan, tra cứu địa điểm và tiện ích cho người du lịch với giao diện trực quan.',
  'Khách du lịch thường mất nhiều thời gian tra cứu phân tán thông tin địa điểm, khó khăn trong việc sắp xếp lộ trình tham quan hợp lý và cần một ứng dụng di động có trải nghiệm mượt mà, thân thiện.',
  'Đảm nhận toàn bộ phần xây dựng giao diện người dùng (Frontend) trên nền tảng Dart: thiết kế UI responsive, kiến trúc component tái sử dụng, tối ưu luồng điều hướng màn hình và xử lý trạng thái hiển thị.',
  'Sử dụng ngôn ngữ Dart, áp dụng tư duy tính toán (Computational Thinking) để chia nhỏ bài toán hiển thị dữ liệu du lịch dạng danh sách và thẻ trực quan. Tích hợp xử lý tương tác chạm, bộ lọc địa điểm theo bán kính.',
  '["Dart", "Mobile UI", "Component Architecture", "UX Flow"]'::jsonb,
  'https://github.com',
  ''
),
(
  'proj-4',
  'Hệ Thống Truyền Video Qua Giao Thức Mạng',
  'system',
  'Mạng máy tính',
  'Networking & Socket',
  'video',
  false,
  'Mô phỏng cơ chế đóng gói, truyền tải và đồng bộ luồng video qua các tầng giao thức mạng thời gian thực.',
  'Truyền tải video qua mạng đòi hỏi xử lý bài toán băng thông, kiểm soát độ trễ (Latency) và mất gói tin (Packet loss). Cần so sánh ưu nhược điểm giữa giao thức tin cậy TCP và giao thức thời gian thực UDP.',
  'Lập trình socket truyền nhận các khối dữ liệu hình ảnh/video giữa Client và Server, đo đạc thông lượng mạng (Throughput) và phân tích ảnh hưởng của nghẽn mạng đến chất lượng phát video.',
  'Ứng dụng Socket Programming, phân tích mô hình OSI và bộ giao thức TCP/IP. Xây dựng bộ đệm (Buffer) tại phía Client để giảm hiện tượng giật khung hình khi mạng dao động.',
  '["Socket Programming", "TCP/IP", "UDP Streaming", "Network Protocols"]'::jsonb,
  'https://github.com',
  ''
),
(
  'proj-5',
  'Thiết Kế Mạch Arduino & Mô Hình 3D',
  'system',
  'Vật lý cho CNTT',
  'IoT & Hardware',
  'circuit-board',
  false,
  'Thiết kế vỏ phần cứng 3D bằng Fusion 360, lập trình vi điều khiển Arduino đọc cảm biến và truyền dữ liệu qua MQTT.',
  'Kết nối thế giới vật lý với hệ thống phần mềm: Cần tạo ra một thiết bị phần cứng hoàn chỉnh có vỏ bảo vệ chuẩn kích thước, đọc tín hiệu cảm biến thời gian thực và gửi về máy chủ.',
  'Thiết kế mô hình vỏ hộp 3D bằng phần mềm Autodesk Fusion 360, lắp ráp mạch điện tử với Arduino, lập trình đọc dữ liệu cảm biến và gửi gói tin qua giao thức MQTT.',
  'Lập trình C/C++ nhúng trên Arduino, sử dụng giao thức nhẹ MQTT phù hợp cho thiết bị IoT băng thông thấp. Nắm vững nền tảng để triển khai mô hình Edge AI (AI trên thiết bị biên) trong tương lai.',
  '["Arduino C++", "Autodesk Fusion 360", "MQTT Protocol", "IoT Hardware"]'::jsonb,
  'https://github.com',
  ''
),
(
  'proj-6',
  'Mô Phỏng Game Bài Poker Bằng C++',
  'software',
  'Cơ sở lập trình',
  'C++ Algorithm',
  'gamepad-2',
  false,
  'Xây dựng trò chơi bài Poker hoàn chỉnh bằng C++ với thuật toán xáo bài ngẫu nhiên và phân loại sức mạnh lá bài.',
  'Cần xử lý logic so sánh xếp hạng các bộ bài (Straight Flush, Four of a Kind, Full House, Flush...) với hàng chục tổ hợp điều kiện phức tạp của luật chơi Poker quốc tế.',
  'Xây dựng toàn bộ kiến trúc giải thuật: Thuật toán xáo bài Fisher-Yates, cấu trúc dữ liệu lưu trữ lá bài và hàm đánh giá điểm số của từng bộ bài để xác định người chiến thắng tự động.',
  'Ứng dụng C++ hướng đối tượng (OOP), quản lý bộ nhớ con trỏ chặt chẽ, mảng 2 chiều và cấu trúc struct/class. Rèn luyện tư duy thuật toán và kỹ năng lập trình không lỗi logic.',
  '["C++", "OOP", "Algorithm", "Game Logic"]'::jsonb,
  'https://github.com',
  ''
)
ON CONFLICT (id) DO NOTHING;
