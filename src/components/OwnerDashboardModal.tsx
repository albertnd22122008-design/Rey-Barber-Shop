import React, { useState } from 'react';
import {
  X,
  LogOut,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  Phone,
  UserCheck,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useBarber, GOOGLE_SHEETS_WEBHOOK_URL } from '../context/BarberContext';
import { BrandLogo } from './BrandLogo';
import { BARBERSHOP_INFO } from '../data/barbershopData';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    logout,
    appointments,
    confirmAppointment,
    completeAppointment,
    cancelAppointment,
    deleteAppointment,
    sheetsWebhookUrl,
    setSheetsWebhookUrl,
    isLoadingSheets,
    refreshFromSheets,
  } = useBarber();

  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'confirmada' | 'pendiente' | 'disponible'>('todos');
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [sheetsSyncing, setSheetsSyncing] = useState<boolean>(false);
  const [showWebhookModal, setShowWebhookModal] = useState<boolean>(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState<string>(sheetsWebhookUrl);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setSheetsWebhookUrl(tempWebhookUrl);
    setShowWebhookModal(false);
    setAlertSuccess('¡URL de Webhook de Google Apps Script guardada con éxito! Las nuevas reservas se enviarán automáticamente.');
  };

  const handleSyncGoogleSheets = async () => {
    setSheetsSyncing(true);
    try {
      if (sheetsWebhookUrl) {
        await refreshFromSheets();
      }

      const csvContent = [
        ['Código', 'Cliente', 'Teléfono', 'Servicio', 'Precio (RD$)', 'Fecha', 'Hora', 'Barbero', 'Estado', 'Notas'].join(','),
        ...appointments.map(a => [
          a.code,
          `"${a.clientName}"`,
          `"${a.clientPhone}"`,
          `"${a.serviceName}"`,
          a.servicePriceRD,
          a.date,
          `"${a.time}"`,
          `"${a.barberName}"`,
          a.status,
          `"${a.notes || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ReyBarberShop_GoogleSheets_Citas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setAlertSuccess(
        sheetsWebhookUrl
          ? '¡Lectura y sincronización en tiempo real con Google Sheets completadas!'
          : '¡Archivo CSV exportado! Para sincronización en tiempo real, configura la URL del Webhook de Google Apps Script.'
      );
    } catch (e) {
      console.error(e);
      setAlertSuccess('Error al sincronizar con Google Sheets.');
    } finally {
      setSheetsSyncing(false);
    }
  };

  if (!isOpen || currentUser?.role !== 'owner') return null;

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = !filterDate || apt.date === filterDate;
    const matchesStatus = filterStatus === 'todos' || apt.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  // Calculate day summary metrics
  const todayApts = appointments.filter((a) => a.date === filterDate);
  const totalRevenue = todayApts
    .filter((a) => a.status === 'confirmada' || a.status === 'completada')
    .reduce((sum, a) => sum + a.servicePriceRD, 0);
  const pendingCount = todayApts.filter((a) => a.status === 'pendiente').length;
  const confirmedCount = todayApts.filter((a) => a.status === 'confirmada').length;
  const freedCount = todayApts.filter((a) => a.status === 'disponible').length;

  const handleCancelApt = (id: string) => {
    const res = cancelAppointment(id);
    setAlertSuccess(`Turno liberado con éxito (${res.freedTime}). Ahora figura como "Disponible" en tiempo real para todos los clientes.`);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-750 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-neutral-100">
        {/* Top Header of Owner Dashboard */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-teal-950/60 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Panel de Administración · Dueño
                </h3>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/30">
                  ADMINISTRADOR
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Rey Barber Shop · Tel: {BARBERSHOP_INFO.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSyncGoogleSheets}
              disabled={sheetsSyncing}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
              title="Sincronizar Citas y exportar para Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sheetsSyncing ? 'animate-spin' : ''}`} />
              <span>Sincronizar Google Sheets</span>
            </button>

            <button
              onClick={() => {
                setTempWebhookUrl(sheetsWebhookUrl);
                setShowWebhookModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Configurar URL del Webhook de Google Sheets / Apps Script"
            >
              <span>🔗 Webhook URL</span>
            </button>

            {/* Logout button as requested */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-red-950/60 border border-neutral-700 hover:border-red-700 text-neutral-300 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner if slot was freed or waitlist alert triggered */}
        {alertSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-3 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{alertSuccess}</span>
            </div>
            <button
              onClick={() => setAlertSuccess(null)}
              className="text-emerald-400 hover:text-white ml-2 text-xs font-bold"
            >
              Entendido
            </button>
          </div>
        )}

        {/* Dashboard Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Citas del Día</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {todayApts.length}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                {confirmedCount} confirmadas · {pendingCount} pendientes
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ingresos Est.</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                RD$ {totalRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                En servicios programados
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Estado Disponibilidad</span>
              </div>
              <div className="text-xl font-black text-blue-400 mt-1">
                Disponible
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                Citas abiertas a clientes
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                <span>Cupos Liberados</span>
              </div>
              <div className="text-2xl font-black text-teal-400 mt-1">
                {freedCount}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                Disponibles para reserva
              </div>
            </div>
          </div>

          {/* Section: Agenda Diaria de Citas */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-800 gap-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Agenda y Gestión de Citas</span>
                </h4>
                <p className="text-xs text-neutral-400">
                  Confirma, cancela o libera cupos con un solo clic.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Date filter */}
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />

                {/* Status filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="confirmada">Confirmadas</option>
                  <option value="disponible">Cupos Liberados</option>
                </select>
              </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length > 0 ? (
              <div className="space-y-3">
                {filteredAppointments.map((apt) => {
                  const isFreed = apt.status === 'disponible';
                  return (
                    <div
                      key={apt.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isFreed
                          ? 'bg-teal-950/20 border-teal-600/40'
                          : apt.status === 'confirmada'
                          ? 'bg-neutral-900/80 border-neutral-800'
                          : apt.status === 'pendiente'
                          ? 'bg-amber-950/20 border-amber-600/30'
                          : 'bg-neutral-900/40 border-neutral-800/60 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Time & Client details */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-14 h-14 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                              Hora
                            </span>
                            <span className="text-xs font-black text-amber-400">
                              {apt.time}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">
                                {isFreed ? '🟢 TURNO LIBERADO (DISPONIBLE)' : apt.clientName}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  apt.status === 'confirmada'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : apt.status === 'pendiente'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : apt.status === 'disponible'
                                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>

                            <div className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span>
                                Servicio: <strong className="text-neutral-200">{apt.serviceName}</strong>
                              </span>
                              <span>·</span>
                              <span>
                                Barbero: <strong className="text-amber-400">{apt.barberName}</strong>
                              </span>
                              <span>·</span>
                              <span className="text-emerald-400 font-semibold">
                                RD$ {apt.servicePriceRD.toLocaleString()}
                              </span>
                            </div>

                            {!isFreed && (
                              <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-3">
                                <span>Tel: {apt.clientPhone}</span>
                                {apt.notes && <span>Nota: "{apt.notes}"</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions for the Owner */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          {apt.status === 'pendiente' && (
                            <button
                              onClick={() => confirmAppointment(apt.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirmar</span>
                            </button>
                          )}

                          {apt.status === 'confirmada' && (
                            <button
                              onClick={() => completeAppointment(apt.id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Completar</span>
                            </button>
                          )}

                          {apt.status !== 'cancelada' && apt.status !== 'disponible' && (
                            <button
                              onClick={() => handleCancelApt(apt.id)}
                              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/80 border border-neutral-700 hover:border-red-700 text-neutral-300 hover:text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Cancela la cita y desocupa el turno para que quede Disponible"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancelar</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              deleteAppointment(apt.id);
                              setAlertSuccess(`Cita ${apt.code} eliminada de la base de datos.`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-900/60 border border-neutral-800 hover:border-red-800 text-neutral-400 hover:text-red-200 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                            title="Eliminar registro completamente"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>

                          {isFreed && (
                            <div className="text-xs text-teal-400 font-bold flex items-center gap-1 bg-teal-950/40 px-3 py-1.5 rounded-lg border border-teal-800/50">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Disponible en tiempo real</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-500 text-xs">
                No hay citas agendadas para esta fecha o filtro seleccionado.
              </div>
            )}
          </div>
        </div>

        {/* Webhook Configuration Modal */}
        {showWebhookModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-neutral-100">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <span>🔗 Configurar Webhook de Google Sheets</span>
                </h4>
                <button
                  onClick={() => setShowWebhookModal(false)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveWebhook} className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Base de Datos Google Sheets Vinculada Fija</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Esta aplicación utiliza de manera permanente y fija la base de datos de Google Apps Script. Las citas se leen (<code className="text-emerald-400 font-mono">GET</code>) y se registran (<code className="text-blue-400 font-mono">POST</code>) automáticamente en tiempo real.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-300 font-semibold">
                      Google Apps Script Webhook URL (Fija):
                    </label>
                    <button
                      type="button"
                      onClick={() => setTempWebhookUrl(GOOGLE_SHEETS_WEBHOOK_URL)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      Restablecer URL Oficial
                    </button>
                  </div>
                  <input
                    type="url"
                    value={tempWebhookUrl}
                    onChange={(e) => setTempWebhookUrl(e.target.value)}
                    placeholder={GOOGLE_SHEETS_WEBHOOK_URL}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
                  />
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-[11px] text-neutral-400 space-y-2">
                  <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                    <span>💡 Código base para Google Apps Script (doGet & doPost)</span>
                  </div>
                  <pre className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg font-mono text-[10px] text-neutral-300 overflow-x-auto max-h-36">
{`function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var appointments = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    appointments.push({
      id: r[0] || 'apt-' + i,
      code: r[1] || 'REY-' + i,
      clientName: r[2],
      clientPhone: r[3],
      serviceName: r[4],
      servicePriceRD: Number(r[5]) || 0,
      date: r[6],
      time: r[7],
      status: r[8] || 'Pendiente'
    });
  }
  return ContentService.createTextOutput(JSON.stringify(appointments))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (data.action === 'create' || data.cliente) {
    sheet.appendRow([
      data.id || ('apt-' + Date.now()),
      data.code || 'REY-APP',
      data.cliente || data.clientName || '',
      data.telefono || data.clientPhone || '',
      data.servicio || data.serviceName || '',
      data.precio || data.servicePriceRD || 0,
      data.fecha || data.date || '',
      data.hora || data.time || '',
      data.estado || data.status || 'Pendiente',
      data.fechaRegistro || new Date()
    ]);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}`}
                  </pre>
                  <p className="text-[10px] text-neutral-500">
                    En Google Sheets: ve a <strong>Extensiones &gt; Apps Script</strong>, pega este código, haz clic en <strong>Implementar &gt; Nueva implementación &gt; Aplicación web</strong> (Acceso: "Cualquiera") y copia la URL generada.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowWebhookModal(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl cursor-pointer"
                  >
                    Guardar Webhook
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
