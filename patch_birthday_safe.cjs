const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "defaultValue={displayUser.birthday ? new Date(displayUser.birthday).toISOString().split('T')[0] : ''}",
  "defaultValue={(() => { try { return displayUser.birthday ? new Date(displayUser.birthday).toISOString().split('T')[0] : ''; } catch (e) { return ''; } })()}"
);

fs.writeFileSync(path, content);
console.log("patched!");
