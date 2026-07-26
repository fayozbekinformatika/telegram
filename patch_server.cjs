const fs = require('fs');
const path = 'server.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "  try {\n    const ai = getAIClient();",
  `  try {
    if (!process.env.GEMINI_API_KEY) {
      const styles = {
        grammar: text + ' (Grammar checked)',
        formal: text + ' (Formalized)',
        short: text + ' (Shortened)',
        zen: text + ' (Zen mode)'
      };
      return res.json({ rewrittenText: styles[style] || text });
    }
    const ai = getAIClient();`
);

fs.writeFileSync(path, content);
