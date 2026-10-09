import React, { useState } from 'react';
import { Clock, Check, Scissors, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';

interface ServicesSectionProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceToBook }) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'corte' | 'barba' | 'combo' | 'especial'>('todos');

  const filteredServices = SERVICES.filter((s) => {
    if (activeCategory === 'todos') return true;
    return s.category === activeCategory;
  });

  return (
    <section id="servicios" className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Ambient soft glow in background */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header con Revelación Suave */}
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
                <Scissors className="w-3.5 h-3.5 animate-scissor-snip" />
                Menú de Servicios & Tarifas
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Cortes Exclusivos & Cuidado Masculino
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-xl">
                Cada servicio incluye diagnóstico capilar, higiene de alto estándar, productos de fijación premium y toallas calientes.
              </p>
            </div>
          </div>

          {/* Interactive filter tabs con respuesta inmediata */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto scrollbar-none">
            {(
              [
                { id: 'todos', label: 'Todos' },
                { id: 'corte', label: 'Cortes & Fade' },
                { id: 'barba', label: 'Barba & Afeitado' },
                { id: 'combo', label: 'Combos VIP' },
                { id: 'especial', label: 'Especiales & Facial' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid con Carga Escalonada (Staggered Load) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  delay: (idx % 6) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="card-luxury bg-neutral-900/60 rounded-2xl border border-neutral-800 flex flex-col justify-between overflow-hidden group shadow-lg cursor-pointer"
                onClick={() => onSelectServiceToBook(service.id)}
              >
                {/* Image banner - 200px height, centered, crisp with smooth zoom on hover */}
                <div className="relative h-[200px] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-[200px] object-cover object-center img-optimized group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Popular mark */}
                  {service.popular && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-md z-10 animate-pulse">
                      Recomendado
                    </div>
                  )}

                  {/* Duration indicator */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-neutral-200 bg-black/75 px-2.5 py-1 rounded-md border border-white/10 shadow-sm z-10 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-medium">{service.durationMinutes} min aprox.</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                        {service.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-amber-400 group-hover:scale-105 transition-transform origin-right">
                          RD$ {service.priceRD.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          ~${service.priceUSD} USD
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
                      {service.tagline}
                    </p>

                    {/* Bullet features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Book this service CTA con micro-interacción */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectServiceToBook(service.id);
                    }}
                    className="w-full py-3 bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm group/btn active:scale-95"
                  >
                    <span>Reservar Este Servicio</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
