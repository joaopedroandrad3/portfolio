import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const NAV_ITEMS = [
  { id: 'hero', key: 'home', num: '01' },
  { id: 'about', key: 'about', num: '02' },
  { id: 'projects', key: 'projects', num: '03' },
  { id: 'telemetry', key: 'telemetry', num: '04' },
  { id: 'trajectory', key: 'trajectory', num: '05' },
  { id: 'contact', key: 'contact', num: '06' },
];

export default function Navbar({ activeSection }) {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/[0.08] bg-[#050509]/80 py-3 backdrop-blur-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Marca astronômica minimalista */}
        <a href="#hero" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition-all duration-300 group-hover:border-amethyst-400/60 group-hover:shadow-violetGlow">
            <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(192,132,252,1)]" />
            <span className="animate-slow-orbit absolute inset-1 rounded-full border border-dashed border-amethyst-400/45" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-semibold tracking-[0.22em] text-white">
              JP<span className="text-amethyst-400">.</span>ANDRADE
            </span>
            <span className="block font-mono text-[10px] tracking-[0.2em] text-mist/75">
              FULLSTACK // AI
            </span>
          </div>
        </a>

        {/* Navegação principal desktop */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-[#0B0A14]/65 px-2 py-1.5 backdrop-blur-xl lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative rounded-full px-4 py-1.5 text-xs font-medium tracking-[0.12em] uppercase transition-colors ${
                  isActive ? 'text-white' : 'text-mist hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="glass-pill-active absolute inset-0 -z-10 rounded-full"
                  />
                )}
                {t.nav[item.key]}
              </a>
            );
          })}
        </nav>

        {/* Controles à direita: Switch PT/EN + menu mobile */}
        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Language switcher"
            className="flex items-center rounded-full border border-white/15 bg-[#0C0B16]/85 p-1 shadow-glass backdrop-blur-xl"
          >
            <Globe className="ml-1.5 mr-1 h-3.5 w-3.5 text-amethyst-300" />
            {['pt', 'en'].map((code) => {
              const active = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`relative rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider transition-all ${
                    active ? 'glass-pill-active' : 'text-mist hover:text-white'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Menu"
            className="glass-pill-idle flex h-9 w-9 items-center justify-center rounded-full text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-4 mt-3 rounded-2xl border border-white/12 bg-[#090812]/95 p-4 shadow-glass backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition ${
                    activeSection === item.id
                      ? 'glass-pill-active'
                      : 'text-mist hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{t.nav[item.key]}</span>
                  <span className="font-mono text-xs opacity-70">{item.num}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
