import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Menu, X, User, ShieldCheck, Crown } from 'lucide-react';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';
import { useBarber } from '../context/BarberContext';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAuth: (defaultTab?: 'client' | 'owner') => void;
  onOpenClientAccount: () => void;
  onOpenOwnerDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAuth,
  onOpenClientAccount,
  onOpenOwnerDashboard,
}) => {
  const { currentUser } = useBarber();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Reservas', href: '#reservas' },
    { label: 'Academia', href: '#academia' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Opiniones', href: '#opiniones' },
    { label: 'Ubicación', href: '#contacto' },
  ];

  const handleAccountClick = () => {
    if (!currentUser) {
      onOpenAuth('client');
    } else if (currentUser.role === 'owner') {
      onOpenOwnerDashboard();
    } else {
      onOpenClientAccount();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Brand title wordmark with official high-res logo */}
          <a
            href="#"
            className="flex items-center gap-3 text-neutral-100 hover:opacity-90 transition-opacity group"
          >
            <BrandLogo size="md" showText={false} />
            <div className="flex flex-col">
              <span className="font-display tracking-widest text-lg sm:text-xl font-black uppercase text-white group-hover:text-amber-300 transition-colors leading-tight">
                Rey Barber Shop
              </span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider hidden sm:block">
                Corte &amp; Afeitado · RD
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-amber-400 transition-colors relative py-1 text-xs uppercase tracking-wider font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary action, Auth Button & WhatsApp */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Botón de Acceso en el Menú: "Ingresar / Mi Cuenta" */}
            <button
              onClick={handleAccountClick}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                currentUser?.role === 'owner'
                  ? 'bg-teal-600/20 text-teal-300 border-teal-500/50 hover:bg-teal-600 hover:text-white'
                  : currentUser?.role === 'client'
                  ? 'bg-neutral-900 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-neutral-950'
                  : 'bg-neutral-900/80 text-neutral-200 border-neutral-700 hover:border-amber-400 hover:text-white'
              }`}
            >
              {currentUser?.role === 'owner' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Panel Dueño (Admin)</span>
                </>
              ) : currentUser?.role === 'client' ? (
                <>
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="max-w-[120px] truncate">Mi Cuenta ({currentUser.name})</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Ingresar / Mi Cuenta</span>
                </>
              )}
            </button>

            {/* Acceso rápido a Dueño si no está logueado como dueño */}
            {currentUser?.role !== 'owner' && (
              <button
                onClick={() => onOpenAuth('owner')}
                className="px-2.5 py-2 text-[11px] font-semibold text-neutral-400 hover:text-teal-300 hover:bg-neutral-900/60 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-neutral-800"
                title="Acceso directo para administración de la barbería"
              >
                Dueño
              </button>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Cita</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={handleAccountClick}
              className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold text-xs rounded-lg flex items-center gap-1 sm:hidden"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser ? 'Cuenta' : 'Entrar'}</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 bg-amber-500 text-neutral-950 font-bold text-xs rounded-lg sm:hidden"
            >
              Reservar
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-neutral-950/98 border-b border-neutral-800 px-4 pt-3 pb-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="pb-3 mb-2 border-b border-neutral-900 flex justify-center">
            <BrandLogo size="md" showText={true} />
          </div>
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-neutral-200 hover:text-amber-400 hover:bg-neutral-900 text-sm font-semibold tracking-wide transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAccountClick();
                }}
                className="w-full py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>
                  {currentUser ? `Mi Cuenta (${currentUser.name})` : 'Ingresar / Mi Cuenta'}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 bg-amber-500 text-neutral-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Cita Online</span>
              </button>

              <div className="flex justify-center py-1">
                <PWAInstallButton variant="navbar" />
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('owner');
                }}
                className="w-full py-2 bg-neutral-950 border border-teal-800/60 text-teal-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acceso Dueño / Admin</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
