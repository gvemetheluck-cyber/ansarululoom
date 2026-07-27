/**
 * Student Database Management System Component
 */
const StudentDBComponent = (function() {
  let searchQuery = '';
  let selectedProgramFilter = 'All';
  let selectedStatusFilter = 'All';

  function render(onAddStudent, onEditStudent, onAssignPrograms, onLogMarks, onDeleteStudent) {
    const students = MadrasaDB.getStudents();
    const programs = MadrasaDB.getPrograms();

    // Filtering logic
    const filteredStudents = students.filter(student => {
      const matchQuery = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.guardian.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProgram = selectedProgramFilter === 'All' || 
        (student.assignedPrograms && student.assignedPrograms.includes(selectedProgramFilter));

      const matchStatus = selectedStatusFilter === 'All' || student.status === selectedStatusFilter;

      return matchQuery && matchProgram && matchStatus;
    });

    return `
      <section id="student-db-section" class="py-16 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
                <i class="fa-solid fa-database text-cyan-400"></i>
                <span>Administrative Database Engine</span>
              </div>
              <h2 class="text-3xl font-title font-extrabold text-white">
                Student Records & Program Assignments
              </h2>
              <p class="mt-1 text-slate-400 text-sm max-w-xl">
                Manage student enrollment profiles, assign academic programs, record exam performance, and track attendance.
              </p>
            </div>

            <!-- Action Controls -->
            <div class="flex flex-wrap items-center gap-3">
              <button 
                id="db-add-student-btn"
                class="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <i class="fa-solid fa-user-plus text-slate-950"></i>
                <span>Add New Student</span>
              </button>

              <button 
                id="db-export-btn"
                class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2"
                title="Export Database JSON"
              >
                <i class="fa-solid fa-download text-amber-400"></i>
                <span>Export DB</span>
              </button>

              <button 
                id="db-reset-btn"
                class="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 transition-colors"
                title="Reset Database to Seed Data"
              >
                <i class="fa-solid fa-rotate-left"></i>
              </button>
            </div>
          </div>

          <!-- Controls & Filters Bar -->
          <div class="glass-panel p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-800">
            <!-- Search Bar -->
            <div class="relative w-full md:w-80">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input 
                type="text" 
                id="db-search-input"
                placeholder="Search by Name, Student ID, Guardian..." 
                value="${NavbarComponent.escapeHTML(searchQuery)}"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              >
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <!-- Program Filter -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400 font-medium">Program:</span>
                <select id="db-program-filter" class="bg-slate-950/80 border border-slate-800 text-xs text-amber-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500">
                  <option value="All">All Programs (${programs.length})</option>
                  ${programs.map(p => `
                    <option value="${p.id}" ${selectedProgramFilter === p.id ? 'selected' : ''}>${p.name}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Status Filter -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400 font-medium">Status:</span>
                <select id="db-status-filter" class="bg-slate-950/80 border border-slate-800 text-xs text-emerald-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500">
                  <option value="All">All Statuses</option>
                  <option value="Active" ${selectedStatusFilter === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="Graduated" ${selectedStatusFilter === 'Graduated' ? 'selected' : ''}>Graduated</option>
                  <option value="Pending" ${selectedStatusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Student Data Table -->
          <div class="glass-panel rounded-2xl overflow-hidden border-slate-800 shadow-xl">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                    <th class="py-4 px-4">Student ID & Name</th>
                    <th class="py-4 px-4">Guardian & Contact</th>
                    <th class="py-4 px-4">Assigned Programs</th>
                    <th class="py-4 px-4">Status</th>
                    <th class="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/80">
                  ${filteredStudents.length === 0 ? `
                    <tr>
                      <td colspan="5" class="py-12 text-center text-slate-500">
                        <i class="fa-solid fa-folder-open text-3xl mb-2 block text-slate-600"></i>
                        <span>No student records found matching your filters.</span>
                      </td>
                    </tr>
                  ` : filteredStudents.map(student => {
                    const assignedProgs = (student.assignedPrograms || []).map(pid => MadrasaDB.getProgramById(pid)).filter(Boolean);

                    return `
                      <tr class="hover:bg-slate-800/40 transition-colors group">
                        <!-- ID & Name -->
                        <td class="py-4 px-4">
                          <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-title">
                              ${student.gender === 'Female' ? '<i class="fa-solid fa-user-graduate"></i>' : '<i class="fa-solid fa-user-ninja"></i>'}
                            </div>
                            <div>
                              <div class="font-bold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-2">
                                <span>${NavbarComponent.escapeHTML(student.name)}</span>
                                <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">${student.age} yrs</span>
                              </div>
                              <div class="text-[11px] font-mono text-amber-400 font-semibold mt-0.5">
                                ${student.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <!-- Guardian & Contact -->
                        <td class="py-4 px-4">
                          <div class="text-slate-200 font-medium">${NavbarComponent.escapeHTML(student.guardian || 'N/A')}</div>
                          <div class="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                            <span><i class="fa-solid fa-envelope text-slate-500"></i> ${student.email || '-'}</span>
                            <span><i class="fa-solid fa-phone text-slate-500"></i> ${student.phone || '-'}</span>
                          </div>
                        </td>

                        <!-- Assigned Programs -->
                        <td class="py-4 px-4">
                          <div class="flex flex-wrap items-center gap-1.5">
                            ${assignedProgs.length === 0 ? `
                              <span class="text-slate-500 italic text-[11px]">Unassigned</span>
                            ` : assignedProgs.map(p => `
                              <span class="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-medium" title="${p.name}">
                                ${p.name.split(' ')[0]} ${p.name.split(' ')[1] || ''}
                              </span>
                            `).join('')}
                          </div>
                        </td>

                        <!-- Status -->
                        <td class="py-4 px-4">
                          <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            student.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            student.status === 'Graduated' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }">
                            ${student.status}
                          </span>
                        </td>

                        <!-- Actions -->
                        <td class="py-4 px-4 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <!-- Assign Program -->
                            <button 
                              data-assign-id="${student.id}"
                              class="db-action-assign p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors" 
                              title="Assign Programs"
                            >
                              <i class="fa-solid fa-book-bookmark"></i>
                            </button>

                            <!-- Log Exam Marks -->
                            <button 
                              data-marks-id="${student.id}"
                              class="db-action-marks p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors" 
                              title="Input Exam Marks"
                            >
                              <i class="fa-solid fa-pen-nib"></i>
                            </button>

                            <!-- Edit Student -->
                            <button 
                              data-edit-id="${student.id}"
                              class="db-action-edit p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors" 
                              title="Edit Student Info"
                            >
                              <i class="fa-solid fa-user-pen"></i>
                            </button>

                            <!-- Delete Student -->
                            <button 
                              data-delete-id="${student.id}"
                              class="db-action-delete p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 transition-colors" 
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

            <!-- Table Footer Stats -->
            <div class="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing <span class="font-bold text-amber-400">${filteredStudents.length}</span> of <span class="font-bold text-white">${students.length}</span> students
              </div>
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Active: ${students.filter(s=>s.status==='Active').length}</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> Graduated: ${students.filter(s=>s.status==='Graduated').length}</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  function attachEvents(onAddStudent, onEditStudent, onAssignPrograms, onLogMarks, onDeleteStudent, onRefresh) {
    const searchInput = document.getElementById('db-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        onRefresh();
      });
    }

    const progFilter = document.getElementById('db-program-filter');
    if (progFilter) {
      progFilter.addEventListener('change', (e) => {
        selectedProgramFilter = e.target.value;
        onRefresh();
      });
    }

    const statusFilter = document.getElementById('db-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        selectedStatusFilter = e.target.value;
        onRefresh();
      });
    }

    document.getElementById('db-add-student-btn')?.addEventListener('click', onAddStudent);

    document.getElementById('db-export-btn')?.addEventListener('click', () => {
      const data = {
        settings: MadrasaDB.getSettings(),
        students: MadrasaDB.getStudents(),
        programs: MadrasaDB.getPrograms(),
        results: MadrasaDB.getResults(),
        events: MadrasaDB.getEvents()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `madrasa_db_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    });

    document.getElementById('db-reset-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the database back to default seed data? All custom modifications will be reloaded.')) {
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
        if (confirm('Are you sure you want to delete this student record? Associated grade transcripts will also be deleted.')) {
          onDeleteStudent(btn.dataset.deleteId);
        }
      });
    });
  }

  return { render, attachEvents };
})();
