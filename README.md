# Portfólio — João Pedro Andrade (`@joaopedroandrad3`)

Portfólio interativo com estética futurista astronômica em **preto, branco e roxo**, desenvolvido em **React (Vite + Tailwind CSS + Framer Motion)** + **Node.js / Express**, com integração em tempo real à API do GitHub (perfil, `README.md` do perfil, repositórios e `README.md` individual de cada repositório) e tradução completa **PT-BR ↔ EN**.

## Estrutura do Projeto

```text
portfolio-joao-pedro/
├── package.json        # Scripts unificados (dev, build, start)
├── server/             # Backend Node.js + Express (porta 3001)
│   └── src/
│       ├── index.js                # Servidor Express + CORS + static build
│       ├── config/github.js        # Configurações de usuário/token/cache
│       ├── services/githubService.js # Integração GitHub API + cache + fallback
│       ├── routes/githubRoutes.js  # Rotas /api/github/*
│       └── routes/contactRoutes.js # Rota POST /api/contact
└── client/             # Frontend React + Vite (porta 5173)
    └── src/
        ├── config/profile.js       # Dados pessoais + slot `photoUrl` para foto futura
        ├── i18n/                   # Sistema bilíngue PT-BR / EN
        ├── hooks/useGitHubData.js  # Hook React para consumir a API Express
        └── components/             # Canvas estelar, Relíquia 3D, Projetos, Telemetria...
```

## Como Rodar Localmente

1. Instale as dependências (na pasta raiz):
   ```bash
   npm run install:all
   ```
2. Inicie o backend Express e o frontend React juntos:
   ```bash
   npm run dev
   ```
3. Acesse `http://localhost:5173` (a API roda em `http://localhost:3001`).

## Como Adicionar Sua Foto no Futuro

Quando quiser trocar a relíquia orbital 3D interativa por um retrato seu:
1. Salve sua foto em `client/public/foto-joao.jpg`.
2. Abra `client/src/config/profile.js` e altere:
   ```js
   photoUrl: '/foto-joao.jpg',
   ```

## Endpoints da API Express

- `GET /api/health` — status operacional da API.
- `GET /api/github/overview` — perfil, README do perfil, repositórios enriquecidos e telemetria (com cache configurável e `?refresh=true`).
- `GET /api/github/repos` — repositórios filtráveis (`?category=...&q=...`).
- `GET /api/github/readme` — README do perfil `@joaopedroandrad3`.
- `GET /api/github/repos/:repo/readme` — README individual de qualquer repositório.
- `POST /api/contact` — recebe mensagens do formulário e grava em `server/data/messages.json`.
