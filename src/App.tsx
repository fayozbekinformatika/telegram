import React, { useState } from 'react';
import { Menu, Search, Lock, ShieldCheck, Sparkles, Plus, Globe } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { TelegramProvider, useTelegram } from './context/TelegramContext';
import { ChatFolderBar } from './components/Sidebar/ChatFolderBar';
import { StoriesBar } from './components/Sidebar/StoriesBar';
import { ChatList } from './components/Sidebar/ChatList';
import { SideMenuDrawer } from './components/Sidebar/SideMenuDrawer';
import { ChatWindow } from './components/Chat/ChatWindow';
import { StoryViewerModal } from './components/Stories/StoryViewerModal';
import { StoryCreatorModal } from './components/Stories/StoryCreatorModal';
import { CallWindowModal } from './components/Calls/CallWindowModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { PasscodeModal } from './components/Modals/PasscodeModal';
import { NewChatModal } from './components/Modals/NewChatModal';
import { PollCreateModal } from './components/Modals/PollCreateModal';
import { MiniAppModal } from './components/Modals/MiniAppModal';
import { ContactsModal } from './components/Modals/ContactsModal';
import { CallsModal } from './components/Modals/CallsModal';

const TelegramMainApp: React.FC = () => {
  const { searchQuery, setSearchQuery, theme, activeChatId, searchInChatMode, setSearchInChatMode } = useTelegram();
  const { lockApp, isPasscodeLocked, passcode } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isCallsModalOpen, setIsCallsModalOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [isMiniAppOpen, setIsMiniAppOpen] = useState(false);
  const [newChatType, setNewChatType] = useState<'group' | 'channel' | 'secret' | null>(null);

  // Theme styling mapping
  const isLight = theme === 'light';

  const getThemeBg = () => {
    if (theme === 'night') return 'bg-[#17212b]';
    if (theme === 'green') return 'bg-emerald-950';
    return 'bg-[#e4e9f0] text-slate-800';
  };

  return (
    <div className={`h-[100dvh] w-full min-h-[100dvh] flex flex-col overflow-hidden select-none font-sans ${getThemeBg()}`}>
      {/* Passcode Lock Overlay if App is Locked */}
      {isPasscodeLocked && (
        <PasscodeModal isOpen={true} onClose={() => {}} />
      )}

      {/* Main Telegram Application Window */}
      <div className="flex-1 flex h-full overflow-hidden relative">
        <div
          className={`w-full md:w-80 lg:w-96 flex flex-col h-full shrink-0 ${
            activeChatId ? 'hidden md:flex' : 'flex'
          } ${
            isLight
              ? 'bg-white border-r border-slate-200 shadow-xs'
              : 'bg-[#17212b] border-r border-[#0e1621]'
          }`}
        >
          {searchInChatMode ? (
            <div className="flex flex-col h-full bg-[#17212b]">
              {/* Top Search & Menu Header */}
              <div
                className={`p-2 flex items-center gap-2 ${
                  isLight ? 'bg-white' : 'bg-[#17212b]'
                }`}
              >
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                    isLight
                      ? 'hover:bg-slate-100 text-slate-500'
                      : 'hover:bg-[#202b36] text-gray-400'
                  }`}
                  title="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <Search
                    className={`w-4 h-4 absolute left-3 top-2.5 ${
                      isLight ? 'text-slate-400' : 'text-gray-400'
                    }`}
                  />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search"
                    className={`w-full py-2 px-4 pl-9 text-sm rounded-full outline-none transition-all ${
                      isLight
                        ? 'bg-slate-100 text-slate-800 border-none focus:ring-2 focus:ring-blue-400 focus:bg-white placeholder:text-slate-400'
                        : 'bg-[#242f3d] text-white border-none focus:bg-[#242f3d] placeholder:text-gray-400'
                    }`}
                  />
                  <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </button>
                </div>
              </div>

              {/* Filter active chip */}
              <div className={`px-4 pb-2 border-b ${isLight ? 'border-slate-200 bg-white' : 'border-[#0e1621] bg-[#17212b]'}`}>
                <div className={`text-[13px] mb-1.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Search messages in</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-medium">TE</div>
                    <span className={`text-[14px] font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>This Group</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  <button onClick={() => setSearchInChatMode(false)} className="p-1 rounded hover:bg-black/10 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isLight ? 'bg-slate-100' : 'bg-[#202b36]'}`}>
                  <Search className={`w-12 h-12 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                </div>
                <p className={`text-[15px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Search for messages
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Top Search & Menu Header (Telegram Desktop Style) */}
              <div
                className={`p-2 flex items-center gap-2 ${
                  isLight ? 'bg-white' : 'bg-[#17212b]'
                }`}
              >
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                    isLight
                      ? 'hover:bg-slate-100 text-slate-500'
                      : 'hover:bg-[#202b36] text-gray-400'
                  }`}
                  title="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <Search
                    className={`w-4 h-4 absolute left-3 top-2.5 ${
                      isLight ? 'text-slate-400' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-2 px-4 pl-9 text-sm rounded-full outline-none transition-all ${
                      isLight
                        ? 'bg-slate-100 text-slate-800 border-none focus:ring-2 focus:ring-blue-400 focus:bg-white placeholder:text-slate-400'
                        : 'bg-[#242f3d] text-white border-none focus:bg-[#242f3d] placeholder:text-gray-400'
                    }`}
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
        </div>

        {/* Right Panel (Active Chat Window) */}
        <ChatWindow
          onOpenCreatePoll={() => setIsCreatePollOpen(true)}
          onOpenMiniApp={() => setIsMiniAppOpen(true)}
        />
      </div>

      {/* Side Menu Drawer */}
      <SideMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenNewChat={(type) => setNewChatType(type)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPasscode={() => setIsPasscodeModalOpen(true)}
        onOpenContacts={() => setIsContactsModalOpen(true)}
        onOpenCalls={() => setIsCallsModalOpen(true)}
      />

      {/* Story Viewer Modal */}
      <StoryViewerModal />

      {/* Story Creator Modal */}
      <StoryCreatorModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
      />

      {/* Encrypted Calls Modal */}
      <CallWindowModal />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenPasscodeModal={() => setIsPasscodeModalOpen(true)}
      />

      {/* Passcode Configuration Modal */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
      />

      <ContactsModal isOpen={isContactsModalOpen} onClose={() => setIsContactsModalOpen(false)} />
      <CallsModal isOpen={isCallsModalOpen} onClose={() => setIsCallsModalOpen(false)} />

      {/* New Chat / Group / Channel Modal */}
      <NewChatModal
        isOpen={!!newChatType}
        type={newChatType}
        onClose={() => setNewChatType(null)}
      />

      {/* Poll Creation Modal */}
      <PollCreateModal
        isOpen={isCreatePollOpen}
        onClose={() => setIsCreatePollOpen(false)}
      />

      {/* Durger King Mini App Modal */}
      <MiniAppModal
        isOpen={isMiniAppOpen}
        onClose={() => setIsMiniAppOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider><TelegramProvider>
        <TelegramMainApp />
      </TelegramProvider></ToastProvider>
    </AuthProvider>
  );
}
