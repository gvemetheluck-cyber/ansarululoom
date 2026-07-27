/**
 * Programs Component - Earth & Leaf Organic Grid matching Reference Image
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
                <span>Meelad Fest 2026 Categories</span>
              </div>
              <h2 class="text-3xl sm:text-5xl font-title font-extrabold text-organic-creamText">
                Programs & Competitions
              </h2>
              <p class="mt-2 text-organic-muted text-sm sm:text-base max-w-2xl font-light">
                Explore stage and off-stage competition divisions for Ansarul Uloom Madrasa, Andona, Thamarassery.
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

          <!-- Programs Grid matching Reference Image Cards (Green, Brown, Sand Cards) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${filteredPrograms.map((program, idx) => {
              // Alternate card themes: Card Green, Card Brown, Card Sand
              const cardClass = idx % 3 === 0 ? 'card-green' : idx % 3 === 1 ? 'card-brown' : 'card-sand';
              const pctEnrolled = Math.min(100, Math.round((program.enrolledCount / program.capacity) * 100));
              const isSand = cardClass === 'card-sand';

              return `
                <div class="${cardClass} p-7 interactive-card flex flex-col justify-between relative overflow-hidden group">
                  <div>
                    <!-- Header Circular Icon Badge & Category Pill -->
                    <div class="flex items-center justify-between gap-2 mb-6">
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

                    <p class="text-xs mt-3 line-clamp-2 leading-relaxed ${isSand ? 'text-[#4A382D]' : 'text-organic-muted'}">
                      ${NavbarComponent.escapeHTML(program.description)}
                    </p>

                    <!-- Items / Events Included List Pills -->
                    <div class="mt-5">
                      <span class="text-[10px] font-bold uppercase tracking-wider block mb-2 ${isSand ? 'text-[#6B4D3B]' : 'text-organic-pillGold'}">
                        Events (${(program.subjects || []).length}):
                      </span>
                      <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        ${(program.subjects || []).slice(0, 6).map(sub => `
                          <span class="px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                            isSand ? 'bg-[#43291F]/15 text-[#372318] border border-[#43291F]/20' : 'bg-black/25 text-emerald-200 border border-white/10'
                          }">
                            ${sub}
                          </span>
                        `).join('')}
                        ${(program.subjects || []).length > 6 ? `
                          <span class="px-2 py-1 rounded-lg text-[10px] font-bold ${isSand ? 'bg-[#43291F]/20 text-[#2B1D14]' : 'bg-amber-500/20 text-amber-300'}">
                            +${(program.subjects || []).length - 6} More
                          </span>
                        ` : ''}
                      </div>
                    </div>

                    <!-- Capacity / Participants Progress -->
                    <div class="mt-6">
                      <div class="flex items-center justify-between text-xs mb-1.5">
                        <span class="${isSand ? 'text-[#5C4537]' : 'text-organic-muted'} font-medium">Registered Participants:</span>
                        <span class="font-extrabold ${isSand ? 'text-[#2B1D14]' : 'text-organic-pillGold'}">${program.enrolledCount} / ${program.capacity}</span>
                      </div>
                      <div class="w-full h-2.5 ${isSand ? 'bg-black/15' : 'bg-black/40'} rounded-full overflow-hidden">
                        <div class="h-full ${isSand ? 'bg-[#43291F]' : 'bg-gradient-to-r from-emerald-400 to-amber-300'} rounded-full transition-all duration-500" style="width: ${pctEnrolled}%"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Card Action Footer -->
                  <div class="mt-8 pt-5 border-t ${isSand ? 'border-black/15' : 'border-white/10'} flex items-center justify-between gap-3">
                    <div class="text-xs">
                      <span class="text-[10px] uppercase font-bold block ${isSand ? 'text-[#6B4D3B]' : 'text-organic-muted'}">Schedule</span>
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
