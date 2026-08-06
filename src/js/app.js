/**
 * Main Application Orchestrator & Router
 * Ansarul Uloom Madrasa, Andona, Thamarassery, Kozhikkode
 * Includes Dedicated Judge Portal & Public Results Access
 */
(function() {
  let activeTab = 'home';

  function initApp() {
    renderView();
    EventsComponent.startCountdownTimer('2026-08-25T08:00:00');
  }

  function renderView() {
    NavbarComponent.render(
      activeTab, 
      (tab) => switchTab(tab),
      () => openEditNameModal(),
      () => openAddStudentModal(),
      () => openLoginModal('judge'),
      () => handleLogout()
    );

    FooterComponent.render((tab) => switchTab(tab));

    const main = document.getElementById('main-content');
    if (!main) return;

    if (activeTab === 'home') {
      main.innerHTML = `
        ${HeroComponent.render((tab) => switchTab(tab), () => switchTab('judge'))}
        ${ProgramsComponent.render(
          (id) => openProgramDetailsModal(id),
          (id) => openQuickEnrollModal(id)
        )}
        ${EventsComponent.render((id) => openEventDetailsModal(id))}
      `;
      HeroComponent.attachEvents((tab) => switchTab(tab), () => switchTab('judge'));
      ProgramsComponent.attachEvents(
        (id) => openProgramDetailsModal(id),
        (id) => openQuickEnrollModal(id),
        () => renderView()
      );
      EventsComponent.attachEvents(
        (id) => openEventDetailsModal(id),
        () => renderView(),
        (id) => handleRSVP(id)
      );

    } else if (activeTab === 'programs') {
      main.innerHTML = ProgramsComponent.render(
        (id) => openProgramDetailsModal(id),
        (id) => openQuickEnrollModal(id)
      );
      ProgramsComponent.attachEvents(
        (id) => openProgramDetailsModal(id),
        (id) => openQuickEnrollModal(id),
        () => renderView()
      );

    } else if (activeTab === 'events') {
      main.innerHTML = EventsComponent.render((id) => openEventDetailsModal(id));
      EventsComponent.attachEvents(
        (id) => openEventDetailsModal(id),
        () => renderView(),
        (id) => handleRSVP(id)
      );

    } else if (activeTab === 'results') {
      // PUBLIC ACCESS TO EVERYONE!
      main.innerHTML = ResultsComponent.render((studentId) => switchTab('judge'));
      ResultsComponent.attachEvents(
        (studentId) => switchTab('judge'),
        () => renderView()
      );

    } else if (activeTab === 'judge') {
      // Protected Judge Check
      if (!MadrasaDB.isAuthenticated()) {
        openLoginModal('judge');
        return;
      }
      main.innerHTML = JudgePortalComponent.render();
      JudgePortalComponent.attachEvents(
        (resultObj) => handleJudgeSubmitScore(resultObj),
        () => handleLogout(),
        () => renderView()
      );

    } else if (activeTab === 'database') {
      // Protected Admin Check
      if (!MadrasaDB.isAuthenticated()) {
        openLoginModal('database');
        return;
      }
      main.innerHTML = StudentDBComponent.render(
        () => openAddStudentModal(),
        (id) => openEditStudentModal(id),
        (id) => openAssignProgramsModal(id),
        (id) => switchTab('judge'),
        (id) => handleDeleteStudent(id)
      );
      StudentDBComponent.attachEvents(
        () => openAddStudentModal(),
        (id) => openEditStudentModal(id),
        (id) => openAssignProgramsModal(id),
        (id) => switchTab('judge'),
        (id) => handleDeleteStudent(id),
        () => renderView()
      );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function switchTab(tab) {
    // Intercept protected tabs if not logged in
    if ((tab === 'judge' || tab === 'database') && !MadrasaDB.isAuthenticated()) {
      openLoginModal(tab);
      return;
    }
    activeTab = tab;
    renderView();
  }

  function openModal(contentHtml) {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    if (!modalContainer || !modalContent) return;

    modalContent.innerHTML = contentHtml;
    modalContainer.classList.add('active');

    modalContainer.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    modalContainer.onclick = function(e) {
      if (e.target === modalContainer) closeModal();
    };
  }

  function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.classList.remove('active');
    }
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-300' :
                    type === 'error' ? 'bg-rose-950/95 border-rose-500/50 text-rose-300' :
                    'bg-amber-950/95 border-amber-500/50 text-amber-300';

    const icon = type === 'success' ? 'fa-circle-check text-emerald-400' :
                 type === 'error' ? 'fa-circle-xmark text-rose-400' :
                 'fa-circle-info text-amber-400';

    toast.className = `pointer-events-auto px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-3 transform transition-all duration-300 translate-y-2 opacity-0 ${bgColor}`;
    toast.innerHTML = `
      <i class="fa-solid ${icon} text-base"></i>
      <span>${NavbarComponent.escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- AUTHENTICATION MODAL ---

  function openLoginModal(targetTabAfterLogin = 'judge') {
    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
              <i class="fa-solid fa-gavel"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Judge & Admin Authentication</h3>
              <p class="text-xs text-organic-muted">Enter credentials to unlock Judge Portal & Student Database.</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-organic-muted hover:text-white rounded-full hover:bg-emerald-900/40">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="login-auth-form" class="mt-6 space-y-4 text-xs">
          <div id="login-error-msg" class="hidden p-3 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 font-bold flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation text-rose-400"></i>
            <span id="login-error-text">Invalid credentials.</span>
          </div>

          <div>
            <label class="block font-semibold text-organic-creamText mb-1.5">Username *</label>
            <div class="relative">
              <i class="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-organic-muted text-xs"></i>
              <input 
                type="text" 
                id="login-username" 
                required 
                placeholder="e.g. judge" 
                class="w-full pl-10 pr-4 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-organic-pillGold font-bold focus:outline-none focus:border-amber-400"
              >
            </div>
          </div>

          <div>
            <label class="block font-semibold text-organic-creamText mb-1.5">Password *</label>
            <div class="relative">
              <i class="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-organic-muted text-xs"></i>
              <input 
                type="password" 
                id="login-password" 
                required 
                placeholder="••••••••" 
                class="w-full pl-10 pr-10 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100 focus:outline-none focus:border-amber-400"
              >
              <button 
                type="button" 
                id="toggle-password-btn" 
                class="absolute right-4 top-1/2 -translate-y-1/2 text-organic-muted hover:text-white"
              >
                <i class="fa-solid fa-eye" id="toggle-password-icon"></i>
              </button>
            </div>
          </div>

          <!-- Credential Hint -->
          <div class="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-800 text-[11px] text-organic-muted space-y-1">
            <div class="font-bold text-amber-300 flex items-center gap-1.5">
              <i class="fa-solid fa-shield-halved"></i> Login Credentials:
            </div>
            <div>• **Judge Credentials**: Username: <code class="text-amber-300 font-mono">judge</code> | Password: <code class="text-amber-300 font-mono">judge2026</code> (or <code class="text-amber-300 font-mono">judge123</code>)</div>
            <div>• **Admin Credentials**: Username: <code class="text-amber-300 font-mono">admin</code> | Password: <code class="text-amber-300 font-mono">ansarululoom2026</code> (or <code class="text-amber-300 font-mono">admin123</code>)</div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-emerald-800/80">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-full text-organic-muted hover:text-white">Cancel</button>
            <button type="submit" class="btn-pill-gold px-8 py-3 text-xs font-bold flex items-center gap-2 shadow-lg">
              <i class="fa-solid fa-unlock"></i>
              <span>Authenticate & Enter Portal</span>
            </button>
          </div>
        </form>
      </div>
    `);

    const pwdInput = document.getElementById('login-password');
    const pwdBtn = document.getElementById('toggle-password-btn');
    const pwdIcon = document.getElementById('toggle-password-icon');

    pwdBtn?.addEventListener('click', () => {
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        pwdIcon.className = 'fa-solid fa-eye-slash';
      } else {
        pwdInput.type = 'password';
        pwdIcon.className = 'fa-solid fa-eye';
      }
    });

    document.getElementById('login-auth-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('login-username').value;
      const passVal = document.getElementById('login-password').value;

      const res = MadrasaDB.login(userVal, passVal);
      if (res.success) {
        showToast(`Welcome back, ${res.session.username}! Judge Session Active.`, 'success');
        closeModal();
        if (targetTabAfterLogin) {
          activeTab = targetTabAfterLogin;
        }
        renderView();
      } else {
        const errorBox = document.getElementById('login-error-msg');
        const errorText = document.getElementById('login-error-text');
        if (errorBox && errorText) {
          errorText.textContent = res.error || 'Invalid credentials.';
          errorBox.classList.remove('hidden');
        }
      }
    });
  }

  function handleLogout() {
    MadrasaDB.logout();
    showToast('Signed out of Judge Session.', 'info');
    activeTab = 'results';
    renderView();
  }

  function handleJudgeSubmitScore(resultObj) {
    const saved = MadrasaDB.saveResult(resultObj);
    const student = MadrasaDB.getStudentById(resultObj.studentId);
    const teamName = student ? (student.team || 'Quaf') : 'Quaf';

    showToast(`Saved Evaluation for ${student ? student.name : resultObj.studentId}! ${saved.grade} (+${saved.pointsAwarded} Pts awarded to Team ${teamName})`, 'success');
    renderView();
  }

  // --- OTHER MODALS ---

  function openEditNameModal() {
    const settings = MadrasaDB.getSettings();
    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i class="fa-solid fa-pen-to-square text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Customize Madrasa Branding</h3>
              <p class="text-xs text-organic-muted">Update official title displayed across the portal.</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-organic-muted hover:text-white rounded-full hover:bg-emerald-900/40">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="edit-name-form" class="mt-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-organic-creamText mb-1">Madrasa Official Name:</label>
            <input 
              type="text" 
              id="input-madrasa-name" 
              value="${NavbarComponent.escapeHTML(settings.madrasaName || 'Ansarul Uloom Madrasa')}" 
              required
              class="w-full px-4 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-organic-pillGold font-title text-base font-bold focus:outline-none focus:border-amber-400"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-organic-creamText mb-1">Location / Tagline:</label>
            <input 
              type="text" 
              id="input-madrasa-tagline" 
              value="${NavbarComponent.escapeHTML(settings.location || 'Andona, Thamarassery, Kozhikkode')}" 
              class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-emerald-800/80">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-full text-xs font-semibold text-organic-muted hover:bg-emerald-900/40">Cancel</button>
            <button type="submit" class="btn-pill-gold px-6 py-2.5 text-xs font-bold">Save Changes</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('edit-name-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('input-madrasa-name').value.trim();
      const newTagline = document.getElementById('input-madrasa-tagline').value.trim();
      if (newName) {
        MadrasaDB.updateSettings({ madrasaName: newName, location: newTagline });
        document.title = `${newName} | Meelad Fest Portal`;
        showToast(`Madrasa title updated to "${newName}"!`, 'success');
        closeModal();
        renderView();
      }
    });
  }

  function openProgramDetailsModal(programId) {
    const p = MadrasaDB.getProgramById(programId);
    if (!p) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
              <i class="fa-solid ${p.icon || 'fa-book-quran'}"></i>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold px-3 py-0.5 rounded-full bg-emerald-900 text-organic-pillGold border border-emerald-700">${p.category}</span>
              <h3 class="text-xl font-bold text-white mt-1">${NavbarComponent.escapeHTML(p.name)}</h3>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-organic-muted hover:text-white rounded-full hover:bg-emerald-900/40">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="mt-6 space-y-6 text-xs text-slate-300">
          <div>
            <h4 class="font-bold text-organic-creamText text-sm mb-1">Division Overview</h4>
            <p class="leading-relaxed text-organic-muted">${NavbarComponent.escapeHTML(p.description)}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-emerald-950 border border-emerald-800">
            <div>
              <span class="text-organic-muted block text-[10px] uppercase font-semibold">Stage Convenor</span>
              <span class="font-bold text-emerald-300">${NavbarComponent.escapeHTML(p.instructor)}</span>
            </div>
            <div>
              <span class="text-organic-muted block text-[10px] uppercase font-semibold">Stage & Timings</span>
              <span class="font-semibold text-slate-200">${p.timing}</span>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-organic-creamText text-sm mb-2">Contest Items Included (${(p.subjects||[]).length}):</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${(p.subjects || []).map(s => `
                <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center gap-2">
                  <i class="fa-solid fa-check text-amber-400"></i>
                  <span class="font-semibold text-slate-200">${NavbarComponent.escapeHTML(s)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="mt-8 pt-4 flex items-center justify-between border-t border-emerald-800/80">
          <button type="button" class="close-modal-btn px-4 py-2 rounded-full text-xs font-semibold text-organic-muted hover:text-white">Close</button>
          <button id="modal-enroll-action-btn" class="btn-pill-gold px-6 py-2.5 text-xs font-bold flex items-center gap-2">
            <i class="fa-solid fa-user-plus"></i>
            <span>Register Student to Category</span>
          </button>
        </div>
      </div>
    `);

    document.getElementById('modal-enroll-action-btn')?.addEventListener('click', () => {
      closeModal();
      openQuickEnrollModal(programId);
    });
  }

  function openAddStudentModal() {
    if (!MadrasaDB.isAuthenticated()) {
      openLoginModal('database');
      return;
    }

    const programs = MadrasaDB.getPrograms();

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i class="fa-solid fa-user-plus text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Register Student & Assign Team</h3>
              <p class="text-xs text-organic-muted">Add contestant details and select Team Quaf (ق), Team Noon (ن), or Team Meem (م).</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-organic-muted hover:text-white rounded-full hover:bg-emerald-900/40">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="add-student-form" class="mt-6 space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Full Student Name *</label>
              <input type="text" id="add-name" required placeholder="e.g. Muhammed Sinan" class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100 focus:border-amber-400">
            </div>

            <div>
              <label class="block font-semibold text-organic-pillGold mb-1">Select Meelad Team *</label>
              <select id="add-team" class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-amber-500/60 text-amber-300 font-bold">
                <option value="Quaf">Team Quaf (ق)</option>
                <option value="Noon">Team Noon (ن)</option>
                <option value="Meem">Team Meem (م)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Age / Gender *</label>
              <div class="flex gap-2">
                <input type="number" id="add-age" min="4" max="80" value="12" required class="w-1/2 px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100">
                <select id="add-gender" class="w-1/2 px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Guardian Name *</label>
              <input type="text" id="add-guardian" required placeholder="e.g. Abdurahiman Andona" class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100 focus:border-amber-400">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Contact Phone</label>
              <input type="text" id="add-phone" placeholder="+91 98470 00000" class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100 focus:border-amber-400">
            </div>
            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Email (Optional)</label>
              <input type="email" id="add-email" placeholder="student@example.com" class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100 focus:border-amber-400">
            </div>
          </div>

          <div>
            <label class="block font-semibold text-organic-pillGold mb-2">Assign Competition Divisions:</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-emerald-950 border border-emerald-800 max-h-36 overflow-y-auto">
              ${programs.map(p => `
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-emerald-900/50 transition-colors">
                  <input type="checkbox" name="add-programs" value="${p.id}" class="rounded border-emerald-700 text-amber-500 focus:ring-amber-400">
                  <span class="text-slate-200 font-medium">${p.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-emerald-800/80">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-full text-organic-muted hover:text-white">Cancel</button>
            <button type="submit" class="btn-pill-gold px-6 py-2.5 text-xs font-bold">Register Student</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('add-student-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll('input[name="add-programs"]:checked');
      const selectedProgIds = Array.from(checkboxes).map(cb => cb.value);

      const newStudent = {
        name: document.getElementById('add-name').value.trim(),
        team: document.getElementById('add-team').value,
        age: parseInt(document.getElementById('add-age').value),
        gender: document.getElementById('add-gender').value,
        guardian: document.getElementById('add-guardian').value.trim(),
        phone: document.getElementById('add-phone').value.trim(),
        email: document.getElementById('add-email').value.trim(),
        assignedPrograms: selectedProgIds,
        status: 'Active'
      };

      const saved = MadrasaDB.saveStudent(newStudent);
      showToast(`Registered ${saved.name} in Team ${saved.team}! (ID: ${saved.id})`, 'success');
      closeModal();
      renderView();
    });
  }

  function openQuickEnrollModal(programId) {
    openAddStudentModal();
    setTimeout(() => {
      const cb = document.querySelector(`input[name="add-programs"][value="${programId}"]`);
      if (cb) cb.checked = true;
    }, 50);
  }

  function openEditStudentModal(studentId) {
    if (!MadrasaDB.isAuthenticated()) {
      openLoginModal('database');
      return;
    }
    const s = MadrasaDB.getStudentById(studentId);
    if (!s) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <i class="fa-solid fa-user-pen text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Edit Profile & Team: ${NavbarComponent.escapeHTML(s.name)}</h3>
              <p class="text-xs text-organic-pillGold font-mono">Student ID: ${s.id}</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-organic-muted hover:text-white rounded-full hover:bg-emerald-900/40">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="edit-student-form" class="mt-6 space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Full Student Name</label>
              <input type="text" id="edit-name" value="${NavbarComponent.escapeHTML(s.name)}" required class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100">
            </div>

            <div>
              <label class="block font-semibold text-organic-pillGold mb-1">Meelad Team Assignment</label>
              <select id="edit-team" class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-amber-500/60 text-amber-300 font-bold">
                <option value="Quaf" ${s.team==='Quaf'?'selected':''}>Team Quaf (ق)</option>
                <option value="Noon" ${s.team==='Noon'?'selected':''}>Team Noon (ن)</option>
                <option value="Meem" ${s.team==='Meem'?'selected':''}>Team Meem (م)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Guardian Name</label>
              <input type="text" id="edit-guardian" value="${NavbarComponent.escapeHTML(s.guardian)}" required class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100">
            </div>
            <div>
              <label class="block font-semibold text-organic-creamText mb-1">Phone</label>
              <input type="text" id="edit-phone" value="${NavbarComponent.escapeHTML(s.phone || '')}" class="w-full px-4 py-2.5 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100">
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-emerald-800/80">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-full text-organic-muted hover:text-white">Cancel</button>
            <button type="submit" class="btn-pill-gold px-6 py-2.5 text-xs font-bold">Save Profile</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('edit-student-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      s.name = document.getElementById('edit-name').value.trim();
      s.team = document.getElementById('edit-team').value;
      s.guardian = document.getElementById('edit-guardian').value.trim();
      s.phone = document.getElementById('edit-phone').value.trim();

      MadrasaDB.saveStudent(s);
      showToast(`Updated record for ${s.name} (Team ${s.team})`, 'success');
      closeModal();
      renderView();
    });
  }

  function openAssignProgramsModal(studentId) {
    if (!MadrasaDB.isAuthenticated()) {
      openLoginModal('database');
      return;
    }
    const s = MadrasaDB.getStudentById(studentId);
    const programs = MadrasaDB.getPrograms();
    if (!s) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i class="fa-solid fa-book-bookmark text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Assign Categories: ${NavbarComponent.escapeHTML(s.name)}</h3>
              <p class="text-xs text-organic-muted">Student ID: <span class="font-mono text-organic-pillGold">${s.id}</span> | Team: <strong>${s.team || 'Quaf'}</strong></p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-organic-muted hover:text-white rounded-full hover:bg-emerald-900/40">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="assign-programs-form" class="mt-6 space-y-4 text-xs">
          <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
            ${programs.map(p => {
              const isAssigned = (s.assignedPrograms || []).includes(p.id);
              return `
                <label class="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950 border ${isAssigned ? 'border-amber-500/60 bg-amber-500/10' : 'border-emerald-800'} cursor-pointer hover:border-amber-500/40 transition-colors">
                  <div class="flex items-center gap-3">
                    <input type="checkbox" name="assign-prog" value="${p.id}" ${isAssigned ? 'checked' : ''} class="rounded border-emerald-700 text-amber-500 focus:ring-amber-400 w-4 h-4">
                    <div>
                      <span class="font-bold text-white block">${p.name}</span>
                      <span class="text-[11px] text-organic-muted">${p.timing}</span>
                    </div>
                  </div>
                </label>
              `;
            }).join('')}
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-emerald-800/80">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-full text-organic-muted hover:text-white">Cancel</button>
            <button type="submit" class="btn-pill-gold px-6 py-2.5 text-xs font-bold">Update Assignments</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('assign-programs-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll('input[name="assign-prog"]:checked');
      const selected = Array.from(checkboxes).map(cb => cb.value);

      MadrasaDB.assignStudentToPrograms(studentId, selected);
      showToast(`Updated assignments for ${s.name}`, 'success');
      closeModal();
      renderView();
    });
  }

  function openEventDetailsModal(eventId) {
    const events = MadrasaDB.getEvents();
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
              <i class="fa-solid ${evt.imageIcon || 'fa-calendar-days'}"></i>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold px-3 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700">${evt.category}</span>
              <h3 class="text-xl font-bold text-white mt-1">${NavbarComponent.escapeHTML(evt.title)}</h3>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-organic-muted hover:text-white rounded-full hover:bg-emerald-900/40">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="mt-6 space-y-4 text-xs text-slate-300">
          <p class="text-organic-creamText leading-relaxed text-sm">${NavbarComponent.escapeHTML(evt.description)}</p>

          <div class="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 space-y-2">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-calendar-day text-amber-400 w-4"></i>
              <span><strong>Date:</strong> ${evt.date}</span>
            </div>
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-clock text-amber-400 w-4"></i>
              <span><strong>Timings:</strong> ${evt.time}</span>
            </div>
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-location-dot text-emerald-400 w-4"></i>
              <span><strong>Venue:</strong> ${evt.location}</span>
            </div>
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-users text-cyan-400 w-4"></i>
              <span><strong>Confirmed RSVPs:</strong> ${evt.rsvpCount} Attending</span>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-4 flex items-center justify-between border-t border-emerald-800/80">
          <button type="button" class="close-modal-btn px-4 py-2 rounded-full text-xs font-semibold text-organic-muted hover:text-white">Close</button>
          <button id="modal-rsvp-btn" class="btn-pill-gold px-6 py-2.5 text-xs font-bold flex items-center gap-2">
            <i class="fa-solid fa-square-check"></i>
            <span>Confirm RSVP Now</span>
          </button>
        </div>
      </div>
    `);

    document.getElementById('modal-rsvp-btn')?.addEventListener('click', () => {
      handleRSVP(eventId);
      closeModal();
    });
  }

  function handleRSVP(eventId) {
    const updated = MadrasaDB.incrementRSVP(eventId);
    if (updated) {
      showToast(`RSVP Confirmed for "${updated.title}"! Total Attendees: ${updated.rsvpCount}`, 'success');
      renderView();
    }
  }

  function handleDeleteStudent(studentId) {
    if (!MadrasaDB.isAuthenticated()) {
      openLoginModal('database');
      return;
    }
    MadrasaDB.deleteStudent(studentId);
    showToast(`Deleted record for student ${studentId}`, 'error');
    renderView();
  }

  document.addEventListener('DOMContentLoaded', initApp);

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initApp();
  }
})();
