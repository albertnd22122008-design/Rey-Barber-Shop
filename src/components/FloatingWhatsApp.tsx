import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const defaultOptions = [
    'Hola! Quisiera reservar una cita en el local.',
    'Hola! Quisiera consultar disponibilidad para hoy.',
    'Hola! Deseo información de los cursos de la academia.',
  ];

  const handleSendOption = (text: string) => {
    const url = `https://wa.me/${BARBERSHOP_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    handleSendOption(customMsg);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center p-0.5 border border-emerald-300/40">
                <BrandLogo size="sm" showText={false} />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Rey Barber Shop</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
                  <span>En línea · Respuesta rápida</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-emerald-700 text-emerald-100 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Body */}
          <div className="p-4 bg-neutral-950/90 text-xs space-y-3">
            <div className="p-3 rounded-xl bg-neutral-900 text-neutral-300 border border-neutral-800 leading-relaxed">
              👋 ¡Hola! Bienvenido a <strong>Rey Barber Shop</strong>. ¿En qué podemos ayudarte hoy?
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                Opciones rápidas:
              </span>
              {defaultOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendOption(opt)}
                  className="w-full text-left p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-neutral-200 text-xs transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{opt}</span>
                  <Send className="w-3 h-3 text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleSendCustom} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 min-h-[44px] px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-base placeholder-neutral-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="min-h-[44px] min-w-[44px] p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-600/50 transition-all hover:scale-105 active:scale-95 cursor-pointer relative group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black flex items-center justify-center">
          1
        </span>
      </button>
    </div>
  );
};
