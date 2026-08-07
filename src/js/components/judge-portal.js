/**
 * Dedicated Judge Portal Component - Clean View (No Guardian Name)
 */
const JudgePortalComponent = (function() {
  let selectedProgramId = 'PRG-SENIOR-B';

  function render() {
    const session = MadrasaDB.getAuthSession();
    const judgeName = session ? session.username : 'Judge';
    const programs = MadrasaDB.getPrograms();
    const students = MadrasaDB.getStudents();
    const results = MadrasaDB.getResults();
    const selectedProgram = MadrasaDB.getProgramById(selectedProgramId) || programs[0];

    const programStudents = students.filter(s => 
      s.assignedPrograms && s.assignedPrograms.includes(selectedProgramId)
    );
    const displayStudents = programStudents.length > 0 ? programStudents : students;

    return `
      <section id="judge-portal-section" class="py-12 relative z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Portal Header -->
          <div class="card-green rounded-3xl p-6 sm:p-8 mb-8 border-emerald-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl shadow-lg animate-pulse-glow">
                <i class="fa-solid fa-gavel"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs uppercase font-extrabold px-3 py-0.5 rounded-full bg-emerald-950 text-organic-pillGold border border-emerald-700">Official Judge Panel</span>
                  <span class="text-xs text-emerald-300 font-bold">Session: ${judgeName}</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-title font-extrabold text-white mt-1">
                  Meelad Competition Judge Portal
                </h2>
                <p class="text-xs text-organic-muted mt-0.5">Input contest marks, evaluate performances, and award team championship points.</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button id="judge-logout-btn" class="px-4 py-2.5 rounded-full text-xs font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 transition-colors flex items-center gap-2">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Exit Judge Session</span>
              </button>
            </div>
          </div>

          <!-- Main Judge Input Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Left 7 Cols: Score Evaluation Form -->
            <div class="lg:col-span-7 card-green rounded-3xl p-6 sm:p-8 border-emerald-700/60 shadow-xl">
              <h3 class="text-xl font-title font-extrabold text-white mb-1 flex items-center gap-2">
                <i class="fa-solid fa-pen-nib text-organic-pillGold"></i>
                <span>Evaluate Contestant Performance</span>
              </h3>
              <p class="text-xs text-organic-muted mb-6">Select division, pick contestant by name, enter item score, and submit evaluation.</p>

              <form id="judge-score-form" class="space-y-4 text-xs">
                <!-- Select Competition Division -->
                <div>
                  <label class="block font-bold text-organic-creamText mb-1.5">1. Select Competition Division *</label>
                  <select id="judge-program-id" class="w-full px-4 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-organic-pillGold font-bold focus:outline-none focus:border-amber-400">
                    ${programs.map(p => `
                      <option value="${p.id}" ${p.id === selectedProgramId ? 'selected' : ''}>
                        ${p.name} (${(p.subjects||[]).length} Items)
                      </option>
                    `).join('')}
                  </select>
                </div>

                <!-- Select Contest Item -->
                <div>
                  <label class="block font-bold text-organic-creamText mb-1.5">2. Select Contest Item *</label>
                  <select id="judge-subject-name" class="w-full px-4 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-slate-100 font-bold focus:outline-none focus:border-amber-400">
                    ${(selectedProgram.subjects || ['MADH GAANAM']).map(sub => `
                      <option value="${sub}">${sub}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Select Contestant Student by Name -->
                <div>
                  <label class="block font-bold text-organic-creamText mb-1.5">3. Select Contestant Student *</label>
                  <select id="judge-student-id" class="w-full px-4 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-organic-pillGold font-bold focus:outline-none focus:border-amber-400">
                    ${displayStudents.map(s => `
                      <option value="${s.id}">
                        ${s.name} — Team ${s.team || 'Quaf'}
                      </option>
                    `).join('')}
                  </select>
                </div>

                <!-- Score Input (0-100) & Award Rank -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block font-bold text-organic-creamText mb-1.5">4. Item Score (0 - 100) *</label>
                    <div class="relative">
                      <input 
                        type="number" 
                        id="judge-score-input" 
                        min="0" 
                        max="100" 
                        value="95" 
                        required 
                        class="w-full px-4 py-3 rounded-full bg-emerald-950 border border-amber-500/60 text-organic-pillGold font-title font-extrabold text-lg focus:outline-none focus:border-amber-400"
                      >
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-organic-muted font-bold text-xs">/ 100</span>
                    </div>
                  </div>

                  <div>
                    <label class="block font-bold text-organic-creamText mb-1.5">Award Rank / Grade</label>
                    <select id="judge-rank-select" class="w-full px-4 py-3 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold focus:outline-none">
                      <option value="1st Rank (A+)">1st Rank (40 Team Pts)</option>
                      <option value="2nd Rank (A+)">2nd Rank (32 Team Pts)</option>
                      <option value="3rd Rank (A)">3rd Rank (25 Team Pts)</option>
                      <option value="Grade B+">Grade B+ (15 Team Pts)</option>
                      <option value="Participated">Participated (5 Team Pts)</option>
                    </select>
                  </div>
                </div>

                <!-- Judge Remarks -->
                <div>
                  <label class="block font-bold text-organic-creamText mb-1.5">Judge Remarks / Evaluation Notes</label>
                  <textarea 
                    id="judge-remarks" 
                    rows="2" 
                    placeholder="Flawless recitation, excellent vocal clarity and stage presence..." 
                    class="w-full px-4 py-3 rounded-2xl bg-emerald-950 border border-emerald-700 text-slate-200 focus:outline-none focus:border-amber-400"
                  ></textarea>
                </div>

                <div class="pt-4 flex items-center justify-end gap-3 border-t border-emerald-800/80">
                  <button type="submit" class="btn-pill-gold px-8 py-3.5 text-xs font-bold flex items-center gap-2 shadow-xl w-full sm:w-auto justify-center">
                    <i class="fa-solid fa-square-check text-organic-darkText text-sm"></i>
                    <span>Submit Judge Score & Award Points</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Right 5 Cols: Submitted Evaluations Table -->
            <div class="lg:col-span-5 card-green rounded-3xl p-6 sm:p-8 border-emerald-700/60 shadow-xl flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-title font-extrabold text-white flex items-center gap-2">
                    <i class="fa-solid fa-list-check text-amber-400"></i>
                    <span>Recent Submissions</span>
                  </h3>
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">Total: ${results.length}</span>
                </div>

                <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  ${results.length === 0 ? `
                    <div class="py-8 text-center text-organic-muted">
                      <i class="fa-solid fa-clipboard text-3xl mb-2 block text-emerald-600"></i>
                      <span>No evaluation entries logged yet.</span>
                    </div>
                  ` : results.map(res => {
                    const student = MadrasaDB.getStudentById(res.studentId);
                    const teamName = student ? (student.team || 'Quaf') : 'Quaf';
                    const isQuaf = teamName === 'Quaf';
                    const isNoon = teamName === 'Noon';

                    return `
                      <div class="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-800 flex items-center justify-between gap-3">
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="font-bold text-white text-xs">${student ? student.name : 'Student'}</span>
                            <span class="px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              isQuaf ? 'bg-emerald-900 text-emerald-200 border border-emerald-600' :
                              isNoon ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                              'bg-amber-950 text-amber-300 border border-amber-700'
                            }">
                              ${teamName}
                            </span>
                          </div>
                          <div class="text-[11px] text-organic-muted mt-0.5">
                            ${(res.marks && res.marks[0]) ? res.marks[0].subject : 'Item'} — <span class="font-bold text-organic-pillGold">${res.totalPercentage}%</span>
                          </div>
                        </div>

                        <div class="text-right">
                          <span class="text-xs font-extrabold text-amber-300 block">${res.grade || '1st Rank'}</span>
                          <span class="text-[10px] text-emerald-400 font-bold">+${res.pointsAwarded || 30} Pts</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-emerald-800/80 text-center">
                <span class="text-xs text-organic-muted">Results are automatically published live to the public Results Portal.</span>
              </div>
            </div>

          </div>

        </div>
      </section>
    `;
  }

  function attachEvents(onSubmitScore, onLogout, onProgramChange) {
    document.getElementById('judge-program-id')?.addEventListener('change', (e) => {
      selectedProgramId = e.target.value;
      onProgramChange();
    });

    document.getElementById('judge-logout-btn')?.addEventListener('click', onLogout);

    document.getElementById('judge-score-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const programId = document.getElementById('judge-program-id').value;
      const subjectName = document.getElementById('judge-subject-name').value;
      const studentId = document.getElementById('judge-student-id').value;
      const scoreVal = parseFloat(document.getElementById('judge-score-input').value || 0);
      const rankVal = document.getElementById('judge-rank-select').value;
      const remarksVal = document.getElementById('judge-remarks').value.trim();

      const resultObj = {
        studentId: studentId,
        programId: programId,
        term: "Meelad Fest 2026",
        marks: [{ subject: subjectName, score: scoreVal, max: 100 }],
        remarks: remarksVal,
        grade: rankVal
      };

      onSubmitScore(resultObj);
    });
  }

  return { render, attachEvents };
})();
