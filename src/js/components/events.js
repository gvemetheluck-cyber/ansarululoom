/**
 * Events & Seminars Showcase Component with Live Countdown
 */
const EventsComponent = (function() {
  let currentCategory = 'All';

  function render(onOpenEventModal) {
    const events = MadrasaDB.getEvents();
    const categories = ['All', 'Academic', 'Ceremony', 'Spiritual', 'Youth'];

    const filteredEvents = currentCategory === 'All'
      ? events
      : events.filter(e => e.category === currentCategory);

    // Pick the earliest upcoming event for countdown banner
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const nextEvent = sortedEvents[0] || events[0];

    return `
      <section id="events-section" class="py-16 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
                <i class="fa-solid fa-calendar-star text-amber-400"></i>
                <span>Madrasa Gatherings</span>
              </div>
              <h2 class="text-3xl sm:text-4xl font-title font-extrabold text-white">
                Upcoming Events & Seminars
              </h2>
              <p class="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
                Join our spiritual gatherings, annual graduation galas, scholarly lectures, and youth competitions.
              </p>
            </div>

            <!-- Category Tabs -->
            <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              ${categories.map(cat => `
                <button 
                  data-cat="${cat}" 
                  class="event-cat-btn px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                    currentCategory === cat
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                  }"
                >
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Featured Countdown Widget -->
          ${nextEvent ? `
            <div class="glass-panel-gold rounded-3xl p-6 lg:p-8 mb-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-3xl flex-shrink-0">
                  <i class="fa-solid ${nextEvent.imageIcon || 'fa-trophy'}"></i>
                </div>
                <div>
                  <span class="text-xs uppercase tracking-widest text-amber-400 font-bold px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 inline-block mb-2">
                    Featured Event Spotlight
                  </span>
                  <h3 class="text-2xl font-bold text-white">${NavbarComponent.escapeHTML(nextEvent.title)}</h3>
                  <p class="text-sm text-slate-300 mt-1 max-w-xl">${NavbarComponent.escapeHTML(nextEvent.description)}</p>
                  
                  <div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-amber-200">
                    <span><i class="fa-solid fa-calendar text-amber-400 mr-1.5"></i> ${nextEvent.date}</span>
                    <span><i class="fa-solid fa-clock text-amber-400 mr-1.5"></i> ${nextEvent.time}</span>
                    <span><i class="fa-solid fa-location-dot text-amber-400 mr-1.5"></i> ${nextEvent.location}</span>
                  </div>
                </div>
              </div>

              <!-- Live Countdown Clock -->
              <div class="flex items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 shadow-inner">
                <div class="text-center px-3">
                  <span id="cd-days" class="text-2xl lg:text-3xl font-extrabold text-amber-400 font-title">18</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Days</span>
                </div>
                <span class="text-slate-600 font-bold text-xl">:</span>
                <div class="text-center px-3">
                  <span id="cd-hours" class="text-2xl lg:text-3xl font-extrabold text-amber-400 font-title">07</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Hours</span>
                </div>
                <span class="text-slate-600 font-bold text-xl">:</span>
                <div class="text-center px-3">
                  <span id="cd-mins" class="text-2xl lg:text-3xl font-extrabold text-amber-400 font-title">42</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Mins</span>
                </div>
                <span class="text-slate-600 font-bold text-xl">:</span>
                <div class="text-center px-3">
                  <span id="cd-secs" class="text-2xl lg:text-3xl font-extrabold text-amber-400 font-title">15</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Secs</span>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Events Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${filteredEvents.map(evt => `
              <div class="glass-panel rounded-2xl p-6 border-slate-800 hover:border-emerald-500/40 transition-all duration-300 interactive-card emerald-card flex flex-col justify-between group">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ${evt.category}
                    </span>
                    <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <i class="fa-solid fa-users text-amber-400"></i>
                      <span>${evt.rsvpCount || 0} Attending</span>
                    </span>
                  </div>

                  <h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    ${NavbarComponent.escapeHTML(evt.title)}
                  </h3>

                  <p class="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    ${NavbarComponent.escapeHTML(evt.description)}
                  </p>

                  <div class="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-calendar-day text-amber-400 w-4"></i>
                      <span>${evt.date} (${evt.time})</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-location-dot text-emerald-400 w-4"></i>
                      <span>${evt.location}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button 
                    data-rsvp-id="${evt.id}"
                    class="event-rsvp-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <i class="fa-solid fa-square-check"></i>
                    <span>RSVP / Register</span>
                  </button>

                  <button 
                    data-view-event="${evt.id}"
                    class="event-view-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    <span>View Info</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

        </div>
      </section>
    `;
  }

  function startCountdownTimer(targetDateStr) {
    const target = new Date(targetDateStr || '2026-08-20T09:00:00').getTime();
    
    function update() {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('cd-days');
      const hEl = document.getElementById('cd-hours');
      const mEl = document.getElementById('cd-mins');
      const sEl = document.getElementById('cd-secs');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  function attachEvents(onOpenEventModal, onCategoryChange, onRSVP) {
    document.querySelectorAll('.event-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.cat;
        onCategoryChange();
      });
    });

    document.querySelectorAll('.event-rsvp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.rsvpId;
        onRSVP(id);
      });
    });

    document.querySelectorAll('.event-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.viewEvent;
        onOpenEventModal(id);
      });
    });
  }

  return { render, attachEvents, startCountdownTimer };
})();
