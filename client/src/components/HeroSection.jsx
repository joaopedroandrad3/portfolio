import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Github, Instagram, Linkedin, Mail, Sparkles } from 'lucide-react';
import { PROFILE_CONFIG } from '../config/profile';
import { useLanguage } from '../i18n/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden pt-28 pb-10"
    >
      {/* Horizonte Astronômico / Eclipse Arquitetônico à Direita */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 h-[640px] w-[640px] -translate-y-1/2 opacity-90 sm:-right-20 lg:right-[2%] lg:h-[740px] lg:w-[740px]"
      >
        {/* Halo de coroa violeta */}
        <div
          className="absolute inset-12 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 38% 45%, rgba(168,85,247,0.34) 0%, rgba(109,40,217,0.16) 40%, rgba(4,4,7,0) 72%)',
          }}
        />
        <svg viewBox="0 0 600 600" className="relative h-full w-full" fill="none">
          <defs>
            <linearGradient id="eclipseRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#C084FC" stopOpacity="0.65" />
              <stop offset="75%" stopColor="#7C3AED" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#040407" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Anéis orbitais lentos */}
          <g className="animate-slow-orbit origin-center" style={{ transformOrigin: '300px 300px' }}>
            <circle
              cx="300"
              cy="300"
              r="258"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="3 10"
            />
            <circle cx="300" cy="42" r="3.5" fill="#E9D5FF" />
            <circle cx="558" cy="300" r="2.2" fill="#FFFFFF" fillOpacity="0.65" />
          </g>

          <g
            className="animate-slow-orbit-reverse origin-center"
            style={{ transformOrigin: '300px 300px' }}
          >
            <ellipse
              cx="300"
              cy="300"
              rx="235"
              ry="94"
              transform="rotate(-28 300 300)"
              stroke="rgba(192,132,252,0.28)"
              strokeWidth="1"
            />
            <circle cx="118" cy="396" r="3" fill="#C084FC" />
          </g>

          {/* Arco de Eclipse (preto absoluto com borda branca & violeta) */}
          <circle cx="300" cy="300" r="158" stroke="url(#eclipseRing)" strokeWidth="2.2" />
          <circle cx="300" cy="300" r="172" stroke="rgba(168,85,247,0.18)" strokeWidth="1" />
          <circle cx="308" cy="304" r="152" fill="#040407" />

          {/* Brilho "anel de diamante" no topo esquerdo do eclipse */}
          <circle cx="194" cy="184" r="4.5" fill="#FFFFFF" />
          <line x1="170" y1="184" x2="218" y2="184" stroke="rgba(255,255,255,0.65)" strokeWidth="1" />
          <line x1="194" y1="160" x2="194" y2="208" stroke="rgba(255,255,255,0.65)" strokeWidth="1" />

          {/* Eixos celestiais */}
          <line x1="300" y1="20" x2="300" y2="108" stroke="rgba(255,255,255,0.1)" />
          <line x1="300" y1="492" x2="300" y2="580" stroke="rgba(255,255,255,0.1)" />
        </svg>
      </div>

      {/* Conteúdo Principal do Hero */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-12 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {/* Coordenadas + Eyebrow */}
          <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.24em] text-amethyst-300 uppercase">
            <span className="inline-flex items-center gap-2 rounded-full border border-amethyst-400/30 bg-amethyst-600/10 px-3.5 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amethyst-300" />
              {t.hero.eyebrow}
            </span>
            <span className="text-white/35">{PROFILE_CONFIG.coordinates}</span>
          </div>

          {/* Tipografia Empilhada Editorial (Ref 4 + Ref 2) */}
          <h1 className="leading-[0.94] tracking-tight">
            <span className="block text-4xl font-light tracking-[0.16em] text-white/80 uppercase sm:text-6xl lg:text-7xl">
              {PROFILE_CONFIG.firstName}
            </span>
            <span className="mt-1 block text-5xl font-bold tracking-[0.06em] text-white uppercase sm:text-7xl lg:text-[5.4rem]">
              {PROFILE_CONFIG.lastName}
              <span className="text-amethyst-400">.</span>
            </span>
          </h1>

          {/* Subtítulo Serifado Editorial */}
          <p className="mt-5 font-serif text-2xl font-light text-white/90 sm:text-3xl lg:text-4xl">
            {t.hero.rolePrefix}{' '}
            <span className="italic text-amethyst-300">{t.hero.roleHighlight}</span>
          </p>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
            {t.hero.tagline}
          </p>

          {/* CTAs Táteis de Vidro Fumê (Ref 4 + Ref 5) */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="glass-pill-active group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-transform duration-300 hover:scale-[1.03]"
            >
              <span>{t.hero.ctaProjects}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="#telemetry"
              className="glass-pill-idle inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide text-white/90"
            >
              <span>{t.hero.ctaTelemetry}</span>
            </a>
          </div>

          {/* Ícones Sociais Minimalistas (Ref 4) */}
          <div className="mt-10 flex items-center gap-3">
            {[
              { href: PROFILE_CONFIG.socials.github, icon: Github, label: 'GitHub' },
              { href: PROFILE_CONFIG.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
              { href: PROFILE_CONFIG.socials.instagram, icon: Instagram, label: 'Instagram' },
              { href: `mailto:${PROFILE_CONFIG.socials.email}`, icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                className="glass-pill-idle flex h-10 w-10 items-center justify-center rounded-full text-mist hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Faixa Inferior Arquitetônica em 3 Colunas (diretamente inspirada na Ref 1!) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10"
      >
        <div className="border-t border-white/12 pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {t.hero.pillars.map((pillar) => (
              <a
                key={pillar.index}
                href={pillar.target}
                className="group flex flex-col justify-between rounded-xl border border-transparent p-3 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.025]"
              >
                <div>
                  <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-amethyst-300">
                    <span>{pillar.index}</span>
                    <span className="h-[1px] w-5 bg-amethyst-400/50 transition-all duration-300 group-hover:w-8" />
                    <span className="text-white/85">{pillar.title}</span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-mist">{pillar.desc}</p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-white/70 transition-colors group-hover:text-amethyst-300">
                  {pillar.linkLabel}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-4 hidden items-center justify-center md:flex">
            <a
              href="#about"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35 transition hover:text-amethyst-300"
            >
              <span>{t.hero.scrollHint}</span>
              <ArrowDown className="h-3 w-3 animate-bounce" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
