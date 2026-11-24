import { useLanguage } from '../i18n/LanguageContext';

const SECTORS = [
  { id: 'hero', num: '01', key: 'home' },
  { id: 'about', num: '02', key: 'about' },
  { id: 'projects', num: '03', key: 'projects' },
  { id: 'telemetry', num: '04', key: 'telemetry' },
  { id: 'trajectory', num: '05', key: 'trajectory' },
  { id: 'contact', num: '06', key: 'contact' },
];

/**
 * Trilho lateral orbital inspirado na Referência 1 (índices verticais 01..06).
 */
export default function OrbitalIndexRail({ activeSection }) {
  const { t } = useLanguage();

  return (
    <aside
      aria-label="Section index"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 2xl:right-6 xl:flex"
    >
      {SECTORS.map((s) => {
        const active = activeSection === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={t.nav[s.key]}
            className="group relative flex items-center gap-2.5"
          >
            <span className="pointer-events-none absolute right-14 rounded-full border border-white/15 bg-[#0A0912]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amethyst-300 opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100">
              {t.nav[s.key]}
            </span>
            <span
              className={`font-mono text-xs transition-all duration-300 ${
                active
                  ? 'scale-110 font-semibold text-white drop-shadow-[0_0_10px_rgba(192,132,252,0.95)]'
                  : 'text-white/30 group-hover:text-white/75'
              }`}
            >
              {s.num}
            </span>
            <span
              className={`h-[1px] transition-all duration-300 ${
                active
                  ? 'w-6 bg-gradient-to-r from-amethyst-400 to-white shadow-[0_0_10px_#A855F7]'
                  : 'w-2.5 bg-white/20 group-hover:w-4 group-hover:bg-white/50'
              }`}
            />
          </a>
        );
      })}
    </aside>
  );
}
