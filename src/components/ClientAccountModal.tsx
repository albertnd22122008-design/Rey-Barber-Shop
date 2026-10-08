import React from 'react';
import { X, Calendar, Clock, Scissors, LogOut, Plus, CheckCircle2, Phone } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { BrandLogo } from './BrandLogo';
import { SERVICES, BARBERSHOP_INFO } from '../data/barbershopData';

interface ClientAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewBookingClick: () => void;
}

export const ClientAccountModal: React.FC<ClientAccountModalProps> = ({
  isOpen,
  onClose,
  onNewBookingClick,
}) => {
  const { currentUser, logout, appointments, cancelAppointment } = useBarber();

  if (!isOpen || !currentUser || currentUser.role !== 'client') return null;

  // Filter appointments for this client name (case insensitive)
  const clientAppointments = appointments.filter(
    (a) =>
      a.clientName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      currentUser.name.toLowerCase().includes(a.clientName.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-750 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative text-neutral-100">
        {/* Modal Header with Logo */}
        <div className="p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/30 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showText={false} />
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Portal de Clientes
              </div>
              <h3 className="text-xl font-black text-white">
                Bienvenido, {currentUser.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action to book new appointment */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-950 to-neutral-900 border border-amber-500/30">
            <div>
              <h4 className="text-sm font-bold text-white">
                ¿Listo para tu próximo corte o afeitado?
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Agenda tu turno con tu barbero favorito en nuestro exclusivo local.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onNewBookingClick();
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar Cita</span>
            </button>
          </div>

          {/* Client Appointments List */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Mis Citas Agendadas ({clientAppointments.length})</span>
            </h4>

            {clientAppointments.length > 0 ? (
              <div className="space-y-3">
                {clientAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">
                          {apt.serviceName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            apt.status === 'confirmada'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : apt.status === 'pendiente'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        {apt.date} a las {apt.time} · con{' '}
                        <strong className="text-amber-400">{apt.barberName}</strong>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">
                        Código: <strong className="font-mono text-neutral-300">{apt.code}</strong> · Total: RD$ {apt.servicePriceRD.toLocaleString()}
                      </div>
                    </div>

                    {apt.status !== 'cancelada' && apt.status !== 'completada' && (
                      <button
                        onClick={() => cancelAppointment(apt.id)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-red-950/60 hover:border-red-800 text-neutral-300 hover:text-red-300 text-xs font-semibold self-start sm:self-center transition-colors cursor-pointer"
                      >
                        Cancelar y Liberar Cupo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800/80 text-center text-xs text-neutral-400">
                No tienes citas activas registradas con tu nombre. ¡Haz clic en "Agendar Cita" para reservar tu primer turno!
              </div>
            )}
          </div>

          {/* Availability Info Banner for Clients */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-neutral-950 border border-emerald-500/30 shadow-lg flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Disponibilidad Directa en Tiempo Real
              </h4>
              <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                Todos los turnos del calendario están 100% disponibles para reservar inmediatamente. No requieren espera, recibes tu confirmación directa en WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
