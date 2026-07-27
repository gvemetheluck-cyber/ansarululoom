/**
 * Navbar Component - Organic Earth & Leaf Aesthetic
 */
const NavbarComponent = (function() {
  function render(activeTab, onNavClick, onEditNameClick, onQuickEnroll) {
    const settings = MadrasaDB.getSettings();
    const madrasaName = settings.madrasaName || "Ansarul Uloom Madrasa";

    const navItems = [
      { id: 'home', label: 'Home', icon: 'fa-house' },
      { id: 'programs', label: 'Meelad Programs', icon: 'fa-list-check' },
      { id: 'events', label: 'Stage Schedule', icon: 'fa-calendar-days' },
      { id: 'database', label: 'Student Records', icon: 'fa-database', badge: 'Admin' },
      { id: 'results', label: 'Results Portal', icon: 'fa-trophy' }
    ];

    const container = document.getElementById('navbar-container');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-organic border-b border-emerald-800/40 px-4 lg:px-8 py-3.5 shadow-2xl transition-all duration-300">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <!-- Brand Logo & Title -->
          <div class="flex items-center gap-3.5 cursor-pointer group" id="brand-header-btn">
            <div class="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 border border-emerald-600/50 text-organic-pillGold shadow-lg group-hover:scale-105 transition-transform duration-300">
              <i class="fa-solid fa-leaf text-xl"></i>
              <span class="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <h1 id="navbar-madrasa-title" class="font-title font-extrabold text-lg md:text-xl text-organic-creamText tracking-wide group-hover:text-organic-pillGold transition-colors">
                  ${escapeHTML(madrasaName)}
                </h1>
                <button id="edit-madrasa-name-btn" title="Edit Madrasa Name" class="text-xs text-organic-muted hover:text-amber-300 transition-colors p-1 rounded-full hover:bg-emerald-900/40 no-print">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
              <span class="text-xs text-organic-pillGold font-medium tracking-wider flex items-center gap-1">
                <span>Andona, Thamarassery, Kozhikkode</span>
                <span class="text-emerald-700">•</span>
                <span class="text-organic-muted">Meelad Fest 2026</span>
              </span>
            </div>
          </div>

          <!-- Desktop Nav Tabs -->
          <nav class="hidden md:flex items-center gap-1.5 bg-[#0A2119] p-1.5 rounded-full border border-emerald-800/60 shadow-inner">
            ${navItems.map(item => `
              <button 
                data-tab="${item.id}" 
                class="nav-btn px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === item.id 
                    ? 'btn-pill-gold shadow-md' 
                    : 'text-organic-creamText hover:text-white hover:bg-emerald-900/40'
                }"
              >
                <i class="fa-solid ${item.icon} ${activeTab === item.id ? 'text-organic-darkText' : 'text-organic-muted'}"></i>
                <span>${item.label}</span>
                ${item.badge ? `<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">${item.badge}</span>` : ''}
              </button>
            `).join('')}
          </nav>

          <!-- Action Buttons -->
          <div class="hidden lg:flex items-center gap-3">
            <button id="quick-result-btn" class="px-4 py-2.5 rounded-full text-xs font-bold text-organic-creamText hover:text-white bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-700/50 transition-all flex items-center gap-2 shadow-sm">
              <i class="fa-solid fa-trophy text-organic-pillGold"></i>
              <span>Results Portal</span>
            </button>

            <button id="quick-enroll-btn" class="btn-pill-gold px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2">
              <i class="fa-solid fa-user-plus text-organic-darkText"></i>
              <span>Register Student</span>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button id="mobile-menu-btn" class="md:hidden p-2.5 rounded-full bg-emerald-950 border border-emerald-800 text-organic-creamText">
            <i class="fa-solid fa-bars text-lg"></i>
          </button>
        </div>

        <!-- Mobile Dropdown -->
        <div id="mobile-menu" class="hidden md:hidden mt-3 pt-3 border-t border-emerald-900/60 flex flex-col gap-2">
          ${navItems.map(item => `
            <button 
              data-tab="${item.id}" 
              class="mobile-nav-btn w-full px-4 py-2.5 rounded-2xl text-xs font-bold text-left flex items-center justify-between ${
                activeTab === item.id 
                  ? 'bg-organic-cardGreen text-organic-pillGold border border-emerald-600/50' 
                  : 'text-organic-creamText hover:bg-emerald-900/30'
              }"
            >
              <div class="flex items-center gap-3">
                <i class="fa-solid ${item.icon} text-organic-pillGold w-5"></i>
                <span>${item.label}</span>
              </div>
              ${item.badge ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-300">${item.badge}</span>` : ''}
            </button>
          `).join('')}

          <div class="flex gap-2 mt-2 pt-2 border-t border-emerald-900/60">
            <button id="mobile-quick-enroll" class="btn-pill-gold w-full py-2.5 text-xs font-bold text-center">
              <i class="fa-solid fa-user-plus mr-1"></i> Register Student
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onNavClick(btn.dataset.tab);
        document.getElementById('mobile-menu')?.classList.add('hidden');
      });
    });

    document.getElementById('edit-madrasa-name-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onEditNameClick();
    });

    document.getElementById('brand-header-btn')?.addEventListener('click', () => onNavClick('home'));
    document.getElementById('quick-enroll-btn')?.addEventListener('click', onQuickEnroll);
    document.getElementById('mobile-quick-enroll')?.addEventListener('click', () => {
      onQuickEnroll();
      document.getElementById('mobile-menu')?.classList.add('hidden');
    });
    document.getElementById('quick-result-btn')?.addEventListener('click', () => onNavClick('results'));
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      document.getElementById('mobile-menu')?.classList.toggle('hidden');
    });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, match => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[match]);
  }

  return { render, escapeHTML };
})();
