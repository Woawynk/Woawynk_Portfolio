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

// Danh sách dự án mặc định theo background HCMUS chuẩn cấu trúc 3 mục
const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Tìm Đường Đi Tối Ưu Cho Xe Cấp Cứu",
    category: "ai",
    badge: "Cơ sở Trí tuệ Nhân tạo",
    tag: "Đồ án AI",
    icon: "navigation",
    isPinned: true, // Đã ghim 1
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
    isPinned: true, // Đã ghim 2
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
    isPinned: true, // Đã ghim 3 (Đủ 3 dự án ưu tiên cao nhất)
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

// Lấy mã băm PIN từ localStorage hoặc mặc định băm của "1234"
function getStoredAdminHash() {
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
  const storedHash = getStoredAdminHash();
  return inputHash === storedHash;
}

// Hàm đổi mã PIN ngay trên giao diện: băm và lưu vào localStorage
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

  const newHash = await hashString(newPin.trim());
  localStorage.setItem("thaihoa_admin_hash", newHash);
  localStorage.removeItem("thaihoa_admin_pin"); // Đảm bảo không lưu chuỗi plain text
  alert("✓ Đã đổi mã PIN thành công! Hệ thống đã mã hóa và lưu mã băm SHA-256 an toàn.");
};

document.addEventListener('DOMContentLoaded', () => {
  loadProjectsFromStorage();

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

  // 2. LOGIC PIN / UNPIN DỰ ÁN (TỐI ĐA 3 DỰ ÁN)
  window.togglePinProject = function(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;

    if (!proj.isPinned) {
      // Đang muốn ghim -> kiểm tra xem đã đủ 3 dự án chưa
      const currentPinnedCount = projectsData.filter(p => p.isPinned).length;
      if (currentPinnedCount >= 3) {
        alert("Bạn chỉ có thể ghim (Pin) tối đa 3 dự án nổi bật nhất! Hãy bỏ ghim 1 dự án khác trước khi ghim thêm.");
        return;
      }
      proj.isPinned = true;
    } else {
      // Bỏ ghim
      proj.isPinned = false;
    }

    saveProjectsToStorage();
    renderProjects();
  };

  // 3. RENDER DANH SÁCH DỰ ÁN (CÁC DỰ ÁN ĐƯỢC PIN SẼ TỰ ĐỘNG ĐỨNG ĐẦU)
  const projectsGrid = document.getElementById('projectsGrid');

  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    // Sắp xếp: Dự án isPinned=true sẽ luôn ưu tiên đứng lên đầu danh sách
    const sortedProjects = [...projectsData].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    const filtered = sortedProjects.filter(item => {
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
      
      // Viền nổi bật hơn nếu dự án được ghim (Pin)
      const borderClass = proj.isPinned 
        ? "border-sky-500/40 bg-gradient-to-b from-[#131926] to-[#0E121A]" 
        : "border-[#232936] hover:border-slate-500/40";

      card.className = `dark-card rounded-2xl p-5 flex flex-col justify-between group hover:-translate-y-1 transition duration-300 relative cursor-pointer border ${borderClass}`;
      
      // Gán sự kiện click vào card mở Modal 3 mục chi tiết
      card.onclick = (e) => {
        if (e.target.closest('.admin-btn') || e.target.closest('.pin-btn') || e.target.closest('a')) return;
        window.openProjectDetail(proj.id);
      };

      // Nút điều khiển Edit/Delete chỉ hiện khi ở Admin Mode
      let adminActions = '';
      if (currentMode === 'admin') {
        adminActions = `
          <div class="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#0B0E14]/90 p-1 rounded-lg border border-[#2B3545]">
            <!-- Nút Pin nhanh trong Admin -->
            <button onclick="event.stopPropagation(); togglePinProject('${proj.id}')" title="${proj.isPinned ? 'Bỏ ghim' : 'Ghim dự án (Tối đa 3)'}" class="pin-btn p-1 ${proj.isPinned ? 'text-amber-400' : 'text-slate-500'} hover:text-amber-300 transition">
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

      // Huy hiệu PIN NỔI BẬT (Hiện cả cho HR thấy đây là dự án tâm đắc nhất)
      const pinBadge = proj.isPinned ? `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <i data-lucide="pin" class="w-2.5 h-2.5 fill-amber-400"></i>
          <span>Featured</span>
        </span>
      ` : '';

      card.innerHTML = `
        ${adminActions}
        <div class="space-y-3">
          <!-- Top Badge & Icon -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-[#181D26] text-slate-300 text-[11px] font-mono border border-[#2B3545]">
                ${proj.badge || 'Đồ án'}
              </span>
              ${pinBadge}
            </div>
            <div class="w-8 h-8 rounded-lg bg-[#181D26] border border-[#242C3A] flex items-center justify-center text-sky-400 group-hover:scale-110 transition shrink-0 ${currentMode === 'admin' ? 'mr-20' : ''}">
              <i data-lucide="${proj.icon || 'folder-code'}" class="w-4 h-4"></i>
            </div>
          </div>

          <!-- Title -->
          <h4 class="text-base font-bold text-white group-hover:text-sky-300 transition line-clamp-1 flex items-center gap-1.5">
            <span>${proj.title}</span>
          </h4>

          <!-- Short Description -->
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
      detailModal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md hidden';
      document.body.appendChild(detailModal);
    }

    const techTags = (proj.techStack || []).map(t => 
      `<span class="px-2.5 py-1 rounded bg-[#181D26] text-slate-200 text-xs font-mono border border-[#242C3A]">${t}</span>`
    ).join('');

    detailModal.innerHTML = `
      <div class="w-full max-w-2xl dark-card rounded-2xl overflow-hidden border border-[#2B3545] shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="bg-[#0B0E14] px-6 py-4 border-b border-[#1E2430] flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">${proj.badge || 'Đồ án'}</span>
              ${proj.isPinned ? '<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">★ Featured Project</span>' : ''}
              <span class="text-xs font-mono text-slate-400">${proj.tag || 'HCMUS'}</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white">${proj.title}</h3>
          </div>
          <button onclick="closeProjectDetail()" class="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- 3 Mục Nội Dung Chính -->
        <div class="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm font-sans">
          
          <!-- Mục 1: Bài toán cần giải quyết -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-sky-400">
              <i data-lucide="help-circle" class="w-4 h-4"></i>
              <span>1. Bài Toán Cần Giải Quyết (Problem & Objective)</span>
            </div>
            <div class="p-4 rounded-xl bg-[#0A0D13] border border-[#1E2430] text-slate-300 leading-relaxed text-xs sm:text-sm">
              ${proj.problem || proj.shortDesc || 'Đang cập nhật thông tin bài toán chi tiết.'}
            </div>
          </div>

          <!-- Mục 2: Vai trò phụ trách cụ thể -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-emerald-400">
              <i data-lucide="user-check" class="w-4 h-4"></i>
              <span>2. Vai Trò Của Huỳnh Thái Hoà (Personal Contribution)</span>
            </div>
            <div class="p-4 rounded-xl bg-[#0A0D13] border border-[#1E2430] text-slate-300 leading-relaxed text-xs sm:text-sm">
              ${proj.role || 'Phụ trách nghiên cứu và hiện thực phần cốt lõi của đồ án.'}
            </div>
          </div>

          <!-- Mục 3: Giải thuật & Kỹ thuật cốt lõi -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              <i data-lucide="cpu" class="w-4 h-4"></i>
              <span>3. Giải Thuật & Công Nghệ Cốt Lõi (Algorithms & Tech Stack)</span>
            </div>
            <div class="p-4 rounded-xl bg-[#0A0D13] border border-[#1E2430] space-y-3 text-slate-300 leading-relaxed text-xs sm:text-sm">
              <div>${proj.techDetails || 'Ứng dụng các thuật toán và thư viện chuyên môn để giải quyết bài toán.'}</div>
              <div class="pt-2 border-t border-[#1E2430] flex flex-wrap gap-1.5">
                ${techTags}
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Modal: Links -->
        <div class="bg-[#0B0E14] px-6 py-3.5 border-t border-[#1E2430] flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-4">
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
          <button onclick="closeProjectDetail()" class="px-3.5 py-1.5 rounded-lg bg-[#181D26] hover:bg-[#222936] text-slate-300 hover:text-white transition">
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

  window.deleteProject = function(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;
    projectsData = projectsData.filter(p => p.id !== id);
    saveProjectsToStorage();
    renderProjects();
  };

  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
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

      if (id) {
        const idx = projectsData.findIndex(p => p.id === id);
        if (idx !== -1) {
          projectsData[idx] = {
            ...projectsData[idx],
            title,
            category,
            badge,
            tag,
            shortDesc: problem,
            problem,
            role,
            techStack,
            githubUrl,
            demoUrl,
            isPinned
          };
        }
      } else {
        const newProj = {
          id: "proj-" + Date.now(),
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
        projectsData.unshift(newProj);
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
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target.result);
          if (Array.isArray(imported)) {
            projectsData = imported;
            saveProjectsToStorage();
            renderProjects();
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

  window.resetDefaultProjects = function() {
    if (confirm("Khôi phục danh sách dự án về mặc định của HCMUS?")) {
      projectsData = [...DEFAULT_PROJECTS];
      saveProjectsToStorage();
      renderProjects();
    }
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
            resLine.innerHTML = `C/C++, Python (NumPy), SQL Server, Dart, Dijkstra, Genetic Algorithm, Socket, Git, Docker, GCP.`;
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
