/**
 * Student Database Management Component with Team Filter (Quaf, Noon, Meem)
 */
const StudentDBComponent = (function() {
  let searchQuery = '';
  let selectedProgramFilter = 'All';
  let selectedStatusFilter = 'All';
  let selectedTeamFilter = 'All';

  function render(onAddStudent, onEditStudent, onAssignPrograms, onLogMarks, onDeleteStudent) {
    const students = MadrasaDB.getStudents();
    const programs = MadrasaDB.getPrograms();

    const filteredStudents = students.filter(student => {
      const matchQuery = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.guardian.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProgram = selectedProgramFilter === 'All' || 
        (student.assignedPrograms && student.assignedPrograms.includes(selectedProgramFilter));

      const matchStatus = selectedStatusFilter === 'All' || student.status === selectedStatusFilter;
      const matchTeam = selectedTeamFilter === 'All' || (student.team || 'Quaf') === selectedTeamFilter;

      return matchQuery && matchProgram && matchStatus && matchTeam;
    });

    return `
      <section id="student-db-section" class="py-16 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-organic-pillGold text-xs font-bold mb-2">
                <i class="fa-solid fa-users text-amber-400"></i>
                <span>Team Database & Student Roster</span>
              </div>
              <h2 class="text-3xl font-title font-extrabold text-organic-creamText">
                Student Records & Team Management
              </h2>
              <p class="mt-1 text-organic-muted text-sm max-w-xl">
                Assign students to Team Quaf (ق), Team Noon (ن), or Team Meem (م), record scores, and track team standings.
              </p>
            </div>

            <!-- Action Controls -->
            <div class="flex flex-wrap items-center gap-3">
              <button 
                id="db-add-student-btn"
                class="btn-pill-gold px-5 py-3 text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <i class="fa-solid fa-user-plus text-organic-darkText"></i>
                <span>Register Student to Team</span>
              </button>

              <button 
                id="db-export-btn"
                class="px-4 py-3 rounded-full text-xs font-bold text-organic-creamText bg-emerald-900/40 border border-emerald-700/50 hover:bg-emerald-900/70 transition-colors flex items-center gap-2"
                title="Export Database JSON"
              >
                <i class="fa-solid fa-download text-organic-pillGold"></i>
                <span>Export DB</span>
              </button>

              <button 
                id="db-reset-btn"
                class="px-4 py-3 rounded-full text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 transition-colors"
                title="Reset Database to Default Seed Data"
              >
                <i class="fa-solid fa-rotate-left"></i>
              </button>
            </div>
          </div>

          <!-- Controls & Filters Bar -->
          <div class="card-green p-5 rounded-3xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <!-- Search Bar -->
            <div class="relative w-full md:w-80">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-organic-muted text-xs"></i>
              <input 
                type="text" 
                id="db-search-input"
                placeholder="Search Name, Student ID, Guardian..." 
                value="${NavbarComponent.escapeHTML(searchQuery)}"
                class="w-full pl-10 pr-4 py-3 rounded-full bg-emerald-950/90 border border-emerald-700/50 text-xs text-organic-creamText placeholder-organic-muted focus:outline-none focus:border-amber-400"
              >
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <!-- Team Filter -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-organic-muted font-bold">Team:</span>
                <select id="db-team-filter" class="bg-emerald-950/90 border border-emerald-700/50 text-xs text-organic-pillGold font-bold rounded-full px-4 py-2.5 focus:outline-none">
                  <option value="All">All Teams (Quaf, Noon, Meem)</option>
                  <option value="Quaf" ${selectedTeamFilter === 'Quaf' ? 'selected' : ''}>Team Quaf (ق)</option>
                  <option value="Noon" ${selectedTeamFilter === 'Noon' ? 'selected' : ''}>Team Noon (ن)</option>
                  <option value="Meem" ${selectedTeamFilter === 'Meem' ? 'selected' : ''}>Team Meem (م)</option>
                </select>
              </div>

              <!-- Program Filter -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-organic-muted font-bold">Program:</span>
                <select id="db-program-filter" class="bg-emerald-950/90 border border-emerald-700/50 text-xs text-emerald-300 font-bold rounded-full px-4 py-2.5 focus:outline-none">
                  <option value="All">All Categories (${programs.length})</option>
                  ${programs.map(p => `
                    <option value="${p.id}" ${selectedProgramFilter === p.id ? 'selected' : ''}>${p.name}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Status Filter -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-organic-muted font-bold">Status:</span>
                <select id="db-status-filter" class="bg-emerald-950/90 border border-emerald-700/50 text-xs text-organic-creamText rounded-full px-4 py-2.5 focus:outline-none">
                  <option value="All">All Statuses</option>
                  <option value="Active" ${selectedStatusFilter === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="Graduated" ${selectedStatusFilter === 'Graduated' ? 'selected' : ''}>Graduated</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Student Data Table -->
          <div class="card-green rounded-3xl overflow-hidden shadow-2xl">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-emerald-950/90 text-organic-muted border-b border-emerald-800/80 uppercase tracking-wider font-bold">
                    <th class="py-4 px-5">Student ID & Name</th>
                    <th class="py-4 px-5">Meelad Team</th>
                    <th class="py-4 px-5">Guardian & Contact</th>
                    <th class="py-4 px-5">Assigned Categories</th>
                    <th class="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-emerald-900/60">
                  ${filteredStudents.length === 0 ? `
                    <tr>
                      <td colspan="5" class="py-12 text-center text-organic-muted">
                        <i class="fa-solid fa-folder-open text-3xl mb-2 block text-emerald-600"></i>
                        <span>No student records found matching your team and program filters.</span>
                      </td>
                    </tr>
                  ` : filteredStudents.map(student => {
                    const assignedProgs = (student.assignedPrograms || []).map(pid => MadrasaDB.getProgramById(pid)).filter(Boolean);
                    const teamName = student.team || 'Quaf';
                    const isQuaf = teamName === 'Quaf';
                    const isNoon = teamName === 'Noon';

                    return `
                      <tr class="hover:bg-emerald-900/40 transition-colors group">
                        <!-- ID & Name -->
                        <td class="py-4 px-5">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-organic-pillGold font-bold">
                              ${student.gender === 'Female' ? '<i class="fa-solid fa-user-graduate"></i>' : '<i class="fa-solid fa-user-ninja"></i>'}
                            </div>
                            <div>
                              <div class="font-bold text-white text-sm group-hover:text-organic-pillGold transition-colors flex items-center gap-2">
                                <span>${NavbarComponent.escapeHTML(student.name)}</span>
                                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-organic-muted font-normal">${student.age} yrs</span>
                              </div>
                              <div class="text-[11px] font-mono text-organic-pillGold font-semibold mt-0.5">
                                ${student.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <!-- Team Badge -->
                        <td class="py-4 px-5">
                          <span class="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                            isQuaf ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600/60' :
                            isNoon ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60' :
                            'bg-amber-950 text-amber-300 border border-amber-700/60'
                          }">
                            <span class="font-arabic text-sm">${isQuaf ? 'ق' : isNoon ? 'ن' : 'م'}</span>
                            <span>Team ${teamName}</span>
                          </span>
                        </td>

                        <!-- Guardian & Contact -->
                        <td class="py-4 px-5">
                          <div class="text-organic-creamText font-semibold">${NavbarComponent.escapeHTML(student.guardian || 'N/A')}</div>
                          <div class="text-organic-muted text-[11px] flex items-center gap-2 mt-0.5">
                            <span><i class="fa-solid fa-phone text-emerald-400"></i> ${student.phone || '-'}</span>
                          </div>
                        </td>

                        <!-- Assigned Programs -->
                        <td class="py-4 px-5">
                          <div class="flex flex-wrap items-center gap-1.5">
                            ${assignedProgs.length === 0 ? `
                              <span class="text-organic-muted italic text-[11px]">Unassigned</span>
                            ` : assignedProgs.map(p => `
                              <span class="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-200 text-[11px] font-medium" title="${p.name}">
                                ${p.category}
                              </span>
                            `).join('')}
                          </div>
                        </td>

                        <!-- Actions -->
                        <td class="py-4 px-5 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <button 
                              data-assign-id="${student.id}"
                              class="db-action-assign p-2.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-organic-pillGold transition-colors" 
                              title="Assign Programs"
                            >
                              <i class="fa-solid fa-book-bookmark text-xs"></i>
                            </button>

                            <button 
                              data-marks-id="${student.id}"
                              class="db-action-marks p-2.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition-colors" 
                              title="Input Exam Marks"
                            >
                              <i class="fa-solid fa-pen-nib text-xs"></i>
                            </button>

                            <button 
                              data-edit-id="${student.id}"
                              class="db-action-edit p-2.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-cyan-300 transition-colors" 
                              title="Edit Profile & Team"
                            >
                              <i class="fa-solid fa-user-pen text-xs"></i>
                            </button>

                            <button 
                              data-delete-id="${student.id}"
                              class="db-action-delete p-2.5 rounded-full bg-emerald-950 hover:bg-rose-900/60 text-rose-400 transition-colors" 
                              title="Delete Record"
                            >
                              <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Table Footer -->
            <div class="px-6 py-4 bg-emerald-950/90 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-organic-muted gap-3">
              <div>
                Showing <span class="font-bold text-organic-pillGold">${filteredStudents.length}</span> of <span class="font-bold text-white">${students.length}</span> contestants
              </div>
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Team Quaf: ${students.filter(s=>(s.team||'Quaf')==='Quaf').length}</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Team Noon: ${students.filter(s=>s.team==='Noon').length}</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Team Meem: ${students.filter(s=>s.team==='Meem').length}</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  function attachEvents(onAddStudent, onEditStudent, onAssignPrograms, onLogMarks, onDeleteStudent, onRefresh) {
    document.getElementById('db-search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      onRefresh();
    });

    document.getElementById('db-team-filter')?.addEventListener('change', (e) => {
      selectedTeamFilter = e.target.value;
      onRefresh();
    });

    document.getElementById('db-program-filter')?.addEventListener('change', (e) => {
      selectedProgramFilter = e.target.value;
      onRefresh();
    });

    document.getElementById('db-status-filter')?.addEventListener('change', (e) => {
      selectedStatusFilter = e.target.value;
      onRefresh();
    });

    document.getElementById('db-add-student-btn')?.addEventListener('click', onAddStudent);

    document.getElementById('db-export-btn')?.addEventListener('click', () => {
      const data = {
        settings: MadrasaDB.getSettings(),
        students: MadrasaDB.getStudents(),
        programs: MadrasaDB.getPrograms(),
        results: MadrasaDB.getResults(),
        teams: MadrasaDB.getTeamStandings()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ansarul_uloom_meelad_db_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    });

    document.getElementById('db-reset-btn')?.addEventListener('click', () => {
      if (confirm('Reset database back to default Meelad Fest seed data?')) {
        MadrasaDB.resetToDefault();
        onRefresh();
      }
    });

    document.querySelectorAll('.db-action-assign').forEach(btn => {
      btn.addEventListener('click', () => onAssignPrograms(btn.dataset.assignId));
    });

    document.querySelectorAll('.db-action-marks').forEach(btn => {
      btn.addEventListener('click', () => onLogMarks(btn.dataset.marksId));
    });

    document.querySelectorAll('.db-action-edit').forEach(btn => {
      btn.addEventListener('click', () => onEditStudent(btn.dataset.editId));
    });

    document.querySelectorAll('.db-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this student record?')) {
          onDeleteStudent(btn.dataset.deleteId);
        }
      });
    });
  }

  return { render, attachEvents };
})();
