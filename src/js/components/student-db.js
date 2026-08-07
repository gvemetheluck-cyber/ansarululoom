/**
 * Student Database Table Component - Clean View (Without Student IDs)
 */
const StudentDBComponent = (function() {
  let searchKeyword = '';
  let selectedTeamFilter = 'All';

  function render(onAddStudent, onEditStudent, onAssignPrograms, onLogMarks, onDeleteStudent) {
    const students = MadrasaDB.getStudents();
    const programs = MadrasaDB.getPrograms();

    let filtered = students;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(kw) || 
        (s.guardian && s.guardian.toLowerCase().includes(kw))
      );
    }

    if (selectedTeamFilter !== 'All') {
      filtered = filtered.filter(s => (s.team || 'Quaf').toLowerCase() === selectedTeamFilter.toLowerCase());
    }

    return `
      <section id="database-section" class="py-16 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-organic-pillGold text-xs font-bold mb-2">
                <i class="fa-solid fa-users text-amber-400"></i>
                <span>Contestant Directory (${students.length} Registered)</span>
              </div>
              <h2 class="text-3xl font-title font-extrabold text-organic-creamText">
                Student & Team Management
              </h2>
              <p class="mt-1 text-organic-muted text-sm max-w-xl">
                Manage contestant registrations, team assignments (Quaf, Noon, Meem), and competition divisions.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button 
                id="add-student-btn"
                class="btn-pill-gold px-6 py-3 text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <i class="fa-solid fa-user-plus text-organic-darkText"></i>
                <span>Register Contestant</span>
              </button>
            </div>
          </div>

          <!-- Filters & Search Toolbar -->
          <div class="card-green rounded-3xl p-6 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Search by Name -->
            <div class="relative flex-grow">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-organic-muted text-sm"></i>
              <input 
                type="text" 
                id="student-search-input"
                placeholder="Search contestant by name or guardian..." 
                value="${NavbarComponent.escapeHTML(searchKeyword)}"
                class="w-full pl-11 pr-4 py-3 rounded-full bg-emerald-950/90 border border-emerald-700/80 text-organic-creamText placeholder-organic-muted text-xs focus:outline-none focus:border-amber-400"
              >
            </div>

            <!-- Team Filter Dropdown -->
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-organic-pillGold whitespace-nowrap"><i class="fa-solid fa-shield-halved mr-1"></i> Filter Team:</span>
              <select id="team-filter-select" class="px-4 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-organic-pillGold font-bold text-xs focus:outline-none">
                <option value="All" ${selectedTeamFilter === 'All' ? 'selected' : ''}>All Teams</option>
                <option value="Quaf" ${selectedTeamFilter === 'Quaf' ? 'selected' : ''}>Team Quaf (ق)</option>
                <option value="Noon" ${selectedTeamFilter === 'Noon' ? 'selected' : ''}>Team Noon (ن)</option>
                <option value="Meem" ${selectedTeamFilter === 'Meem' ? 'selected' : ''}>Team Meem (م)</option>
              </select>
            </div>
          </div>

          <!-- Students Data Table (Without Student IDs) -->
          <div class="card-green rounded-4xl border-emerald-700/60 shadow-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-emerald-950/90 text-organic-pillGold border-b border-emerald-800 uppercase font-extrabold text-[11px] tracking-wider">
                    <th class="py-4 px-6">Contestant Student Name</th>
                    <th class="py-4 px-6">Meelad Team</th>
                    <th class="py-4 px-6">Gender / Age</th>
                    <th class="py-4 px-6">Guardian Name</th>
                    <th class="py-4 px-6">Assigned Divisions</th>
                    <th class="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-emerald-800/50">
                  ${filtered.length === 0 ? `
                    <tr>
                      <td colspan="6" class="py-12 text-center text-organic-muted">
                        <i class="fa-solid fa-user-slash text-3xl mb-2 block text-emerald-600"></i>
                        <span>No contestant records matched your search filter.</span>
                      </td>
                    </tr>
                  ` : filtered.map(student => {
                    const teamName = student.team || 'Quaf';
                    const isQuaf = teamName === 'Quaf';
                    const isNoon = teamName === 'Noon';

                    const assignedProgNames = (student.assignedPrograms || []).map(pId => {
                      const prog = programs.find(p => p.id === pId);
                      return prog ? prog.name.split(' ')[0] : pId;
                    });

                    return `
                      <tr class="hover:bg-emerald-900/40 transition-colors">
                        <!-- Student Name -->
                        <td class="py-4 px-6 font-bold text-white text-sm">
                          <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-organic-pillGold font-bold text-xs shadow-inner">
                              <i class="fa-solid fa-user"></i>
                            </div>
                            <div>
                              <span class="block">${NavbarComponent.escapeHTML(student.name)}</span>
                              <span class="text-[10px] text-organic-muted font-normal">${student.phone || 'No Contact'}</span>
                            </div>
                          </div>
                        </td>

                        <!-- Meelad Team -->
                        <td class="py-4 px-6">
                          <span class="px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 ${
                            isQuaf ? 'bg-emerald-900 text-emerald-200 border border-emerald-600' :
                            isNoon ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                            'bg-amber-950 text-amber-300 border border-amber-700'
                          }">
                            <span class="font-arabic text-sm">${isQuaf ? 'ق' : isNoon ? 'ن' : 'م'}</span>
                            <span>Team ${teamName}</span>
                          </span>
                        </td>

                        <!-- Gender / Age -->
                        <td class="py-4 px-6 text-slate-200">
                          <span class="font-semibold">${student.gender || 'Male'}</span>
                          <span class="text-organic-muted text-[11px]"> (${student.age || 12} yrs)</span>
                        </td>

                        <!-- Guardian -->
                        <td class="py-4 px-6 text-slate-300 font-medium">
                          ${NavbarComponent.escapeHTML(student.guardian || 'Parent')}
                        </td>

                        <!-- Assigned Divisions -->
                        <td class="py-4 px-6">
                          <div class="flex flex-wrap gap-1">
                            ${assignedProgNames.length > 0 ? assignedProgNames.map(p => `
                              <span class="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                                ${NavbarComponent.escapeHTML(p)}
                              </span>
                            `).join('') : '<span class="text-organic-muted italic text-[11px]">Unassigned</span>'}
                          </div>
                        </td>

                        <!-- Action Buttons -->
                        <td class="py-4 px-6 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <button 
                              data-edit-id="${student.id}" 
                              class="edit-student-btn p-2 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors"
                              title="Edit Contestant Profile & Team"
                            >
                              <i class="fa-solid fa-pen-to-square"></i>
                            </button>

                            <button 
                              data-assign-id="${student.id}" 
                              class="assign-programs-btn p-2 rounded-full text-amber-300 hover:text-white hover:bg-emerald-900/60 transition-colors"
                              title="Assign Categories"
                            >
                              <i class="fa-solid fa-book-bookmark"></i>
                            </button>

                            <button 
                              data-delete-id="${student.id}" 
                              class="delete-student-btn p-2 rounded-full text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 transition-colors"
                              title="Delete Record"
                            >
                              <i class="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  function attachEvents(onAddStudent, onEditStudent, onAssignPrograms, onLogMarks, onDeleteStudent, onRefresh) {
    const searchInput = document.getElementById('student-search-input');
    const teamSelect = document.getElementById('team-filter-select');

    searchInput?.addEventListener('input', (e) => {
      searchKeyword = e.target.value;
      onRefresh();
    });

    teamSelect?.addEventListener('change', (e) => {
      selectedTeamFilter = e.target.value;
      onRefresh();
    });

    document.getElementById('add-student-btn')?.addEventListener('click', onAddStudent);

    document.querySelectorAll('.edit-student-btn').forEach(btn => {
      btn.addEventListener('click', () => onEditStudent(btn.dataset.editId));
    });

    document.querySelectorAll('.assign-programs-btn').forEach(btn => {
      btn.addEventListener('click', () => onAssignPrograms(btn.dataset.assignId));
    });

    document.querySelectorAll('.delete-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete this contestant record?`)) {
          onDeleteStudent(btn.dataset.deleteId);
        }
      });
    });
  }

  return { render, attachEvents };
})();
