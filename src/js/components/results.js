/**
 * Results & Transcripts Portal Component with Team Badges (Quaf, Noon, Meem)
 */
const ResultsComponent = (function() {
  let searchedId = 'ANS-2026-001'; // Default demo student

  function render(onOpenMarksModal) {
    const student = MadrasaDB.getStudentById(searchedId);
    const results = student ? MadrasaDB.getStudentResults(student.id) : [];
    const settings = MadrasaDB.getSettings();
    const teamName = student ? (student.team || 'Quaf') : 'Quaf';
    const isQuaf = teamName === 'Quaf';
    const isNoon = teamName === 'Noon';

    return `
      <section id="results-section" class="py-16 relative z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-organic-pillGold text-xs font-bold mb-2">
                <i class="fa-solid fa-trophy text-amber-400"></i>
                <span>Meelad Competition Results & Team Points</span>
              </div>
              <h2 class="text-3xl font-title font-extrabold text-organic-creamText">
                Student & Team Results Portal
              </h2>
              <p class="mt-1 text-organic-muted text-sm max-w-xl">
                Enter your Student Roll ID to generate your verified Meelad Fest transcript, category scores, and team championship points.
              </p>
            </div>

            <button 
              id="results-log-marks-btn"
              class="btn-pill-gold px-6 py-3 text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <i class="fa-solid fa-pen-nib text-organic-darkText"></i>
              <span>Input Contest Scores (Admin)</span>
            </button>
          </div>

          <!-- Student Search Bar -->
          <div class="card-green rounded-3xl p-6 mb-8 shadow-xl">
            <label class="block text-xs font-extrabold uppercase tracking-wider text-organic-pillGold mb-2">
              <i class="fa-solid fa-id-card mr-1.5"></i> Enter Student ID Number:
            </label>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <div class="relative w-full">
                <i class="fa-solid fa-barcode absolute left-4 top-1/2 -translate-y-1/2 text-organic-muted text-base"></i>
                <input 
                  type="text" 
                  id="results-search-input"
                  placeholder="e.g. ANS-2026-001" 
                  value="${NavbarComponent.escapeHTML(searchedId)}"
                  class="w-full pl-11 pr-4 py-3.5 rounded-full bg-emerald-950/90 border border-amber-500/50 text-organic-pillGold font-mono text-sm font-bold placeholder-organic-muted focus:outline-none focus:border-amber-400"
                >
              </div>

              <button 
                id="results-search-btn"
                class="btn-pill-gold w-full sm:w-auto px-8 py-3.5 text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>Fetch Transcript</span>
              </button>
            </div>

            <!-- Quick Demo Selectors -->
            <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span class="text-organic-muted font-bold">Quick Test Roll IDs:</span>
              ${MadrasaDB.getStudents().slice(0, 6).map(s => `
                <button 
                  data-quick-id="${s.id}" 
                  class="quick-id-btn px-3 py-1 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-organic-pillGold text-[11px] font-mono font-bold transition-colors"
                >
                  ${s.id} (${s.name.split(' ')[0]} - ${s.team || 'Quaf'})
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Official Transcript Card -->
          ${student ? `
            <div class="print-area card-green rounded-4xl p-6 sm:p-10 border-emerald-700/60 shadow-2xl relative overflow-hidden">
              
              <!-- Header -->
              <div class="border-b border-emerald-800/80 pb-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div class="flex flex-col md:flex-row items-center gap-4">
                  <div class="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-organic-pillGold text-3xl shadow-lg">
                    <i class="fa-solid fa-leaf"></i>
                  </div>
                  <div>
                    <h1 class="text-2xl font-title font-bold text-organic-creamText">
                      ${NavbarComponent.escapeHTML(settings.madrasaName || 'Ansarul Uloom Madrasa')}
                    </h1>
                    <p class="text-xs text-organic-muted mt-0.5">${settings.location || 'Andona, Thamarassery, Kozhikkode'}</p>
                    <div class="text-[11px] text-organic-pillGold font-bold tracking-wider uppercase mt-1">OFFICIAL MEELAD FEST COMPETITION TRANSCRIPT</div>
                  </div>
                </div>

                <div class="no-print flex items-center gap-3">
                  <button 
                    id="print-transcript-btn"
                    class="px-5 py-2.5 rounded-full text-xs font-bold text-organic-creamText bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <i class="fa-solid fa-print text-amber-400"></i>
                    <span>Print Certificate</span>
                  </button>
                </div>
              </div>

              <!-- Student Profile Summary & Team Badge -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-emerald-950/90 border border-emerald-800 mb-8 text-xs">
                <div>
                  <span class="text-organic-muted block text-[10px] uppercase font-bold">Contestant Name</span>
                  <span class="font-extrabold text-white text-sm">${NavbarComponent.escapeHTML(student.name)}</span>
                </div>

                <div>
                  <span class="text-organic-muted block text-[10px] uppercase font-bold">Meelad Team</span>
                  <span class="px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 mt-0.5 ${
                    isQuaf ? 'bg-emerald-900 text-emerald-200 border border-emerald-600' :
                    isNoon ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                    'bg-amber-950 text-amber-300 border border-amber-700'
                  }">
                    <span class="font-arabic text-sm">${isQuaf ? 'ق' : isNoon ? 'ن' : 'م'}</span>
                    <span>Team ${teamName}</span>
                  </span>
                </div>

                <div>
                  <span class="text-organic-muted block text-[10px] uppercase font-bold">Student Roll ID</span>
                  <span class="font-bold text-organic-pillGold font-mono text-sm">${student.id}</span>
                </div>

                <div>
                  <span class="text-organic-muted block text-[10px] uppercase font-bold">Guardian</span>
                  <span class="font-semibold text-slate-200">${NavbarComponent.escapeHTML(student.guardian)}</span>
                </div>
              </div>

              <!-- Results Records List -->
              ${results.length === 0 ? `
                <div class="py-12 text-center text-organic-muted">
                  <i class="fa-solid fa-file-pen text-4xl mb-3 block text-emerald-600"></i>
                  <p class="font-bold text-white">No recorded contest scores found for this student yet.</p>
                  <p class="text-xs text-organic-muted mt-1">Use the "Input Contest Scores" button above to enter score items.</p>
                </div>
              ` : results.map(res => {
                const program = MadrasaDB.getProgramById(res.programId);
                return `
                  <div class="mb-8 p-6 rounded-3xl bg-emerald-950/80 border border-emerald-800 shadow-md">
                    <!-- Term & Division Title Bar -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-800">
                      <div>
                        <span class="text-xs font-extrabold text-organic-pillGold uppercase tracking-wider">${res.term || 'Meelad Fest 2026'}</span>
                        <h3 class="text-xl font-bold text-white mt-0.5">
                          ${program ? program.name : 'Meelad Competition Division'}
                        </h3>
                      </div>

                      <div class="flex items-center gap-4">
                        <div class="text-right">
                          <span class="text-[10px] text-organic-muted uppercase block font-bold">Score Percentage</span>
                          <span class="text-2xl font-extrabold text-organic-pillGold font-title">${res.totalPercentage}%</span>
                        </div>
                        <div class="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-title font-extrabold text-sm shadow-lg text-center">
                          <div>${res.grade || '1st Rank'}</div>
                          <div class="text-[10px] font-normal text-emerald-300 mt-0.5">+${res.pointsAwarded || 30} Team Pts</div>
                        </div>
                      </div>
                    </div>

                    <!-- Subject Scores Table -->
                    <div class="overflow-x-auto">
                      <table class="w-full text-left text-xs">
                        <thead>
                          <tr class="text-organic-muted border-b border-emerald-800/80 uppercase font-bold text-[10px]">
                            <th class="py-2.5 px-3">Contest Item</th>
                            <th class="py-2.5 px-3">Score Obtained</th>
                            <th class="py-2.5 px-3">Performance Meter</th>
                            <th class="py-2.5 px-3 text-right">Percentage</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-emerald-800/40">
                          ${(res.marks || []).map(m => {
                            const pct = Math.round((m.score / (m.max || 100)) * 100);
                            return `
                              <tr class="hover:bg-emerald-900/30 transition-colors">
                                <td class="py-3 px-3 font-bold text-slate-100">${NavbarComponent.escapeHTML(m.subject)}</td>
                                <td class="py-3 px-3 font-mono font-bold text-organic-pillGold">${m.score} / ${m.max || 100}</td>
                                <td class="py-3 px-3 w-48">
                                  <div class="w-full h-2.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
                                    <div class="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full" style="width: ${pct}%"></div>
                                  </div>
                                </td>
                                <td class="py-3 px-3 text-right font-extrabold text-emerald-400">${pct}%</td>
                              </tr>
                            `;
                          }).join('')}
                        </tbody>
                      </table>
                    </div>

                    ${res.remarks ? `
                      <div class="mt-4 pt-3 border-t border-emerald-800/80 text-xs text-slate-300 bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800">
                        <span class="font-bold text-organic-pillGold mr-1"><i class="fa-solid fa-comment-dots"></i> Judge Remarks:</span>
                        <span class="italic text-organic-muted">${NavbarComponent.escapeHTML(res.remarks)}</span>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}

              <div class="mt-12 pt-8 border-t border-emerald-800/80 grid grid-cols-2 gap-8 text-center text-xs text-organic-muted">
                <div>
                  <div class="w-36 h-0.5 bg-emerald-700/60 mx-auto mb-2"></div>
                  <span class="font-semibold text-slate-300">Meelad General Convenor</span>
                </div>
                <div>
                  <div class="w-36 h-0.5 bg-emerald-700/60 mx-auto mb-2"></div>
                  <span class="font-semibold text-slate-300">Ansarul Uloom Official Seal</span>
                </div>
              </div>

            </div>
          ` : `
            <div class="card-green p-12 rounded-3xl text-center">
              <i class="fa-solid fa-user-slash text-4xl text-emerald-600 mb-3 block"></i>
              <h3 class="text-xl font-bold text-white">Student Record Not Found</h3>
              <p class="text-sm text-organic-muted mt-1">Please check the Roll ID number and try again.</p>
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
