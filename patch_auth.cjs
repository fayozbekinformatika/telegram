const fs = require('fs');

let authCode = fs.readFileSync('src/context/AuthContext.tsx', 'utf-8');
authCode = authCode.replace(
  "phoneNumber: '+998 90 ' + Math.floor(1000000 + Math.random() * 9000000),",
  ""
);
fs.writeFileSync('src/context/AuthContext.tsx', authCode);
console.log('patched AuthContext');

let initCode = fs.readFileSync('src/data/initialData.ts', 'utf-8');
initCode = initCode.replace(
  "phoneNumber: '+998 90 123 45 67',",
  ""
);
fs.writeFileSync('src/data/initialData.ts', initCode);
console.log('patched initialData');

