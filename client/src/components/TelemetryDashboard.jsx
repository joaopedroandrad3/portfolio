import { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, FolderGit2, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const CONSTELLATION_LAYOUT = [
  { id: 'core', x: 16, y: 46, primary: true },
  { id: 'fullstack', x: 46, y: 24, primary: true },
  { id: 'ai', x: 78, y: 30, primary: true },
  { id: 'infra', x: 46, y: 74, primary: true },
  { id: 'aed', x: 24, y: 20, primary: false },
  { id: 'beecrowd', x: 26, y: 74, primary: false },
  { id: 'termos', x: 76, y: 72, primary: false },
];

const CONSTELLATION_EDGES = [
  ['core', 'aed'],
  ['core', 'beecrowd'],
  ['core', 'fullstack'],
  ['core', 'infra'],
  ['fullstack', 'ai'],
  ['fullstack', 'infra'],
  ['infra', 'termos'],
  ['ai', 'termos'],
  ['aed', 'fullstack'],
];

const OVERALL_STACK_TRACKS = [
  { name: 'C / C++ & DSA', percentage: 34 },
  { name: 'React & Node/Express', percentage: 28 },
  { name: 'IT Infra & Linux', percentage: 22 },
  { name: 'Python & AI Track', percentage: 16 },
];

function MiniSparkline({ points }) {
  const gradId = `spark-${useId().replace(/:/g, '')}`;
  const path = points
    .map((val, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - (val / 100) * 24;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const area = `${path} L 100 32 L 0 32 Z`;

  return (
    <svg viewBox="0 0 100 32" className="mt-3 h-8 w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke="#C084FC" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function TelemetryDashboard({ telemetry, meta, onRefresh, refreshing }) {
  const { t } = useLanguage();
  const [selectedStar, setSelectedStar] = useState('fullstack');
  const [ringMode, setRingMode] = useState('repos');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const chartData = useMemo(() => {
    const raw = telemetry?.timeline || [];
    if (raw.length >= 4) return raw;
    return [
      { month: '2025-08', events: 2 },
      { month: '2025-11', events: 3 },
      { month: '2025-12', events: 2 },
      { month: '2026-07', events: 4 },
      { month: '2026-08', events: 2 },
      { month: '2026-11', events: 4 },
    ];
  }, [telemetry]);

  const maxEvents = Math.max(...chartData.map((d) => d.events), 1);
  const peakIndex = chartData.reduce(
    (bestIdx, item, idx, arr) => (item.events > arr[bestIdx].events ? idx : bestIdx),
    0
  );
  const activePointIdx = hoveredPoint ?? peakIndex;

  const chartCoords = chartData.map((d, idx) => {
    const x = 24 + (idx / Math.max(1, chartData.length - 1)) * 552;
    const y = 162 - (d.events / maxEvents) * 112;
    return { ...d, x, y };
  });

  const smoothLinePath = chartCoords.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const smoothAreaPath = `${smoothLinePath} L ${chartCoords[chartCoords.length - 1].x} 178 L ${chartCoords[0].x} 178 Z`;

  const ringList =
    ringMode === 'repos' && telemetry?.languages?.length
      ? telemetry.languages.slice(0, 4)
      : OVERALL_STACK_TRACKS;
  const primaryPercent = ringList[0]?.percentage || 55;
  const ringCircumference = 2 * Math.PI * 52;
  const ringDashOffset = ringCircumference * (1 - primaryPercent / 100);

  const topTwoLangs = (telemetry?.languages || [])
    .slice(0, 2)
    .map((l) => l.name)
    .join(' • ');

  const starById = Object.fromEntries(CONSTELLATION_LAYOUT.map((n) => [n.id, n]));
  const activeStarInfo = t.telemetry.constellationNodes[selectedStar];

  return (
    <section id="telemetry" className="relative z-10 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-block border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.26em] text-amethyst-300 uppercase">
              {t.telemetry.sector}
            </span>
            <h2 className="mt-4 font-serif text-4xl font-light text-white sm:text-5xl">
              {t.telemetry.titleStart}{' '}
              <span className="italic text-amethyst-300">{t.telemetry.titleItalic}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
              {t.telemetry.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] text-white/90">
              <span className="h-2 w-2 rounded-full bg-amethyst-400 shadow-[0_0_12px_#A855F7]" />
              {meta?.source === 'live' ? t.telemetry.sourceLive : t.telemetry.sourceSnapshot}
            </span>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="glass-pill-active inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {t.telemetry.refresh}
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="glass-panel mt-12 rounded-3xl p-5 sm:p-7 lg:p-8"
        >
          {/* 3 KPIs objetivos e relevantes para recrutamento */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: FolderGit2,
                label: t.telemetry.kpis.repos,
                value: telemetry?.publicRepos ?? 9,
                sub: t.telemetry.kpis.reposSub,
                spark: [20, 35, 32, 55, 68, 72, 92],
              },
              {
                icon: Code2,
                label: t.telemetry.kpis.topLang,
                value: topTwoLangs || 'C • JavaScript',
                sub: t.telemetry.kpis.topLangSub,
                spark: [22, 42, 48, 60, 74, 82, 94],
              },
              {
                icon: Cpu,
                label: t.telemetry.kpis.focus,
                value: t.telemetry.kpis.focusVal,
                sub: t.telemetry.kpis.focusSub,
                spark: [30, 46, 58, 70, 80, 88, 98],
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="glass-panel-hover rounded-2xl border border-white/10 bg-[#0C0A17]/80 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amethyst-400/35 bg-amethyst-600/20 text-amethyst-300 shadow-[0_0_16px_rgba(139,92,246,0.28)]">
                    <kpi.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-4 text-xs text-mist">{kpi.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {kpi.value}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-mist/75">{kpi.sub}</p>
                <MiniSparkline points={kpi.spark} />
              </div>
            ))}
          </div>

          {/* Gráfico de Atividade (8 cols) + Distribuição Circular (4 cols) */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-white/10 bg-[#0B0915]/80 p-5 sm:p-6 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-medium text-white">{t.telemetry.activityTitle}</h3>
                  <p className="mt-0.5 text-xs text-mist">{t.telemetry.activitySub}</p>
                </div>
                <div className="rounded-full border border-amethyst-400/35 bg-amethyst-600/15 px-3.5 py-1 font-mono text-[11px] text-amethyst-300">
                  {chartCoords[activePointIdx]?.month} • {chartCoords[activePointIdx]?.events}{' '}
                  {t.telemetry.eventsLabel}
                </div>
              </div>

              <div className="relative mt-6">
                <svg viewBox="0 0 600 205" className="w-full overflow-visible">
                  <defs>
                    <linearGradient id="areaVioletGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity="0.62" />
                      <stop offset="65%" stopColor="#7C3AED" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#0B0915" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glowStroke">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {[48, 92, 136, 178].map((y) => (
                    <line
                      key={y}
                      x1="20"
                      y1={y}
                      x2="580"
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="3 6"
                    />
                  ))}

                  <path d={smoothAreaPath} fill="url(#areaVioletGrad)" />
                  <path
                    d={smoothLinePath}
                    fill="none"
                    stroke="#D8B4FE"
                    strokeWidth="2.4"
                    filter="url(#glowStroke)"
                  />

                  {chartCoords.map((pt, idx) => {
                    const isFocused = idx === activePointIdx;
                    return (
                      <g
                        key={pt.month}
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="cursor-pointer"
                      >
                        {isFocused && (
                          <>
                            <line
                              x1={pt.x}
                              y1={pt.y}
                              x2={pt.x}
                              y2="178"
                              stroke="rgba(216,180,254,0.45)"
                              strokeDasharray="3 4"
                            />
                            <circle cx={pt.x} cy={pt.y} r="13" fill="rgba(168,85,247,0.3)" />
                            <g
                              transform={`translate(${Math.min(470, Math.max(55, pt.x - 48))}, ${Math.max(6, pt.y - 44)})`}
                            >
                              <rect
                                width="96"
                                height="30"
                                rx="8"
                                fill="rgba(24,18,42,0.94)"
                                stroke="rgba(216,180,254,0.55)"
                                strokeWidth="1"
                              />
                              <text
                                x="48"
                                y="14"
                                textAnchor="middle"
                                fill="#FFFFFF"
                                fontSize="10"
                                fontWeight="600"
                                fontFamily="JetBrains Mono, monospace"
                              >
                                {pt.events} {t.telemetry.eventsLabel}
                              </text>
                              <text
                                x="48"
                                y="24"
                                textAnchor="middle"
                                fill="#C084FC"
                                fontSize="8"
                                fontFamily="JetBrains Mono, monospace"
                              >
                                {idx === peakIndex ? t.telemetry.peakBadge : pt.month}
                              </text>
                            </g>
                          </>
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isFocused ? 5 : 3.5}
                          fill={isFocused ? '#FFFFFF' : '#C084FC'}
                          stroke="#7C3AED"
                          strokeWidth="1.5"
                        />
                        <text
                          x={pt.x}
                          y="196"
                          textAnchor="middle"
                          fill={isFocused ? '#FFFFFF' : '#85829C'}
                          fontSize="10"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {pt.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0915]/80 p-5 sm:p-6 lg:col-span-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-medium text-white">{t.telemetry.ringTitle}</h3>
                <div className="inline-flex rounded-full border border-white/12 bg-black/60 p-0.5">
                  {[
                    { id: 'repos', label: t.telemetry.ringModeRepos },
                    { id: 'orbit', label: t.telemetry.ringModeOrbit },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setRingMode(mode.id)}
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] transition ${
                        ringMode === mode.id ? 'glass-pill-active' : 'text-mist hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-5 flex items-center justify-center">
                <div className="relative h-36 w-36">
                  <svg viewBox="0 0 130 130" className="h-full w-full -rotate-90">
                    <defs>
                      <linearGradient id="ringViolet" x1="0" y1="0" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F5F3FF" />
                        <stop offset="45%" stopColor="#C084FC" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="65"
                      cy="65"
                      r="52"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="65"
                      cy="65"
                      r="52"
                      fill="none"
                      stroke="url(#ringViolet)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringDashOffset}
                      className="transition-all duration-700"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.75))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-white">{primaryPercent}%</span>
                    <span className="max-w-[82px] truncate font-mono text-[10px] text-amethyst-300">
                      {ringList[0]?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {ringList.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-mist">
                      <span className="font-mono text-[10px] text-white/40">{idx + 1}.</span>
                      <span className="text-white/90">{item.name}</span>
                    </span>
                    <span className="font-mono text-xs text-amethyst-300">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mapa Interativo de Competências & Projetos em largura total limpa */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#080610]/90 p-5 sm:p-6">
            <div>
              <h3 className="text-base font-medium text-white">{t.telemetry.constellationTitle}</h3>
              <p className="mt-0.5 text-xs text-mist">{t.telemetry.constellationSub}</p>
            </div>

            <div className="relative mt-4 h-56 w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.16),rgba(5,5,9,0.96)_72%)]">
              <div className="editorial-grain absolute inset-0 opacity-60" />

              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                {CONSTELLATION_EDGES.map(([aId, bId]) => {
                  const a = starById[aId];
                  const b = starById[bId];
                  const highlighted = selectedStar === aId || selectedStar === bId;
                  return (
                    <line
                      key={`${aId}-${bId}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={highlighted ? 'rgba(216,180,254,0.75)' : 'rgba(139,92,246,0.24)'}
                      strokeWidth={highlighted ? 0.55 : 0.3}
                    />
                  );
                })}
              </svg>

              {CONSTELLATION_LAYOUT.map((node) => {
                const active = selectedStar === node.id;
                const info = t.telemetry.constellationNodes[node.id];
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedStar(node.id)}
                    onMouseEnter={() => setSelectedStar(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        active
                          ? 'h-5 w-5 bg-white shadow-[0_0_24px_8px_rgba(168,85,247,0.85)]'
                          : node.primary
                            ? 'h-3.5 w-3.5 bg-amethyst-300 shadow-[0_0_16px_4px_rgba(139,92,246,0.65)] group-hover:scale-125'
                            : 'h-2.5 w-2.5 bg-white/80 shadow-[0_0_12px_2px_rgba(192,132,252,0.5)] group-hover:scale-125'
                      }`}
                    />
                    <span
                      className={`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] transition ${
                        active ? 'text-white' : 'text-mist/85'
                      }`}
                    >
                      {info?.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeStarInfo && (
              <div className="mt-3 flex flex-col gap-1.5 rounded-xl border border-amethyst-400/25 bg-black/55 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-amethyst-300" />
                  <span className="text-xs font-semibold text-white">{activeStarInfo.title}</span>
                  <span className="rounded-full border border-amethyst-400/30 bg-amethyst-600/15 px-2.5 py-0.5 font-mono text-[10px] text-amethyst-300">
                    {activeStarInfo.tag}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-mist sm:text-right">
                  {activeStarInfo.desc}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
