import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import githubRoutes from './routes/githubRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { githubConfig } from './config/github.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Health check da API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'operational',
    service: 'joao-pedro-portfolio-api',
    githubUser: githubConfig.username,
    timestamp: new Date().toISOString(),
  });
});

// Rotas principais
app.use('/api/github', githubRoutes);
app.use('/api/contact', contactRoutes);

// Em produção, serve automaticamente o build do React (client/dist)
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n✦ Portfolio API online em http://localhost:${PORT}`);
  console.log(`✦ GitHub sync configurado para @${githubConfig.username}\n`);
});
