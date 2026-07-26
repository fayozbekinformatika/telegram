const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<div className="w-20 h-20 rounded-full border-4 border-green-500 p-1 mb-2">',
  '<div className={`w-20 h-20 rounded-full border-4 ${activeColor.replace(\'bg-\', \'border-\')} p-1 mb-2`}>'
);

content = content.replace(
  '<h3 className="font-medium">{displayUser.name}</h3>',
  '<h3 className={`font-medium ${activeColor.replace(\'bg-\', \'text-\')}`}>{displayUser.name}</h3>'
);

fs.writeFileSync(path, content);
