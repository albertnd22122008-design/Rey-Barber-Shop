import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  Navigation,
  ChevronDown,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BARBERSHOP_INFO, FAQS } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Check if currently open based on local Dominican / system time
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 is Sunday
  const isOpenNow = currentDay === 0 ? (currentHour >= 10 && currentHour < 18) : (currentHour >= 9 && currentHour < 21);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="contacto" className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header con Revelación Suave */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 mb-3">
            <MapPin className="w-4 h-4 animate-pin-float" />
            Visítanos o Escríbenos
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ubicación, Horarios & Contacto
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Estamos ubicados en una zona accesible con parqueo disponible, climatización total y la mejor atención.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Left Column: Business Details & Schedule con Animación */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Live Status Card con Hover Elevado y Sombra Dinámica */}
            <div className="card-luxury p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                  <span className={`text-xs font-black uppercase tracking-wider ${isOpenNow ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isOpenNow ? 'Abierto Ahora' : 'Cerrado Ahora'}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 font-mono">
                  {BARBERSHOP_INFO.phone}
                </span>
              </div>

              {/* Hours List */}
              <div className="py-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Lunes a Sábado:
                  </span>
                  <span className="font-bold text-white font-mono">
                    {BARBERSHOP_INFO.schedule.weekdays}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Domingos:
                  </span>
                  <span className="font-bold text-white font-mono">
                    {BARBERSHOP_INFO.schedule.sundays}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="pt-4 border-t border-neutral-800 text-xs">
                <div className="flex items-start gap-2.5 text-neutral-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pin-float" />
                  <div>
                    <strong className="text-white block font-semibold">
                      {BARBERSHOP_INFO.name}
                    </strong>
                    <span className="text-neutral-400">
                      {BARBERSHOP_INFO.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons con Micro-interacciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-neutral-800">
                <a
                  href={`https://wa.me/${BARBERSHOP_INFO.whatsapp}?text=${encodeURIComponent('Hola Rey Barber Shop! Quisiera información o agendar una cita.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Directo</span>
                </a>

                <button
                  onClick={onOpenBooking}
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Turno</span>
                </button>
              </div>
            </div>

            {/* Parking & Services Amenities Card */}
            <div className="card-luxury p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 text-xs space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
                Comodidades del Establecimiento
              </h4>
              <div className="grid grid-cols-2 gap-2 text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Parqueo vigilado
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Aire acondicionado
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Wi-Fi de alta velocidad
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Bebidas de cortesía
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Map Interface con Revelación Suave */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="card-luxury rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900 shadow-2xl relative">
              {/* Top Bar of Map Viewer */}
              <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">Mapa & Navegación en Tiempo Real</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={BARBERSHOP_INFO.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                  <a
                    href="https://www.waze.com/ul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span>Waze</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>
              </div>

              {/* Map Canvas with Custom Barbershop Coordinates & Dark Styling */}
              <div className="relative h-[380px] bg-neutral-950 overflow-hidden">
                <iframe
                  title="Ubicación Rey Barber Shop"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?q=18.4861,-69.9312&hl=es&z=15&output=embed"
                  className="w-full h-full filter invert hue-rotate-180 brightness-90 contrast-125 opacity-85"
                />

                {/* Custom Overlay Marker Card with Official Brand Logo */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-3.5 bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-xl shadow-2xl text-xs hover:border-amber-400/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <BrandLogo size="sm" showText={false} />
                    <div>
                      <div className="font-bold text-white text-sm">Rey Barber Shop</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{BARBERSHOP_INFO.address}</div>
                      <div className="text-[10px] text-teal-400 font-semibold mt-1">
                        ★ 4.7 (13 reseñas) · Corte &amp; Afeitado
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section con Revelación Suave */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto pt-10 border-t border-neutral-800/80"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Preguntas Frecuentes
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Todo lo que necesitas saber antes de tu visita a nuestras instalaciones.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="card-luxury rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-neutral-200 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
