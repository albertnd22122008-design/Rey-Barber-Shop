import React from 'react';
import { Phone, MapPin, Instagram, ShieldCheck, Heart } from 'lucide-react';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenOwnerLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOwnerLogin }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Wordmark & Official Brand Logo */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="lg" showText={true} />
            <p className="text-neutral-400 leading-relaxed text-xs">
              Tu estilo en manos de profesionales. Experiencia premium en barbería masculina, cortes exclusivos y escuela técnica para barberos de élite.
            </p>
            <div className="text-[11px] text-amber-400 font-semibold">
              ★ 4.7 en Google Maps (13 Reseñas Verificadas)
            </div>
            {/* Instagram link */}
            <a
              href={`https://instagram.com/${BARBERSHOP_INFO.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-amber-400 transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>{BARBERSHOP_INFO.instagram}</span>
            </a>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#servicios" className="hover:text-amber-400 transition-colors">
                  Cortes Exclusivos &amp; Barba
                </a>
              </li>
              <li>
                <a href="#reservas" className="hover:text-amber-400 transition-colors">
                  Reservar Cita Online
                </a>
              </li>
              <li>
                <a href="#reservas" className="hover:text-amber-400 transition-colors">
                  Horarios &amp; Turnos Disponibles
                </a>
              </li>
              <li>
                <a href="#academia" className="hover:text-amber-400 transition-colors">
                  Academia &amp; Cursos
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-amber-400 transition-colors">
                  Galería de Trabajos
                </a>
              </li>
              <li>
                <a href="#opiniones" className="hover:text-amber-400 transition-colors">
                  Opiniones de Clientes
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Cursos de Barbería */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Rey Barber Academy
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#academia" className="hover:text-amber-400 transition-colors">
                  Curso Básico de Peluquería
                </a>
              </li>
              <li>
                <a href="#academia" className="hover:text-amber-400 transition-colors">
                  Curso Avanzado (Tijeras y Peinado)
                </a>
              </li>
              <li>
                <a href="#academia" className="hover:text-amber-400 transition-colors">
                  Taller de Tintado de Cejas &amp; Barba
                </a>
              </li>
              <li>
                <span className="text-neutral-500">
                  Certificaciones y Prácticas Reales
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Horarios y Contacto Oficial */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Atención al Cliente
            </h4>
            <div className="space-y-2 text-neutral-400">
              <p>Lun - Sáb: 9:00 AM - 9:00 PM</p>
              <p>Domingos: 10:00 AM - 6:00 PM</p>
              <p className="text-white font-mono flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{BARBERSHOP_INFO.phone}</span>
              </p>
              <p className="text-neutral-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{BARBERSHOP_INFO.address}</span>
              </p>
            </div>

            {/* Acceso Dueño / Admin Button as requested */}
            {onOpenOwnerLogin && (
              <div className="pt-2">
                <button
                  onClick={onOpenOwnerLogin}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-teal-800/70 hover:border-teal-500 text-teal-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Acceso Dueño / Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Rey Barber Shop. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-2">
            <span>Corte &amp; Afeitado</span>
            <span>·</span>
            <span>Santo Domingo, República Dominicana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
