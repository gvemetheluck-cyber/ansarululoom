/**
 * Hero Section Component - Clean Organic Organic Earth & Leaf Theme
 */
const HeroComponent = (function() {
  function render(onNavigate, onEnrollClick) {
    const settings = MadrasaDB.getSettings();
    const madrasaName = settings.madrasaName || "Ansarul Uloom Madrasa";
    const location = settings.location || "Andona, Thamarassery, Kozhikkode";
    const studentsCount = MadrasaDB.getStudents().length;
    const programsCount = MadrasaDB.getPrograms().length;

    return `
      <section class="relative pt-12 pb-20 overflow-hidden">
        <!-- Background Ambient Glow Orbs -->
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
              <span>MEELAD FEST PROGRAMS & COMPETITIONS</span>
              <span class="text-xs px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase font-bold">1448 AH</span>
            </div>

            <!-- Subtitle -->
            <p class="mt-4 text-base sm:text-lg text-organic-muted max-w-3xl font-light leading-relaxed">
              Official Portal for Kids, Sub-Junior, Junior, Senior, and General Group Meelad Competitions, Student Records, Program Assignments & Result Transcripts.
            </p>

            <!-- Quick Category Tags -->
            <div class="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
              <span class="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-amber-500/40 text-organic-pillGold"><i class="fa-solid fa-child text-amber-400 mr-1.5"></i> KIDS (BOYS | GIRLS)</span>
              <span class="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"><i class="fa-solid fa-child-reaching text-emerald-400 mr-1.5"></i> SUB JUNIOR</span>
              <span class="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-cyan-500/40 text-cyan-300"><i class="fa-solid fa-user-graduate text-cyan-400 mr-1.5"></i> JUNIOR</span>
              <span class="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-purple-500/40 text-purple-300"><i class="fa-solid fa-award text-purple-400 mr-1.5"></i> SENIOR</span>
              <span class="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-rose-500/40 text-rose-300"><i class="fa-solid fa-music text-rose-400 mr-1.5"></i> GENERAL (QAWALI / BURDA)</span>
            </div>

            <!-- Call to Actions -->
            <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button id="hero-explore-btn" class="btn-pill-gold px-8 py-4 text-sm font-bold flex items-center gap-3 shadow-xl">
                <i class="fa-solid fa-list-check text-organic-darkText text-base"></i>
                <span>Explore Meelad Programs</span>
              </button>

              <button id="hero-enroll-btn" class="btn-pill-green px-8 py-4 text-sm font-bold flex items-center gap-3 shadow-lg">
                <i class="fa-solid fa-user-plus text-emerald-300"></i>
                <span>Register Student</span>
              </button>

              <button id="hero-portal-btn" class="px-6 py-4 rounded-full text-xs font-bold text-organic-creamText hover:text-white bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-700/50 transition-all flex items-center gap-2">
                <i class="fa-solid fa-trophy text-organic-pillGold"></i>
                <span>Meelad Results Lookup</span>
              </button>
            </div>
          </div>

          <!-- Dynamic Organic Earth Stats Section -->
          <div class="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div class="card-green p-6 interactive-card group">
              <div class="flex items-center justify-between">
                <div class="badge-circle-icon">
                  <i class="fa-solid fa-users text-xl"></i>
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Meelad</span>
              </div>
              <div class="mt-4">
                <div class="text-3xl font-extrabold text-organic-creamText font-title cream-gradient-text">
                  250+ Students
                </div>
                <div class="text-xs font-medium text-organic-muted mt-1">Registered Contestants</div>
              </div>
            </div>

            <div class="card-brown p-6 interactive-card group">
              <div class="flex items-center justify-between">
                <div class="badge-circle-icon">
                  <i class="fa-solid fa-layer-group text-xl"></i>
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Categories</span>
              </div>
              <div class="mt-4">
                <div class="text-3xl font-extrabold text-organic-creamText font-title sand-gradient-text">
                  8 Divisions
                </div>
                <div class="text-xs font-medium text-organic-muted mt-1">Kids to Senior & General</div>
              </div>
            </div>

            <div class="card-sand p-6 interactive-card group">
              <div class="flex items-center justify-between">
                <div class="badge-circle-icon">
                  <i class="fa-solid fa-trophy text-xl"></i>
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#3D241B] text-[#E6C594]">Events</span>
              </div>
              <div class="mt-4">
                <div class="text-3xl font-extrabold text-[#2B1D14] font-title">
                  50+ Contests
                </div>
                <div class="text-xs font-bold text-[#5C4537] mt-1">Stage & Off-Stage</div>
              </div>
            </div>

            <div class="card-green p-6 interactive-card group">
              <div class="flex items-center justify-between">
                <div class="badge-circle-icon">
                  <i class="fa-solid fa-location-dot text-xl"></i>
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Campus</span>
              </div>
              <div class="mt-4">
                <div class="text-2xl font-extrabold text-organic-creamText font-title cream-gradient-text">
                  Thamarassery
                </div>
                <div class="text-xs font-medium text-organic-muted mt-1">Andona, Kozhikkode</div>
              </div>
            </div>

          </div>

          <!-- Feature Spotlight Banner -->
          <div class="mt-10 card-brown rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl flex-shrink-0">
                <i class="fa-solid fa-trophy animate-bounce"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">Meelad Grand Stage</span>
                  <span class="text-xs text-amber-300 font-semibold">Ansarul Uloom Campus</span>
                </div>
                <h3 class="text-xl font-bold text-white mt-1">General Group Contests: Qawali, Burda, Nasheed & Maalappattu</h3>
                <p class="text-sm text-organic-muted mt-1">Live group performances by Senior & Junior students at Andona, Thamarassery.</p>
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
  }

  return { render, attachEvents };
})();
