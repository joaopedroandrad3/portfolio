import app from './app.js';
import { githubConfig } from './config/github.js';

const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, () => {
  console.log(`\n✦ Portfolio API online em http://localhost:${PORT}`);
  console.log(`✦ GitHub sync configurado para @${githubConfig.username}\n`);
});
