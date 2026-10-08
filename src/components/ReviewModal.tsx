import React, { useState } from 'react';
import { X, Star, CheckCircle, Send } from 'lucide-react';
import { GoogleReview } from '../types';
import { BrandLogo } from './BrandLogo';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (newReview: GoogleReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitReview }) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isLocalGuide, setIsLocalGuide] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    const review: GoogleReview = {
      id: `user-rev-${Date.now()}`,
      author: author.trim(),
      isLocalGuide,
      guideStats: isLocalGuide ? 'Local Guide · 12 opiniones' : '1 opinión',
      rating,
      timeAgo: 'Recién publicado',
      content: content.trim(),
      likesCount: 0,
    };

    onSubmitReview(review);
    setSubmitted(true);
  };

  const handleFinish = () => {
    setSubmitted(false);
    setAuthor('');
    setContent('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo size="sm" showText={false} />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Google Reseñas · Rey Barber Shop
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Escribe tu Opinión
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star rating selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Calificación *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-600 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-amber-400">
                    {rating} de 5 estrellas
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ej: Manuel Castillo"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="guideCheck"
                  checked={isLocalGuide}
                  onChange={(e) => setIsLocalGuide(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="guideCheck" className="text-xs text-neutral-300 cursor-pointer">
                  Soy Google Local Guide
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Tu Reseña *
                </label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe la calidad del corte, la puntualidad, el ambiente y la atención..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publicar Reseña
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">
              ¡Muchas gracias por tu reseña!
            </h4>
            <p className="text-xs text-neutral-400">
              Tu opinión ha sido añadida a la lista de Google Reviews de Rey Barber Shop.
            </p>
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-md"
            >
              Aceptar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
