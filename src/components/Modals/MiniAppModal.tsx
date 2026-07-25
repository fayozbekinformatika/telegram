import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

interface MiniAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'b1',
    name: 'Durger Double Cheese',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'b2',
    name: 'Spicy Chicken Durger',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'b3',
    name: 'Crispy French Fries',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'b4',
    name: 'Cold Ice Cola',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80',
  },
];

export const MiniAppModal: React.FC<MiniAppModalProps> = ({ isOpen, onClose }) => {
  const { sendMessage, activeChatId } = useTelegram();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderOrdered, setOrderOrdered] = useState(false);

  if (!isOpen) return null;

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updated };
    });
  };

  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    const itemQty = Number(qty);
    return sum + (item ? item.price * itemQty : 0);
  }, 0);

  const handleOrder = () => {
    if (totalPrice === 0) return;
    setOrderOrdered(true);

    const itemsSummary = Object.entries(cart)
      .map(([id, qty]) => {
        const item = MENU_ITEMS.find((m) => m.id === id);
        return `${item?.name} x${qty}`;
      })
      .join(', ');

    if (activeChatId) {
      sendMessage(
        activeChatId,
        `🍔 **Durger King Order Confirmed!**\nItems: ${itemsSummary}\nTotal: $${totalPrice.toFixed(
          2
        )}\nStatus: Preparing fresh meal 🛵`
      );
    }

    setTimeout(() => {
      setOrderOrdered(false);
      setCart({});
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#17212b] text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0e1621]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍔</span>
            <div>
              <h2 className="text-sm font-bold text-white">Durger King Mini App</h2>
              <p className="text-[10px] text-amber-400">Telegram Web App API v7.2</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
          {MENU_ITEMS.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="bg-[#0e1621] p-3 rounded-2xl border border-gray-800 flex flex-col items-center text-center group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl mb-2 group-hover:scale-105 transition-transform"
                />
                <h3 className="text-xs font-bold text-white line-clamp-1">{item.name}</h3>
                <span className="text-xs font-extrabold text-amber-400 my-1">${item.price}</span>

                {qty === 0 ? (
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl mt-1"
                  >
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full bg-amber-500/20 rounded-xl p-1 mt-1 border border-amber-500/40">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-amber-400 hover:bg-amber-500/30 rounded-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-amber-300">{qty}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-amber-400 hover:bg-amber-500/30 rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Checkout Bar */}
        <div className="p-4 border-t border-gray-800 bg-[#0e1621]">
          {orderOrdered ? (
            <div className="w-full py-3 bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs">
              <Check className="w-4 h-4" /> Order Placed via Telegram Web App!
            </div>
          ) : (
            <button
              onClick={handleOrder}
              disabled={totalPrice === 0}
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-between px-5 transition-all ${
                totalPrice > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg hover:scale-102'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> VIEW ORDER
              </span>
              <span>${totalPrice.toFixed(2)}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
