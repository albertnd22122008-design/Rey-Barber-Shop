import React, { useState } from 'react';
import { Star, ThumbsUp, Heart, MessageSquare, CheckCircle, ShieldCheck, PenSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GOOGLE_REVIEWS, BARBERSHOP_INFO } from '../data/barbershopData';
import { GoogleReview } from '../types';
import { ReviewModal } from './ReviewModal';
import { BrandLogo } from './BrandLogo';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<GoogleReview[]>(GOOGLE_REVIEWS);
  const [sortBy, setSortBy] = useState<'relevantes' | 'recientes' | 'alta' | 'baja'>('relevantes');
  const [userLikes, setUserLikes] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sorting logic
  const sortedReviews = [...reviewsList].sort((a, b) => {
    if (sortBy === 'alta') {
      return b.rating - a.rating;
    }
    if (sortBy === 'baja') {
      return a.rating - b.rating;
    }
    if (sortBy === 'recientes') {
      return a.id.localeCompare(b.id);
    }
    // 'relevantes': default order
    const scoreA = (a.isLocalGuide ? 2 : 0) + (a.ownerReply ? 2 : 0) + (a.likesCount || 0);
    const scoreB = (b.isLocalGuide ? 2 : 0) + (b.ownerReply ? 2 : 0) + (b.likesCount || 0);
    return scoreB - scoreA;
  });

  const handleLike = (reviewId: string) => {
    setUserLikes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const handleAddReview = (newRev: GoogleReview) => {
    setReviewsList([newRev, ...reviewsList]);
  };

  // Google star rating breakdown math
  const starCounts = {
    5: reviewsList.filter((r) => r.rating === 5).length,
    4: reviewsList.filter((r) => r.rating === 4).length,
    3: reviewsList.filter((r) => r.rating === 3).length,
    2: reviewsList.filter((r) => r.rating === 2).length,
    1: reviewsList.filter((r) => r.rating === 1).length,
  };
  const totalReviews = reviewsList.length;

  return (
    <section id="opiniones" className="py-24 bg-neutral-900/60 border-t border-neutral-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title con Revelación Suave */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
            Opiniones de Google
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-400">
            Resumen auténtico de valoraciones en Google Maps para <strong className="text-white">Rey Barber Shop</strong>.
          </p>
        </motion.div>

        {/* Google Reviews Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="card-luxury max-w-4xl mx-auto bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Big Rating Number */}
            <div className="md:col-span-5 text-center md:text-left flex flex-col items-center md:items-start justify-center border-b md:border-b-0 md:border-r border-neutral-800 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center gap-2 mb-1.5">
                <BrandLogo size="sm" showText={false} />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Rey Barber Shop · Google Reviews
                </span>
              </div>
              <div className="flex items-baseline gap-3 my-1">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  4.7
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                    <div className="relative">
                      <Star className="w-5 h-5 text-amber-400" />
                      <div className="absolute inset-0 overflow-hidden w-[70%]">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 mt-1">
                    ({totalReviews} opiniones verificadas)
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Basado en clientes locales, guías verificados y visitantes.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-5 w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Escribir una Opinión</span>
              </button>
            </div>

            {/* Bars */}
            <div className="md:col-span-7 space-y-2 text-xs">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star as keyof typeof starCounts];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-3 font-semibold text-neutral-300">{star}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                    <div className="flex-1 h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-neutral-500 tabular-nums">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Sorting Bar */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-neutral-800 gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">Ordenar por:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(
                [
                  { id: 'relevantes', label: 'Más relevantes' },
                  { id: 'recientes', label: 'Más recientes' },
                  { id: 'alta', label: 'Más alta' },
                  { id: 'baja', label: 'Más baja' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                    sortBy === s.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-neutral-500">
            Mostrando {sortedReviews.length} reseñas públicas
          </div>
        </div>

        {/* Reviews List con Carga Escalonada & Card Luxury Hover */}
        <div className="max-w-4xl mx-auto space-y-5">
          <AnimatePresence mode="popLayout">
            {sortedReviews.map((rev, idx) => {
              const extraLikes = userLikes[rev.id] || 0;
              const currentLikes = (rev.likesCount || 0) + extraLikes;

              return (
                <motion.div
                  key={rev.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, delay: (idx % 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="card-luxury p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-200 cursor-default"
                >
                  {/* Author row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar circle with initial */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-neutral-800 text-white font-bold flex items-center justify-center text-sm shadow-md uppercase">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {rev.author}
                          </h4>
                          {rev.isLocalGuide && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              Local Guide
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {rev.guideStats ? rev.guideStats : 'Cliente verificado'}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] text-neutral-500 shrink-0">
                      {rev.timeAgo}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 my-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Body */}
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {rev.content}
                  </p>

                  {/* Interactive Like / Reaction */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-900 text-xs">
                    <button
                      onClick={() => handleLike(rev.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer active:scale-95 ${
                        extraLikes > 0
                          ? 'text-amber-400 bg-amber-500/10 font-bold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${extraLikes > 0 ? 'fill-amber-400' : ''}`} />
                      <span>Útil ({currentLikes})</span>
                    </button>

                    <span className="text-neutral-600">·</span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      Visita presencial verificada
                    </span>
                  </div>

                  {/* Owner Response if present */}
                  {rev.ownerReply && (
                    <div className="mt-4 p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <BrandLogo size="sm" showText={false} />
                        <span>Respuesta de Rey Barber Shop (Dueño)</span>
                      </div>
                      <p className="text-neutral-400 text-xs pl-6">
                        &ldquo;{rev.ownerReply.content}&rdquo;
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReview={handleAddReview}
      />
    </section>
  );
};
