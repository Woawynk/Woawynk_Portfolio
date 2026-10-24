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

// Danh sách dự án khởi tạo mặc định chuẩn hóa 100% khớp với CV của Huỳnh Thái Hoà
const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "AI Arena Vietnam 2026 - \"Audition: Viet Phuc Remix\"",
    category: "ai",
    badge: "AI Arena 2026 · Điểm: 86.75",
    tag: "AI & Supabase",
    icon: "sparkles",
    isPinned: true, // Ghim 1 (Top 1 CV)
    shortDesc: "Ứng dụng AI hướng tới Gen-Z giúp khám phá và cách điệu trang phục cổ phong Việt Nam theo bối cảnh sự kiện và phong cách cá nhân.",
    problem: "Người trẻ yêu thích trang phục truyền thống Việt Nam nhưng gặp rào cản trong việc tra cứu ngữ cảnh văn hóa, cách phối đồ phù hợp với từng dịp lễ hội hoặc phong cách hiện đại. Cần một giải pháp AI trực quan, tương tác nhanh và đảm bảo tính chính xác về văn hóa.",
    role: "AI Backend Developer & Database Engineer: Thiết kế kiến trúc Cơ sở dữ liệu cốt lõi trên Supabase (PostgreSQL) để lưu trữ hiệu quả ngữ cảnh văn hóa và hồ sơ người dùng. Xây dựng dịch vụ backend và áp dụng framework Prompt 5 bước (5-step structured prompt) giúp tối đa hóa độ chính xác, tính nhất quán và khả năng thích ứng ngữ cảnh của LLM.",
    techDetails: "Tích hợp mô hình ngôn ngữ lớn (LLM Integration) qua Google AI Studio API, xây dựng backend service bằng Python / Node.js, thiết kế cơ sở dữ liệu quan hệ với Supabase (PostgreSQL), tối ưu kỹ thuật Prompt Engineering nâng cao. Dự án đạt điểm số chính thức 86.75/100 từ Hội đồng Giám khảo Quốc gia.",
    techStack: ["Python", "Node.js", "Supabase (PostgreSQL)", "Prompt Engineering", "LLM Integration", "Google AI Studio"],
    githubUrl: "https://github.com/woawynk",
    demoUrl: ""
  },
  {
    id: "proj-2",
    title: "RescueRoute – Emergency Vehicle Routing",
    category: "ai",
    badge: "Đồ án Cơ sở AI (HCMUS)",
    tag: "Dijkstra & Genetic",
    icon: "navigation",
    isPinned: true, // Ghim 2 (Top 2 CV)
    shortDesc: "Ứng dụng web định tuyến tìm lộ trình di chuyển tối ưu cho xe cấp cứu trong điều kiện giao thông đô thị biến thiên.",
    problem: "Trong các đô thị lớn, xe cấp cứu thường xuyên đối mặt với tình trạng tắc đường, đèn tín hiệu và rào cản bất ngờ. Thuật toán tìm đường thông thường chỉ tính khoảng cách hình học ngắn nhất mà bỏ qua yếu tố thời gian thực và mật độ lưu thông.",
    role: "Algorithm & Software Engineer: Trực tiếp hiện thực hóa 2 giải thuật tìm đường Dijkstra và Genetic Algorithm (Giải thuật di truyền). Thiết kế hàm chi phí tùy biến (Custom Cost Function) kết hợp các chỉ số thực tế để cân bằng tối ưu giữa tốc độ thực thi và độ tối ưu của cung đường. Xây dựng framework tự động đo lường hiệu năng (Automated Benchmarking).",
    techDetails: "Lập trình thuật toán bằng Python, xây dựng giao diện ứng dụng web tương tác, mô hình hóa ma trận trọng số chi phí đồ thị giao thông. Thiết lập hệ thống benchmark tự động để so sánh và đánh giá hiệu năng thuật toán trong nhiều kịch bản nghẽn mạng khác nhau.",
    techStack: ["Python", "Web Development", "Dijkstra's Algorithm", "Genetic Algorithm", "Benchmarking"],
    githubUrl: "https://github.com/woawynk",
    demoUrl: ""
  },
  {
    id: "proj-3",
    title: "Smart File Organizer",
    category: "software",
    badge: "Personal Project",
    tag: "Python Automation",
    icon: "folder-archive",
    isPinned: true, // Ghim 3 (Top 3 CV)
    shortDesc: "Công cụ Desktop tự động phân loại, sắp xếp và tối ưu hóa tệp tin hệ thống theo cấu trúc thư mục và định dạng mở rộng.",
    problem: "Thư mục công việc và tải về trên máy tính thường xuyên bị quá tải, lộn xộn sau thời gian dài sử dụng, gây mất thời gian tra cứu và giảm hiệu suất làm việc hàng ngày của lập trình viên.",
    role: "Solo Developer: Thiết kế và phát triển toàn bộ công cụ tự động hóa desktop bằng Python. Xử lý các thao tác hệ thống tệp tin cấp hệ điều hành (di chuyển, đổi tên, phân luồng theo đuôi file và cây thư mục) một cách an toàn và sạch sẽ, giúp tự động hóa các tác vụ lặp lại và nâng cao hiệu quả làm việc.",
    techDetails: "Sử dụng Python Scripting và các module hệ điều hành (OS File System Operations, Pathlib, Shutil). Xử lý an toàn các ngoại lệ về xung đột tên file, quyền truy cập tệp và tối ưu tốc độ quét dữ liệu dung lượng lớn.",
    techStack: ["Python", "OS File System Operations", "Scripting", "Automation"],
    githubUrl: "https://github.com/woawynk",
    demoUrl: ""
  },
  {
    id: "proj-4",
    title: "Xử Lý & Biến Đổi Ảnh Bằng Ma Trận",
    category: "ai",
    badge: "Toán ứng dụng CNTT (HCMUS)",
    tag: "Python & Matrix",
    icon: "image",
    isPinned: false,
    shortDesc: "Áp dụng đại số tuyến tính và phép toán ma trận để phân tích, biến đổi hình học và xử lý ảnh số không dùng thư viện xử lý ảnh có sẵn.",
    problem: "Hiểu rõ cơ chế bản chất của ảnh số (Digital Image) dưới dạng Tensor dữ liệu đa chiều, thay vì chỉ sử dụng các hàm có sẵn của OpenCV. Cần tự xây dựng các thuật toán biến đổi hình học và lọc ma trận từ đầu.",
    role: "Lập trình các phép biến đổi ảnh: Phép quay không gian (Rotation matrix), phép co giãn (Scaling), biến đổi tương phản Affine và thiết kế nhân tích chập (Convolution Kernel) để lọc làm mịn hoặc tách biên (Edge detection).",
    techDetails: "Toàn bộ thuật toán được hiện thực bằng Python thuần kết hợp NumPy để xử lý vector hóa dữ liệu ma trận ảnh 2D/3D. Đây là nền tảng toán học nền móng cho Computer Vision và mạng nơ-ron tích chập (CNN).",
    techStack: ["Linear Algebra", "Matrix Convolution", "Tensor", "Python", "NumPy"],
    githubUrl: "https://github.com/woawynk",
    demoUrl: ""
  },
  {
    id: "proj-5",
    title: "Mô Phỏng Game Bài Poker Bằng C++",
    category: "software",
    badge: "Cơ sở lập trình (HCMUS)",
    tag: "C++ OOP & Logic",
    icon: "gamepad-2",
    isPinned: false,
    shortDesc: "Xây dựng trò chơi bài Poker hoàn chỉnh bằng C++ với thuật toán xáo bài ngẫu nhiên và phân loại sức mạnh lá bài.",
    problem: "Cần xử lý logic so sánh xếp hạng các bộ bài (Straight Flush, Four of a Kind, Full House, Flush...) với hàng chục tổ hợp điều kiện phức tạp của luật chơi Poker quốc tế.",
    role: "Xây dựng toàn bộ kiến trúc giải thuật: Thuật toán xáo bài Fisher-Yates, cấu trúc dữ liệu lưu trữ lá bài và hàm đánh giá điểm số của từng bộ bài để xác định người chiến thắng tự động.",
    techDetails: "Ứng dụng C++ hướng đối tượng (OOP), quản lý bộ nhớ con trỏ chặt chẽ, mảng 2 chiều và cấu trúc struct/class. Rèn luyện tư duy thuật toán và kỹ năng lập trình không lỗi logic.",
    techStack: ["C++", "OOP", "Algorithm", "Game Logic"],
    githubUrl: "https://github.com/woawynk",
    demoUrl: ""
  },
  {
    id: "proj-6",
    title: "Thiết Kế Mạch Arduino & Mô Hình 3D",
    category: "system",
    badge: "Vật lý cho CNTT (HCMUS)",
    tag: "IoT & Hardware",
    icon: "circuit-board",
    isPinned: false,
    shortDesc: "Thiết kế vỏ phần cứng 3D bằng Fusion 360, lập trình vi điều khiển Arduino đọc cảm biến và truyền dữ liệu qua MQTT.",
    problem: "Kết nối thế giới vật lý với hệ thống phần mềm: Cần tạo ra một thiết bị phần cứng hoàn chỉnh có vỏ bảo vệ chuẩn kích thước, đọc tín hiệu cảm biến thời gian thực và gửi về máy chủ.",
    role: "Thiết kế mô hình vỏ hộp 3D bằng phần mềm Autodesk Fusion 360, lắp ráp mạch điện tử với Arduino, lập trình đọc dữ liệu cảm biến và gửi gói tin qua giao thức MQTT.",
    techDetails: "Lập trình C/C++ nhúng trên Arduino, sử dụng giao thức nhẹ MQTT phù hợp cho thiết bị IoT băng thông thấp. Nắm vững nền tảng để triển khai mô hình Edge AI trong tương lai.",
    techStack: ["Arduino C++", "Autodesk Fusion 360", "MQTT Protocol", "IoT Hardware"],
    githubUrl: "https://github.com/woawynk",
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
