/**
 * Main Application Orchestrator & State Coordinator
 */
(function() {
  let activeTab = 'home';

  function initApp() {
    renderView();
    // Start countdown timer for events
    EventsComponent.startCountdownTimer('2026-08-20T09:00:00');
  }

  function renderView() {
    // Render Navbar
    NavbarComponent.render(
      activeTab, 
      (tab) => switchTab(tab),
      () => openEditNameModal(),
      () => openAddStudentModal()
    );

    // Render Footer
    FooterComponent.render((tab) => switchTab(tab));

    // Render Main Content
    const main = document.getElementById('main-content');
    if (!main) return;

    if (activeTab === 'home') {
      main.innerHTML = `
        ${HeroComponent.render((tab) => switchTab(tab), () => openAddStudentModal())}
        ${ProgramsComponent.render(
          (id) => openProgramDetailsModal(id),
          (id) => openQuickEnrollModal(id)
        )}
        ${EventsComponent.render((id) => openEventDetailsModal(id))}
      `;
      HeroComponent.attachEvents((tab) => switchTab(tab), () => openAddStudentModal());
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

    } else if (activeTab === 'database') {
      main.innerHTML = StudentDBComponent.render(
        () => openAddStudentModal(),
        (id) => openEditStudentModal(id),
        (id) => openAssignProgramsModal(id),
        (id) => openLogMarksModal(id),
        (id) => handleDeleteStudent(id)
      );
      StudentDBComponent.attachEvents(
        () => openAddStudentModal(),
        (id) => openEditStudentModal(id),
        (id) => openAssignProgramsModal(id),
        (id) => openLogMarksModal(id),
        (id) => handleDeleteStudent(id),
        () => renderView()
      );

    } else if (activeTab === 'results') {
      main.innerHTML = ResultsComponent.render((studentId) => openLogMarksModal(studentId));
      ResultsComponent.attachEvents(
        (studentId) => openLogMarksModal(studentId),
        () => renderView()
      );
    }

    // Scroll smoothly to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function switchTab(tab) {
    activeTab = tab;
    renderView();
  }

  // --- Modal Helpers ---
  function openModal(contentHtml) {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    if (!modalContainer || !modalContent) return;

    modalContent.innerHTML = contentHtml;
    modalContainer.classList.add('active');

    // Attach close listener
    modalContainer.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Close on clicking backdrop
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

  // --- Toast Notification System ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300' :
                    type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-300' :
                    'bg-amber-950/90 border-amber-500/50 text-amber-300';

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

  // --- MODAL DIALOG IMPLEMENTATIONS ---

  // 1. Edit Madrasa Name Modal
  function openEditNameModal() {
    const settings = MadrasaDB.getSettings();
    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i class="fa-solid fa-pen-to-square text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Customize Madrasa Branding</h3>
              <p class="text-xs text-slate-400">Update the official title displayed across the portal.</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="edit-name-form" class="mt-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Madrasa Official Name:</label>
            <input 
              type="text" 
              id="input-madrasa-name" 
              value="${NavbarComponent.escapeHTML(settings.madrasaName || 'Madrasa Al-Hikmah')}" 
              required
              class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-title text-base font-bold focus:outline-none focus:border-amber-400"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Motto / Tagline:</label>
            <input 
              type="text" 
              id="input-madrasa-tagline" 
              value="${NavbarComponent.escapeHTML(settings.tagline || '')}" 
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300">Save Changes</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('edit-name-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('input-madrasa-name').value.trim();
      const newTagline = document.getElementById('input-madrasa-tagline').value.trim();
      if (newName) {
        MadrasaDB.updateSettings({ madrasaName: newName, tagline: newTagline });
        document.title = `${newName} | Institute of Quranic Sciences`;
        showToast(`Madrasa name updated to "${newName}"!`, 'success');
        closeModal();
        renderView();
      }
    });
  }

  // 2. Program Details Modal
  function openProgramDetailsModal(programId) {
    const p = MadrasaDB.getProgramById(programId);
    if (!p) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
              <i class="fa-solid ${p.icon || 'fa-book-quran'}"></i>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">${p.category}</span>
              <h3 class="text-xl font-bold text-white mt-1">${NavbarComponent.escapeHTML(p.name)}</h3>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="mt-6 space-y-6 text-xs text-slate-300">
          <div>
            <h4 class="font-bold text-slate-200 text-sm mb-1">Program Overview</h4>
            <p class="leading-relaxed text-slate-300">${NavbarComponent.escapeHTML(p.description)}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span class="text-slate-500 block text-[10px] uppercase font-semibold">Lead Instructor</span>
              <span class="font-bold text-emerald-400">${NavbarComponent.escapeHTML(p.instructor)}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px] uppercase font-semibold">Schedule & Timings</span>
              <span class="font-semibold text-slate-200">${p.timing}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px] uppercase font-semibold">Program Duration</span>
              <span class="font-semibold text-slate-200">${p.duration}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px] uppercase font-semibold">Tuition Fee</span>
              <span class="font-bold text-amber-400">${p.fee}</span>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-slate-200 text-sm mb-2">Curriculum & Core Modules</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${(p.subjects || []).map(s => `
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-check-double text-amber-400"></i>
                  <span class="font-medium text-slate-200">${NavbarComponent.escapeHTML(s)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="mt-8 pt-4 flex items-center justify-between border-t border-slate-800">
          <button type="button" class="close-modal-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">Close</button>
          <button id="modal-enroll-action-btn" class="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-2">
            <i class="fa-solid fa-user-plus"></i>
            <span>Enroll Student in Course</span>
          </button>
        </div>
      </div>
    `);

    document.getElementById('modal-enroll-action-btn')?.addEventListener('click', () => {
      closeModal();
      openQuickEnrollModal(programId);
    });
  }

  // 3. Add Student Modal
  function openAddStudentModal() {
    const programs = MadrasaDB.getPrograms();

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i class="fa-solid fa-user-plus text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Enroll New Student</h3>
              <p class="text-xs text-slate-400">Input student personal details and initial program assignments.</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="add-student-form" class="mt-6 space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Full Student Name *</label>
              <input type="text" id="add-name" required placeholder="e.g. Abdullah Al-Mansoor" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-amber-400">
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Age / Gender *</label>
              <div class="flex gap-2">
                <input type="number" id="add-age" min="5" max="80" value="16" required class="w-1/2 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100">
                <select id="add-gender" class="w-1/2 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Guardian Name *</label>
              <input type="text" id="add-guardian" required placeholder="e.g. Tariq Al-Mansoor" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-amber-400">
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input type="text" id="add-phone" placeholder="+1 (555) 000-0000" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-amber-400">
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Email Address</label>
            <input type="email" id="add-email" placeholder="student@example.com" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-amber-400">
          </div>

          <div>
            <label class="block font-semibold text-amber-300 mb-2">Assign Academic Programs:</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-40 overflow-y-auto">
              ${programs.map(p => `
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
                  <input type="checkbox" name="add-programs" value="${p.id}" class="rounded border-slate-700 text-amber-500 focus:ring-amber-400">
                  <span class="text-slate-200 font-medium">${p.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300">Submit Admission</button>
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
        age: parseInt(document.getElementById('add-age').value),
        gender: document.getElementById('add-gender').value,
        guardian: document.getElementById('add-guardian').value.trim(),
        phone: document.getElementById('add-phone').value.trim(),
        email: document.getElementById('add-email').value.trim(),
        assignedPrograms: selectedProgIds,
        status: 'Active'
      };

      const saved = MadrasaDB.saveStudent(newStudent);
      showToast(`Student ${saved.name} enrolled successfully! (ID: ${saved.id})`, 'success');
      closeModal();
      renderView();
    });
  }

  // 4. Quick Enroll for specific program
  function openQuickEnrollModal(programId) {
    openAddStudentModal();
    // Pre-check the target program
    setTimeout(() => {
      const cb = document.querySelector(`input[name="add-programs"][value="${programId}"]`);
      if (cb) cb.checked = true;
    }, 50);
  }

  // 5. Edit Student Modal
  function openEditStudentModal(studentId) {
    const s = MadrasaDB.getStudentById(studentId);
    if (!s) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <i class="fa-solid fa-user-pen text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Edit Profile: ${NavbarComponent.escapeHTML(s.name)}</h3>
              <p class="text-xs text-amber-400 font-mono">Student ID: ${s.id}</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="edit-student-form" class="mt-6 space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Full Student Name</label>
              <input type="text" id="edit-name" value="${NavbarComponent.escapeHTML(s.name)}" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100">
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Status</label>
              <select id="edit-status" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-bold">
                <option value="Active" ${s.status==='Active'?'selected':''}>Active</option>
                <option value="Graduated" ${s.status==='Graduated'?'selected':''}>Graduated</option>
                <option value="Pending" ${s.status==='Pending'?'selected':''}>Pending</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Guardian Name</label>
              <input type="text" id="edit-guardian" value="${NavbarComponent.escapeHTML(s.guardian)}" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100">
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Phone</label>
              <input type="text" id="edit-phone" value="${NavbarComponent.escapeHTML(s.phone || '')}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100">
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300">Save Profile</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('edit-student-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      s.name = document.getElementById('edit-name').value.trim();
      s.guardian = document.getElementById('edit-guardian').value.trim();
      s.phone = document.getElementById('edit-phone').value.trim();
      s.status = document.getElementById('edit-status').value;

      MadrasaDB.saveStudent(s);
      showToast(`Updated record for ${s.name}`, 'success');
      closeModal();
      renderView();
    });
  }

  // 6. Assign Programs Modal
  function openAssignProgramsModal(studentId) {
    const s = MadrasaDB.getStudentById(studentId);
    const programs = MadrasaDB.getPrograms();
    if (!s) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i class="fa-solid fa-book-bookmark text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Assign Programs: ${NavbarComponent.escapeHTML(s.name)}</h3>
              <p class="text-xs text-slate-400">Select active programs for student roll ID <span class="font-mono text-amber-400">${s.id}</span></p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="assign-programs-form" class="mt-6 space-y-4 text-xs">
          <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
            ${programs.map(p => {
              const isAssigned = (s.assignedPrograms || []).includes(p.id);
              return `
                <label class="flex items-center justify-between p-3 rounded-xl bg-slate-950 border ${isAssigned ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800'} cursor-pointer hover:border-amber-500/30 transition-colors">
                  <div class="flex items-center gap-3">
                    <input type="checkbox" name="assign-prog" value="${p.id}" ${isAssigned ? 'checked' : ''} class="rounded border-slate-700 text-amber-500 focus:ring-amber-400 w-4 h-4">
                    <div>
                      <span class="font-bold text-white block">${p.name}</span>
                      <span class="text-[11px] text-slate-400">${p.timing} • ${p.instructor}</span>
                    </div>
                  </div>
                  <span class="text-xs font-semibold text-amber-400">${p.fee}</span>
                </label>
              `;
            }).join('')}
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300">Update Assignments</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('assign-programs-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll('input[name="assign-prog"]:checked');
      const selected = Array.from(checkboxes).map(cb => cb.value);

      MadrasaDB.assignStudentToPrograms(studentId, selected);
      showToast(`Updated program assignments for ${s.name}`, 'success');
      closeModal();
      renderView();
    });
  }

  // 7. Log Exam Marks Modal
  function openLogMarksModal(defaultStudentId) {
    const students = MadrasaDB.getStudents();
    const targetStudent = MadrasaDB.getStudentById(defaultStudentId) || students[0];
    const programs = MadrasaDB.getPrograms();

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <i class="fa-solid fa-pen-nib text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Input Exam Subject Marks</h3>
              <p class="text-xs text-slate-400">Record scores and generate automated letter grades.</p>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="log-marks-form" class="mt-6 space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Select Student *</label>
              <select id="marks-student-id" class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-bold">
                ${students.map(s => `
                  <option value="${s.id}" ${targetStudent && s.id === targetStudent.id ? 'selected' : ''}>
                    ${s.name} (${s.id})
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Program *</label>
              <select id="marks-program-id" class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200">
                ${programs.map(p => `
                  <option value="${p.id}">${p.name}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1">Exam Term</label>
              <input type="text" id="marks-term" value="Spring 2026" required class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200">
            </div>
          </div>

          <!-- Subject Marks Fields Container -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="font-bold text-amber-300">Subject Scores:</label>
              <button type="button" id="add-subject-row-btn" class="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                <i class="fa-solid fa-plus-circle"></i> Add Subject Row
              </button>
            </div>

            <div id="subject-rows-container" class="space-y-2">
              <!-- Initial 3 subject rows -->
              <div class="subject-row flex items-center gap-2">
                <input type="text" placeholder="Subject Name (e.g. Tajweed)" value="Tajweed & Makharij" class="subj-name flex-grow px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200">
                <input type="number" placeholder="Score" value="95" min="0" max="100" class="subj-score w-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-bold">
                <span class="text-slate-400 font-bold">/ 100</span>
              </div>
              <div class="subject-row flex items-center gap-2">
                <input type="text" placeholder="Subject Name" value="Quran Memorization" class="subj-name flex-grow px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200">
                <input type="number" placeholder="Score" value="92" min="0" max="100" class="subj-score w-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-bold">
                <span class="text-slate-400 font-bold">/ 100</span>
              </div>
              <div class="subject-row flex items-center gap-2">
                <input type="text" placeholder="Subject Name" value="Revision & Retention" class="subj-name flex-grow px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200">
                <input type="number" placeholder="Score" value="94" min="0" max="100" class="subj-score w-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-bold">
                <span class="text-slate-400 font-bold">/ 100</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Teacher Remarks / Notes:</label>
            <textarea id="marks-remarks" rows="2" placeholder="Exceptional recitation and consistent attendance..." class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-400"></textarea>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button type="button" class="close-modal-btn px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300">Save Exam Results</button>
          </div>
        </form>
      </div>
    `);

    document.getElementById('add-subject-row-btn')?.addEventListener('click', () => {
      const container = document.getElementById('subject-rows-container');
      if (container) {
        const row = document.createElement('div');
        row.className = 'subject-row flex items-center gap-2';
        row.innerHTML = `
          <input type="text" placeholder="Subject Name" class="subj-name flex-grow px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200">
          <input type="number" placeholder="Score" value="90" min="0" max="100" class="subj-score w-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-bold">
          <span class="text-slate-400 font-bold">/ 100</span>
        `;
        container.appendChild(row);
      }
    });

    document.getElementById('log-marks-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentId = document.getElementById('marks-student-id').value;
      const programId = document.getElementById('marks-program-id').value;
      const term = document.getElementById('marks-term').value.trim();
      const remarks = document.getElementById('marks-remarks').value.trim();

      const rows = document.querySelectorAll('.subject-row');
      const marks = [];
      rows.forEach(r => {
        const name = r.querySelector('.subj-name').value.trim();
        const score = parseFloat(r.querySelector('.subj-score').value || 0);
        if (name) {
          marks.push({ subject: name, score: score, max: 100 });
        }
      });

      if (marks.length === 0) {
        alert('Please add at least one subject score.');
        return;
      }

      const res = MadrasaDB.saveResult({
        studentId: studentId,
        programId: programId,
        term: term,
        marks: marks,
        remarks: remarks
      });

      showToast(`Logged marks for student ${studentId}. Calculated Grade: ${res.grade}`, 'success');
      closeModal();
      activeTab = 'results';
      renderView();
    });
  }

  // 8. Event Details Modal
  function openEventDetailsModal(eventId) {
    const events = MadrasaDB.getEvents();
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    openModal(`
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
              <i class="fa-solid ${evt.imageIcon || 'fa-calendar-days'}"></i>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">${evt.category}</span>
              <h3 class="text-xl font-bold text-white mt-1">${NavbarComponent.escapeHTML(evt.title)}</h3>
            </div>
          </div>
          <button class="close-modal-btn p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="mt-6 space-y-4 text-xs text-slate-300">
          <p class="text-slate-200 leading-relaxed text-sm">${NavbarComponent.escapeHTML(evt.description)}</p>

          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
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

        <div class="mt-8 pt-4 flex items-center justify-between border-t border-slate-800">
          <button type="button" class="close-modal-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">Close</button>
          <button id="modal-rsvp-btn" class="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-2">
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
    MadrasaDB.deleteStudent(studentId);
    showToast(`Deleted student record ${studentId}`, 'error');
    renderView();
  }

  // Initialize App on DOM Load
  document.addEventListener('DOMContentLoaded', initApp);

  // Fallback in case DOM is already ready
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initApp();
  }
})();
