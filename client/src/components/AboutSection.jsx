import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode2, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { PROFILE_CONFIG } from '../config/profile';
import { useLanguage } from '../i18n/LanguageContext';
import ObsidianRelicCanvas from './ObsidianRelicCanvas';
import MarkdownRenderer from './MarkdownRenderer';

export default function AboutSection({ readme, onRefresh, refreshing }) {
  const { lang, t } = useLanguage();
  const [viewMode, setViewMode] = useState('editorial'); // 'editorial' | 'readme'

  return (
    <section id="about" className="relative z-10 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Coluna Visual com Moldura Geométrica Offset (Ref 2) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="offset-frame mx-auto max-w-md">
              <div className="glass-panel relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                {PROFILE_CONFIG.photoUrl ? (
                  /* Quando o usuário configurar photoUrl em src/config/profile.js,
                     seu retrato aparece aqui no estilo editorial monocromático da Ref 4! */
                  <img
                    src={PROFILE_CONFIG.photoUrl}
                    alt={PROFILE_CONFIG.fullName}
                    className="h-full w-full object-cover grayscale contrast-110 transition duration-700 hover:grayscale-0"
                  />
                ) : (
                  /* Escultura Orbital 3D Interativa enquanto o usuário prefere sem foto */
                  <ObsidianRelicCanvas />
                )}

                {/* Legenda inferior astronômica sobre a moldura */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.14em] text-amethyst-300">
                    <span className="whitespace-nowrap">{t.about.relicLabel}</span>
                    <span className="whitespace-nowrap">@{PROFILE_CONFIG.githubUsername}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-mist/80">
                    {PROFILE_CONFIG.photoUrl
                      ? PROFILE_CONFIG.location[lang]
                      : t.about.relicSub}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coluna Editorial + Alternador Live README do GitHub */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-block border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.26em] text-amethyst-300 uppercase">
              {t.about.sector}
            </span>

            <h2 className="mt-5 font-serif text-4xl font-light leading-[1.08] text-white sm:text-5xl">
              {t.about.titleStart}{' '}
              <span className="italic text-amethyst-300">{t.about.titleItalic}</span>{' '}
              {t.about.titleEnd}
            </h2>

            {/* Switcher Tátil Ref-5: Visão Editorial ↔ README.md Live do GitHub */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-full border border-white/12 bg-[#0B0A14]/90 p-1 shadow-glass backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('editorial')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    viewMode === 'editorial'
                      ? 'glass-pill-active'
                      : 'text-mist hover:text-white'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  {t.about.tabEditorial}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('readme')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    viewMode === 'readme' ? 'glass-pill-active' : 'text-mist hover:text-white'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  {t.about.tabReadme}
                </button>
              </div>

              {viewMode === 'readme' && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="glass-pill-idle inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[11px] text-amethyst-300 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? t.about.syncing : t.about.syncButton}
                </button>
              )}
            </div>

            {/* Conteúdo Alternável */}
            <div className="mt-6 min-h-[260px]">
              <AnimatePresence mode="wait">
                {viewMode === 'editorial' ? (
                  <motion.div
                    key="editorial"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <p className="text-base font-medium leading-relaxed text-white/95 sm:text-lg">
                      {t.about.lead}
                    </p>
                    <div className="h-[1px] w-20 bg-gradient-to-r from-amethyst-400 to-transparent" />
                    <p className="text-sm leading-relaxed text-mist sm:text-[15px]">
                      {t.about.body1}
                    </p>
                    <p className="text-sm leading-relaxed text-mist sm:text-[15px]">
                      {t.about.body2}
                    </p>

                    {/* Cartões rápidos arquitetônicos */}
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      {t.about.quickStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="glass-panel rounded-xl px-4 py-3.5"
                        >
                          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mist/80">
                            {stat.label}
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-white sm:text-base">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="readme"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel rounded-2xl p-6"
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] text-amethyst-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t.about.readmeCaption}
                      </span>
                      <span className="font-mono text-[10px] text-mist">
                        {readme?.lineCount || 0} lines
                      </span>
                    </div>
                    <div className="max-h-[340px] overflow-y-auto pr-2">
                      <MarkdownRenderer content={readme?.raw} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
