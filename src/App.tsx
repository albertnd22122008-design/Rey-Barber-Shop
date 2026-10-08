import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BookingSection } from './components/BookingSection';
import { ServicesSection } from './components/ServicesSection';
import { AcademySection } from './components/AcademySection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AuthModal } from './components/AuthModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { ClientAccountModal } from './components/ClientAccountModal';
import { BarberProvider, useBarber } from './context/BarberContext';
import { Bell, Sparkles, X, Phone, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './components/BrandLogo';

const MainApp: React.FC = () => {
  const { currentUser } = useBarber();

  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'client' | 'owner'>('client');
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [isClientAccountOpen, setIsClientAccountOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    scrollToSection('reservas');
  };

  const handleSelectServiceToBook = (serviceId: string) => {
    setBookingServiceId(serviceId);
    scrollToSection('reservas');
  };

  const handleOpenAuth = (tab: 'client' | 'owner' = 'client') => {
    setAuthDefaultTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navigation bar with official logo and 3-zone contract */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenAuth={handleOpenAuth}
        onOpenClientAccount={() => setIsClientAccountOpen(true)}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenBooking={handleOpenBooking}
          onExploreServices={() => scrollToSection('servicios')}
          onExploreCourses={() => scrollToSection('academia')}
        />

        {/* Citas y Reservas Interactivas en Tiempo Real */}
        <BookingSection
          key={bookingServiceId}
          initialServiceId={bookingServiceId}
        />

        {/* Catálogo de Servicios y Precios Exclusivos */}
        <ServicesSection onSelectServiceToBook={handleSelectServiceToBook} />

        {/* Academia / Cursos de Peluquería */}
        <AcademySection />

        {/* Galería de Trabajos Reales */}
        <GallerySection />

        {/* Google Reviews 4.7★ con 13 reseñas reales */}
        <ReviewsSection />

        {/* Ubicación, Mapa, Horarios & Contacto */}
        <ContactSection onOpenBooking={handleOpenBooking} />
      </main>

      {/* Footer */}
      <Footer onOpenOwnerLogin={() => handleOpenAuth('owner')} />

      {/* Floating WhatsApp Quick Action */}
      <FloatingWhatsApp />

      {/* Auth Modal (Cliente / Dueño) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab={authDefaultTab}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessOwnerLogin={() => setIsOwnerDashboardOpen(true)}
      />

      {/* Owner Dashboard Modal */}
      <OwnerDashboardModal
        isOpen={isOwnerDashboardOpen}
        onClose={() => setIsOwnerDashboardOpen(false)}
      />

      {/* Client Account Modal */}
      <ClientAccountModal
        isOpen={isClientAccountOpen}
        onClose={() => setIsClientAccountOpen(false)}
        onNewBookingClick={handleOpenBooking}
      />
    </div>
  );
};

export default function App() {
  return (
    <BarberProvider>
      <MainApp />
    </BarberProvider>
  );
}
