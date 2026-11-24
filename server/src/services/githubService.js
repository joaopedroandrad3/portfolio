import { githubConfig } from '../config/github.js';
import {
  FALLBACK_PROFILE,
  FALLBACK_PROFILE_README,
  FALLBACK_REPOS,
  FALLBACK_REPO_READMES,
} from '../data/fallbackSnapshot.js';

// Metadados bilíngues para enriquecer os repositórios conhecidos do GitHub
// (repositórios novos criados no futuro também aparecem automaticamente!)
const REPO_ENRICHMENT = {
  portfolio: {
    displayTitle: {
      pt: 'Portfólio Orbital — FullStack & IA',
      en: 'Orbital Portfolio — FullStack & AI',
    },
    summary: {
      pt: 'Portfólio futurista astronômico em React + Node.js/Express com API própria sincronizada em tempo real com o GitHub e tradução PT/EN.',
      en: 'Futuristic astronomical portfolio built with React + Node.js/Express featuring a live GitHub API backend and full PT/EN i18n.',
    },
    category: 'web-infra',
    featured: true,
    visualTheme: 'eclipse',
    highlights: ['React', 'Node/Express', 'GitHub API', 'PT/EN'],
  },
  AED_TP: {
    displayTitle: {
      pt: 'Lab de Algoritmos & Estruturas de Dados',
      en: 'Algorithms & Data Structures Lab',
    },
    summary: {
      pt: 'Estudo aprofundado de ponteiros, manipulação direta de memória, modularização e otimização algorítmica em C.',
      en: 'In-depth study of pointers, direct memory manipulation, modularization, and algorithmic optimization in C.',
    },
    category: 'algorithms',
    featured: true,
    visualTheme: 'astrolabe',
    highlights: ['Pointers', 'Memory', 'Algorithms', 'C'],
  },
  'tecnicas-de-programa--o': {
    displayTitle: {
      pt: 'Sistema de Cadastro & Persistência em Arquivo',
      en: 'Student Registry & File Persistence System',
    },
    summary: {
      pt: 'Sistema CLI em C para cadastro e listagem de estudantes com persistência em arquivos (.txt) e validação de ponteiros nulos.',
      en: 'Pure C CLI system for student registration & listing with persistent .txt file I/O and null-pointer integrity checks.',
    },
    category: 'systems',
    featured: true,
    visualTheme: 'prism',
    highlights: ['File I/O', 'CLI Menu', 'Data Integrity', 'C'],
  },
  'Estudos-Beecrowd': {
    displayTitle: {
      pt: 'Maratona Beecrowd & Programação Competitiva',
      en: 'Beecrowd & Competitive Programming',
    },
    summary: {
      pt: 'Resolução contínua de desafios lógicos e matemáticos do Beecrowd para preparação da Maratona SBC/ICPC.',
      en: 'Continuous algorithmic and mathematical problem-solving archive for SBC/ICPC competitive programming prep.',
    },
    category: 'algorithms',
    featured: true,
    visualTheme: 'constellation',
    highlights: ['SBC / ICPC', 'Beecrowd', 'Logic', 'C / C++'],
  },
  'Prova-de-TP': {
    displayTitle: {
      pt: 'Desafios Técnicos sob Tempo Limite',
      en: 'Timed Technical Programming Challenges',
    },
    summary: {
      pt: 'Soluções estruturadas sob avaliação prática, demonstrando interpretação ágil de requisitos e precisão em C.',
      en: 'Structured algorithmic solutions built under practical assessment constraints with speed and clarity in C.',
    },
    category: 'systems',
    featured: true,
    visualTheme: 'eclipse',
    highlights: ['Problem Solving', 'Clean Logic', 'C'],
  },
  TermosTI: {
    displayTitle: {
      pt: 'TermosTI — Glossário & Base de Infraestrutura',
      en: 'TermosTI — IT Infrastructure & Tech Glossary',
    },
    summary: {
      pt: 'Repositório conectado à rotina de Infraestrutura de TI, organização técnica de conceitos e termos essenciais da área.',
      en: 'Project bridging daily IT Infrastructure practice with clear technical terminology and reference tooling.',
    },
    category: 'web-infra',
    featured: true,
    visualTheme: 'lattice',
    highlights: ['IT Infra', 'Documentation', 'Tech Terms'],
  },
  joaopedroandrad3: {
    displayTitle: {
      pt: 'Perfil GitHub & Apresentação Viva',
      en: 'GitHub Profile & Live README',
    },
    summary: {
      pt: 'Repositório especial do perfil que alimenta dinamicamente a seção Sobre deste portfólio via API Node/Express.',
      en: 'Special GitHub profile repository dynamically powering this portfolio About section through the Node/Express API.',
    },
    category: 'web-infra',
    featured: false,
    visualTheme: 'eclipse',
    highlights: ['Markdown', 'Profile', 'Live API Sync'],
  },
  'tecnica-de-programacao': {
    displayTitle: {
      pt: 'Fundamentos de Técnicas de Programação',
      en: 'Programming Techniques Foundations',
    },
    summary: {
      pt: 'Repositório inicial da disciplina de Técnicas de Programação com práticas de lógica estruturada na PUC Goiás.',
      en: 'Foundational Programming Techniques coursework repository exploring structured programming logic at PUC Goiás.',
    },
    category: 'systems',
    featured: false,
    visualTheme: 'constellation',
    highlights: ['Logic', 'PUC Goiás', 'Foundations'],
  },
};

const cache = {
  overview: { data: null, expiresAt: 0 },
  repoReadmes: new Map(),
};

function buildHeaders(extra = {}) {
  const headers = {
    'User-Agent': githubConfig.userAgent,
    Accept: 'application/vnd.github+json',
    ...extra,
  };
  if (githubConfig.token) {
    headers.Authorization = `Bearer ${githubConfig.token}`;
  }
  return headers;
}

async function fetchGitHub(endpoint, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(`${githubConfig.apiBaseUrl}${endpoint}`, {
      headers: buildHeaders(options.headers),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new Error(`GitHub API HTTP ${response.status} on ${endpoint}`);
      error.status = response.status;
      throw error;
    }

    if (options.raw) {
      return await response.text();
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function inferCategory(repo) {
  const lang = (repo.language || '').toLowerCase();
  const name = repo.name.toLowerCase();
  if (['javascript', 'typescript', 'html', 'css', 'vue', 'svelte'].includes(lang)) {
    return 'web-infra';
  }
  if (['python', 'jupyter notebook'].includes(lang) || name.includes('ia') || name.includes('ai')) {
    return 'ai';
  }
  if (['c', 'c++'].includes(lang) || name.includes('aed') || name.includes('beecrowd')) {
    return 'algorithms';
  }
  return 'systems';
}

function enrichRepo(repo, index) {
  const custom = REPO_ENRICHMENT[repo.name];
  const fallbackThemes = ['astrolabe', 'prism', 'constellation', 'eclipse', 'lattice'];

  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    homepage: repo.homepage || null,
    description: repo.description || null,
    displayTitle: custom?.displayTitle || {
      pt: repo.name.replace(/[-_]+/g, ' '),
      en: repo.name.replace(/[-_]+/g, ' '),
    },
    summary: custom?.summary || {
      pt:
        repo.description ||
        `Repositório público desenvolvido em ${repo.language || 'código aberto'} e sincronizado ao vivo do GitHub.`,
      en:
        repo.description ||
        `Public repository built with ${repo.language || 'open technologies'} and synced live from GitHub.`,
    },
    language: repo.language || (repo.name === githubConfig.username ? 'Markdown' : 'Multi-tech'),
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    watchers: repo.watchers_count || 0,
    sizeKb: repo.size || 0,
    isFork: Boolean(repo.fork),
    isProfileRepo: repo.name.toLowerCase() === githubConfig.username.toLowerCase(),
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    highlights: custom?.highlights || [repo.language || 'Code', 'GitHub'],
    category: custom?.category || inferCategory(repo),
    featured: custom?.featured ?? (!repo.fork && index < 4),
    visualTheme: custom?.visualTheme || fallbackThemes[index % fallbackThemes.length],
    defaultBranch: repo.default_branch || 'main',
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
  };
}

function parseProfileReadme(markdown) {
  const cleanLines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  // Extrai badges do shields.io se existirem
  const badgeMatches = [...markdown.matchAll(/alt="([^"]+)"/g)].map((m) => m[1]);

  // Extrai links de redes sociais
  const links = {
    instagram: markdown.match(/https?:\/\/(www\.)?instagram\.com\/[^\s"')]+/i)?.[0] || null,
    linkedin: markdown.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[^\s"')]+/i)?.[0] || null,
    discord: markdown.match(/https?:\/\/discord\.com\/users\/[^\s"')]+/i)?.[0] || null,
    email: markdown.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || null,
  };

  return {
    raw: markdown,
    lineCount: cleanLines.length,
    detectedBadges: badgeMatches,
    links,
  };
}

function computeTelemetry(profile, repos) {
  const ownRepos = repos.filter((r) => !r.isFork);
  const totalStars = ownRepos.reduce((acc, r) => acc + r.stars, 0);
  const totalForks = ownRepos.reduce((acc, r) => acc + r.forks, 0);
  const totalSizeKb = ownRepos.reduce((acc, r) => acc + r.sizeKb, 0);

  // Distribuição de linguagens baseada nos repositórios próprios
  const langMap = new Map();
  for (const repo of ownRepos) {
    const key = repo.language && repo.language !== 'Multi-tech' ? repo.language : 'Documentation';
    const weight = Math.max(repo.sizeKb, 8);
    langMap.set(key, (langMap.get(key) || 0) + weight);
  }
  const totalWeight = [...langMap.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...langMap.entries()]
    .map(([name, weight]) => ({
      name,
      percentage: Math.round((weight / totalWeight) * 100),
      repoCount: ownRepos.filter(
        (r) => (r.language && r.language !== 'Multi-tech' ? r.language : 'Documentation') === name
      ).length,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Linha do tempo mensal de atividade (criação + pushes)
  const monthBuckets = new Map();
  for (const repo of ownRepos) {
    const dates = [repo.createdAt, repo.pushedAt].filter(Boolean);
    for (const iso of dates) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      monthBuckets.set(key, (monthBuckets.get(key) || 0) + 1);
    }
  }

  const timeline = [...monthBuckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, events]) => ({
      month,
      events,
    }));

  return {
    publicRepos: profile.public_repos ?? ownRepos.length,
    ownReposCount: ownRepos.length,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
    totalStars,
    totalForks,
    totalSizeKb,
    memberSince: profile.created_at,
    lastActivity: ownRepos[0]?.pushedAt || profile.updated_at,
    languages,
    timeline,
  };
}

export async function getGitHubOverview({ forceRefresh = false } = {}) {
  const now = Date.now();
  if (!forceRefresh && cache.overview.data && cache.overview.expiresAt > now) {
    return {
      ...cache.overview.data,
      meta: {
        ...cache.overview.data.meta,
        cached: true,
      },
    };
  }

  const username = githubConfig.username;
  let source = 'live';
  let profileData = null;
  let reposData = null;
  let readmeRaw = null;

  try {
    const [profileRes, reposRes, readmeRes] = await Promise.allSettled([
      fetchGitHub(`/users/${username}`),
      fetchGitHub(`/users/${username}/repos?per_page=100&sort=pushed`),
      fetchGitHub(`/repos/${username}/${username}/readme`, {
        raw: true,
        headers: { Accept: 'application/vnd.github.raw' },
      }),
    ]);

    if (profileRes.status === 'fulfilled' && reposRes.status === 'fulfilled') {
      profileData = profileRes.value;
      reposData = reposRes.value;
      readmeRaw =
        readmeRes.status === 'fulfilled' ? readmeRes.value : FALLBACK_PROFILE_README;
    } else {
      throw new Error('Primary GitHub endpoints unavailable');
    }
  } catch (err) {
    console.warn(`[GitHubService] Fallback ativado (${err.message})`);
    source = 'snapshot';
    profileData = FALLBACK_PROFILE;
    reposData = FALLBACK_REPOS;
    readmeRaw = FALLBACK_PROFILE_README;
  }

  const normalizedRepos = reposData
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .map((repo, idx) => enrichRepo(repo, idx));

  const payload = {
    profile: {
      username: profileData.login,
      name: profileData.name || 'João Pedro Andrade',
      avatarUrl: profileData.avatar_url,
      githubUrl: profileData.html_url,
      bio: profileData.bio,
      location: profileData.location || 'Goiânia, GO — Brasil',
      publicRepos: profileData.public_repos,
      followers: profileData.followers,
      following: profileData.following,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at,
    },
    readme: parseProfileReadme(readmeRaw),
    repos: normalizedRepos,
    telemetry: computeTelemetry(profileData, normalizedRepos),
    meta: {
      source,
      cached: false,
      syncedAt: new Date().toISOString(),
      cacheTtlMinutes: Math.round(githubConfig.cacheTtlMs / 60000),
    },
  };

  cache.overview = {
    data: payload,
    expiresAt: now + githubConfig.cacheTtlMs,
  };

  return payload;
}

export async function getRepoReadme(repoName) {
  const safeName = String(repoName || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if (!safeName) {
    throw new Error('Invalid repository name');
  }

  const now = Date.now();
  const cachedEntry = cache.repoReadmes.get(safeName);
  if (cachedEntry && cachedEntry.expiresAt > now) {
    return { repo: safeName, content: cachedEntry.content, cached: true, source: cachedEntry.source };
  }

  try {
    const content = await fetchGitHub(`/repos/${githubConfig.username}/${safeName}/readme`, {
      raw: true,
      headers: { Accept: 'application/vnd.github.raw' },
    });
    cache.repoReadmes.set(safeName, {
      content,
      source: 'live',
      expiresAt: now + githubConfig.cacheTtlMs,
    });
    return { repo: safeName, content, cached: false, source: 'live' };
  } catch {
    const fallback =
      FALLBACK_REPO_READMES[safeName] ||
      `# ${safeName}\n\nEste repositório ainda não possui um README detalhado no GitHub. Acesse o código diretamente em https://github.com/${githubConfig.username}/${safeName}.`;
    return { repo: safeName, content: fallback, cached: false, source: 'snapshot' };
  }
}
