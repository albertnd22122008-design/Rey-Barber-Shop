import React, { useRef } from 'react';
import { Calendar, Sparkles, GraduationCap, Scissors, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
  onExploreCourses: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreServices,
  onExploreCourses,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax ultra sutil para dar sensación de profundidad espacial
  const bgOrbY1 = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const bgOrbY2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], [0, 35]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-neutral-950"
    >
      {/* Background ambient lighting con Parallax sutil */}
      <motion.div
        style={{ y: bgOrbY1 }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: bgOrbY2 }}
        className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle barber pole ribbon at top */}
      <div className="absolute top-0 left-0 right-0 h-1 barber-pole-stripes opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs con revelación suave */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            {/* Trust badge with Google Rating & Official Crest */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 text-xs text-neutral-300"
            >
              <div className="p-1.5 rounded-2xl bg-neutral-900 border border-teal-500/50 flex items-center gap-2 shadow-lg shadow-teal-950/40 hover:border-teal-400 transition-colors">
                <BrandLogo size="md" showText={false} />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-teal-300 pr-1 hidden sm:inline">
                  Rey Barber Shop Oficial
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                4.7 en Google
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-400 font-medium">13 Reseñas Verificadas</span>
              <span className="text-neutral-600">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Higiene Certificada
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance"
            >
              Tu Estilo en Manos de{' '}
              <span className="gold-gradient-text font-display italic">
                Profesionales
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed"
            >
              En <strong className="text-neutral-100 font-semibold">Rey Barber Shop</strong> fusionamos la tradición del afeitado clásico con las técnicas más avanzadas de degradado contemporáneo, toallas calientes y academia profesional.
            </motion.p>

            {/* CTAs con Botón Hero Pulse */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={onOpenBooking}
                className="btn-hero-pulse px-7 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Reservar Cita Online</span>
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-4 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm rounded-xl border border-neutral-700/80 hover:border-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
              >
                <span>Ver Servicios & Precios</span>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Service Pillars / Indicators con Micro-animación de Tijeras y Hover Elevado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="pt-6 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {/* Pillar 1: Cortes exclusivos con icono animado de tijeras */}
              <div
                onClick={onExploreServices}
                className="card-luxury p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scissors className="w-4 h-4 animate-scissor-snip" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200 group-hover:text-amber-300 transition-colors">
                    Cortes Exclusivos
                  </h2>
                </div>
                <p className="text-xs text-neutral-400">
                  Fades milimétricos, perfilado a navaja y peinado estructurado.
                </p>
              </div>

              {/* Pillar 2: Barba & Afeitado Clásico */}
              <div
                onClick={onExploreServices}
                className="card-luxury p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200 group-hover:text-teal-300 transition-colors">
                    Barba & Toalla Caliente
                  </h2>
                </div>
                <p className="text-xs text-neutral-400">
                  Ritual de afeitado tradicional con aceites aromáticos y vapor.
                </p>
              </div>

              {/* Pillar 3: Cursos y academia */}
              <div
                onClick={onExploreCourses}
                className="card-luxury p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200 group-hover:text-blue-300 transition-colors">
                    Academia & Cursos
                  </h2>
                </div>
                <p className="text-xs text-neutral-400">
                  Talleres prácticos: Básico, Avanzado a tijera y Tintado de Cejas.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Asset con Parallax sutil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: imageParallaxY }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-red-500/20 to-blue-500/30 rounded-3xl blur-xl opacity-50" />

              <div className="relative rounded-2xl overflow-hidden border border-neutral-700/80 bg-neutral-900 shadow-2xl group">
                <img
                  src="https://i.postimg.cc/HsrR2C02/991e5765-e18f-4001-8e1a-fe2d95b88671.jpg"
                  alt="Instalaciones en alta definición de Rey Barber Shop"
                  className="w-full h-[430px] sm:h-[480px] object-cover object-center img-optimized transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Subtle soft gradient at the bottom only for card readability */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />

                {/* Floating Brand Badge in top corner */}
                <div className="absolute top-4 left-4 p-2 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-teal-500/60 shadow-2xl">
                  <BrandLogo size="md" showText={false} />
                </div>

                {/* Overlay Badge Bottom */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          Abierto Hoy · 9:00 AM - 9:00 PM
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        Ambiente Climatizado & Bar Lounge
                      </p>
                      <p className="text-xs text-neutral-400">
                        Sillones ergonómicos, música lounge y toallas térmicas
                      </p>
                    </div>

                    <button
                      onClick={onOpenBooking}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all shrink-0 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
