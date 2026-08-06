/**
 * Programs Component - Earth & Leaf Organic Grid displaying ALL Meelad Contest Items
 */
const ProgramsComponent = (function() {
  let currentCategory = 'All';

  function render(onOpenDetailsModal, onEnrollProgram) {
    const programs = MadrasaDB.getPrograms();
    const categories = ['All', 'Kids', 'Sub-Junior', 'Junior', 'Senior', 'General'];

    const filteredPrograms = currentCategory === 'All' 
      ? programs 
      : programs.filter(p => p.category === currentCategory);

    return `
      <section id="programs-section" class="py-16 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-organic-pillGold text-xs font-bold mb-3 shadow-md">
                <i class="fa-solid fa-leaf text-amber-400"></i>
                <span>Meelad Fest 2026 Official Competitions</span>
              </div>
              <h2 class="text-3xl sm:text-5xl font-title font-extrabold text-organic-creamText">
                Meelad Programs & Contest Items
              </h2>
              <p class="mt-2 text-organic-muted text-sm sm:text-base max-w-2xl font-light">
                Complete list of all stage and off-stage competition items for Ansarul Uloom Madrasa, Andona, Thamarassery.
              </p>
            </div>

            <!-- Filter Category Tabs -->
            <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              ${categories.map(cat => `
                <button 
                  data-cat="${cat}" 
                  class="program-cat-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                    currentCategory === cat
                      ? 'btn-pill-gold shadow-lg'
                      : 'bg-emerald-950/80 text-organic-creamText hover:text-white border border-emerald-800/60'
                  }"
                >
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Programs Grid matching Reference Image -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${filteredPrograms.map((program, idx) => {
              const cardClass = idx % 3 === 0 ? 'card-green' : idx % 3 === 1 ? 'card-brown' : 'card-sand';
              const pctEnrolled = Math.min(100, Math.round((program.enrolledCount / program.capacity) * 100));
              const isSand = cardClass === 'card-sand';
              const subjects = program.subjects || [];

              return `
                <div class="${cardClass} p-7 interactive-card flex flex-col justify-between relative overflow-hidden group">
                  <div>
                    <!-- Header Circular Icon Badge & Category Pill -->
                    <div class="flex items-center justify-between gap-2 mb-5">
                      <div class="badge-circle-icon">
                        <i class="fa-solid ${program.icon || 'fa-trophy'} text-xl"></i>
                      </div>
                      <span class="text-xs font-extrabold px-3 py-1 rounded-full ${
                        isSand ? 'bg-[#43291F] text-[#E6C594]' : 'bg-black/30 text-organic-pillGold border border-white/10'
                      }">
                        ${program.category}
                      </span>
                    </div>

                    <!-- Program Name -->
                    <h3 class="text-2xl font-title font-extrabold ${isSand ? 'text-[#2B1D14]' : 'text-organic-creamText'} group-hover:text-organic-pillGold transition-colors">
                      ${NavbarComponent.escapeHTML(program.name)}
                    </h3>

                    <p class="text-xs mt-2 line-clamp-2 leading-relaxed ${isSand ? 'text-[#4A382D]' : 'text-organic-muted'}">
                      ${NavbarComponent.escapeHTML(program.description)}
                    </p>

                    <!-- Contest Items Included List -->
                    <div class="mt-5">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider ${isSand ? 'text-[#6B4D3B]' : 'text-organic-pillGold'}">
                          Contest Items (${subjects.length}):
                        </span>
                        <span class="text-[10px] ${isSand ? 'text-[#4A382D]' : 'text-organic-muted'} font-semibold">Stage & Off-Stage</span>
                      </div>

                      <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                        ${subjects.map(sub => `
                          <span class="px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                            isSand ? 'bg-[#43291F]/15 text-[#372318] border border-[#43291F]/20' : 'bg-black/30 text-emerald-200 border border-white/10'
                          }">
                            ${sub}
                          </span>
                        `).join('')}
                      </div>
                    </div>

                    <!-- Contestants Enrolled Progress -->
                    <div class="mt-6">
                      <div class="flex items-center justify-between text-xs mb-1.5">
                        <span class="${isSand ? 'text-[#5C4537]' : 'text-organic-muted'} font-medium">Registered Contestants:</span>
                        <span class="font-extrabold ${isSand ? 'text-[#2B1D14]' : 'text-organic-pillGold'}">${program.enrolledCount} Students</span>
                      </div>
                      <div class="w-full h-2.5 ${isSand ? 'bg-black/15' : 'bg-black/40'} rounded-full overflow-hidden">
                        <div class="h-full ${isSand ? 'bg-[#43291F]' : 'bg-gradient-to-r from-emerald-400 to-amber-300'} rounded-full transition-all duration-500" style="width: ${pctEnrolled}%"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Card Action Footer -->
                  <div class="mt-8 pt-5 border-t ${isSand ? 'border-black/15' : 'border-white/10'} flex items-center justify-between gap-3">
                    <div class="text-xs">
                      <span class="text-[10px] uppercase font-bold block ${isSand ? 'text-[#6B4D3B]' : 'text-organic-muted'}">Stage Timing</span>
                      <span class="font-bold ${isSand ? 'text-[#2B1D14]' : 'text-white'}">${program.timing.split('|')[0]}</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button 
                        data-details-id="${program.id}"
                        class="program-details-btn p-3 rounded-full ${isSand ? 'bg-[#43291F] text-[#E6C594]' : 'bg-black/40 text-organic-creamText hover:text-white'} transition-colors"
                        title="View Full Item List"
                      >
                        <i class="fa-solid fa-circle-info text-sm"></i>
                      </button>

                      <button 
                        data-enroll-id="${program.id}"
                        class="program-enroll-btn ${isSand ? 'btn-pill-green' : 'btn-pill-gold'} px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md"
                      >
                        <span>Register</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>
      </section>
    `;
  }

  function attachEvents(onOpenDetailsModal, onEnrollProgram, onCategoryChange) {
    document.querySelectorAll('.program-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.cat;
        onCategoryChange();
      });
    });

    document.querySelectorAll('.program-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onOpenDetailsModal(btn.dataset.detailsId);
      });
    });

    document.querySelectorAll('.program-enroll-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onEnrollProgram(btn.dataset.enrollId);
      });
    });
  }

  return { render, attachEvents };
})();
