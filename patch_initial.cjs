const fs = require('fs');
const path = 'src/data/initialData.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/isOutgoing: true, isRead: true/g, 'isOutgoing: true, isRead: false');

fs.writeFileSync(path, content);
