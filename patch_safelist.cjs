const fs = require('fs');
let code = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf-8');

if (!code.includes('_safelist')) {
  code = code.replace(
    "export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {",
    `// Tailwind safelist for dynamic colors
const _safelist = 'border-red-500 border-orange-500 border-yellow-500 border-green-500 border-cyan-500 border-blue-500 border-indigo-500 border-purple-500 border-pink-500 border-rose-500 text-red-500 text-orange-500 text-yellow-500 text-green-500 text-cyan-500 text-blue-500 text-indigo-500 text-purple-500 text-pink-500 text-rose-500';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {`
  );
  fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', code);
  console.log('Safelist added to UserProfileModal');
}
