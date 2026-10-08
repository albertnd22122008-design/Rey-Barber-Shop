import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle, Clock, Calendar, ShieldCheck, Phone, Send } from 'lucide-react';
import { CourseItem } from '../types';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';

interface CourseModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentExperience, setStudentExperience] = useState('Sin experiencia previa');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !course) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;
    setSubmitted(true);
  };

  const getWhatsAppCourseLink = () => {
    const text = `🎓 *SOLICITUD DE INFORMACIÓN - REY BARBER ACADEMY*
📚 *Curso:* ${course.title}
⏱️ *Duración:* ${course.duration}
👤 *Interesado:* ${studentName || 'Interesado'}
📱 *Teléfono:* ${studentPhone || 'No indicado'}
💡 *Nivel Actual:* ${studentExperience}
Por favor enviarme fechas de inicio, método de pago y cupos disponibles.`;

    return `https://wa.me/${BARBERSHOP_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-neutral-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3 mb-3">
            <BrandLogo size="sm" showText={false} />
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <GraduationCap className="w-4 h-4" />
              Rey Barber Academy · Formación Profesional
            </div>
          </div>
          <h3 className="text-2xl font-black text-white">
            {course.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1 rounded-md border border-neutral-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1 rounded-md border border-neutral-800">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {course.schedule}
            </span>
            <span className="font-bold text-amber-400">
              Inversión: RD$ {course.priceRD.toLocaleString()} (~${course.priceUSD} USD)
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!submitted ? (
            <>
              {/* Modules List */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Temario y Módulos Prácticos
                </h4>
                <div className="space-y-2.5">
                  {course.modules.map((mod, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 p-2.5 rounded-lg bg-neutral-950/40 border border-neutral-800">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  ¿Qué incluye la inscripción?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                  {course.includes.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="pt-4 border-t border-neutral-800 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Solicitar Información e Inscripción al Curso
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      autoCapitalize="words"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ej: David Santana"
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-base focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="Ej: 8295559876"
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-base focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Nivel de Experiencia
                    </label>
                    <select
                      value={studentExperience}
                      onChange={(e) => setStudentExperience(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-base focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                    >
                      <option value="Sin experiencia previa (Principiante)">Sin experiencia previa (Principiante)</option>
                      <option value="Conocimientos básicos de máquina">Conocimientos básicos de máquina</option>
                      <option value="Barbero en activo buscando perfeccionamiento">Barbero en activo buscando perfeccionamiento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-base focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                  >
                    <Send className="w-4 h-4" />
                    <span>Registrar Solicitud</span>
                  </button>

                  <a
                    href={getWhatsAppCourseLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[48px] px-5 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-neutral-700 transition-colors active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Preguntar por WhatsApp</span>
                  </a>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white">
                ¡Solicitud Recibida para {course.title}!
              </h4>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Gracias, <strong className="text-white">{studentName}</strong>. El coordinador de Rey Barber Academy se pondrá en contacto contigo al <strong className="text-amber-400">{studentPhone}</strong> para formalizar tu matrícula y enviarte el temario en PDF.
              </p>

              <div className="flex justify-center gap-3 pt-4">
                <a
                  href={getWhatsAppCourseLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chatear ahora por WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl hover:bg-neutral-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
