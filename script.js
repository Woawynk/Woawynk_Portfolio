/**
 * ==========================================================================
 * SCRIPT ĐIỀU KHIỂN PORTFOLIO - HUỲNH THÁI HOÀ (HCMUS - AI ENGINEER)
 * 1. Phân trang SPA gọn gàng (Tổng quan & Hồ sơ, Dự án & Đồ án, Liên hệ)
 * 2. Trang dự án tối giản: Card compact sạch sẽ, click mở 3 mục chi tiết (Modal 3 tabs: Bài toán, Vai trò, Kỹ thuật)
 * 3. TÍNH NĂNG PIN DỰ ÁN (Tối đa 3 dự án nổi bật nhất được ghim lên đầu)
 * 4. HỆ THỐNG 2 CHẾ ĐỘ: HR VIEW (Khách xem) vs ADMIN / CREATOR VIEW (Quản lý dự án)
 * 5. Quản lý dự án động với LocalStorage & Xuất / Nhập JSON
 * 6. Bộ lọc danh mục dự án
 * 7. Interactive Developer CLI Terminal (whoami, projects, cert, admin, v.v.)
 * ==========================================================================
 */

// ==================== CẤU HÌNH SUPABASE CHO GITHUB PAGES ====================
// Điền thông tin dự án Supabase của bạn tại đây để web chạy trực tiếp trên GitHub Pages.
// Lấy trong Supabase Dashboard -> Project Settings -> API:
const SUPABASE_URL = "https://kmmtohjsmnondasrnbog.supabase.co"; // Thay bằng Project URL của bạn
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbXRvaGpzbW5vbmRhc3JuYm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTQ4MDYsImV4cCI6MjEwODQzMDgwNn0.Jb90K8Lx_9MRhgaHhB0Dm5XXOIVeZyzegEGqqQCS7Co"; // Thay bằng Anon / Public API Key của bạn

// Khởi tạo Supabase Client (sử dụng thư viện Supabase JS SDK từ CDN)
let supabaseClient = null;
if (window.supabase && SUPABASE_URL && !SUPABASE_URL.includes("your-project") && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "your-anon-key") {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✓ Đã kết nối Supabase Client SDK thành công!");
  } catch (e) {
    console.warn("Lỗi khởi tạo Supabase Client:", e);
  }
}

// Danh sách dự án mặc định chuẩn hóa 100% khớp với CV của Huỳnh Thái Hoà
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

// Khởi tạo State
let projectsData = [];
let currentMode = "hr"; // "hr" hoặc "admin"
let activeCategoryFilter = "all";

// Lấy dữ liệu từ localStorage
function loadProjectsFromStorage() {
  const saved = localStorage.getItem("thaihoa_portfolio_projects");
  if (saved) {
    try {
      projectsData = JSON.parse(saved);
    } catch (e) {
      projectsData = [...DEFAULT_PROJECTS];
    }
  } else {
    projectsData = [...DEFAULT_PROJECTS];
    saveProjectsToStorage();
  }
}

// Lưu dữ liệu vào localStorage
function saveProjectsToStorage() {
  localStorage.setItem("thaihoa_portfolio_projects", JSON.stringify(projectsData));
}

// ==================== BẢO MẬT MÃ BĂM (SHA-256 HASH) ====================
// Hash mặc định của mã PIN "1234"
const DEFAULT_PIN_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

// Thuật toán pure JS SHA-256 dự phòng đảm bảo chạy trên mọi môi trường
function pureSha256(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow; const maxWord = mathPow(2, 32); const lengthProperty = 'length';
  let i, j; const words = []; const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = []; const k = []; let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 = hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
      const temp2 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  let res = '';
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      res += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return res;
}

// Hàm băm chuỗi thành SHA-256 (ưu tiên Web Crypto API, fallback sang pure JS)
async function hashString(str) {
  if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
    try {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback nếu có lỗi context
    }
  }
  return pureSha256(str);
}

// Chuyển đổi dữ liệu từ Supabase PostgreSQL (snake_case) sang camelCase cho Client
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
    icon: row.icon || 'folder-code',
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

// Lấy mã băm PIN từ Supabase SDK (trên GitHub Pages), backend API (localhost), hoặc localStorage
async function getStoredAdminHash() {
  // 1. Thử qua Supabase Client SDK trực tiếp (dành cho GitHub Pages)
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('app_config')
        .select('value')
        .eq('key', 'admin_pin_hash')
        .maybeSingle();
      if (!error && data && data.value) {
        localStorage.setItem("thaihoa_admin_hash", data.value);
        return data.value;
      }
    } catch (e) {
      console.warn("Lỗi đọc PIN từ Supabase SDK:", e);
    }
  }

  // 2. Thử qua backend API (nếu có server chạy)
  try {
    const res = await fetch('/api/admin/pin-hash');
    if (res.ok) {
      const data = await res.json();
      if (data && data.hash) {
        localStorage.setItem("thaihoa_admin_hash", data.hash);
        return data.hash;
      }
    }
  } catch (e) {
    // Offline hoặc static host
  }

  const storedHash = localStorage.getItem("thaihoa_admin_hash");
  if (storedHash) return storedHash;

  // Hỗ trợ tự động migrate từ key plain text cũ nếu có
  const oldPlainPin = localStorage.getItem("thaihoa_admin_pin");
  if (oldPlainPin) {
    const migratedHash = pureSha256(oldPlainPin);
    localStorage.setItem("thaihoa_admin_hash", migratedHash);
    localStorage.removeItem("thaihoa_admin_pin");
    return migratedHash;
  }

  return DEFAULT_PIN_HASH;
}

// Kiểm tra mã PIN nhập vào có khớp với mã băm đã lưu không
async function verifyAdminPIN(inputPin) {
  if (!inputPin) return false;
  const inputHash = await hashString(inputPin.trim());
  const storedHash = await getStoredAdminHash();
  return inputHash === storedHash;
}

// Hàm đổi mã PIN ngay trên giao diện: băm và lưu vào Supabase + localStorage
window.changeAdminPIN = async function() {
  const oldInput = prompt("Xác thực: Nhập mã PIN hiện tại của bạn:");
  if (oldInput === null) return;
  
  const isOldValid = await verifyAdminPIN(oldInput);
  if (!isOldValid) {
    alert("Mã PIN hiện tại không chính xác! Yêu cầu đổi mã bị từ chối.");
    return;
  }

  const newPin = prompt("Nhập mã PIN mới mong muốn (ví dụ: 8888):");
  if (!newPin || newPin.trim() === "") {
    alert("Mã PIN mới không được để trống!");
    return;
  }

  const oldHash = await hashString(oldInput.trim());
  const newHash = await hashString(newPin.trim());

  // 1. Thử lưu qua Supabase Client SDK trực tiếp (GitHub Pages)
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('app_config')
        .upsert({ key: 'admin_pin_hash', value: newHash });
      if (!error) {
        localStorage.setItem("thaihoa_admin_hash", newHash);
        alert("✓ Đã đổi mã PIN thành công! Mã băm SHA-256 mới đã được lưu trực tiếp trên Supabase (GitHub Pages).");
        return;
      }
    } catch (e) {
      console.warn("Lỗi lưu Supabase SDK:", e);
    }
  }

  // 2. Thử đồng bộ lên Supabase qua backend API
  try {
    const res = await fetch('/api/admin/pin-hash', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldHash, newHash })
    });
    if (res.ok) {
      localStorage.setItem("thaihoa_admin_hash", newHash);
      alert("✓ Đã đổi mã PIN thành công! Mã băm SHA-256 mới đã được đồng bộ lên Supabase qua API.");
      return;
    }
  } catch (e) {
    console.warn("Backend offline, cập nhật local:", e);
  }

  localStorage.setItem("thaihoa_admin_hash", newHash);
  localStorage.removeItem("thaihoa_admin_pin");
  alert("✓ Đã đổi mã PIN thành công! Hệ thống đã mã hóa và lưu mã băm SHA-256 an toàn.");
};

document.addEventListener('DOMContentLoaded', () => {
  // Nạp dữ liệu offline trước để giao diện hiển thị ngay lập tức
  loadProjectsFromStorage();

  // Đồng bộ dữ liệu động từ Supabase (Hỗ trợ cả GitHub Pages và Local Server)
  async function loadProjectsFromSupabase() {
    // 1. Thử tải trực tiếp bằng Supabase JS SDK (dành cho GitHub Pages)
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('projects')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          projectsData = data.map(mapProjectRow);
          saveProjectsToStorage();
          renderProjects();
          const badge = document.getElementById('dbSyncBadge');
          if (badge) {
            badge.innerHTML = `
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Supabase Live (${projectsData.length} dự án)</span>
            `;
          }
          return;
        }
      } catch (e) {
        console.warn("Lỗi kết nối Supabase SDK:", e);
      }
    }

    // 2. Thử tải qua Backend API (khi chạy localhost hoặc Node server)
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          projectsData = json.data;
          saveProjectsToStorage();
          renderProjects();
          const badge = document.getElementById('dbSyncBadge');
          if (badge) {
            badge.innerHTML = `
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Supabase Cloud (${projectsData.length} dự án)</span>
            `;
          }
          return;
        }
      }
    } catch (e) {
      console.log("Đang chạy chế độ local cache:", e.message);
    }
  }
  loadProjectsFromSupabase();

  // Khởi tạo Icons Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. LOGIC PHÂN TRANG SPA
  const navLinks = document.querySelectorAll('.nav-page-btn');
  const pageSections = document.querySelectorAll('.page-section');
  const mobileMenu = document.getElementById('mobileMenu');

  function navigateToPage(pageId) {
    if (!pageId) pageId = 'hero';

    pageSections.forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(pageId);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
      const linkTarget = link.getAttribute('data-target');
      if (linkTarget === pageId) {
        link.classList.add('text-white', 'bg-[#181D26]', 'border-[#2B3545]');
        link.classList.remove('text-slate-400', 'border-transparent');
      } else {
        link.classList.remove('text-white', 'bg-[#181D26]', 'border-[#2B3545]');
        link.classList.add('text-slate-400', 'border-transparent');
      }
    });

    history.pushState(null, null, `#${pageId}`);

    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  }

  navLinks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = btn.getAttribute('data-target');
      navigateToPage(targetPage);
    });
  });

  const pageJumpBtns = document.querySelectorAll('.page-jump-btn');
  pageJumpBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = btn.getAttribute('data-target');
      navigateToPage(targetPage);
    });
  });

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    navigateToPage(initialHash);
  } else {
    navigateToPage('hero');
  }

  window.addEventListener('popstate', () => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && document.getElementById(currentHash)) {
      navigateToPage(currentHash);
    } else {
      navigateToPage('hero');
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. LOGIC PIN / UNPIN DỰ ÁN (TỐI ĐA 3 DỰ ÁN CÙNG LÚC)
  window.togglePinProject = async function(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;

    if (!proj.isPinned) {
      // Đang muốn ghim -> kiểm tra xem đã đủ 3 dự án chưa
      const currentPinnedCount = projectsData.filter(p => p.isPinned).length;
      if (currentPinnedCount >= 3) {
        alert("Bạn chỉ có thể ghim (Pin) tối đa 3 dự án nổi bật nhất vào Khung Tiêu Điểm! Hãy bỏ ghim 1 dự án khác trước khi ghim thêm.");
        return;
      }
    }

    const targetState = !proj.isPinned;

    // 1. Thử qua Supabase Client SDK trực tiếp (dành cho GitHub Pages)
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('projects')
          .update({ is_pinned: targetState })
          .eq('id', id);
        if (error) {
          alert("Lỗi khi cập nhật trên Supabase: " + error.message);
          return;
        }
        proj.isPinned = targetState;
        saveProjectsToStorage();
        renderProjects();
        return;
      } catch (e) {
        console.warn("Lỗi Supabase SDK:", e);
      }
    }

    // 2. Thử qua Backend API (nếu có server chạy)
    try {
      const res = await fetch(`/api/projects/${id}/pin`, { method: 'PUT' });
      if (res.ok) {
        const json = await res.json();
        proj.isPinned = json.isPinned;
        saveProjectsToStorage();
        renderProjects();
        return;
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi khi cập nhật trạng thái ghim trên Supabase!");
        return;
      }
    } catch (e) {
      // Fallback local
      proj.isPinned = targetState;
      saveProjectsToStorage();
      renderProjects();
    }
  };

  // 3. RENDER DANH SÁCH DỰ ÁN (KHUNG RIÊNG TOP 3 PINNED & TOÀN BỘ DANH MỤC)
  const projectsGrid = document.getElementById('projectsGrid');
  const pinnedShowcaseGrid = document.getElementById('pinnedShowcaseGrid');
  const pinnedCountText = document.getElementById('pinnedCountText');

  function renderProjects() {
    // 3.1 RENDER KHUNG RIÊNG: TOP 3 DỰ ÁN ĐƯỢC GHIM (PINNED SPOTLIGHT SHOWCASE)
    const pinnedProjects = projectsData.filter(p => p.isPinned);
    if (pinnedCountText) {
      pinnedCountText.textContent = `${pinnedProjects.length}/3`;
    }

    if (pinnedShowcaseGrid) {
      pinnedShowcaseGrid.innerHTML = '';
      if (pinnedProjects.length === 0) {
        pinnedShowcaseGrid.innerHTML = `
          <div class="col-span-full py-8 text-center text-slate-500 font-mono text-xs border border-dashed border-[#232936] rounded-xl">
            Chưa có dự án nào được ghim vào Khung Tiêu Điểm. (Vào Creator Mode và bấm icon Ghim để đánh dấu tối đa 3 dự án ưng ý nhất).
          </div>
        `;
      } else {
        pinnedProjects.forEach((proj, idx) => {
          const card = document.createElement('div');
          card.className = "pinned-spotlight-card rounded-2xl p-5 flex flex-col justify-between group hover:-translate-y-1 transition duration-300 relative cursor-pointer border";
          
          card.onclick = (e) => {
            if (e.target.closest('.admin-btn') || e.target.closest('.pin-btn') || e.target.closest('a')) return;
            window.openProjectDetail(proj.id);
          };

          let adminActions = '';
          if (currentMode === 'admin') {
            adminActions = `
              <div class="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#0B0E14]/90 p-1 rounded-lg border border-[#2B3545]">
                <button onclick="event.stopPropagation(); togglePinProject('${proj.id}')" title="Bỏ ghim khỏi Tiêu điểm" class="pin-btn p-1 text-amber-400 hover:text-amber-300 transition">
                  <i data-lucide="pin-off" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="event.stopPropagation(); editProject('${proj.id}')" title="Sửa dự án" class="admin-btn p-1 hover:text-sky-400 text-slate-400 transition">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="event.stopPropagation(); deleteProject('${proj.id}')" title="Xóa dự án" class="admin-btn p-1 hover:text-rose-400 text-slate-400 transition">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `;
          }

          const tagsHtml = (proj.techStack || []).slice(0, 3).map(t => 
            `<span class="px-2 py-0.5 rounded bg-[#181D26] text-amber-200/90 text-[11px] font-mono border border-amber-500/20">${t}</span>`
          ).join('');

          card.innerHTML = `
            ${adminActions}
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                    <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>
                    <span>TOP ${idx + 1} FEATURED</span>
                  </span>
                  <span class="text-[11px] text-slate-400 font-mono">${proj.badge || 'Đồ án'}</span>
                </div>
                <div class="w-8 h-8 rounded-lg bg-[#181D26] border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition shrink-0 ${currentMode === 'admin' ? 'mr-24' : ''}">
                  <i data-lucide="${proj.icon || 'star'}" class="w-4 h-4"></i>
                </div>
              </div>

              <h4 class="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                ${proj.title}
              </h4>

              <p class="text-xs text-slate-300 leading-relaxed line-clamp-2">
                ${proj.problem || proj.shortDesc || ''}
              </p>

              <div class="p-2.5 rounded-xl bg-[#090C12] border border-[#1E2430] text-[11px] text-slate-400 line-clamp-2">
                <strong class="text-emerald-400 font-mono">Vai trò:</strong> ${proj.role || 'Phụ trách nghiên cứu & triển khai cốt lõi.'}
              </div>
            </div>

            <div class="pt-4 mt-4 border-t border-[#1E2430] flex items-center justify-between">
              <div class="flex flex-wrap gap-1">
                ${tagsHtml}
                ${(proj.techStack && proj.techStack.length > 3) ? `<span class="text-[10px] text-amber-400/80 font-mono self-center">+${proj.techStack.length - 3}</span>` : ''}
              </div>
              <span class="text-xs font-mono text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition shrink-0 ml-2">
                <span>Xem giải thuật</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </span>
            </div>
          `;
          pinnedShowcaseGrid.appendChild(card);
        });
      }
    }

    // 3.2 RENDER DANH MỤC TOÀN BỘ DỰ ÁN
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    const filtered = projectsData.filter(item => {
      if (activeCategoryFilter === 'all') return true;
      return item.category === activeCategoryFilter;
    });

    if (filtered.length === 0) {
      projectsGrid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
          Chưa có dự án nào trong danh mục này.
        </div>
      `;
      return;
    }

    filtered.forEach(proj => {
      const card = document.createElement('div');
      
      const borderClass = proj.isPinned 
        ? "border-amber-500/40 bg-gradient-to-b from-[#141A26] to-[#0E121A]" 
        : "border-[#232936] hover:border-slate-500/40";

      card.className = `dark-card rounded-2xl p-5 flex flex-col justify-between group hover:-translate-y-1 transition duration-300 relative cursor-pointer border ${borderClass}`;
      
      card.onclick = (e) => {
        if (e.target.closest('.admin-btn') || e.target.closest('.pin-btn') || e.target.closest('a')) return;
        window.openProjectDetail(proj.id);
      };

      let adminActions = '';
      if (currentMode === 'admin') {
        adminActions = `
          <div class="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#0B0E14]/90 p-1 rounded-lg border border-[#2B3545]">
            <button onclick="event.stopPropagation(); togglePinProject('${proj.id}')" title="${proj.isPinned ? 'Bỏ ghim khỏi Tiêu điểm' : 'Ghim dự án (Tối đa 3)'}" class="pin-btn p-1 ${proj.isPinned ? 'text-amber-400' : 'text-slate-500'} hover:text-amber-300 transition">
              <i data-lucide="pin" class="w-3.5 h-3.5 ${proj.isPinned ? 'fill-amber-400' : ''}"></i>
            </button>
            <button onclick="event.stopPropagation(); editProject('${proj.id}')" title="Sửa dự án" class="admin-btn p-1 hover:text-sky-400 text-slate-400 transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="event.stopPropagation(); deleteProject('${proj.id}')" title="Xóa dự án" class="admin-btn p-1 hover:text-rose-400 text-slate-400 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
      }

      const tagsHtml = (proj.techStack || []).slice(0, 3).map(t => 
        `<span class="px-2 py-0.5 rounded bg-[#181D26] text-slate-300 text-[11px] font-mono border border-[#242C3A]">${t}</span>`
      ).join('');

      const pinBadge = proj.isPinned ? `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <i data-lucide="pin" class="w-2.5 h-2.5 fill-amber-400"></i>
          <span>Pinned</span>
        </span>
      ` : '';

      card.innerHTML = `
        ${adminActions}
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-[#181D26] text-slate-300 text-[11px] font-mono border border-[#2B3545]">
                ${proj.badge || 'Đồ án'}
              </span>
              ${pinBadge}
            </div>
            <div class="w-8 h-8 rounded-lg bg-[#181D26] border border-[#242C3A] flex items-center justify-center text-sky-400 group-hover:scale-110 transition shrink-0 ${currentMode === 'admin' ? 'mr-24' : ''}">
              <i data-lucide="${proj.icon || 'folder-code'}" class="w-4 h-4"></i>
            </div>
          </div>

          <h4 class="text-base font-bold text-white group-hover:text-sky-300 transition line-clamp-1">
            ${proj.title}
          </h4>

          <p class="text-xs text-slate-400 leading-relaxed line-clamp-2">
            ${proj.shortDesc || proj.problem || ''}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-[#1E2430] flex items-center justify-between">
          <div class="flex flex-wrap gap-1">
            ${tagsHtml}
            ${(proj.techStack && proj.techStack.length > 3) ? `<span class="text-[10px] text-slate-500 font-mono self-center">+${proj.techStack.length - 3}</span>` : ''}
          </div>
          <span class="text-xs font-mono text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition shrink-0 ml-2">
            <span>Chi tiết</span>
            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
          </span>
        </div>
      `;

      projectsGrid.appendChild(card);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // 4. XỬ LÝ BỘ LỌC DỰ ÁN
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#1E2430]', 'text-white', 'border-[#2B3545]');
        b.classList.add('bg-[#0F1219]', 'text-slate-400', 'border-transparent');
      });
      btn.classList.add('bg-[#1E2430]', 'text-white', 'border-[#2B3545]');
      btn.classList.remove('bg-[#0F1219]', 'text-slate-400', 'border-transparent');

      activeCategoryFilter = btn.getAttribute('data-filter') || 'all';
      renderProjects();
    });
  });

  // 5. MODAL CHI TIẾT DỰ ÁN: HIỂN THỊ ĐỦ 3 MỤC (BÀI TOÁN - VAI TRÒ - GIẢI THUẬT/TECH)
  window.openProjectDetail = function(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;

    let detailModal = document.getElementById('projectDetailModal');
    if (!detailModal) {
      detailModal = document.createElement('div');
      detailModal.id = 'projectDetailModal';
      detailModal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md hidden';
      document.body.appendChild(detailModal);
    }

    // Đóng khi click ngoài khung modal trên mobile/tablet
    detailModal.onclick = (e) => {
      if (e.target === detailModal) {
        window.closeProjectDetail();
      }
    };

    const techTags = (proj.techStack || []).map(t => 
      `<span class="px-2.5 py-1 rounded bg-[#181D26] text-slate-200 text-[11px] sm:text-xs font-mono border border-[#242C3A]">${t}</span>`
    ).join('');

    detailModal.innerHTML = `
      <div class="w-full max-w-2xl dark-card rounded-2xl overflow-hidden border border-[#2B3545] shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]">
        <!-- Header -->
        <div class="bg-[#0B0E14] px-4 py-3 sm:px-6 sm:py-4 border-b border-[#1E2430] flex items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">${proj.badge || 'Đồ án'}</span>
              ${proj.isPinned ? '<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">★ Featured Project</span>' : ''}
              <span class="text-[11px] font-mono text-slate-400">${proj.tag || 'HCMUS'}</span>
            </div>
            <h3 class="text-base sm:text-xl font-bold text-white leading-snug">${proj.title}</h3>
          </div>
          <button onclick="closeProjectDetail()" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- 3 Mục Nội Dung Chính -->
        <div class="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs sm:text-sm font-sans">
          
          <!-- Mục 1: Bài toán cần giải quyết -->
          <div class="space-y-1.5 sm:space-y-2">
            <div class="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-sky-400">
              <i data-lucide="help-circle" class="w-4 h-4 shrink-0"></i>
              <span>1. Bài Toán Cần Giải Quyết (Problem & Objective)</span>
            </div>
            <div class="p-3.5 sm:p-4 rounded-xl bg-[#0A0D13] border border-[#1E2430] text-slate-300 leading-relaxed text-xs sm:text-sm">
              ${proj.problem || proj.shortDesc || 'Đang cập nhật thông tin bài toán chi tiết.'}
            </div>
          </div>

          <!-- Mục 2: Vai trò phụ trách cụ thể -->
          <div class="space-y-1.5 sm:space-y-2">
            <div class="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-emerald-400">
              <i data-lucide="user-check" class="w-4 h-4 shrink-0"></i>
              <span>2. Vai Trò Của Huỳnh Thái Hoà (Personal Contribution)</span>
            </div>
            <div class="p-3.5 sm:p-4 rounded-xl bg-[#0A0D13] border border-[#1E2430] text-slate-300 leading-relaxed text-xs sm:text-sm">
              ${proj.role || 'Phụ trách nghiên cứu và hiện thực phần cốt lõi của đồ án.'}
            </div>
          </div>

          <!-- Mục 3: Giải thuật & Kỹ thuật cốt lõi -->
          <div class="space-y-1.5 sm:space-y-2">
            <div class="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              <i data-lucide="cpu" class="w-4 h-4 shrink-0"></i>
              <span>3. Giải Thuật & Công Nghệ Cốt Lõi (Algorithms & Tech Stack)</span>
            </div>
            <div class="p-3.5 sm:p-4 rounded-xl bg-[#0A0D13] border border-[#1E2430] space-y-3 text-slate-300 leading-relaxed text-xs sm:text-sm">
              <div>${proj.techDetails || 'Ứng dụng các thuật toán và thư viện chuyên môn để giải quyết bài toán.'}</div>
              <div class="pt-2 border-t border-[#1E2430] flex flex-wrap gap-1.5">
                ${techTags}
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Modal: Links -->
        <div class="bg-[#0B0E14] px-4 py-3 sm:px-6 sm:py-3.5 border-t border-[#1E2430] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div class="flex flex-wrap items-center gap-3">
            ${proj.githubUrl ? `
              <a href="${proj.githubUrl}" target="_blank" class="text-slate-300 hover:text-white flex items-center gap-1.5 transition">
                <i data-lucide="github" class="w-4 h-4 text-sky-400"></i>
                <span>Xem GitHub Repo</span>
              </a>
            ` : '<span class="text-slate-500">Mã nguồn nội bộ</span>'}

            ${proj.demoUrl ? `
              <a href="${proj.demoUrl}" target="_blank" class="text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition">
                <i data-lucide="external-link" class="w-4 h-4"></i>
                <span>Xem Demo Trực Tiếp</span>
              </a>
            ` : ''}
          </div>
          <button onclick="closeProjectDetail()" class="px-3.5 py-1.5 rounded-lg bg-[#181D26] hover:bg-[#222936] text-slate-300 hover:text-white transition ml-auto">
            Đóng
          </button>
        </div>
      </div>
    `;

    detailModal.classList.remove('hidden');
    if (window.lucide) {
      lucide.createIcons();
    }
  };

  window.closeProjectDetail = function() {
    const detailModal = document.getElementById('projectDetailModal');
    if (detailModal) detailModal.classList.add('hidden');
  };

  // 6. QUẢN LÝ CHẾ ĐỘ: HR VIEW VS ADMIN VIEW
  const modeBadge = document.getElementById('modeBadge');
  const adminPanelBtn = document.getElementById('adminPanelBtn');
  const adminControlsBar = document.getElementById('adminControlsBar');

  function updateModeUI() {
    if (currentMode === 'admin') {
      if (modeBadge) {
        modeBadge.textContent = "Creator Mode";
        modeBadge.className = "px-2.5 py-1 rounded text-xs font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-pointer flex items-center gap-1.5";
      }
      if (adminControlsBar) adminControlsBar.classList.remove('hidden');
    } else {
      if (modeBadge) {
        modeBadge.textContent = "HR View";
        modeBadge.className = "px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer flex items-center gap-1.5";
      }
      if (adminControlsBar) adminControlsBar.classList.add('hidden');
    }
    renderProjects();
  }

  window.toggleMode = async function() {
    if (currentMode === 'hr') {
      const pin = prompt("Nhập mã PIN để chuyển sang Creator/Admin Mode:");
      if (pin === null) return;
      const isValid = await verifyAdminPIN(pin);
      if (isValid) {
        currentMode = 'admin';
        updateModeUI();
      } else {
        alert("Mã PIN không đúng! Vui lòng thử lại.");
      }
    } else {
      currentMode = 'hr';
      updateModeUI();
    }
  };

  if (modeBadge) modeBadge.addEventListener('click', window.toggleMode);
  if (adminPanelBtn) adminPanelBtn.addEventListener('click', window.toggleMode);

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      window.toggleMode();
    }
  });

  // 7. FORM THÊM / SỬA DỰ ÁN (CHỈ DÀNH CHO ADMIN)
  const projectModal = document.getElementById('projectModal');
  const projectForm = document.getElementById('projectForm');
  const modalTitle = document.getElementById('modalTitle');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');

  window.openAddProjectModal = function() {
    if (currentMode !== 'admin') {
      alert("Vui lòng chuyển sang Creator/Admin Mode trước!");
      return;
    }
    if (modalTitle) modalTitle.textContent = "Thêm Dự Án Mới";
    if (projectForm) projectForm.reset();
    document.getElementById('projectId').value = "";
    document.getElementById('projIsPinned').checked = false;
    if (projectModal) projectModal.classList.remove('hidden');
  };

  window.closeProjectModal = function() {
    if (projectModal) projectModal.classList.add('hidden');
  };

  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', window.closeProjectModal);
  }

  // Đóng khi click ra ngoài backdrop trên thiết bị cảm ứng
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        window.closeProjectModal();
      }
    });
  }

  window.editProject = function(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;

    if (modalTitle) modalTitle.textContent = "Chỉnh Sửa Dự Án";
    document.getElementById('projectId').value = proj.id;
    document.getElementById('projTitle').value = proj.title || "";
    document.getElementById('projCategory').value = proj.category || "ai";
    document.getElementById('projBadge').value = proj.badge || "";
    document.getElementById('projTag').value = proj.tag || "";
    document.getElementById('projShortDesc').value = proj.problem || proj.shortDesc || "";
    document.getElementById('projRole').value = proj.role || "";
    document.getElementById('projTechStack').value = (proj.techStack || []).join(', ');
    document.getElementById('projGithub').value = proj.githubUrl || "";
    document.getElementById('projDemo').value = proj.demoUrl || "";
    
    // Checkbox ghim
    const pinCheckbox = document.getElementById('projIsPinned');
    if (pinCheckbox) pinCheckbox.checked = !!proj.isPinned;

    if (projectModal) projectModal.classList.remove('hidden');
  };

  window.deleteProject = async function(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;
    
    // 1. Xóa qua Supabase SDK (GitHub Pages)
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('projects').delete().eq('id', id);
        if (error) console.warn("Lỗi xóa trên Supabase SDK:", error);
      } catch (e) {
        console.warn("Lỗi gọi Supabase SDK:", e);
      }
    } else {
      // 2. Xóa qua Backend API (localhost)
      fetch(`/api/projects/${id}`, { method: 'DELETE' }).catch(e => console.log("Xóa offline:", e));
    }

    projectsData = projectsData.filter(p => p.id !== id);
    saveProjectsToStorage();
    renderProjects();
  };

  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('projectId').value;
      const title = document.getElementById('projTitle').value.trim();
      const category = document.getElementById('projCategory').value;
      const badge = document.getElementById('projBadge').value.trim();
      const tag = document.getElementById('projTag').value.trim();
      const problem = document.getElementById('projShortDesc').value.trim();
      const role = document.getElementById('projRole').value.trim();
      const techStackStr = document.getElementById('projTechStack').value.trim();
      const githubUrl = document.getElementById('projGithub').value.trim();
      const demoUrl = document.getElementById('projDemo').value.trim();
      const pinCheckbox = document.getElementById('projIsPinned');
      const isPinned = pinCheckbox ? pinCheckbox.checked : false;

      // Kiểm tra giới hạn 3 pin nếu chọn ghim
      if (isPinned) {
        const otherPinned = projectsData.filter(p => p.isPinned && p.id !== id).length;
        if (otherPinned >= 3) {
          alert("Bạn chỉ có thể ghim tối đa 3 dự án! Hãy bỏ ghim 1 dự án khác trước.");
          return;
        }
      }

      const techStack = techStackStr ? techStackStr.split(',').map(s => s.trim()).filter(Boolean) : [];
      const targetId = id || ("proj-" + Date.now());

      const updatedItem = {
        id: targetId,
        title,
        category,
        badge,
        tag,
        icon: category === 'ai' ? 'brain' : (category === 'software' ? 'smartphone' : 'cpu'),
        shortDesc: problem,
        problem,
        role,
        techDetails: "Được xây dựng bằng " + techStack.join(', ') + ".",
        techStack,
        githubUrl,
        demoUrl,
        isPinned
      };

      // 1. Đồng bộ lên Supabase SDK trực tiếp (GitHub Pages)
      if (supabaseClient) {
        try {
          const dbRow = {
            id: targetId,
            title,
            category,
            badge,
            tag,
            icon: updatedItem.icon,
            is_pinned: isPinned,
            short_desc: problem,
            problem,
            role,
            tech_details: updatedItem.techDetails,
            tech_stack: techStack,
            github_url: githubUrl,
            demo_url: demoUrl
          };
          const { error } = await supabaseClient.from('projects').upsert(dbRow);
          if (error) {
            console.warn("Lỗi lưu Supabase SDK:", error);
          } else {
            console.log("✓ Đã đồng bộ dự án lên Supabase thành công!");
          }
        } catch (err) {
          console.warn("Lỗi gọi Supabase SDK:", err);
        }
      } else {
        // 2. Đồng bộ qua Backend API (localhost)
        fetch(id ? `/api/projects/${id}` : '/api/projects', {
          method: id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem)
        }).catch(err => console.log("Lưu offline:", err));
      }

      if (id) {
        const idx = projectsData.findIndex(p => p.id === id);
        if (idx !== -1) {
          projectsData[idx] = updatedItem;
        }
      } else {
        projectsData.unshift(updatedItem);
      }

      saveProjectsToStorage();
      renderProjects();
      window.closeProjectModal();
    });
  }

  // 8. XUẤT / NHẬP JSON DỮ LIỆU
  window.exportProjectsJSON = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "projects_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  window.importProjectsJSON = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const imported = JSON.parse(evt.target.result);
          if (Array.isArray(imported)) {
            projectsData = imported;
            saveProjectsToStorage();
            renderProjects();

            // Nếu có Supabase SDK thì đồng bộ hàng loạt lên luôn
            if (supabaseClient) {
              const rows = imported.map(p => ({
                id: p.id,
                title: p.title,
                category: p.category,
                badge: p.badge,
                tag: p.tag,
                icon: p.icon || 'folder-code',
                is_pinned: !!p.isPinned,
                short_desc: p.shortDesc,
                problem: p.problem,
                role: p.role,
                tech_details: p.techDetails,
                tech_stack: p.techStack,
                github_url: p.githubUrl,
                demo_url: p.demoUrl
              }));
              await supabaseClient.from('projects').upsert(rows);
            }

            alert("Đã nhập thành công " + imported.length + " dự án!");
          } else {
            alert("Định dạng file JSON không hợp lệ!");
          }
        } catch (err) {
          alert("Lỗi khi đọc file JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  window.resetDefaultProjects = async function() {
    if (!confirm("Khôi phục danh sách dự án về mặc định của HCMUS?")) return;

    if (supabaseClient) {
      try {
        await supabaseClient.from('projects').delete().neq('id', '___dummy___');
        const rows = DEFAULT_PROJECTS.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          badge: p.badge,
          tag: p.tag,
          icon: p.icon || 'folder-code',
          is_pinned: !!p.isPinned,
          short_desc: p.shortDesc,
          problem: p.problem,
          role: p.role,
          tech_details: p.techDetails,
          tech_stack: p.techStack,
          github_url: p.githubUrl,
          demo_url: p.demoUrl
        }));
        await supabaseClient.from('projects').insert(rows);
      } catch (e) {
        console.warn("Lỗi reset trên Supabase SDK:", e);
      }
    } else {
      fetch('/api/projects/reset', { method: 'POST' }).catch(e => console.log("Reset offline"));
    }

    projectsData = [...DEFAULT_PROJECTS];
    saveProjectsToStorage();
    renderProjects();
    alert("✓ Đã khôi phục danh sách dự án mặc định thành công!");
  };

  // 9. TYPING EFFECT
  const titles = [
    'Aspiring AI Engineer',
    'Knowledge Technology Student @ HCMUS',
    'Route Optimization & Search Algorithms',
    'Git Work-Ready Certified',
    'Problem Solver & Team Player'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById('typingEffect');

  function typeEffect() {
    if (!typingElement) return;
    const currentTitle = titles[titleIndex];
    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    let typingSpeed = isDeleting ? 35 : 75;

    if (!isDeleting && charIndex === currentTitle.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }
  typeEffect();

  // 10. FORM LIÊN HỆ
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formFeedback.classList.remove('hidden');
      contactForm.reset();
      setTimeout(() => {
        formFeedback.classList.add('hidden');
      }, 5000);
    });
  }

  // 11. CLI TERMINAL
  const terminalToggleBtn = document.getElementById('terminalToggleBtn');
  const terminalModal = document.getElementById('terminalModal');
  const closeTerminalBtn = document.getElementById('closeTerminalBtn');
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');

  function openTerminal() {
    if (terminalModal) {
      terminalModal.classList.remove('hidden');
      terminalInput.focus();
    }
  }

  function closeTerminal() {
    if (terminalModal) {
      terminalModal.classList.add('hidden');
    }
  }

  if (terminalToggleBtn) terminalToggleBtn.addEventListener('click', openTerminal);
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);
  if (terminalModal) {
    terminalModal.addEventListener('click', (e) => {
      if (e.target === terminalModal) closeTerminal();
    });
  }

  if (terminalInput && terminalBody) {
    terminalInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `<span class="text-sky-400">thaihoa@hcmus:~$</span> <span class="text-white">${command}</span>`;
        terminalBody.appendChild(cmdLine);

        const resLine = document.createElement('div');
        resLine.className = 'text-slate-300 mb-2';

        switch (command) {
          case 'help':
            resLine.innerHTML = `
              <div class="space-y-1">
                <div><span class="text-sky-300 font-bold">whoami</span> - Thông tin Huỳnh Thái Hoà</div>
                <div><span class="text-sky-300 font-bold">skills</span> - Kỹ năng & Môn học HCMUS</div>
                <div><span class="text-sky-300 font-bold">projects</span> - Danh sách dự án (Có đánh dấu Pin)</div>
                <div><span class="text-sky-300 font-bold">admin</span> - Xác thực & Chuyển sang Creator Mode</div>
                <div><span class="text-sky-300 font-bold">goto [home|projects|contact]</span> - Chuyển trang</div>
                <div><span class="text-sky-300 font-bold">clear</span> - Xóa terminal</div>
                <div><span class="text-sky-300 font-bold">exit</span> - Đóng terminal</div>
              </div>`;
            break;
          case 'whoami':
            resLine.innerHTML = `Huỳnh Thái Hoà - Sinh viên năm 3 ngành Công nghệ Tri thức, ĐH Khoa học Tự nhiên (HCMUS). Định hướng AI Engineer.`;
            break;
          case 'skills':
            resLine.innerHTML = `
              <div class="space-y-1">
                <div><span class="text-sky-300 font-bold">• Programming Languages:</span> C++, Python, SQL</div>
                <div><span class="text-emerald-300 font-bold">• Databases & Backend:</span> Supabase, MS SQL Server</div>
                <div><span class="text-amber-300 font-bold">• Tools & Platforms:</span> Git / GitHub, VS Code, Gemini, Antigravity, Claude, Google AI Studio</div>
              </div>`;
            break;
          case 'projects':
            resLine.innerHTML = projectsData.map((p, idx) => `${idx + 1}. ${p.isPinned ? '[★ PINNED] ' : ''}${p.title} (${p.category})`).join('<br>');
            break;
          case 'admin':
            if (currentMode === 'admin') {
              resLine.innerHTML = `<span class="text-amber-400">Bạn đã ở Creator Mode rồi. (Bấm badge 'Creator Mode' trên thanh điều hướng để quay lại HR View).</span>`;
            } else {
              const enteredPin = prompt("Xác thực CLI: Nhập mã PIN hiện tại để kích hoạt Creator Mode:");
              if (enteredPin === null) {
                resLine.innerHTML = `<span class="text-slate-400">[HỦY] Đã hủy yêu cầu xác thực qua CLI.</span>`;
              } else {
                const isValid = await verifyAdminPIN(enteredPin);
                if (isValid) {
                  currentMode = 'admin';
                  updateModeUI();
                  resLine.innerHTML = `<span class="text-emerald-400 font-bold">✓ Xác thực thành công!</span> <span class="text-amber-300">Đã kích hoạt Creator Mode. Bạn có toàn quyền quản trị dự án!</span>`;
                } else {
                  resLine.innerHTML = `<span class="text-rose-400 font-bold">✗ BẢO MẬT: Mã PIN không chính xác! Truy cập bị từ chối.</span>`;
                }
              }
            }
            break;
          case 'goto home':
            navigateToPage('hero');
            resLine.innerHTML = `Chuyển sang trang Tổng quan & Hồ sơ.`;
            break;
          case 'goto projects':
            navigateToPage('projects');
            resLine.innerHTML = `Chuyển sang trang Dự án.`;
            break;
          case 'goto contact':
            navigateToPage('contact');
            resLine.innerHTML = `Chuyển sang trang Liên hệ.`;
            break;
          case 'clear':
            terminalBody.innerHTML = '';
            return;
          case 'exit':
            closeTerminal();
            return;
          case '':
            return;
          default:
            resLine.innerHTML = `<span class="text-rose-400">Lệnh không hợp lệ: "${command}". Gõ "help" để xem danh sách.</span>`;
            break;
        }

        terminalBody.appendChild(resLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  }

  // Render lần đầu
  updateModeUI();
});
