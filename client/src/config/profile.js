/**
 * ============================================================================
 * CONFIGURAÇÃO CENTRAL DO PERFIL — JOÃO PEDRO ANDRADE
 * ============================================================================
 * Altere qualquer informação aqui no futuro sem precisar mexer nos componentes!
 *
 * QUANDO QUISER ADICIONAR SUA FOTO NO FUTURO:
 * 1. Salve sua imagem em: client/public/foto-joao.jpg (ou .png / .webp)
 * 2. Troque `photoUrl: null` abaixo para: `photoUrl: '/foto-joao.jpg'`
 * A seção "Sobre" trocará automaticamente a escultura 3D pelo seu retrato!
 */

export const PROFILE_CONFIG = {
  firstName: 'João Pedro',
  lastName: 'Andrade',
  fullName: 'João Pedro Andrade',
  githubUsername: 'joaopedroandrad3',
  university: 'PUC Goiás',
  location: {
    pt: 'Goiânia, GO — Brasil',
    en: 'Goiânia, GO — Brazil',
  },

  // Deixe `null` para exibir a escultura orbital 3D interativa.
  // Para usar sua foto no futuro, coloque o caminho (ex: '/foto-joao.jpg').
  photoUrl: null,

  // Canais profissionais focados em recrutamento, LinkedIn e GitHub
  socials: {
    github: 'https://github.com/joaopedroandrad3',
    linkedin: 'https://www.linkedin.com/in/joão-pedro-andrade-santana-silva-198097347',
    email: 'joaopedroandrad3@gmail.com',
  },
};
