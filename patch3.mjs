import fs from 'fs';
let code = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf8');

code = code.replace(
  "(displayUser.status || 'online')",
  "(displayUser.status || 'last seen recently')"
);

code = code.replace(
  "status: member.status || 'online',",
  "status: member.status || 'last seen recently',"
);

code = code.replace(
  "user_sayida: { name: 'Sayida 🐚', username: 'sayida_s', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'online' },",
  "user_sayida: { name: 'Sayida 🐚', username: 'sayida_s', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'last seen recently' },"
);

code = code.replace(
  "user_deedo: { name: 'deedo', username: 'deedo_admin', avatar: 'https://ui-avatars.com/api/?name=D&background=ec4899&color=fff&font-size=0.4', status: 'online', role: 'owner' },",
  "user_deedo: { name: 'deedo', username: 'deedo_admin', avatar: 'https://ui-avatars.com/api/?name=D&background=ec4899&color=fff&font-size=0.4', status: 'last seen recently', role: 'owner' },"
);

fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', code);
