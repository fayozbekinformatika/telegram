const fs = require('fs');
let code = fs.readFileSync('src/context/TelegramContext.tsx', 'utf8');

const target = `      }, (error) => handleFirestoreError(error, OperationType.GET, "telegram_clone/chats"));

      setTimeout(() => {
        if (!messagesLoaded) isInitiated.current = true;
      }, 2000);

      return () => { unsubMessages(); unsubChats(); unsubUsers(); };
    } else {
      isInitiated.current = true;
      return () => {};
    }
  }, [user]);`;

const replacement = `      }, (error) => handleFirestoreError(error, OperationType.GET, "telegram_clone/chats"));

      unsubSavedMessages = onSnapshot(doc(db, 'telegram_clone', 'saved_messages_' + user.id), (docSnap) => {
        if (docSnap.exists()) {
           const savedMsgs = docSnap.data().messages as Message[] || [];
           const str = JSON.stringify(savedMsgs);
           if (lastSavedMessagesStr.current !== str) {
             lastSavedMessagesStr.current = str;
             setMessages(prev => {
                const result = { ...prev };
                result['chat_saved'] = savedMsgs;
                return result;
             });
           }
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, "telegram_clone/saved_messages"));

      setTimeout(() => {
        if (!messagesLoaded) isInitiated.current = true;
      }, 2000);

      return () => { unsubMessages(); unsubChats(); unsubUsers(); unsubSavedMessages(); };
    } else {
      isInitiated.current = true;
      return () => {};
    }
  }, [user]);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/context/TelegramContext.tsx', code);
