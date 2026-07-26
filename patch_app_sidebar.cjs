const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacementTarget = `{/* Folder Tabs */}
          <ChatFolderBar />
          {/* Chat List */}
          <ChatList />
          {/* Sidebar Footer Security Badge */}`;

// The header also needs to change?
// In Screenshot 3: The left sidebar header has a menu button, "Search messages in", and the close button on the right. Below that is a selected chip "TE This Group". Below that is a large magnifying glass icon with "Search for messages".
// Let's replace the whole Left Sidebar content if searchInChatMode is true.

const leftSidebarBlockRegex = /\{\/\* Left Sidebar \(Chats, Folders, Search & Stories\) \*\/\}\s*<div[\s\S]*?update Telegram\s*<\/button>\s*<\/div>/i;

const oldSidebar = `<div
          className={\`w-full md:w-80 lg:w-96 flex flex-col h-full shrink-0 \${
            activeChatId ? 'hidden md:flex' : 'flex'
          } \${
            isLight
              ? 'bg-white border-r border-slate-200 shadow-xs'
              : 'bg-[#17212b] border-r border-[#0e1621]'
          }\`}
        >
          {/* Top Search & Menu Header (Telegram Desktop Style) */}
          <div
            className={\`p-2 flex items-center gap-2 \${
              isLight ? 'bg-white' : 'bg-[#17212b]'
            }\`}
          >
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={\`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors \${
                isLight
                  ? 'hover:bg-slate-100 text-slate-500'
                  : 'hover:bg-[#202b36] text-gray-400'
              }\`}
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <Search
                className={\`w-4 h-4 absolute left-3 top-2.5 \${
                  isLight ? 'text-slate-400' : 'text-gray-400'
                }\`}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={\`w-full py-2 px-4 pl-9 text-sm rounded-full outline-none transition-all \${
                  isLight
                    ? 'bg-slate-100 text-slate-800 border-none focus:ring-2 focus:ring-blue-400 focus:bg-white placeholder:text-slate-400'
                    : 'bg-[#242f3d] text-white border-none focus:bg-[#242f3d] placeholder:text-gray-400'
                }\`}
              />
            </div>
          </div>
          {/* Folder Tabs */}
          <ChatFolderBar />
          {/* Chat List */}
          <ChatList />
          {/* Sidebar Footer Security Badge */}
          <button className="w-full h-12 shrink-0 bg-[#00c73e] hover:bg-[#00d844] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Update Telegram
          </button>
        </div>`;
        
const newSidebar = `<div
          className={\`w-full md:w-80 lg:w-96 flex flex-col h-full shrink-0 \${
            activeChatId ? 'hidden md:flex' : 'flex'
          } \${
            isLight
              ? 'bg-white border-r border-slate-200 shadow-xs'
              : 'bg-[#17212b] border-r border-[#0e1621]'
          }\`}
        >
          {searchInChatMode ? (
            <div className="flex flex-col h-full">
              <div className={\`flex items-center gap-4 px-4 py-3 border-b \${isLight ? 'border-slate-200' : 'border-[#0e1621]'}\`}>
                <button onClick={() => setIsDrawerOpen(true)} className={\`p-1.5 -ml-1.5 rounded-full transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <Menu className={\`w-5 h-5 \${isLight ? 'text-slate-500' : 'text-gray-400'}\`} />
                </button>
                <div className="flex-1">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search messages in"
                    className={\`w-full bg-transparent outline-none text-[15px] \${isLight ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-gray-400'}\`}
                  />
                </div>
                <button onClick={() => setSearchInChatMode(false)} className={\`p-1.5 -mr-1.5 rounded-full transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <svg className={\`w-5 h-5 \${isLight ? 'text-slate-500' : 'text-gray-400'}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className={\`px-4 py-3 flex items-center border-b \${isLight ? 'border-slate-200' : 'border-[#0e1621]'}\`}>
                <div className="flex items-center gap-1.5 bg-sky-500/10 px-2 py-1 rounded text-sky-500 text-[13px] font-medium">
                  <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">TE</div>
                  This Group
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className={\`w-24 h-24 rounded-full flex items-center justify-center mb-6 \${isLight ? 'bg-slate-100' : 'bg-[#202b36]'}\`}>
                  <Search className={\`w-12 h-12 \${isLight ? 'text-slate-400' : 'text-gray-500'}\`} />
                </div>
                <p className={\`text-[15px] \${isLight ? 'text-slate-500' : 'text-gray-400'}\`}>
                  Search for messages
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Top Search & Menu Header (Telegram Desktop Style) */}
              <div
                className={\`p-2 flex items-center gap-2 \${
                  isLight ? 'bg-white' : 'bg-[#17212b]'
                }\`}
              >
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className={\`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors \${
                    isLight
                      ? 'hover:bg-slate-100 text-slate-500'
                      : 'hover:bg-[#202b36] text-gray-400'
                  }\`}
                  title="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <Search
                    className={\`w-4 h-4 absolute left-3 top-2.5 \${
                      isLight ? 'text-slate-400' : 'text-gray-400'
                    }\`}
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={\`w-full py-2 px-4 pl-9 text-sm rounded-full outline-none transition-all \${
                      isLight
                        ? 'bg-slate-100 text-slate-800 border-none focus:ring-2 focus:ring-blue-400 focus:bg-white placeholder:text-slate-400'
                        : 'bg-[#242f3d] text-white border-none focus:bg-[#242f3d] placeholder:text-gray-400'
                    }\`}
                  />
                </div>
              </div>
              {/* Folder Tabs */}
              <ChatFolderBar />
              {/* Chat List */}
              <ChatList />
              {/* Sidebar Footer Security Badge */}
              <button className="w-full h-12 shrink-0 bg-[#00c73e] hover:bg-[#00d844] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Update Telegram
              </button>
            </>
          )}
        </div>`;

// Wait, the `searchInChatMode` variable is not imported in App.tsx!
content = content.replace("searchQuery, setSearchQuery, theme, activeChatId", "searchQuery, setSearchQuery, theme, activeChatId, searchInChatMode, setSearchInChatMode");
content = content.replace(leftSidebarBlockRegex, newSidebar);

fs.writeFileSync(path, content);
