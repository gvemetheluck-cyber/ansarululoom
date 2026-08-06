/**
 * Navbar Component with Auth Status & Lock Badges
 */
const NavbarComponent = (function() {
  function render(activeTab, onNavClick, onEditNameClick, onQuickEnroll, onLoginClick, onLogoutClick) {
    const settings = MadrasaDB.getSettings();
    const madrasaName = settings.madrasaName || "Ansarul Uloom Madrasa";
    const isAuthenticated = MadrasaDB.isAuthenticated();
    const session = MadrasaDB.getAuthSession();

    const navItems = [
      { id: 'home', label: 'Home', icon: 'fa-house' },
      { id: 'programs', label: 'Meelad Programs', icon: 'fa-list-check' },
      { id: 'events', label: 'Stage Schedule', icon: 'fa-calendar-days' },
      { id: 'database', label: 'Student Records', icon: 'fa-database', protected: true, badge: 'Protected' },
      { id: 'results', label: 'Results Portal', icon: 'fa-trophy', protected: true, badge: 'Protected' }
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
                ${item.protected && !isAuthenticated ? `
                  <i class="fa-solid fa-lock text-[10px] text-amber-400" title="Login Required"></i>
                ` : ''}
                ${item.protected && isAuthenticated ? `
                  <span class="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700">Unlocked</span>
                ` : ''}
              </button>
            `).join('')}
          </nav>

          <!-- Auth & Action Buttons -->
          <div class="hidden lg:flex items-center gap-3">
            ${isAuthenticated ? `
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-700 text-xs text-emerald-300 font-bold">
                <i class="fa-solid fa-user-shield text-amber-400"></i>
                <span>${session ? session.username : 'Admin'}</span>
              </div>

              <button id="auth-logout-btn" class="px-3.5 py-2 rounded-full text-xs font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 transition-colors flex items-center gap-1.5" title="Sign Out">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            ` : `
              <button id="auth-login-btn" class="px-4 py-2 rounded-full text-xs font-bold text-organic-pillGold bg-emerald-950 border border-amber-500/50 hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-sm">
                <i class="fa-solid fa-lock text-amber-400"></i>
                <span>Admin Login</span>
              </button>
            `}

            <button id="quick-enroll-btn" class="btn-pill-gold px-5 py-2 text-xs font-bold flex items-center gap-2">
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
              ${item.protected && !isAuthenticated ? `<i class="fa-solid fa-lock text-amber-400 text-xs"></i>` : ''}
            </button>
          `).join('')}

          <div class="flex gap-2 mt-2 pt-2 border-t border-emerald-900/60">
            ${isAuthenticated ? `
              <button id="mobile-auth-logout" class="flex-1 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950 border border-rose-800 text-center">
                <i class="fa-solid fa-right-from-bracket mr-1"></i> Logout
              </button>
            ` : `
              <button id="mobile-auth-login" class="flex-1 py-2.5 rounded-xl text-xs font-bold text-organic-pillGold bg-emerald-950 border border-amber-500/50 text-center">
                <i class="fa-solid fa-lock mr-1 text-amber-400"></i> Admin Login
              </button>
            `}
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
    
    document.getElementById('auth-login-btn')?.addEventListener('click', onLoginClick);
    document.getElementById('mobile-auth-login')?.addEventListener('click', () => {
      onLoginClick();
      document.getElementById('mobile-menu')?.classList.add('hidden');
    });

    document.getElementById('auth-logout-btn')?.addEventListener('click', onLogoutClick);
    document.getElementById('mobile-auth-logout')?.addEventListener('click', () => {
      onLogoutClick();
      document.getElementById('mobile-menu')?.classList.add('hidden');
    });

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
