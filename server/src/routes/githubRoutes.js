import { Router } from 'express';
import { getGitHubOverview, getRepoReadme } from '../services/githubService.js';

const router = Router();

// GET /api/github/overview -> perfil + README do perfil + repositórios + telemetria
router.get('/overview', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const data = await getGitHubOverview({ forceRefresh });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load GitHub overview',
      details: error.message,
    });
  }
});

// GET /api/github/repos -> lista filtrável de repositórios
router.get('/repos', async (req, res) => {
  try {
    const { category, q } = req.query;
    const overview = await getGitHubOverview();
    let repos = overview.repos;

    if (category && category !== 'all') {
      repos = repos.filter((r) => r.category === category);
    }

    if (q) {
      const term = String(q).toLowerCase();
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.displayTitle.pt.toLowerCase().includes(term) ||
          r.displayTitle.en.toLowerCase().includes(term) ||
          r.summary.pt.toLowerCase().includes(term) ||
          r.summary.en.toLowerCase().includes(term) ||
          r.language.toLowerCase().includes(term)
      );
    }

    res.json({
      count: repos.length,
      repos,
      meta: overview.meta,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repositories', details: error.message });
  }
});

// GET /api/github/readme -> README do perfil @joaopedroandrad3
router.get('/readme', async (_req, res) => {
  try {
    const overview = await getGitHubOverview();
    res.json({
      username: overview.profile.username,
      readme: overview.readme,
      meta: overview.meta,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile README', details: error.message });
  }
});

// GET /api/github/repos/:repo/readme -> README de um repositório específico sob demanda
router.get('/repos/:repo/readme', async (req, res) => {
  try {
    const result = await getRepoReadme(req.params.repo);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch repository README', details: error.message });
  }
});

// POST /api/github/refresh -> força atualização imediata do cache
router.post('/refresh', async (_req, res) => {
  try {
    const data = await getGitHubOverview({ forceRefresh: true });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh GitHub cache', details: error.message });
  }
});

export default router;
