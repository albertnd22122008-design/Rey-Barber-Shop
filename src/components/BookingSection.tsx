import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Phone,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Bell,
  RefreshCw
} from 'lucide-react';
import { SERVICES, BARBERS, BARBERSHOP_INFO } from '../data/barbershopData';
import { ServiceItem, Barber, BookingFormData } from '../types';
import { useBarber } from '../context/BarberContext';
import { BrandLogo } from './BrandLogo';

interface BookingSectionProps {
  initialServiceId?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ initialServiceId }) => {
  const { currentUser, appointments, addAppointment, refreshFromSheets, isLoadingSheets } = useBarber();

  const containerRef = useRef<HTMLDivElement>(null);
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  // Step 1: Servicio, Step 2: Barbero, Fecha & Hora, Step 3: Datos de Contacto, Step 4: Confirmado
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || SERVICES[0].id);
  const [selectedBarberId, setSelectedBarberId] = useState<string>(BARBERS[0].id);

  // Synchronize appointments from Google Sheets webhook on mount
  useEffect(() => {
    refreshFromSheets();
  }, []);

  // Smooth scroll to container when changing step (eliminates excessive jumping on mobile)
  const goToStep = (step: number) => {
    if (step === 2) {
      // Refresh real-time appointments when selecting date and time
      refreshFromSheets();
    }
    setCurrentStep(step);
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({
        top: Math.max(0, topOffset),
        behavior: 'smooth'
      });
    }
  };
  
  // Date Picker Logic (generate dates for next 14 days)
  const availableDates = useMemo(() => {
    const list = [];
    const today = new Date();
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const isSunday = d.getDay() === 0;
      const formattedDate = d.toISOString().split('T')[0];
      list.push({
        fullDate: formattedDate,
        dayNumber: d.getDate(),
        dayName: daysOfWeek[d.getDay()],
        monthName: months[d.getMonth()],
        isToday: i === 0,
        isSunday,
      });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].fullDate);

  // Time Slots
  const timeSlots = [
    '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
    '12:00 PM', '01:30 PM', '02:15 PM', '03:00 PM',
    '03:45 PM', '04:30 PM', '05:15 PM', '06:00 PM',
    '06:45 PM', '07:30 PM', '08:15 PM',
  ];
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');

  const CLIENT_SAVED_INFO_KEY = 'rey_barber_saved_client_info';

  // Contact form - prefill if logged in as client or from saved localStorage info
  const [clientName, setClientName] = useState<string>(() => {
    if (currentUser?.name) return currentUser.name;
    try {
      const saved = localStorage.getItem(CLIENT_SAVED_INFO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || '';
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [clientPhone, setClientPhone] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CLIENT_SAVED_INFO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.phone || '';
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [clientNotes, setClientNotes] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [reservationCode, setReservationCode] = useState<string>('');

  // Validate phone: optional (empty is valid), but if written, must have exactly 10 clean digits
  const validatePhone = (value: string): { isValid: boolean; cleanDigits: string; errorMsg: string } => {
    const trimmed = value.trim();
    if (!trimmed) {
      return { isValid: true, cleanDigits: '', errorMsg: '' };
    }
    const cleanDigits = trimmed.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      return {
        isValid: false,
        cleanDigits,
        errorMsg: 'Ingresa un número válido de 10 dígitos o déjalo en blanco',
      };
    }
    return { isValid: true, cleanDigits, errorMsg: '' };
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setClientPhone(val);
    const trimmed = val.trim();
    if (!trimmed) {
      setPhoneError('');
    } else {
      const cleanDigits = trimmed.replace(/\D/g, '');
      if (cleanDigits.length > 0 && cleanDigits.length !== 10) {
        setPhoneError('Ingresa un número válido de 10 dígitos o déjalo en blanco');
      } else {
        setPhoneError('');
      }
    }
  };

  const handlePhoneBlur = () => {
    const trimmed = clientPhone.trim();
    if (trimmed) {
      const cleanDigits = trimmed.replace(/\D/g, '');
      if (cleanDigits.length !== 10) {
        setPhoneError('Ingresa un número válido de 10 dígitos o déjalo en blanco');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  // Update client name if user logs in or auto-save contact info
  useEffect(() => {
    if (currentUser?.name && !clientName) {
      setClientName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (clientName.trim() || clientPhone.trim()) {
      try {
        localStorage.setItem(
          CLIENT_SAVED_INFO_KEY,
          JSON.stringify({ name: clientName.trim(), phone: clientPhone.trim() })
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, [clientName, clientPhone]);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const selectedBarber = BARBERS.find((b) => b.id === selectedBarberId) || BARBERS[0];

  // Helper to check if a slot on this date was freed
  const isSlotFreed = (time: string) => {
    return appointments.some(
      (a) => a.date === selectedDate && a.time === time && a.status === 'disponible'
    );
  };

  // Helper to check if a slot on this date is booked by someone
  const getBookedAppointment = (time: string) => {
    return appointments.find(
      (a) =>
        a.date === selectedDate &&
        a.time === time &&
        (selectedBarberId === 'any-barber' || a.barberId === selectedBarberId || !a.barberId) &&
        (a.status === 'confirmada' || a.status === 'pendiente' || a.status === 'completada')
    );
  };

  // Active appointments for selected date (realtime synced)
  const activeDateAppointments = useMemo(() => {
    return appointments.filter(
      (a) => a.date === selectedDate && a.status !== 'disponible' && a.status !== 'cancelada'
    );
  }, [appointments, selectedDate]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      return;
    }

    const phoneCheck = validatePhone(clientPhone);
    if (!phoneCheck.isValid) {
      setPhoneError('Ingresa un número válido de 10 dígitos o déjalo en blanco');
      return;
    }

    const finalPhone = phoneCheck.cleanDigits ? phoneCheck.cleanDigits : 'Sin número';

    // Add to shared context and persistent localStorage
    const createdApt = addAppointment({
      clientName: clientName.trim(),
      clientPhone: finalPhone,
      serviceName: selectedService.name,
      serviceId: selectedService.id,
      servicePriceRD: selectedService.priceRD,
      durationMinutes: selectedService.durationMinutes,
      date: selectedDate,
      time: selectedTime,
      barberName: selectedBarber.name,
      barberId: selectedBarber.id,
      serviceType: 'local',
      status: 'confirmada',
      notes: clientNotes.trim() || undefined,
    });

    setReservationCode(createdApt.code);
    setIsSubmitted(true);
    setCurrentStep(4);

    // Automatically open WhatsApp with exact details to +1 (849) 247-6301
    const text = `¡Nueva Reserva en Rey Barber Shop!
Cliente: ${clientName.trim()}
Servicio: ${selectedService.name}
Fecha: ${selectedDate}
Hora: ${selectedTime}
Código: ${createdApt.code}
Teléfono: ${finalPhone}
Total: RD$ ${selectedService.priceRD.toLocaleString()}`;

    const waUrl = `https://wa.me/18492476301?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const getWhatsAppBookingLink = () => {
    const phoneCheck = validatePhone(clientPhone);
    const finalPhone = phoneCheck.cleanDigits ? phoneCheck.cleanDigits : 'Sin número';
    const text = `¡Nueva Reserva en Rey Barber Shop!
Cliente: ${clientName}
Servicio: ${selectedService.name}
Fecha: ${selectedDate}
Hora: ${selectedTime}
Código: ${reservationCode}
Teléfono: ${finalPhone}`;

    return `https://wa.me/18492476301?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="reservas" className="py-20 bg-neutral-900/60 relative border-t border-b border-neutral-800">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Sistema de Citas en Tiempo Real
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Agenda tu Experiencia en <span className="gold-gradient-text">Rey Barber Shop</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Elige el servicio, selecciona tu fecha y hora preferida, y recibe confirmación inmediata vía WhatsApp.
          </p>
        </div>

        {/* Booking Container */}
        <div ref={containerRef} className="max-w-5xl mx-auto bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden scroll-mt-24">
          {/* Progress Indicator - Mobile-Optimized Stepper / Wizard */}
          <div className="grid grid-cols-4 border-b border-neutral-800 text-center text-xs bg-neutral-900/60 sticky top-0 z-20 backdrop-blur-md">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className={`py-3.5 px-2 font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 min-h-[48px] cursor-pointer ${
                currentStep === 1
                  ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                  : currentStep > 1
                  ? 'border-emerald-500 text-emerald-400 hover:bg-neutral-800/40'
                  : 'border-transparent text-neutral-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep > 1 ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-800'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="text-[11px] sm:text-xs">Servicio</span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className={`py-3.5 px-2 font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 min-h-[48px] cursor-pointer ${
                currentStep === 2
                  ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                  : currentStep > 2
                  ? 'border-emerald-500 text-emerald-400 hover:bg-neutral-800/40'
                  : 'border-transparent text-neutral-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep > 2 ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-800'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className="text-[11px] sm:text-xs">Horario</span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className={`py-3.5 px-2 font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 min-h-[48px] cursor-pointer ${
                currentStep === 3
                  ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                  : currentStep > 3
                  ? 'border-emerald-500 text-emerald-400 hover:bg-neutral-800/40'
                  : 'border-transparent text-neutral-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep > 3 ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-800'
              }`}>
                {currentStep > 3 ? '✓' : '3'}
              </span>
              <span className="text-[11px] sm:text-xs">Datos</span>
            </button>
            <div
              className={`py-3.5 px-2 font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 min-h-[48px] ${
                currentStep === 4
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-neutral-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === 4 ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-800'
              }`}>
                4
              </span>
              <span className="text-[11px] sm:text-xs">Boleto</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* STEP 1: Selección de Servicio */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Lista de Servicios en el Local */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Selecciona el servicio que deseas en el local
                    </label>
                    <span className="text-xs text-neutral-500">
                      Precios en RD$ y USD · Experiencia en Salón
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {SERVICES.map((s) => {
                      const isSelected = selectedServiceId === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedServiceId(s.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] active:scale-[0.99] touch-manipulation select-none ${
                            isSelected
                              ? 'border-amber-400 bg-gradient-to-br from-amber-500/15 to-neutral-900 text-white shadow-md ring-1 ring-amber-400/40'
                              : 'border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700 text-neutral-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                {s.name}
                                {s.popular && (
                                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                                    Popular
                                  </span>
                                )}
                              </h3>
                              <div className="text-right">
                                <span className="text-sm font-black text-amber-400">
                                  RD$ {s.priceRD.toLocaleString()}
                                </span>
                                <span className="text-[11px] text-neutral-500 block">
                                  (${s.priceUSD} USD)
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-neutral-400 line-clamp-2">
                              {s.tagline}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800/60 text-xs text-neutral-400">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              {s.durationMinutes} minutos aprox.
                            </span>
                            <span className={`text-xs font-semibold ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`}>
                              {isSelected ? '✓ Seleccionado' : 'Elegir'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    Servicio seleccionado: <strong className="text-amber-400">{selectedService.name}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="min-h-[44px] px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                  >
                    <span>Siguiente: Barbero y Horario</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Barbero, Calendario y Horario en Tiempo Real */}
            {currentStep === 2 && (
              <div className="space-y-7">
                {/* Selector de Barbero */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Selecciona tu Barbero Preferido
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BARBERS.map((barber) => {
                      const isSelected = selectedBarberId === barber.id;
                      return (
                        <button
                          key={barber.id}
                          type="button"
                          onClick={() => setSelectedBarberId(barber.id)}
                          className={`min-h-[110px] p-3.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 touch-manipulation select-none ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/10 text-white shadow-md ring-1 ring-amber-400/30'
                              : 'border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-full mx-auto mb-2 overflow-hidden border-2 border-neutral-700 bg-neutral-800 flex items-center justify-center shrink-0">
                            {barber.id === 'any-barber' ? (
                              <User className="w-7 h-7 text-neutral-400" />
                            ) : (
                              <img
                                src={barber.avatar}
                                alt={barber.name}
                                className="w-full h-full object-cover img-optimized"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <div className="text-xs font-bold text-white truncate">{barber.name}</div>
                          <div className="text-[10px] text-neutral-400 truncate mt-0.5">{barber.role}</div>
                          <div className="mt-1 text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Disponible
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendario Interactivo de Fecha */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Selecciona la Fecha de tu Cita
                    </label>
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      Próximos 14 días disponibles
                    </span>
                  </div>

                  {/* Horizontal Scrollable Date Carousel */}
                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none touch-scroll overscroll-x-contain py-1">
                    {availableDates.map((item) => {
                      const isSelected = selectedDate === item.fullDate;
                      return (
                        <button
                          key={item.fullDate}
                          type="button"
                          onClick={() => {
                            setSelectedDate(item.fullDate);
                            // Smooth scroll subtly to the time slots if on mobile
                            if (window.innerWidth < 640 && timeSlotsRef.current) {
                              timeSlotsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }}
                          className={`flex-shrink-0 w-20 min-h-[78px] py-3 px-2 rounded-xl border text-center transition-all cursor-pointer active:scale-95 touch-manipulation select-none ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                              : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/80'
                          }`}
                        >
                          <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                            {item.dayName}
                          </div>
                          <div className="text-lg font-black my-0.5">
                            {item.dayNumber}
                          </div>
                          <div className="text-[10px] uppercase opacity-75">
                            {item.monthName}
                          </div>
                          <div className={`mt-1 text-[8px] font-bold rounded px-1 py-0.5 ${
                            isSelected ? 'bg-neutral-950/20 text-neutral-950' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            Disponible
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selector de Horarios en Tiempo Real */}
                <div ref={timeSlotsRef} className="scroll-mt-28">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Selecciona la Hora
                    </label>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Turnos disponibles en tiempo real
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      const freed = isSlotFreed(time);
                      const bookedApt = getBookedAppointment(time);
                      const isBooked = !!bookedApt;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`min-h-[52px] py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col items-center justify-center gap-1 active:scale-95 touch-manipulation select-none ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500 text-neutral-950 shadow-md ring-2 ring-amber-400/40'
                              : isBooked
                              ? 'border-amber-600/50 bg-amber-950/30 text-amber-200 hover:border-amber-500'
                              : freed
                              ? 'border-teal-500 bg-teal-950/40 text-teal-200 hover:border-teal-400'
                              : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700 hover:text-white'
                          }`}
                        >
                          <span className={`text-xs font-extrabold ${isSelected ? 'text-neutral-950' : 'text-white'}`}>
                            {time}
                          </span>
                          <span
                            className={`text-[9px] font-bold flex items-center gap-1 ${
                              isSelected
                                ? 'text-neutral-950/90'
                                : isBooked
                                ? 'text-amber-400'
                                : freed
                                ? 'text-teal-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected
                                  ? 'bg-neutral-950'
                                  : isBooked
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400 animate-pulse'
                              }`}
                            />
                            {isBooked ? 'Reservado' : freed ? '¡Cupo Libre!' : 'Disponible'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Indicador destacado de confirmación de disponibilidad / ocupación */}
                  {(() => {
                    const bookedForSelectedTime = getBookedAppointment(selectedTime);
                    if (bookedForSelectedTime) {
                      return (
                        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/80 via-neutral-900 to-neutral-900 border border-amber-500/50 flex items-center justify-between gap-3 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                              <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  Turno Ocupado / Reservado
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                                  Reservado
                                </span>
                              </div>
                              <p className="text-neutral-300 text-xs mt-0.5">
                                El turno de las <strong className="text-amber-400 font-extrabold">{selectedTime}</strong> para el <strong className="text-white">{selectedDate}</strong> ya fue reservado. Por favor elige otro horario libre.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-neutral-900 to-neutral-900 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">
                                ¡Sí está disponible a esa hora!
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                                Confirmado
                              </span>
                            </div>
                            <p className="text-neutral-300 text-xs mt-0.5">
                              El turno de las <strong className="text-emerald-400 font-extrabold">{selectedTime}</strong> para el <strong className="text-white">{selectedDate}</strong> con <strong className="text-amber-400">{selectedBarber.name}</strong> está 100% disponible.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Resumen del paso */}
                <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-neutral-500">Servicio:</span>{' '}
                    <strong className="text-white">{selectedService.name}</strong>
                    <span className="mx-2 text-neutral-700">·</span>
                    <span className="text-neutral-500">Barbero:</span>{' '}
                    <strong className="text-amber-400">{selectedBarber.name}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">Fecha y Hora:</span>{' '}
                    <strong className="text-white">{selectedDate} a las {selectedTime}</strong>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Sí está disponible a esa hora
                    </span>
                  </div>
                </div>

                {/* Nav Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800 gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-850 text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a Servicios</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="min-h-[44px] px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                  >
                    <span>Siguiente: Tus Datos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Datos de Contacto y Confirmación */}
            {currentStep === 3 && (
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Completa tus Datos para la Reserva
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Te enviaremos los detalles y recordatorio de tu cita directamente por WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Marcos Almonte"
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-base focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-neutral-300">
                        Teléfono / WhatsApp <span className="text-neutral-400 font-normal">(Opcional)</span>
                      </label>
                      <span className="text-[11px] text-neutral-400 font-normal">10 dígitos</span>
                    </div>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      placeholder="Ej: 8495242279 (opcional)"
                      className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg bg-neutral-900 border ${
                        phoneError ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-amber-400'
                      } text-white placeholder-neutral-500 text-base focus:outline-none transition-colors`}
                    />
                    {phoneError ? (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{phoneError}</span>
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-neutral-400">
                        Opcional: Si lo ingresas, debe tener 10 dígitos (ej: 8495242279). Si lo dejas en blanco, se guardará como &ldquo;Sin número&rdquo;.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Instrucciones Especiales o Notas (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Ej: Prefiero degradado con razor fade número cero, cejas con navaja..."
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-base focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Resumen del Pedido / Boleto Previo */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BrandLogo size="sm" showText={false} />
                    <div>
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        Resumen de tu Cita
                      </div>
                      <div className="text-sm font-black text-white mt-0.5">
                        {selectedService.name}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>{selectedDate} · {selectedTime} · con {selectedBarber.name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          ✓ Sí está disponible a esa hora
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-neutral-800 sm:pl-6">
                    <div className="text-xs text-neutral-400">Total a Pagar</div>
                    <div className="text-lg font-black text-amber-400">
                      RD$ {selectedService.priceRD.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      (~${selectedService.priceUSD} USD)
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800 gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-850 text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a Horario</span>
                  </button>

                  <button
                    type="submit"
                    className="min-h-[44px] px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-500/25 active:scale-95 transition-transform"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Reservación</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Confirmación Exitosa / Boleto Digital */}
            {currentStep === 4 && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-black text-white">
                    ¡Cita Agendada con Éxito!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                    Tu código de reservación es <strong className="text-amber-400 font-mono text-base">{reservationCode}</strong>.
                    Hemos guardado tu espacio en tiempo real.
                  </p>
                </div>

                {/* Digital Ticket */}
                <div className="max-w-md mx-auto bg-neutral-900 border border-amber-500/40 rounded-2xl p-6 text-left shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1 barber-pole-stripes" />
                  
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <BrandLogo size="md" showText={false} />
                      <div>
                        <div className="font-display font-bold text-amber-400 text-sm tracking-wider">
                          REY BARBER SHOP
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          Pase Oficial de Reserva
                        </div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                      {reservationCode}
                    </div>
                  </div>

                  <div className="py-4 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Cliente:</span>
                      <span className="font-semibold text-white">{clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Teléfono:</span>
                      <span className="font-semibold text-white">
                        {clientPhone.trim() ? (clientPhone.replace(/\D/g, '') || clientPhone.trim()) : 'Sin número'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Servicio:</span>
                      <span className="font-semibold text-white">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Ubicación:</span>
                      <span className="font-semibold text-emerald-400">
                        🏢 Salón Rey Barber Shop (C. Marcelino Pérez 75)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Barbero:</span>
                      <span className="font-semibold text-amber-300">{selectedBarber.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Fecha y Hora:</span>
                      <div className="text-right">
                        <span className="font-semibold text-white block">{selectedDate} · {selectedTime}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full mt-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          ✓ Sí está disponible a esa hora
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm">
                      <span className="text-neutral-400 font-bold">Total:</span>
                      <span className="font-black text-amber-400">
                        RD$ {selectedService.priceRD.toLocaleString()} (~${selectedService.priceUSD} USD)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Te esperamos con puntualidad. Cancelación sin costo hasta 2 hrs antes.</span>
                  </div>
                </div>

                {/* Direct Action: Send to WhatsApp */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <a
                    href={getWhatsAppBookingLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95 touch-manipulation select-none"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Enviar Detalles por WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      goToStep(1);
                      setIsSubmitted(false);
                      setClientNotes('');
                    }}
                    className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-850 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
                  >
                    Agendar Otra Cita
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
