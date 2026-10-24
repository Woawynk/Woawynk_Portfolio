/**
 * SERVER BACKEND CHO PORTFOLIO CỦA HUỲNH THÁI HOÀ
 * - Kết nối trực tiếp với Supabase qua duy nhất 1 biến môi trường: DATABASE_URL
 * - Tự động tạo bảng 'projects' và 'app_config' (lưu mã băm SHA-256 của admin)
 * - Tự động seed dữ liệu dự án HCMUS chuẩn mực nếu bảng trống
 * - Đảm bảo quy tắc tối đa 3 dự án được ghim (PIN) cùng một lúc
 * - Đồng bộ thời gian thực cho mọi thiết bị truy cập (HR và Creator)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 1. Cấu hình Database Pool từ duy nhất biến DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

let pool = null;
if (databaseUrl && databaseUrl.trim() !== "") {
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  console.warn("\n⚠️ [CHÚ Ý] DATABASE_URL chưa được điền trong file .env!");
  console.warn("👉 Vui lòng mở file .env và điền connection string từ Supabase để đồng bộ dữ liệu đám mây.\n");
}

// Danh sách dự án khởi tạo mặc định của Huỳnh Thái Hoà tại HCMUS
const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Tìm Đường Đi Tối Ưu Cho Xe Cấp Cứu",
    category: "ai",
    badge: "Cơ sở Trí tuệ Nhân tạo",
    tag: "Đồ án AI",
    icon: "navigation",
    isPinned: true, // Ghim 1
    shortDesc: "Xây dựng giải thuật định tuyến tìm lộ trình di chuyển nhanh nhất cho xe cứu thương trong đô thị với nhiều ràng buộc kẹt xe.",
    problem: "Trong các đô thị lớn, xe cấp cứu thường xuyên bị chậm trễ do ùn tắc giao thông, đèn đỏ và sự cố đột xuất. Các thuật toán định tuyến thông thường chỉ tìm đường ngắn nhất về khoảng cách địa lý (Geometric Distance) mà không phản ánh đúng thời gian thực.",
    role: "Phân tích đồ thị mạng lưới đường sá, thiết kế ma trận trọng số chi phí di chuyển (Cost matrix) kết hợp độ dài quãng đường và mật độ phương tiện. Tối ưu hàm Heuristic định hướng đường đi để giảm số lượng đỉnh cần duyệt.",
    techDetails: "Ứng dụng thuật toán Dijkstra và A* Search trên đồ thị có trọng số biến thiên. Mô hình hóa bài toán bằng Python, tối ưu tốc độ tính toán ma trận với NumPy. Đạt kết quả tối ưu thời gian tìm đường nhanh hơn 30% so với duyệt thông thường.",
    techStack: ["A* Algorithm", "Dijkstra", "Weight Matrix", "Python", "NumPy"],
    githubUrl: "https://github.com",
    demoUrl: ""
  },
  {
    id: "proj-2",
    title: "Xử Lý & Biến Đổi Ảnh Bằng Ma Trận",
    category: "ai",
    badge: "Toán ứng dụng CNTT",
    tag: "Python & Matrix",
    icon: "image",
    isPinned: true, // Ghim 2
    shortDesc: "Áp dụng đại số tuyến tính và phép toán ma trận để phân tích, biến đổi hình học và xử lý ảnh số không dùng thư viện xử lý ảnh có sẵn.",
    problem: "Hiểu rõ cơ chế bản chất của ảnh số (Digital Image) dưới dạng Tensor dữ liệu đa chiều, thay vì chỉ sử dụng các hàm có sẵn của OpenCV. Cần tự xây dựng các thuật toán biến đổi hình học và lọc ma trận từ đầu.",
    role: "Lập trình các phép biến đổi ảnh: Phép quay không gian (Rotation matrix), phép co giãn (Scaling), biến đổi tương phản Affine và thiết kế nhân tích chập (Convolution Kernel) để lọc làm mịn hoặc tách biên (Edge detection).",
    techDetails: "Toàn bộ thuật toán được hiện thực bằng Python thuần kết hợp NumPy để xử lý vector hóa dữ liệu ma trận ảnh 2D/3D. Đây là nền tảng toán học nền móng cho Computer Vision và mạng nơ-ron tích chập (CNN).",
    techStack: ["Linear Algebra", "Matrix Convolution", "Tensor", "Python", "NumPy"],
    githubUrl: "https://github.com",
    demoUrl: ""
  },
  {
    id: "proj-3",
    title: "App Mobile Hỗ Trợ Du Lịch",
    category: "software",
    badge: "Tư duy tính toán",
    tag: "Dart Mobile App",
    icon: "smartphone",
    isPinned: true, // Ghim 3 (Đủ tối đa 3 dự án)
    shortDesc: "Ứng dụng di động giúp gợi ý lộ trình tham quan, tra cứu địa điểm và tiện ích cho người du lịch với giao diện trực quan.",
    problem: "Khách du lịch thường mất nhiều thời gian tra cứu phân tán thông tin địa điểm, khó khăn trong việc sắp xếp lộ trình tham quan hợp lý và cần một ứng dụng di động có trải nghiệm mượt mà, thân thiện.",
    role: "Đảm nhận toàn bộ phần xây dựng giao diện người dùng (Frontend) trên nền tảng Dart: thiết kế UI responsive, kiến trúc component tái sử dụng, tối ưu luồng điều hướng màn hình và xử lý trạng thái hiển thị.",
    techDetails: "Sử dụng ngôn ngữ Dart, áp dụng tư duy tính toán (Computational Thinking) để chia nhỏ bài toán hiển thị dữ liệu du lịch dạng danh sách và thẻ trực quan. Tích hợp xử lý tương tác chạm, bộ lọc địa điểm theo bán kính.",
    techStack: ["Dart", "Mobile UI", "Component Architecture", "UX Flow"],
    githubUrl: "https://github.com",
    demoUrl: ""
  },
  {
    id: "proj-4",
    title: "Hệ Thống Truyền Video Qua Giao Thức Mạng",
    category: "system",
    badge: "Mạng máy tính",
    tag: "Networking & Socket",
    icon: "video",
    isPinned: false,
    shortDesc: "Mô phỏng cơ chế đóng gói, truyền tải và đồng bộ luồng video qua các tầng giao thức mạng thời gian thực.",
    problem: "Truyền tải video qua mạng đòi hỏi xử lý bài toán băng thông, kiểm soát độ trễ (Latency) và mất gói tin (Packet loss). Cần so sánh ưu nhược điểm giữa giao thức tin cậy TCP và giao thức thời gian thực UDP.",
    role: "Lập trình socket truyền nhận các khối dữ liệu hình ảnh/video giữa Client và Server, đo đạc thông lượng mạng (Throughput) và phân tích ảnh hưởng của nghẽn mạng đến chất lượng phát video.",
    techDetails: "Ứng dụng Socket Programming, phân tích mô hình OSI và bộ giao thức TCP/IP. Xây dựng bộ đệm (Buffer) tại phía Client để giảm hiện tượng giật khung hình khi mạng dao động.",
    techStack: ["Socket Programming", "TCP/IP", "UDP Streaming", "Network Protocols"],
    githubUrl: "https://github.com",
    demoUrl: ""
  },
  {
    id: "proj-5",
    title: "Thiết Kế Mạch Arduino & Mô Hình 3D",
    category: "system",
    badge: "Vật lý cho CNTT",
    tag: "IoT & Hardware",
    icon: "circuit-board",
    isPinned: false,
    shortDesc: "Thiết kế vỏ phần cứng 3D bằng Fusion 360, lập trình vi điều khiển Arduino đọc cảm biến và truyền dữ liệu qua MQTT.",
    problem: "Kết nối thế giới vật lý với hệ thống phần mềm: Cần tạo ra một thiết bị phần cứng hoàn chỉnh có vỏ bảo vệ chuẩn kích thước, đọc tín hiệu cảm biến thời gian thực và gửi về máy chủ.",
    role: "Thiết kế mô hình vỏ hộp 3D bằng phần mềm Autodesk Fusion 360, lắp ráp mạch điện tử với Arduino, lập trình đọc dữ liệu cảm biến và gửi gói tin qua giao thức MQTT.",
    techDetails: "Lập trình C/C++ nhúng trên Arduino, sử dụng giao thức nhẹ MQTT phù hợp cho thiết bị IoT băng thông thấp. Nắm vững nền tảng để triển khai mô hình Edge AI (AI trên thiết bị biên) trong tương lai.",
    techStack: ["Arduino C++", "Autodesk Fusion 360", "MQTT Protocol", "IoT Hardware"],
    githubUrl: "https://github.com",
    demoUrl: ""
  },
  {
    id: "proj-6",
    title: "Mô Phỏng Game Bài Poker Bằng C++",
    category: "software",
    badge: "Cơ sở lập trình",
    tag: "C++ Algorithm",
    icon: "gamepad-2",
    isPinned: false,
    shortDesc: "Xây dựng trò chơi bài Poker hoàn chỉnh bằng C++ với thuật toán xáo bài ngẫu nhiên và phân loại sức mạnh lá bài.",
    problem: "Cần xử lý logic so sánh xếp hạng các bộ bài (Straight Flush, Four of a Kind, Full House, Flush...) với hàng chục tổ hợp điều kiện phức tạp của luật chơi Poker quốc tế.",
    role: "Xây dựng toàn bộ kiến trúc giải thuật: Thuật toán xáo bài Fisher-Yates, cấu trúc dữ liệu lưu trữ lá bài và hàm đánh giá điểm số của từng bộ bài để xác định người chiến thắng tự động.",
    techDetails: "Ứng dụng C++ hướng đối tượng (OOP), quản lý bộ nhớ con trỏ chặt chẽ, mảng 2 chiều và cấu trúc struct/class. Rèn luyện tư duy thuật toán và kỹ năng lập trình không lỗi logic.",
    techStack: ["C++", "OOP", "Algorithm", "Game Logic"],
    githubUrl: "https://github.com",
    demoUrl: ""
  }
];

// Hash SHA-256 mặc định của mã PIN "1234"
const DEFAULT_PIN_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

// 2. Hàm khởi tạo cấu trúc bảng trên Supabase nếu chưa có
async function initDatabase() {
  if (!pool) return;
  try {
    console.log("⏳ Đang kết nối tới Supabase PostgreSQL...");
    const client = await pool.connect();
    try {
      // Tạo bảng projects
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id VARCHAR(100) PRIMARY KEY,
          title TEXT NOT NULL,
          category VARCHAR(50) NOT NULL,
          badge VARCHAR(100),
          tag VARCHAR(100),
          icon VARCHAR(50),
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

        CREATE TABLE IF NOT EXISTS app_config (
          key VARCHAR(100) PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);

      // Kiểm tra và khởi tạo mã băm admin PIN
      const pinRes = await client.query("SELECT value FROM app_config WHERE key = 'admin_pin_hash'");
      if (pinRes.rows.length === 0) {
        await client.query(
          "INSERT INTO app_config (key, value) VALUES ('admin_pin_hash', $1)",
          [DEFAULT_PIN_HASH]
        );
        console.log("✓ Đã khởi tạo mã băm PIN admin mặc định (1234) trong Supabase.");
      }

      // Kiểm tra và nạp dữ liệu ban đầu nếu bảng projects trống
      const countRes = await client.query("SELECT COUNT(*) FROM projects");
      const currentCount = parseInt(countRes.rows[0].count, 10);
      if (currentCount === 0) {
        console.log("🌱 Bảng projects trống, đang seed 6 dự án gốc của Huỳnh Thái Hoà vào Supabase...");
        for (const p of DEFAULT_PROJECTS) {
          await client.query(
            `INSERT INTO projects (
              id, title, category, badge, tag, icon, is_pinned,
              short_desc, problem, role, tech_details, tech_stack, github_url, demo_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
              p.id, p.title, p.category, p.badge, p.tag, p.icon, !!p.isPinned,
              p.shortDesc, p.problem, p.role, p.techDetails, JSON.stringify(p.techStack || []),
              p.githubUrl, p.demoUrl
            ]
          );
        }
        console.log(`✓ Đã nạp thành công ${DEFAULT_PROJECTS.length} dự án vào Supabase.`);
      }

      console.log("🚀 SẴN SÀNG! Đã kết nối và đồng bộ hoàn tất với Supabase.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Không thể kết nối tới Supabase:", err.message);
  }
}

// Chuyển đổi bản ghi DB sang định dạng camelCase cho Client JS
function mapProjectRow(row) {
  let stack = [];
  try {
    stack = typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : (row.tech_stack || []);
  } catch (e) {
    stack = [];
  }

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    badge: row.badge,
    tag: row.tag,
    icon: row.icon,
    isPinned: !!row.is_pinned,
    shortDesc: row.short_desc,
    problem: row.problem,
    role: row.role,
    techDetails: row.tech_details,
    techStack: stack,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    createdAt: row.created_at
  };
}

// ==================== REST APIS ====================

// Trạng thái server & kết nối database
app.get('/api/status', async (req, res) => {
  res.json({
    status: 'online',
    hasDatabaseUrl: !!databaseUrl,
    connectedToSupabase: !!pool
  });
});

// Lấy toàn bộ danh sách dự án từ Supabase
app.get('/api/projects', async (req, res) => {
  if (!pool) {
    return res.json({ success: true, source: 'fallback', data: DEFAULT_PROJECTS });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY is_pinned DESC, created_at DESC"
    );
    const projects = result.rows.map(mapProjectRow);
    res.json({ success: true, source: 'supabase', data: projects });
  } catch (err) {
    console.error("Lỗi đọc danh sách dự án:", err);
    res.status(500).json({ success: false, error: err.message, data: DEFAULT_PROJECTS });
  }
});

// Thêm dự án mới vào Supabase
app.post('/api/projects', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Chưa cấu hình DATABASE_URL' });

  const {
    id, title, category, badge, tag, icon, isPinned,
    shortDesc, problem, role, techDetails, techStack, githubUrl, demoUrl
  } = req.body;

  try {
    // Kiểm tra giới hạn 3 pin
    if (isPinned) {
      const pinCountRes = await pool.query("SELECT COUNT(*) FROM projects WHERE is_pinned = true");
      if (parseInt(pinCountRes.rows[0].count, 10) >= 3) {
        return res.status(400).json({ error: "Chỉ được ghim tối đa 3 dự án nổi bật nhất cùng lúc!" });
      }
    }

    const newId = id || `proj-${Date.now()}`;
    await pool.query(
      `INSERT INTO projects (
        id, title, category, badge, tag, icon, is_pinned,
        short_desc, problem, role, tech_details, tech_stack, github_url, demo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        newId, title, category || 'ai', badge || '', tag || '', icon || 'folder', !!isPinned,
        shortDesc || '', problem || '', role || '', techDetails || '',
        JSON.stringify(techStack || []), githubUrl || '', demoUrl || ''
      ]
    );

    res.json({ success: true, id: newId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật dự án
app.put('/api/projects/:id', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Chưa cấu hình DATABASE_URL' });

  const projId = req.params.id;
  const {
    title, category, badge, tag, icon, isPinned,
    shortDesc, problem, role, techDetails, techStack, githubUrl, demoUrl
  } = req.body;

  try {
    // Nếu muốn chuyển sang pinned, kiểm tra xem đã đủ 3 dự án chưa
    if (isPinned) {
      const checkRes = await pool.query(
        "SELECT COUNT(*) FROM projects WHERE is_pinned = true AND id != $1",
        [projId]
      );
      if (parseInt(checkRes.rows[0].count, 10) >= 3) {
        return res.status(400).json({ error: "Chỉ được ghim tối đa 3 dự án nổi bật nhất cùng lúc!" });
      }
    }

    await pool.query(
      `UPDATE projects SET
        title = $1, category = $2, badge = $3, tag = $4, icon = $5, is_pinned = $6,
        short_desc = $7, problem = $8, role = $9, tech_details = $10,
        tech_stack = $11, github_url = $12, demo_url = $13
       WHERE id = $14`,
      [
        title, category, badge, tag, icon || 'folder', !!isPinned,
        shortDesc, problem, role, techDetails,
        JSON.stringify(techStack || []), githubUrl, demoUrl,
        projId
      ]
    );

    res.json({ success: true, id: projId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bật / Tắt PIN (Tối đa 3 dự án)
app.put('/api/projects/:id/pin', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Chưa cấu hình DATABASE_URL' });

  const projId = req.params.id;
  try {
    const currentRes = await pool.query("SELECT is_pinned FROM projects WHERE id = $1", [projId]);
    if (currentRes.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy dự án" });
    }

    const currentlyPinned = currentRes.rows[0].is_pinned;
    const targetState = !currentlyPinned;

    if (targetState === true) {
      // Đang muốn ghim -> kiểm tra số lượng
      const countRes = await pool.query("SELECT COUNT(*) FROM projects WHERE is_pinned = true");
      const currentPinnedCount = parseInt(countRes.rows[0].count, 10);
      if (currentPinnedCount >= 3) {
        return res.status(400).json({
          error: "Bạn chỉ có thể ghim tối đa 3 dự án nổi bật nhất! Hãy bỏ ghim 1 dự án khác trước khi ghim thêm."
        });
      }
    }

    await pool.query("UPDATE projects SET is_pinned = $1 WHERE id = $2", [targetState, projId]);
    res.json({ success: true, id: projId, isPinned: targetState });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa dự án
app.delete('/api/projects/:id', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Chưa cấu hình DATABASE_URL' });

  const projId = req.params.id;
  try {
    await pool.query("DELETE FROM projects WHERE id = $1", [projId]);
    res.json({ success: true, id: projId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khôi phục dự án gốc HCMUS trên Supabase
app.post('/api/projects/reset', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Chưa cấu hình DATABASE_URL' });

  try {
    await pool.query("TRUNCATE TABLE projects");
    for (const p of DEFAULT_PROJECTS) {
      await pool.query(
        `INSERT INTO projects (
          id, title, category, badge, tag, icon, is_pinned,
          short_desc, problem, role, tech_details, tech_stack, github_url, demo_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          p.id, p.title, p.category, p.badge, p.tag, p.icon, !!p.isPinned,
          p.shortDesc, p.problem, p.role, p.techDetails, JSON.stringify(p.techStack || []),
          p.githubUrl, p.demoUrl
        ]
      );
    }
    res.json({ success: true, message: "Đã khôi phục danh sách dự án mặc định thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ADMIN PIN HASH APIs (LƯU & THAY ĐỔI MÃ BĂM) ====================

// Lấy mã băm PIN hiện tại từ Supabase
app.get('/api/admin/pin-hash', async (req, res) => {
  if (!pool) {
    return res.json({ hash: DEFAULT_PIN_HASH });
  }
  try {
    const result = await pool.query("SELECT value FROM app_config WHERE key = 'admin_pin_hash'");
    if (result.rows.length > 0) {
      return res.json({ hash: result.rows[0].value });
    }
    res.json({ hash: DEFAULT_PIN_HASH });
  } catch (err) {
    res.json({ hash: DEFAULT_PIN_HASH });
  }
});

// Đổi mã băm PIN lưu trên Supabase
app.put('/api/admin/pin-hash', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Chưa cấu hình DATABASE_URL' });

  const { oldHash, newHash } = req.body;
  if (!newHash) return res.status(400).json({ error: 'Mã băm mới không hợp lệ' });

  try {
    const curRes = await pool.query("SELECT value FROM app_config WHERE key = 'admin_pin_hash'");
    const currentStoredHash = curRes.rows.length > 0 ? curRes.rows[0].value : DEFAULT_PIN_HASH;

    if (oldHash !== currentStoredHash) {
      return res.status(403).json({ error: 'Mã PIN hiện tại không chính xác!' });
    }

    await pool.query(
      "INSERT INTO app_config (key, value) VALUES ('admin_pin_hash', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [newHash]
    );

    res.json({ success: true, message: 'Đã cập nhật mã băm PIN bảo mật trên Supabase thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mọi route khác điều hướng về index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Khởi chạy Server
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🌐 Portfolio Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`======================================================`);
  await initDatabase();
});
