import React, { useState } from 'react';
import { GraduationCap, Clock, CheckCircle2, Users, Award, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { COURSES, ACADEMY_IMAGE } from '../data/barbershopData';
import { CourseItem } from '../types';
import { CourseModal } from './CourseModal';
import { BrandLogo } from './BrandLogo';

export const AcademySection: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCourseInfo = (course: CourseItem) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <section id="academia" className="py-24 bg-neutral-900/50 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 mb-3">
            <GraduationCap className="w-4 h-4" />
            Rey Barber Academy · Escuela de Alta Formación
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Aprende el Oficio Más Demandado y Rentable
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Fórmate con maestros barberos activos. Metodología 90% práctica con modelos reales, equipamiento profesional y certificación oficial para emprender tu propio negocio.
          </p>

          {/* Value points */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Certificado Oficial Incluido
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" />
              Grupos Reducidos (Máx 8 alumnos)
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Prácticas en Modelos Reales
            </span>
          </div>
        </div>

        {/* 3 Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 group"
            >
              {/* Card visual banner - clear HD rendering without dark heavy overlay */}
              <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover object-center img-optimized group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Level Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-amber-400 rounded-md shadow z-10">
                  {course.level}
                </div>

                <div className="absolute bottom-3 left-3 text-xs text-neutral-200 flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-md border border-white/10 shadow-sm z-10">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium">{course.duration}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BrandLogo size="sm" showText={false} />
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                      Certificación Oficial Rey Academy
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 mb-4">
                    {course.subtitle}
                  </p>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 mb-4">
                    <div className="text-[11px] text-neutral-400">Inversión del Taller:</div>
                    <div className="text-xl font-black text-amber-400">
                      RD$ {course.priceRD.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      ~${course.priceUSD} USD · Facilidades en 2 cuotas
                    </div>
                  </div>

                  {/* Modules highlight */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                      Temas Destacados:
                    </div>
                    {course.modules.slice(0, 3).map((mod, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA button for the course as requested */}
                <button
                  onClick={() => handleOpenCourseInfo(course)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/15 group/btn"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solicitar Información del Curso</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal */}
      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
