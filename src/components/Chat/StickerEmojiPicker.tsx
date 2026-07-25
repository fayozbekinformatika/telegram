import React, { useState } from 'react';
import { Smile, Image as ImageIcon, Flame, Search, Film, Sparkles } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

interface StickerEmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker: (stickerUrl: string) => void;
  onSelectGif: (gifUrl: string) => void;
  onClose: () => void;
}

// Rich Emojis Dataset by Category
const EMOJI_CATEGORIES = [
  {
    name: 'Smileys & People',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
      '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
      '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸',
      '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
      '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
      '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓',
      '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄',
      '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵',
      '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠',
    ],
  },
  {
    name: 'Gestures & Body',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
      '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
      '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
      '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
    ],
  },
  {
    name: 'Hearts & Emotions',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🔥',
      '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '🧠', '🫀',
    ],
  },
  {
    name: 'Animals & Nature',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨',
      '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
      '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞',
    ],
  },
  {
    name: 'Food & Drinks',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
      '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
      '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
      '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆',
      '🍿', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🍩', '🍪',
      '☕', '🍵', '🧃', '🥤', '🧋', '🍺', '🍻', '🥂', '🍷', '🥃',
    ],
  },
  {
    name: 'Objects & Symbols',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🎮', '🕹️', '🎯', '🎲', '🎰', '🎨', '🎬', '🎤', '🎧', '🎼',
      '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷',
      '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '🛠️', '⛏️', '🔩',
      '⚙️', '⛓️', '🧲', '🔫', '💣', '🔪', '🗡️', '⚔️', '🛡️', '🚬',
      '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '❤️‍🔥', '💯', '⚡', '🚀',
    ],
  },
];

// Rich Telegram Sticker Packs
const STICKER_PACKS = [
  {
    id: 'pack_spotty',
    name: 'Spotty Duck',
    thumbnail: '🦆',
    stickers: [
      { id: 'st_1', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f986/512.webp', emoji: '🦆' },
      { id: 'st_2', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp', emoji: '🔥' },
      { id: 'st_3', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp', emoji: '🚀' },
      { id: 'st_4', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.webp', emoji: '👍' },
      { id: 'st_5', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp', emoji: '🎉' },
      { id: 'st_6', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.webp', emoji: '🤩' },
      { id: 'st_7', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.webp', emoji: '😎' },
      { id: 'st_8', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fa84/512.webp', emoji: '🪄' },
    ],
  },
  {
    id: 'pack_pepe',
    name: 'Pepe & Friends',
    thumbnail: '🐸',
    stickers: [
      { id: 'st_9', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f430/512.webp', emoji: '🐰' },
      { id: 'st_10', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp', emoji: '🥳' },
      { id: 'st_11', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.webp', emoji: '😍' },
      { id: 'st_12', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/512.webp', emoji: '💖' },
      { id: 'st_13', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f911/512.webp', emoji: '🤑' },
      { id: 'st_14', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.webp', emoji: '🥰' },
      { id: 'st_15', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.webp', emoji: '🤯' },
      { id: 'st_16', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47d/512.webp', emoji: '👽' },
    ],
  },
  {
    id: 'pack_cat',
    name: 'Cool Cats',
    thumbnail: '🐱',
    stickers: [
      { id: 'st_17', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f631/512.webp', emoji: '😱' },
      { id: 'st_18', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f633/512.webp', emoji: '😳' },
      { id: 'st_19', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f63a/512.webp', emoji: '😺' },
      { id: 'st_20', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f63b/512.webp', emoji: '😻' },
      { id: 'st_21', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f63d/512.webp', emoji: '😽' },
      { id: 'st_22', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f640/512.webp', emoji: '🙀' },
    ],
  },
];

// Rich Telegram Reaction GIFs Collection
const GIF_COLLECTION = [
  {
    id: 'gif_1',
    title: 'Cat Typing Fast',
    keywords: ['cat', 'typing', 'work', 'fast', 'programmer'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h0Y2g5NW10Mms1bjR3NDkydHR5cTNkMmxldXFkZWpldXdqcnA2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif',
  },
  {
    id: 'gif_2',
    title: 'Mind Blown Explosion',
    keywords: ['mind blown', 'wow', 'explosion', 'amazing', 'shocked'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpkeDRhY2J3NnMxbms4Y2xra2dybmR1eHkxbjUxaWVwZXlsNDI2bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xeJpnrWC4XWblEk/giphy.gif',
  },
  {
    id: 'gif_3',
    title: 'Dance Celebration',
    keywords: ['dance', 'happy', 'party', 'celebrate', 'joy'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGh2cXNudnAyd29scXUxeGlnbnhsdTFqcnRreHl5cXRhYnpzNWNmNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0AMJzLg55AjaA3A4/giphy.gif',
  },
  {
    id: 'gif_4',
    title: 'Thumbs Up Cool',
    keywords: ['thumbs up', 'ok', 'like', 'agree', 'cool'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnYyeHRpd2xxdTRxZnI4OHkyaWVqZXJtNXkyajlyZHBra2tqZW4zcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/111ebonMs90YLu/giphy.gif',
  },
  {
    id: 'gif_5',
    title: 'High Five',
    keywords: ['high five', 'team', 'friend', 'success', 'yes'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJvdTZsdjhrOXN5YWk0b2xrd2UzbWZkczQxMXZvdjRkeW9tYzVwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKoWXm3okO1kgHC/giphy.gif',
  },
  {
    id: 'gif_6',
    title: 'Confused John Travolta',
    keywords: ['confused', 'where', 'lost', 'what', 'question'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHhhM2trNTd6cDV4bHJ6djRmbDFqM3Yxa2xpdXZrNDlmbnJvZDRudCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g01ZnwAUvctuK8GIQn/giphy.gif',
  },
  {
    id: 'gif_7',
    title: 'Hype Fire Reaction',
    keywords: ['fire', 'hype', 'lit', 'awesome', 'hot'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODgxcG5ndHoxdnFxeTlpa3k2bDJ1dGRwNmxwMW9ycmYwMnd2MDF4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lopx9eUi34rbq/giphy.gif',
  },
  {
    id: 'gif_8',
    title: 'Facepalm Face',
    keywords: ['facepalm', 'fail', 'omg', 'no', 'dumb'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmtudm0xeXV0OHo0OHU5b3oxczJnaHpqa2o1cmJ2dHpyNnpzeDByMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xsF1FSDbjguis/giphy.gif',
  },
];

export const StickerEmojiPicker: React.FC<StickerEmojiPickerProps> = ({
  onSelectEmoji,
  onSelectSticker,
  onSelectGif,
  onClose,
}) => {
  const { theme } = useTelegram();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gifs'>('emoji');
  const [search, setSearch] = useState('');
  const [activeStickerPack, setActiveStickerPack] = useState('pack_spotty');

  const filteredGifs = GIF_COLLECTION.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className={`absolute bottom-16 left-2 right-2 sm:left-auto sm:right-4 w-auto sm:w-88 max-w-[95vw] h-[400px] max-h-[55vh] rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 border ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#17212b] border-gray-700/80 text-white'
      }`}
    >
      {/* Top Header & Search Bar */}
      <div
        className={`p-2.5 border-b flex flex-col gap-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1621] border-gray-800'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Navigation Tabs */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl ${
              isLight ? 'bg-slate-200/70' : 'bg-[#17212b]'
            }`}
          >
            <button
              onClick={() => setActiveTab('emoji')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'emoji'
                  ? isLight
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-[#2b5278] text-white shadow-xs'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" /> Emoji
            </button>

            <button
              onClick={() => setActiveTab('stickers')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'stickers'
                  ? isLight
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-[#2b5278] text-white shadow-xs'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Stickers
            </button>

            <button
              onClick={() => setActiveTab('gifs')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'gifs'
                  ? isLight
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-[#2b5278] text-white shadow-xs'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> GIFs
            </button>
          </div>

          <button
            onClick={onClose}
            className={`text-xs px-2 py-1 rounded-lg font-bold transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full">
          <Search
            className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${
              isLight ? 'text-slate-400' : 'text-gray-400'
            }`}
          />
          <input
            type="text"
            placeholder={
              activeTab === 'emoji'
                ? 'Search emojis...'
                : activeTab === 'stickers'
                ? 'Search stickers...'
                : 'Search GIFs (e.g. cat, dance, wow)...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border outline-none transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400'
                : 'bg-[#17212b] text-white border-gray-700/60 focus:border-sky-500 placeholder:text-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {/* Emojis Tab */}
        {activeTab === 'emoji' && (
          <div className="space-y-4">
            {EMOJI_CATEGORIES.map((cat) => {
              const filtered = cat.emojis.filter((e) => e.includes(search));
              if (filtered.length === 0) return null;

              return (
                <div key={cat.name}>
                  <h4
                    className={`text-[11px] font-bold uppercase tracking-wider mb-2 px-1 ${
                      isLight ? 'text-slate-400' : 'text-gray-400'
                    }`}
                  >
                    {cat.name}
                  </h4>
                  <div className="grid grid-cols-7 gap-1.5">
                    {filtered.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onSelectEmoji(emoji);
                          onClose();
                        }}
                        className={`text-2xl p-1.5 rounded-xl transition-all text-center hover:scale-125 ${
                          isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stickers Tab */}
        {activeTab === 'stickers' && (
          <div className="space-y-4">
            {/* Sticker Pack Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {STICKER_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setActiveStickerPack(pack.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-all ${
                    activeStickerPack === pack.id
                      ? isLight
                        ? 'bg-blue-100 text-blue-700 font-bold'
                        : 'bg-[#2b5278] text-white'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-gray-800/40 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{pack.thumbnail}</span>
                  <span>{pack.name}</span>
                </button>
              ))}
            </div>

            {/* Sticker Grid */}
            {STICKER_PACKS.filter((p) => p.id === activeStickerPack).map((pack) => (
              <div key={pack.id} className="grid grid-cols-4 gap-2">
                {pack.stickers.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onSelectSticker(st.url);
                      onClose();
                    }}
                    className={`p-2 rounded-2xl transition-all flex items-center justify-center hover:scale-110 shadow-2xs ${
                      isLight
                        ? 'bg-slate-50 hover:bg-blue-50 border border-slate-100'
                        : 'bg-gray-800/30 hover:bg-[#202b36] border border-gray-700/30'
                    }`}
                  >
                    <img src={st.url} alt={st.emoji} className="w-14 h-14 object-contain" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* GIFs Tab */}
        {activeTab === 'gifs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-500 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Trending Reaction GIFs
              </span>
              <span>{filteredGifs.length} results</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredGifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => {
                    onSelectGif(gif.url);
                    onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden aspect-video border transition-all hover:scale-102 shadow-xs ${
                    isLight ? 'border-slate-200 hover:border-blue-500' : 'border-gray-700 hover:border-sky-400'
                  }`}
                >
                  <img
                    src={gif.url}
                    alt={gif.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] font-semibold text-white truncate">
                      {gif.title}
                    </span>
                  </div>
                  <span className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                    GIF
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
