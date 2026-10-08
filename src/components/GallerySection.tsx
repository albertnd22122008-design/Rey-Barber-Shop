import React, { useState } from 'react';
import { Camera, X, ZoomIn, Scissors, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_ITEMS, HERO_IMAGE, SERVICE_CUT_IMAGE, GALLERY_FADE_IMAGE, ACADEMY_IMAGE } from '../data/barbershopData';
import { GalleryItem } from '../types';
import { BrandLogo } from './BrandLogo';

export const GallerySection: React.FC = () => {
  const [filter, setFilter] = useState<'todos' | 'fade' | 'barba' | 'local'>('todos');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  // Extended gallery list incorporating authentic cuts and shop ambiance
  const fullGallery: GalleryItem[] = [
    ...GALLERY_ITEMS,
    {
      id: 'gal-7',
      title: 'Degradado Low Fade & Barba Texturizada',
      category: 'fade',
      barber: 'Rey Master Barber',
      image: SERVICE_CUT_IMAGE,
      description: 'Línea de navaja impecable con conexión a barba en ángulo recto.',
    },
    {
      id: 'gal-8',
      title: 'Sillones Hidráulicos & Zona de Barba',
      category: 'local',
      barber: 'Rey Barber Shop',
      image: HERO_IMAGE,
      description: 'Espacio higiénico, iluminación LED fría para máxima precisión de corte.',
    },
    {
      id: 'gal-9',
      title: 'Taper Fade con Rizos Definidos',
      category: 'fade',
      barber: 'Marcos Fade',
      image: GALLERY_FADE_IMAGE,
      description: 'Taper en patillas y nuca con esponja definidora en la parte superior.',
    },
  ];

  const filteredItems = fullGallery.filter((item) => {
    if (filter === 'todos') return true;
    return item.category === filter;
  });

  const handlePrev = () => {
    if (!activeModalItem) return;
    const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveModalItem(filteredItems[prevIndex]);
  };

  const handleNext = () => {
    if (!activeModalItem) return;
    const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveModalItem(filteredItems[nextIndex]);
  };

  return (
    <section id="galeria" className="py-24 bg-neutral-950 relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block shrink-0 mt-1">
              <BrandLogo size="md" showText={false} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                <Camera className="w-3.5 h-3.5" />
                Galería de Trabajos Reales
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Precisión, Arte y Detalles en Cada Corte
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-xl">
                Nuestros clientes son nuestra mejor carta de presentación. Explora degradados limpios, perfilados a navaja y el ambiente de nuestro local.
              </p>
            </div>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilter('todos')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'todos'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todos los Trabajos
            </button>
            <button
              onClick={() => setFilter('fade')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'fade'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Degradados & Fade
            </button>
            <button
              onClick={() => setFilter('barba')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'barba'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Perfilado de Barba
            </button>
            <button
              onClick={() => setFilter('local')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'local'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Ambiente & Academia
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-4/3 cursor-pointer shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover img-optimized group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Soft Scrim Overlay - lightened for crystal clear photo visibility */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-neutral-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-amber-400" />
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-0.5">
                  {item.barber}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setActiveModalItem(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors z-20 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev/Next arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors z-20 cursor-pointer hidden sm:flex items-center justify-center"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors z-20 cursor-pointer hidden sm:flex items-center justify-center"
            aria-label="Foto siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Image viewer */}
            <div className="md:w-3/5 bg-black flex items-center justify-center min-h-[300px] max-h-[70vh] md:max-h-[80vh] p-2">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-full h-full object-contain img-optimized max-h-[600px] rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Details panel */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BrandLogo size="sm" showText={false} />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {activeModalItem.barber}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeModalItem.description}
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Estilo:</span>
                    <strong className="text-white capitalize">{activeModalItem.category}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Herramientas:</span>
                    <strong className="text-white">Wahl / Babyliss Pro & Navaja Libre</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duración estimada:</span>
                    <strong className="text-amber-400">40 - 50 minutos</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <a
                  href="#reservas"
                  onClick={() => setActiveModalItem(null)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl text-center transition-colors"
                >
                  Quiero Este Corte (Reservar)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
