/**
 * Hero Section Component with Meelad 3 Team Leaderboard (Quaf, Noon, Meem)
 */
const HeroComponent = (function() {
  function render(onNavigate, onEnrollClick) {
    const settings = MadrasaDB.getSettings();
    const madrasaName = settings.madrasaName || "Ansarul Uloom Madrasa";
    const location = settings.location || "Andona, Thamarassery, Kozhikkode";
    const standings = MadrasaDB.getTeamStandings();

    return `
      <section class="relative pt-12 pb-20 overflow-hidden">
        <!-- Ambient Glow Orbs -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-700/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div class="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <!-- Bismillah & Location Badge -->
          <div class="flex flex-col items-center text-center mb-6">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-700/50 text-organic-pillGold text-xs font-bold shadow-lg mb-6 hover:border-amber-400 transition-colors">
              <i class="fa-solid fa-star text-amber-400 text-[10px]"></i>
              <span class="font-arabic text-sm text-amber-200">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
              <span class="text-slate-600">|</span>
              <span class="text-emerald-300"><i class="fa-solid fa-location-dot mr-1"></i> ${location}</span>
            </div>

            <!-- Main Title -->
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-title font-extrabold tracking-tight text-organic-creamText max-w-5xl leading-tight">
              <span class="cream-gradient-text drop-shadow-lg inline-block transform hover:scale-105 transition-transform duration-300">
                ${NavbarComponent.escapeHTML(madrasaName)}
              </span>
            </h1>

            <div class="mt-2 text-xl font-extrabold text-organic-pillGold flex items-center justify-center gap-2">
              <span>MEELAD FEST TEAMS & COMPETITIONS</span>
              <span class="text-xs px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase font-bold">1448 AH</span>
            </div>

            <!-- Subtitle -->
            <p class="mt-4 text-base sm:text-lg text-organic-muted max-w-3xl font-light leading-relaxed">
              Official Portal for Kids, Sub-Junior, Junior, Senior, and General Group Meelad Competitions, 3-Team Championship Points & Transcripts.
            </p>

            <!-- Call to Actions -->
            <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button id="hero-explore-btn" class="btn-pill-gold px-8 py-4 text-sm font-bold flex items-center gap-3 shadow-xl">
                <i class="fa-solid fa-list-check text-organic-darkText text-base"></i>
                <span>Explore Meelad Programs</span>
              </button>

              <button id="hero-enroll-btn" class="btn-pill-green px-8 py-4 text-sm font-bold flex items-center gap-3 shadow-lg">
                <i class="fa-solid fa-user-plus text-emerald-300"></i>
                <span>Register Student to Team</span>
              </button>

              <button id="hero-portal-btn" class="px-6 py-4 rounded-full text-xs font-bold text-organic-creamText hover:text-white bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-700/50 transition-all flex items-center gap-2">
                <i class="fa-solid fa-trophy text-organic-pillGold"></i>
                <span>Meelad Results Lookup</span>
              </button>
            </div>
          </div>

          <!-- 3 TEAMS CHAMPIONSHIP LEADERBOARD SECTION (Quaf, Noon, Meem) -->
          <div class="mt-14">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg">
                  <i class="fa-solid fa-trophy animate-bounce"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-title font-extrabold text-organic-creamText">Meelad Team Leaderboard</h3>
                  <p class="text-xs text-organic-muted">Overall Championship Points for Team Quaf (ق), Team Noon (ن), and Team Meem (م)</p>
                </div>
              </div>
              <span class="text-xs uppercase font-bold px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">Live Points</span>
            </div>

            <!-- 3 Team Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${standings.map((team, index) => {
                const rankBadge = index === 0 ? "🥇 1st Place" : index === 1 ? "🥈 2nd Place" : "🥉 3rd Place";
                const isQuaf = team.name === "Quaf";
                const isNoon = team.name === "Noon";
                const cardClass = isQuaf ? "card-green" : isNoon ? "card-brown" : "card-sand";

                return `
                  <div class="${cardClass} p-7 interactive-card flex flex-col justify-between relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-14 h-14 rounded-full ${isQuaf ? 'bg-emerald-950 border-emerald-500' : isNoon ? 'bg-amber-950 border-amber-500' : 'bg-[#43291F] border-[#E6C594]'} border-2 flex items-center justify-center text-3xl font-arabic font-bold ${team.name === 'Meem' ? 'text-[#E6C594]' : 'text-amber-300'} shadow-lg">
                          ${team.arabic}
                        </div>
                        <div>
                          <span class="text-[11px] font-extrabold uppercase tracking-wider block ${team.name === 'Meem' ? 'text-[#5C4537]' : 'text-organic-muted'}">
                            Team ${team.name}
                          </span>
                          <h4 class="text-2xl font-title font-extrabold ${team.name === 'Meem' ? 'text-[#2B1D14]' : 'text-white'}">
                            ${team.name} (टीम)
                          </h4>
                        </div>
                      </div>

                      <span class="text-xs font-extrabold px-3 py-1 rounded-full ${
                        index === 0 ? 'bg-amber-400 text-slate-950 shadow-md font-bold' :
                        team.name === 'Meem' ? 'bg-[#43291F] text-[#E6C594]' : 'bg-black/30 text-organic-creamText'
                      }">
                        ${rankBadge}
                      </span>
                    </div>

                    <div class="my-6 py-4 px-5 rounded-2xl ${team.name === 'Meem' ? 'bg-[#43291F]/15 border border-[#43291F]/20' : 'bg-black/30 border border-white/10'} flex items-center justify-between">
                      <div>
                        <span class="text-[10px] uppercase font-bold block ${team.name === 'Meem' ? 'text-[#6B4D3B]' : 'text-organic-muted'}">Total Points</span>
                        <span class="text-4xl font-title font-extrabold ${team.name === 'Meem' ? 'text-[#2B1D14]' : 'text-organic-pillGold'}">
                          ${team.points} <span class="text-xs font-normal">pts</span>
                        </span>
                      </div>
                      <div class="text-right">
                        <span class="text-[10px] uppercase font-bold block ${team.name === 'Meem' ? 'text-[#6B4D3B]' : 'text-organic-muted'}">1st Prizes</span>
                        <span class="text-2xl font-extrabold ${team.name === 'Meem' ? 'text-[#2B1D14]' : 'text-emerald-400'}">
                          🏆 ${team.firstPrizes}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center justify-between text-xs font-semibold ${team.name === 'Meem' ? 'text-[#4A382D]' : 'text-organic-muted'}">
                      <span>Contestants: <strong>${team.totalStudents} Students</strong></span>
                      <button data-filter-team="${team.name}" class="team-filter-btn hover:underline text-organic-pillGold font-bold flex items-center gap-1">
                        <span>View Team Roster</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Feature Spotlight Banner -->
          <div class="mt-10 card-brown rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl flex-shrink-0">
                <i class="fa-solid fa-shield-halved animate-pulse"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">Team Championship</span>
                  <span class="text-xs text-amber-300 font-semibold">Ansarul Uloom Campus</span>
                </div>
                <h3 class="text-xl font-bold text-white mt-1">Quaf, Noon & Meem Group Battles: Qawali, Burda & Nasheed</h3>
                <p class="text-sm text-organic-muted mt-1">Live group performances and points battle by Senior & Junior teams at Andona, Thamarassery.</p>
              </div>
            </div>
            <button id="hero-event-btn" class="btn-pill-gold px-6 py-3 text-xs font-bold flex items-center gap-2 whitespace-nowrap">
              <span>View Meelad Schedule</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

        </div>
      </section>
    `;
  }

  function attachEvents(onNavigate, onEnrollClick) {
    document.getElementById('hero-explore-btn')?.addEventListener('click', () => onNavigate('programs'));
    document.getElementById('hero-enroll-btn')?.addEventListener('click', onEnrollClick);
    document.getElementById('hero-portal-btn')?.addEventListener('click', () => onNavigate('results'));
    document.getElementById('hero-event-btn')?.addEventListener('click', () => onNavigate('events'));

    document.querySelectorAll('.team-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onNavigate('database');
      });
    });
  }

  return { render, attachEvents };
})();
