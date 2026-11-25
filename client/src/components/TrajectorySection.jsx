import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

function SkillTrack({ name, level, tag, delay = 0 }) {
  return (
    <div className="group">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-white/95 transition-colors group-hover:text-amethyst-300">
          {name}
        </span>
        <span className="font-mono text-[10px] text-mist">{tag}</span>
      </div>
      <div className="relative h-[2px] w-full bg-white/12">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full bg-gradient-to-r from-white/40 via-amethyst-400 to-white"
        >
          <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white bg-[#0A0912] shadow-[0_0_12px_rgba(192,132,252,0.95)]" />
        </motion.div>
      </div>
    </div>
  );
}

export default function TrajectorySection() {
  const { t } = useLanguage();

  return (
    <section id="trajectory" className="relative z-10 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="inline-block border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.26em] text-amethyst-300 uppercase">
            {t.trajectory.sector}
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light text-white sm:text-5xl">
            {t.trajectory.titleStart}{' '}
            <span className="italic text-amethyst-300">{t.trajectory.titleItalic}</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Coluna 1: Habilidades Técnicas */}
          <div className="space-y-8 lg:col-span-4">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-mono text-xs tracking-[0.22em] text-white uppercase">
                {t.trajectory.colSkillsCore}
              </h3>
              <div className="mt-2 h-[1px] w-12 bg-amethyst-400" />
              <div className="mt-6 space-y-5">
                {t.trajectory.skillsCore.map((skill, idx) => (
                  <SkillTrack key={skill.name} {...skill} delay={idx * 0.08} />
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-mono text-xs tracking-[0.22em] text-amethyst-300 uppercase">
                {t.trajectory.colSkillsNext}
              </h3>
              <div className="mt-2 h-[1px] w-12 bg-amethyst-400" />
              <div className="mt-6 space-y-5">
                {t.trajectory.skillsNext.map((skill, idx) => (
                  <SkillTrack key={skill.name} {...skill} delay={0.15 + idx * 0.08} />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna 2: Linha do Tempo Profissional e Acadêmica */}
          <div className="lg:col-span-5">
            <div className="glass-panel h-full rounded-2xl p-6 sm:p-8">
              <h3 className="font-mono text-xs tracking-[0.22em] text-white uppercase">
                {t.trajectory.colTimeline}
              </h3>
              <div className="mt-2 h-[1px] w-12 bg-amethyst-400" />

              <div className="relative mt-8 space-y-8 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-[1px] before:bg-gradient-to-b before:from-amethyst-400/80 before:via-white/20 before:to-transparent">
                {t.trajectory.timeline.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative pl-12"
                  >
                    <span className="absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-amethyst-400/60 bg-[#0D0A1A] font-mono text-[9px] text-amethyst-300 shadow-[0_0_16px_rgba(139,92,246,0.45)]">
                      0{idx + 1}
                    </span>

                    <span className="font-mono text-[10px] tracking-[0.2em] text-amethyst-300 uppercase">
                      {item.period}
                    </span>
                    <h4 className="mt-1 text-base font-semibold text-white">{item.title}</h4>
                    <p className="font-mono text-[11px] text-white/60">{item.org}</p>
                    <p className="mt-2 text-xs leading-relaxed text-mist">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna 3: Contribuições + Disponibilidade & Idiomas (focado em recrutadores) */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <div className="glass-panel flex-1 rounded-2xl p-6">
              <h3 className="font-mono text-xs tracking-[0.22em] text-white uppercase">
                {t.trajectory.colCapabilities}
              </h3>
              <div className="mt-2 h-[1px] w-12 bg-amethyst-400" />

              <ul className="mt-6 space-y-4">
                {t.trajectory.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2.5 text-xs leading-relaxed text-mist">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amethyst-400" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-amethyst-300" />
                <h3 className="font-mono text-xs tracking-[0.22em] text-white uppercase">
                  {t.trajectory.colAvailability}
                </h3>
              </div>
              <div className="mt-5 space-y-4">
                {t.trajectory.availability.map((item) => (
                  <div key={item.label} className="border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
                    <span className="block font-mono text-[10px] tracking-[0.18em] text-amethyst-300 uppercase">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-white/95">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
