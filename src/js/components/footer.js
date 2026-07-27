/**
 * Dynamic Footer Component
 */
const FooterComponent = (function() {
  function render(onNavClick) {
    const settings = MadrasaDB.getSettings();
    const container = document.getElementById('footer-container');
    if (!container) return;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <!-- Col 1: Madrasa Brand -->
          <div class="md:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                <i class="fa-solid fa-mosque"></i>
              </div>
              <h3 class="font-title font-bold text-lg text-amber-300">
                ${NavbarComponent.escapeHTML(settings.madrasaName || 'Madrasa Al-Hikmah')}
              </h3>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">
              Dedicated to preserving classical Quranic memorization, Tajweed sciences, and Islamic jurisprudence for future generations.
            </p>
            <div class="flex items-center gap-3 text-slate-400">
              <a href="#" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/40 transition-colors"><i class="fa-brands fa-facebook-f text-xs"></i></a>
              <a href="#" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/40 transition-colors"><i class="fa-brands fa-youtube text-xs"></i></a>
              <a href="#" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/40 transition-colors"><i class="fa-brands fa-whatsapp text-xs"></i></a>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Navigation</h4>
            <ul class="space-y-2 text-xs text-slate-300">
              <li><button data-footer-nav="home" class="hover:text-amber-300 transition-colors">Home Page</button></li>
              <li><button data-footer-nav="programs" class="hover:text-amber-300 transition-colors">Academic Programs</button></li>
              <li><button data-footer-nav="events" class="hover:text-amber-300 transition-colors">Upcoming Events</button></li>
              <li><button data-footer-nav="database" class="hover:text-amber-300 transition-colors">Student Database</button></li>
              <li><button data-footer-nav="results" class="hover:text-amber-300 transition-colors">Results Portal</button></li>
            </ul>
          </div>

          <!-- Col 3: Programs Overview -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Core Disciplines</h4>
            <ul class="space-y-2 text-xs text-slate-300">
              <li><span class="text-slate-400">•</span> Tajweed & Sab'ah Qira'at</li>
              <li><span class="text-slate-400">•</span> Full Hifz-ul-Quran</li>
              <li><span class="text-slate-400">•</span> Alimiyyah Arabic & Hadith</li>
              <li><span class="text-slate-400">•</span> Fiqh & Modern Bioethics</li>
              <li><span class="text-slate-400">•</span> Weekend Youth Academy</li>
            </ul>
          </div>

          <!-- Col 4: Contact & Campus -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">Campus Contact</h4>
            <div class="space-y-2 text-xs text-slate-300">
              <p><i class="fa-solid fa-location-dot text-amber-400 w-4"></i> ${settings.address || '786 Knowledge Ave, Islamic District'}</p>
              <p><i class="fa-solid fa-phone text-emerald-400 w-4"></i> ${settings.contactPhone || '+1 (800) 555-QURAN'}</p>
              <p><i class="fa-solid fa-envelope text-cyan-400 w-4"></i> ${settings.contactEmail || 'info@madrasa-alhikmah.edu'}</p>
            </div>
            
            <!-- Quick Newsletter Form -->
            <div class="mt-4 pt-3 border-t border-slate-800">
              <span class="text-[11px] text-slate-400 block mb-1.5">Subscribe to Event Bulletins:</span>
              <div class="flex items-center gap-1.5">
                <input type="email" placeholder="Your email..." class="bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 w-full">
                <button class="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors">Join</button>
              </div>
            </div>
          </div>

        </div>

        <div class="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; ${new Date().getFullYear()} <span class="text-amber-300 font-semibold">${NavbarComponent.escapeHTML(settings.madrasaName || 'Madrasa Al-Hikmah')}</span>. All Rights Reserved.
          </div>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" class="hover:text-slate-200 transition-colors">Academic Terms</a>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-footer-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        onNavClick(btn.dataset.footerNav);
      });
    });
  }

  return { render };
})();
