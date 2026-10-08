import React, { useState } from 'react';
import { Download, Smartphone, X, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { BrandLogo } from './BrandLogo';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // If already installed or running as standalone, don't show
  if (isInstalled) {
    return null;
  }

  // If on other devices where prompt is not yet ready and not iOS, allow testing / display if installable or user wants
  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Default explanation modal if beforeinstallprompt is not triggered yet (e.g. standard browser)
      setShowIOSModal(true);
    }
  };

  // 1. Variant: Banner at the bottom of the screen
  if (variant === 'banner') {
    if (dismissedBanner) return null;

    return (
      <>
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-20 sm:max-w-md z-40 bg-neutral-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 text-neutral-100 animate-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                Instalar App de Reservas
              </h4>
              <p className="text-[11px] text-neutral-400 truncate">
                Acceso rápido sin descargas pesadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleAction}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
            <button
              onClick={() => setDismissedBanner(true)}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Guided Modal for iOS / Browser Manual Install */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-neutral-750 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-neutral-100">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <BrandLogo size="sm" showText={false} />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Rey Barber Shop App
                  </span>
                  <h3 className="text-base font-black text-white">
                    Instalar en tu Pantalla de Inicio
                  </h3>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-300 py-2">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">1. Toca Compartir</strong>
                    <span>En Safari o Chrome, pulsa el botón Compartir en la barra de navegación.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">2. Añadir a pantalla de inicio</strong>
                    <span>Desplázate hacia abajo y selecciona &ldquo;Agregar a inicio&rdquo;.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">3. ¡Listo para usar!</strong>
                    <span>Abre la app directamente desde tu móvil sin barras de navegación.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full mt-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. Default Variant: Button in Navbar / Header
  return (
    <>
      <button
        onClick={handleAction}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 transition-all cursor-pointer shadow-sm active:scale-95"
        title="Instalar App de Reservas"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Instalar App</span>
        <span className="md:hidden">App</span>
      </button>

      {/* Guided Modal for iOS / Manual Install */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-750 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-neutral-100">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <BrandLogo size="sm" showText={false} />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Rey Barber Shop App
                </span>
                <h3 className="text-base font-black text-white">
                  Instalar en tu Pantalla de Inicio
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-300 py-2">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">1. Toca Compartir</strong>
                  <span>En Safari o Chrome, pulsa el botón Compartir en la barra del navegador.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">2. Añadir a pantalla de inicio</strong>
                  <span>Desplázate hacia abajo y pulsa &ldquo;Agregar a pantalla de inicio&rdquo;.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">3. ¡Acceso directo!</strong>
                  <span>Podrás abrir Rey Barber Shop como una app nativa en tu móvil o PC.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
