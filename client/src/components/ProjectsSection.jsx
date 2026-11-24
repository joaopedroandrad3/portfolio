import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  GitBranch,
  Search,
  Star,
  X,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import CosmicPlate from './CosmicPlate';
import MarkdownRenderer from './MarkdownRenderer';

function formatShortDate(iso, lang) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

/**
 * Card Vertical Editorial com inclinação 3D suave e brilho especular no cursor (Ref 1 + Ref 5)
 */
function TiltRepoCard({ repo, index, lang, t, onInspect }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 9,
      ry: (px - 0.5) * 9,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.28) }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onInspect(repo)}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 0.22s ease-out',
      }}
      className="group relative flex min-h-[390px] cursor-pointer flex-col justify-between overflow-hidden rounded-sm border border-white/12 bg-[#07060D] shadow-glass transition-colors duration-300 hover:border-amethyst-400/65"
    >
      {/* Placa Astronômica de Fundo */}
      <CosmicPlate
        theme={repo.visualTheme}
        className="absolute inset-0 h-full w-full"
      />

      {/* Brilho Especular Violeta seguindo o ponteiro */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(240px circle at ${tilt.gx}% ${tilt.gy}%, rgba(192,132,252,0.22), transparent 70%)`,
        }}
      />

      {/* Topo do Card */}
      <div className="relative z-10 flex items-center justify-between p-5">
        <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-amethyst-300 uppercase backdrop-blur-md">
          {repo.language}
        </span>
        <span className="font-mono text-xs text-white/45">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Base do Card (estilo vertical editorial da Ref 1) */}
      <div className="relative z-10 mt-auto p-5">
        <p className="font-mono text-[10px] tracking-[0.2em] text-amethyst-300/90 uppercase">
          {repo.name}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-amethyst-300">
          {repo.displayTitle?.[lang] || repo.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-mist">
          {repo.summary?.[lang] || repo.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-white/12 pt-3 font-mono text-[10px] text-white/60">
          <span>
            {t.projects.updatedPrefix} {formatShortDate(repo.pushedAt, lang)}
          </span>
          <span className="inline-flex items-center gap-1 text-amethyst-300 transition-transform group-hover:translate-x-0.5">
            README
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection({ repos = [], loading = false, fetchRepoReadme }) {
  const { lang, t } = useLanguage();
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  // Modal de inspeção de README ao vivo
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [readmeContent, setReadmeContent] = useState('');
  const [readmeLoading, setReadmeLoading] = useState(false);

  useEffect(() => {
    if (!selectedRepo) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedRepo(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedRepo]);

  const featuredRepos = useMemo(() => {
    const list = repos.filter((r) => r.featured);
    return list.length > 0 ? list : repos.slice(0, 4);
  }, [repos]);

  const activeFeatured = featuredRepos[featuredIdx % Math.max(1, featuredRepos.length)];

  const filteredRepos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.displayTitle?.[lang] || '').toLowerCase().includes(q) ||
        (r.summary?.[lang] || '').toLowerCase().includes(q) ||
        (r.language || '').toLowerCase().includes(q)
      );
    });
  }, [repos, category, query, lang]);

  const openModal = async (repo) => {
    setSelectedRepo(repo);
    setReadmeContent('');
    setReadmeLoading(true);
    try {
      const res = await fetchRepoReadme(repo.name);
      setReadmeContent(res.content);
    } catch {
      setReadmeContent(`# ${repo.name}\n\n${repo.summary?.[lang] || ''}`);
    } finally {
      setReadmeLoading(false);
    }
  };

  const nextFeatured = () =>
    setFeaturedIdx((i) => (i + 1) % Math.max(1, featuredRepos.length));
  const prevFeatured = () =>
    setFeaturedIdx((i) => (i - 1 + featuredRepos.length) % Math.max(1, featuredRepos.length));

  return (
    <section id="projects" className="relative z-10 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Cabeçalho da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <span className="inline-block border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.26em] text-amethyst-300 uppercase">
            {t.projects.sector}
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light text-white sm:text-5xl">
            {t.projects.titleStart}{' '}
            <span className="italic text-amethyst-300">{t.projects.titleItalic}</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
            {t.projects.subtitle}
          </p>
        </motion.div>

        {/* Destaque Editorial Assímetrico com Carrossel (diretamente inspirado na Ref 2!) */}
        {activeFeatured && (
          <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="offset-frame mx-auto max-w-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeatured.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => openModal(activeFeatured)}
                    className="group relative aspect-[4/5] cursor-pointer overflow-hidden border border-white/15 shadow-glass"
                  >
                    <CosmicPlate
                      theme={activeFeatured.visualTheme}
                      className="h-full w-full"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="font-mono text-[10px] tracking-[0.22em] text-amethyst-300 uppercase">
                        {activeFeatured.fullName}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Paginação circular (Ref 2) */}
              <div className="mt-7 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={prevFeatured}
                  aria-label="Previous featured project"
                  className="glass-pill-idle flex h-10 w-10 items-center justify-center rounded-full text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  {featuredRepos.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFeaturedIdx(idx)}
                      aria-label={`Select ${item.name}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === featuredIdx % featuredRepos.length
                          ? 'w-7 bg-amethyst-400 shadow-[0_0_12px_#A855F7]'
                          : 'w-2 bg-white/25 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextFeatured}
                  aria-label="Next featured project"
                  className="glass-pill-idle flex h-10 w-10 items-center justify-center rounded-full text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Narrativa Editorial do Destaque */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeatured.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="inline-block border border-white/20 px-3 py-1 font-mono text-[10px] tracking-[0.24em] text-white/80 uppercase">
                    {t.projects.featuredBadge}
                  </span>

                  <h3 className="mt-5 font-serif text-3xl font-light leading-tight text-white sm:text-5xl">
                    {activeFeatured.displayTitle?.[lang] || activeFeatured.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-4">
                    <span className="font-mono text-xs text-amethyst-300">
                      {activeFeatured.name}
                    </span>
                    <span className="h-[1px] flex-1 max-w-[120px] bg-white/20" />
                    <span className="font-mono text-xs text-mist">
                      {activeFeatured.language}
                    </span>
                  </div>

                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
                    {activeFeatured.summary?.[lang]}
                  </p>

                  {/* Tags de destaque */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(activeFeatured.highlights || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-amethyst-400/25 bg-amethyst-600/10 px-3 py-1 font-mono text-[11px] text-amethyst-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => openModal(activeFeatured)}
                      className="glass-pill-active inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-xs font-medium tracking-wider uppercase"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {t.projects.inspectReadme}
                    </button>
                    <a
                      href={activeFeatured.url}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-pill-idle inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-medium tracking-wider text-white/90 uppercase"
                    >
                      {t.projects.openGithub}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Barra Flutuante de Filtros e Busca em Vidro Fumê (Ref 2 + Ref 5) */}
        <div className="glass-panel mt-20 flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'algorithms', 'systems', 'web-infra'].map((key) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    active ? 'glass-pill-active' : 'glass-pill-idle text-mist hover:text-white'
                  }`}
                >
                  {t.projects.filters[key]}
                </button>
              );
            })}
          </div>

          <div className="flex flex-1 items-center gap-3 lg:max-w-lg">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.projects.searchPlaceholder}
                className="w-full rounded-full border border-white/12 bg-black/55 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-mist/60 focus:border-amethyst-400/65 focus:outline-none focus:ring-1 focus:ring-amethyst-400/40"
              />
            </div>
            <span className="hidden whitespace-nowrap font-mono text-[11px] text-mist sm:inline">
              {filteredRepos.length} {t.projects.countLabel}
            </span>
          </div>
        </div>

        {/* Grade de 4 Cards Verticais Editoriais (diretamente inspirada na Ref 1!) */}
        {loading && repos.length === 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-panel min-h-[390px] animate-pulse rounded-sm border border-white/10"
              />
            ))}
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="glass-panel mt-8 rounded-2xl p-12 text-center text-sm text-mist">
            {t.projects.emptyState}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredRepos.map((repo, idx) => (
              <TiltRepoCard
                key={repo.id}
                repo={repo}
                index={idx}
                lang={lang}
                t={t}
                onInspect={openModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Inspeção do README do Repositório ao Vivo */}
      <AnimatePresence>
        {selectedRepo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRepo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedRepo.name}
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border-amethyst-400/35"
            >
              <div className="flex items-start justify-between border-b border-white/10 p-6">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-amethyst-300 uppercase">
                    {t.projects.modal.liveReadmeTitle}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-medium text-white">
                    {selectedRepo.displayTitle?.[lang] || selectedRepo.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-mist">
                    <span className="inline-flex items-center gap-1">
                      <GitBranch className="h-3 w-3 text-amethyst-400" />
                      {t.projects.modal.branch}: {selectedRepo.defaultBranch}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 text-amethyst-400" />
                      {selectedRepo.stars}
                    </span>
                    <span>
                      {t.projects.modal.size}: {selectedRepo.sizeKb} KB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRepo(null)}
                  aria-label={t.projects.modal.close}
                  className="glass-pill-idle flex h-9 w-9 items-center justify-center rounded-full text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-6">
                {readmeLoading ? (
                  <div className="flex items-center gap-3 py-10 font-mono text-xs text-amethyst-300">
                    <span className="h-2 w-2 animate-ping rounded-full bg-amethyst-400" />
                    {t.projects.modal.loading}
                  </div>
                ) : (
                  <MarkdownRenderer content={readmeContent} />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-black/40 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedRepo(null)}
                  className="glass-pill-idle rounded-full px-5 py-2 text-xs text-mist hover:text-white"
                >
                  {t.projects.modal.close}
                </button>
                <a
                  href={selectedRepo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-pill-active inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium"
                >
                  {t.projects.modal.viewOnGithub}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
