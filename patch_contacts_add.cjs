const fs = require('fs');
const path = 'src/components/Modals/ContactsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace "Done" button in Add Contact view to actually create the contact
const targetButton = '<button onClick={() => setIsAdding(false)} className="text-sky-500 font-medium hover:text-sky-600">Done</button>';

content = content.replace(targetButton, 
  `<button onClick={() => {
              if (firstName.trim() || phone.trim()) {
                const name = (firstName + ' ' + lastName).trim() || phone;
                // Add to contacts by creating a private chat (in our mock structure)
                // Assuming we can access createNewChat from context
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('app:addContact', { detail: { name, phone } });
                  window.dispatchEvent(event);
                }
              }
              setIsAdding(false);
              setFirstName('');
              setLastName('');
              setPhone('');
            }} className="text-sky-500 font-medium hover:text-sky-600">Done</button>`
);

fs.writeFileSync(path, content);
