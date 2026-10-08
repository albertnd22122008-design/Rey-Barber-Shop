import React, { useState } from 'react';
import { Clock, Check, Scissors, Sparkles, Shield, Phone, ChevronRight } from 'lucide-react';
import { SERVICES, BARBERSHOP_INFO } from '../data/barbershopData';
import { ServiceItem } from '../types';
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
    <section id="servicios" className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block shrink-0 mt-1">
              <BrandLogo size="md" showText={false} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                <Scissors className="w-3.5 h-3.5" />
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

          {/* Interactive filter tabs (Buttons conforming to zero-pill rule for functional controls) */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'todos'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveCategory('corte')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'corte'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cortes & Fade
            </button>
            <button
              onClick={() => setActiveCategory('barba')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'barba'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Barba & Afeitado
            </button>
            <button
              onClick={() => setActiveCategory('combo')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'combo'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Combos VIP
            </button>
            <button
              onClick={() => setActiveCategory('especial')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'especial'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Especiales & Facial
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-neutral-900/60 rounded-2xl border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-amber-500/5"
            >
              {/* Image banner - 200px height, centered, crisp with no dark overlay */}
              <div className="relative h-[200px] w-full overflow-hidden bg-neutral-900">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-[200px] object-cover object-center img-optimized group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Popular mark */}
                {service.popular && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-md z-10">
                    Recomendado
                  </div>
                )}

                {/* Duration indicator with dedicated small semi-transparent black background */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-neutral-200 bg-black/75 px-2.5 py-1 rounded-md border border-white/10 shadow-sm z-10">
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
                      <div className="text-lg font-black text-amber-400">
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
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book this service CTA */}
                <button
                  onClick={() => onSelectServiceToBook(service.id)}
                  className="w-full py-3 bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group/btn"
                >
                  <span>Reservar Este Servicio</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
