import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { BrandLogo } from './BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'client' | 'owner';
  onSuccessOwnerLogin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'client',
  onSuccessOwnerLogin,
}) => {
  const { loginAsClient, loginAsOwner } = useBarber();
  const [activeTab, setActiveTab] = useState<'client' | 'owner'>(defaultTab);

  // Client form
  const [clientName, setClientName] = useState('');

  // Owner form
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerError, setOwnerError] = useState('');

  if (!isOpen) return null;

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    loginAsClient(clientName.trim());
    onClose();
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerError('');
    const res = loginAsOwner(ownerEmail, ownerPassword);
    if (res.success) {
      onClose();
      if (onSuccessOwnerLogin) {
        onSuccessOwnerLogin();
      }
    } else {
      setOwnerError(res.error || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-750 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative text-neutral-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors z-10 cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Official Logo */}
        <div className="p-6 pb-4 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-neutral-800 text-center">
          <div className="flex justify-center mb-2">
            <BrandLogo size="lg" showText={false} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Acceso a Rey Barber Shop
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Gestiona tus citas o ingresa al panel administrativo.
          </p>

          {/* 2 Tabs as requested: Cliente (Default) vs Dueño / Owner */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl mt-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('client');
                setOwnerError('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'client'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Soy Cliente</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('owner');
                setOwnerError('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'owner'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dueño / Admin</span>
            </button>
          </div>
        </div>

        {/* Tab 1: CLIENT (Solo pide Nombre, sin correo ni contraseña) */}
        {activeTab === 'client' && (
          <form onSubmit={handleClientSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Ingresa tu Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Marcos Almonte"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-2">
                🔒 Sin contraseñas ni correos complicados. Solo necesitamos tu nombre para vincular tus reservas y guardar tu historial en este dispositivo.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Entrar a Mi Cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: DUEÑO / OWNER (reybarbershop0808@gmail.com / admin2026) */}
        {activeTab === 'owner' && (
          <form onSubmit={handleOwnerSubmit} className="p-6 space-y-4">
            {ownerError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <span>⚠️ {ownerError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Correo Electrónico del Dueño *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-teal-400 transition-colors"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Contraseña Administrativa *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-teal-400 transition-colors"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Ingresar al Panel Administrativo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
