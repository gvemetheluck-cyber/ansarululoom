/**
 * Results & Transcripts Portal Component
 */
const ResultsComponent = (function() {
  let searchedId = 'MDR-2026-001'; // Default demo student

  function render(onOpenMarksModal) {
    const student = MadrasaDB.getStudentById(searchedId);
    const results = student ? MadrasaDB.getStudentResults(student.id) : [];
    const settings = MadrasaDB.getSettings();

    return `
      <section id="results-section" class="py-16 relative z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <i class="fa-solid fa-award text-amber-400"></i>
                <span>Academic Examination & Transcript Portal</span>
              </div>
              <h2 class="text-3xl font-title font-extrabold text-white">
                Student Results & Transcripts
              </h2>
              <p class="mt-1 text-slate-400 text-sm max-w-xl">
                Enter your Student ID to generate your verified official transcript and subject performance breakdown.
              </p>
            </div>

            <button 
              id="results-log-marks-btn"
              class="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 border border-emerald-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <i class="fa-solid fa-plus-circle text-slate-950"></i>
              <span>Input Exam Marks (Admin)</span>
            </button>
          </div>

          <!-- Student Lookup Bar -->
          <div class="glass-panel-gold rounded-2xl p-6 mb-8 shadow-xl">
            <label class="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
              <i class="fa-solid fa-id-card text-amber-400 mr-1.5"></i> Enter Student ID Number:
            </label>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <div class="relative w-full">
                <i class="fa-solid fa-barcode absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base"></i>
                <input 
                  type="text" 
                  id="results-search-input"
                  placeholder="e.g. MDR-2026-001" 
                  value="${NavbarComponent.escapeHTML(searchedId)}"
                  class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/90 border border-amber-500/40 text-amber-300 font-mono text-sm font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400"
                >
              </div>

              <button 
                id="results-search-btn"
                class="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>Fetch Transcript</span>
              </button>
            </div>

            <!-- Quick Demo Selectors -->
            <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span class="text-slate-400">Quick Test IDs:</span>
              ${MadrasaDB.getStudents().slice(0, 5).map(s => `
                <button 
                  data-quick-id="${s.id}" 
                  class="quick-id-btn px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-amber-300 text-[11px] font-mono transition-colors"
                >
                  ${s.id} (${s.name.split(' ')[0]})
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Transcript Card Container -->
          ${student ? `
            <div class="print-area glass-panel rounded-3xl p-6 sm:p-10 border-slate-800 shadow-2xl relative overflow-hidden">
              
              <!-- Subtle Watermark -->
              <div class="absolute right-6 top-6 opacity-5 text-amber-400 text-9xl pointer-events-none">
                <i class="fa-solid fa-mosque"></i>
              </div>

              <!-- Transcript Header -->
              <div class="border-b border-slate-800/80 pb-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div class="flex flex-col md:flex-row items-center gap-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-3xl shadow-lg">
                    <i class="fa-solid fa-mosque"></i>
                  </div>
                  <div>
                    <h1 class="text-2xl font-title font-bold text-amber-300">
                      ${NavbarComponent.escapeHTML(settings.madrasaName || 'Madrasa Al-Hikmah')}
                    </h1>
                    <p class="text-xs text-slate-400 mt-0.5">${settings.tagline || 'Center for Quranic Excellence'}</p>
                    <div class="text-[11px] text-emerald-400 font-semibold mt-1">OFFICIAL ACADEMIC TRANSCRIPT & REPORT CARD</div>
                  </div>
                </div>

                <div class="no-print flex items-center gap-3">
                  <button 
                    id="print-transcript-btn"
                    class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <i class="fa-solid fa-print text-amber-400"></i>
                    <span>Print Transcript</span>
                  </button>
                </div>
              </div>

              <!-- Student Profile Summary Bar -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-8 text-xs">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
                  <span class="font-bold text-white text-sm">${NavbarComponent.escapeHTML(student.name)}</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-semibold">Student Roll ID</span>
                  <span class="font-bold text-amber-400 font-mono text-sm">${student.id}</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-semibold">Guardian</span>
                  <span class="font-semibold text-slate-200">${NavbarComponent.escapeHTML(student.guardian)}</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-semibold">Enrollment Status</span>
                  <span class="font-bold text-emerald-400">${student.status}</span>
                </div>
              </div>

              <!-- Results Records List -->
              ${results.length === 0 ? `
                <div class="py-12 text-center text-slate-400">
                  <i class="fa-solid fa-file-pen text-4xl mb-3 block text-slate-600"></i>
                  <p class="font-semibold">No recorded exam grades found for this student yet.</p>
                  <p class="text-xs text-slate-500 mt-1">Use the "Input Exam Marks" button above to add exam scores.</p>
                </div>
              ` : results.map(res => {
                const program = MadrasaDB.getProgramById(res.programId);
                return `
                  <div class="mb-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                    <!-- Term & Program Title Bar -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                      <div>
                        <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">${res.term || 'Spring 2026'} Exam</span>
                        <h3 class="text-lg font-bold text-white mt-0.5">
                          ${program ? program.name : 'Madrasa Academic Program'}
                        </h3>
                      </div>

                      <div class="flex items-center gap-4">
                        <div class="text-right">
                          <span class="text-[10px] text-slate-400 uppercase block">Overall Percentage</span>
                          <span class="text-xl font-extrabold text-amber-400 font-title">${res.totalPercentage}%</span>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-title font-extrabold text-xl shadow-lg">
                          ${res.grade || 'A'}
                        </div>
                      </div>
                    </div>

                    <!-- Subject Scores Table -->
                    <div class="overflow-x-auto">
                      <table class="w-full text-left text-xs">
                        <thead>
                          <tr class="text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
                            <th class="py-2.5 px-3">Subject / Module Name</th>
                            <th class="py-2.5 px-3">Marks Obtained</th>
                            <th class="py-2.5 px-3">Performance Meter</th>
                            <th class="py-2.5 px-3 text-right">Percentage</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                          ${(res.marks || []).map(m => {
                            const pct = Math.round((m.score / (m.max || 100)) * 100);
                            return `
                              <tr class="hover:bg-slate-800/30 transition-colors">
                                <td class="py-3 px-3 font-semibold text-slate-200">${NavbarComponent.escapeHTML(m.subject)}</td>
                                <td class="py-3 px-3 font-mono font-bold text-amber-400">${m.score} / ${m.max || 100}</td>
                                <td class="py-3 px-3 w-48">
                                  <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style="width: ${pct}%"></div>
                                  </div>
                                </td>
                                <td class="py-3 px-3 text-right font-bold text-emerald-400">${pct}%</td>
                              </tr>
                            `;
                          }).join('')}
                        </tbody>
                      </table>
                    </div>

                    <!-- Remarks -->
                    ${res.remarks ? `
                      <div class="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                        <span class="font-bold text-amber-400 mr-1"><i class="fa-solid fa-comment-dots"></i> Teacher Remarks:</span>
                        <span class="italic text-slate-300">${NavbarComponent.escapeHTML(res.remarks)}</span>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}

              <!-- Signature Footer for Print -->
              <div class="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 text-center text-xs text-slate-400">
                <div>
                  <div class="w-36 h-0.5 bg-slate-700 mx-auto mb-2"></div>
                  <span class="font-semibold text-slate-300">Head Qari / Director of Studies</span>
                </div>
                <div>
                  <div class="w-36 h-0.5 bg-slate-700 mx-auto mb-2"></div>
                  <span class="font-semibold text-slate-300">Official Seal of Madrasa</span>
                </div>
              </div>

            </div>
          ` : `
            <div class="glass-panel p-12 rounded-3xl text-center border-slate-800">
              <i class="fa-solid fa-user-slash text-4xl text-slate-600 mb-3 block"></i>
              <h3 class="text-xl font-bold text-white">Student Record Not Found</h3>
              <p class="text-sm text-slate-400 mt-1">Please verify the Student ID number and try again.</p>
            </div>
          `}

        </div>
      </section>
    `;
  }

  function attachEvents(onOpenMarksModal, onSearch) {
    const input = document.getElementById('results-search-input');
    const searchBtn = document.getElementById('results-search-btn');

    searchBtn?.addEventListener('click', () => {
      if (input && input.value.trim()) {
        searchedId = input.value.trim();
        onSearch();
      }
    });

    document.querySelectorAll('.quick-id-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        searchedId = btn.dataset.quickId;
        onSearch();
      });
    });

    document.getElementById('results-log-marks-btn')?.addEventListener('click', () => {
      onOpenMarksModal(searchedId);
    });

    document.getElementById('print-transcript-btn')?.addEventListener('click', () => {
      window.print();
    });
  }

  return { render, attachEvents };
})();
