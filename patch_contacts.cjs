const fs = require('fs');
let contactsCode = fs.readFileSync('src/components/Modals/ContactsModal.tsx', 'utf-8');

contactsCode = contactsCode.replace(
  "const [phone, setPhone] = useState('');",
  "const [email, setEmail] = useState('');"
);
contactsCode = contactsCode.replace(
  /<input type="text" placeholder="Phone Number" value=\{phone\} onChange=\{\(e\) => setPhone\(e\.target\.value\)\} className=\{\`w-full bg-transparent border-b \$\{borderCol\} focus:border-sky-500 focus:outline-none pb-1 text-\[15px\]\`\} \/>/,
  `<input type="text" placeholder="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} className={\`w-full bg-transparent border-b \${borderCol} focus:border-sky-500 focus:outline-none pb-1 text-[15px]\`} />`
);
contactsCode = contactsCode.replace(
  "if (firstName.trim() || phone.trim()) {",
  "if (firstName.trim() || email.trim()) {"
);
contactsCode = contactsCode.replace(
  "const name = (firstName + ' ' + lastName).trim() || phone;",
  "const name = (firstName + ' ' + lastName).trim() || email;"
);
contactsCode = contactsCode.replace(
  "createNewChat(name, 'private', phone, 'Added from contacts');",
  "createNewChat(name, 'private', email, 'Added from contacts');"
);
contactsCode = contactsCode.replace(
  "setPhone('');",
  "setEmail('');"
);
fs.writeFileSync('src/components/Modals/ContactsModal.tsx', contactsCode);
console.log('patched ContactsModal');

