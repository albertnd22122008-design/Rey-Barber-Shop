import React, { useState } from 'react';
import { Camera, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS, HERO_IMAGE, SERVICE_CUT_IMAGE, GALLERY_FADE_IMAGE } from '../data/barbershopData';
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
    <section id="galeria" className="py-24 bg-neutral-950 relative border-t border-neutral-800 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header con Revelación Suave */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="hidden sm:block shrink-0 mt-1">
              <BrandLogo size="md" showText={false} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                <Camera className="w-3.5 h-3.5 animate-pulse" />
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
            {(
              [
                { id: 'todos', label: 'Todos los Trabajos' },
                { id: 'fade', label: 'Degradados & Fade' },
                { id: 'barba', label: 'Barba & Afeitado' },
                { id: 'local', label: 'Ambiente & Academia' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
                  filter === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid con Carga Escalonada & Card Luxury Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActiveModalItem(item)}
                className="card-luxury group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-4/3 cursor-pointer shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover img-optimized group-hover:scale-108 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Soft Scrim Overlay */}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setActiveModalItem(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors z-20 cursor-pointer active:scale-95"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev/Next arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-white z-20 transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-white z-20 transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="max-h-[70vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    {activeModalItem.barber}
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-xs text-neutral-400 capitalize">
                    {activeModalItem.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {activeModalItem.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <a
                  href="#reservas"
                  onClick={() => setActiveModalItem(null)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                >
                  Pedir Este Corte
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
