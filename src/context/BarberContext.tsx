import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, Appointment } from '../types';
import { INITIAL_APPOINTMENTS, BARBERSHOP_INFO } from '../data/barbershopData';

interface BarberContextType {
  currentUser: UserSession | null;
  loginAsClient: (name: string) => void;
  loginAsOwner: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  appointments: Appointment[];
  addAppointment: (newApt: Omit<Appointment, 'id' | 'code' | 'createdAt'>) => Appointment;
  confirmAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  cancelAppointment: (id: string) => { freedDate: string; freedTime: string };
  deleteAppointment: (id: string) => void;
  sheetsWebhookUrl: string;
  setSheetsWebhookUrl: (url: string) => void;
  isLoadingSheets: boolean;
  refreshFromSheets: () => Promise<void>;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'rey_barber_user_session';
const APPOINTMENTS_STORAGE_KEY = 'rey_barber_appointments_v1';
const SHEETS_WEBHOOK_KEY = 'rey_barber_sheets_webhook_url';

// URL del Webhook permanente y fija de Google Apps Script (Base de Datos Oficial)
export const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyXVBfYk1s3iEZBkR4emZS2i3qfsT1G1A_l-IMF7-kYXgNS5_Eo7XNrwB6hwz0xL273Sw/exec';
export const DEFAULT_WEBHOOK_URL = GOOGLE_SHEETS_WEBHOOK_URL;

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Persistent User Session in localStorage
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Persistent Appointments in localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Google Sheets Webhook URL permanente y fija
  const [sheetsWebhookUrl, setSheetsWebhookUrlState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SHEETS_WEBHOOK_KEY);
      // Prioridad #1 permanente: Siempre fija la URL permanente oficial y elimina URLs antiguas/temporales
      if (saved && saved.trim() && saved.includes('AKfycbyXVBfYk1s3iEZBkR4emZS2i3qfsT1G1A_l-IMF7-kYXgNS5_Eo7XNrwB6hwz0xL273Sw')) {
        return saved.trim();
      }
      localStorage.setItem(SHEETS_WEBHOOK_KEY, GOOGLE_SHEETS_WEBHOOK_URL);
      return GOOGLE_SHEETS_WEBHOOK_URL;
    } catch {
      return GOOGLE_SHEETS_WEBHOOK_URL;
    }
  });

  const setSheetsWebhookUrl = (url: string) => {
    const trimmed = url.trim();
    const targetUrl = trimmed || GOOGLE_SHEETS_WEBHOOK_URL;
    setSheetsWebhookUrlState(targetUrl);
    try {
      localStorage.setItem(SHEETS_WEBHOOK_KEY, targetUrl);
    } catch (e) {
      console.error(e);
    }
  };

  // Real-time Google Sheets Database State
  const [isLoadingSheets, setIsLoadingSheets] = useState<boolean>(false);

  // Sync with Google Sheets Webhook via GET (Lectura de reservaciones para el calendario y panel admin)
  const refreshFromSheets = async () => {
    const activeUrl = sheetsWebhookUrl || GOOGLE_SHEETS_WEBHOOK_URL;
    if (!activeUrl) return;
    setIsLoadingSheets(true);
    try {
      const res = await fetch(activeUrl, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.appointments)) {
            items = data.appointments;
          } else if (Array.isArray(data.citas)) {
            items = data.citas;
          } else if (Array.isArray(data.data)) {
            items = data.data;
          }
        }

        if (items.length > 0) {
          const normalized: Appointment[] = items.map((item, idx) => ({
            id: String(item.id || `apt-${Date.now()}-${idx}`),
            code: String(item.code || `REY-${1000 + idx}`),
            clientName: String(item.clientName || item.cliente || 'Cliente'),
            clientPhone: String(item.clientPhone || item.telefono || 'Sin número'),
            serviceName: String(item.serviceName || item.servicio || 'Corte Exclusivo & Fade'),
            serviceId: String(item.serviceId || 'corte-exclusivo'),
            servicePriceRD: Number(item.servicePriceRD || item.precio || 600),
            durationMinutes: Number(item.durationMinutes || 40),
            date: String(item.date || item.fecha || ''),
            time: String(item.time || item.hora || ''),
            barberName: String(item.barberName || item.barbero || 'Rey (Master Barber)'),
            barberId: String(item.barberId || 'rey-master'),
            serviceType: 'local',
            status: (item.status || item.estado || 'confirmada') as Appointment['status'],
            notes: item.notes || item.notas || '',
            createdAt: item.createdAt || item.fechaRegistro || new Date().toISOString(),
          }));
          setAppointments(normalized);
        }
      }
    } catch (e) {
      console.warn('Google Sheets Webhook GET request note:', e);
    } finally {
      setIsLoadingSheets(false);
    }
  };

  useEffect(() => {
    refreshFromSheets();
  }, [sheetsWebhookUrl]);

  // Helper for background POST mutations to Google Sheets Webhook (Envío de nuevas citas y actualizaciones)
  const sendToSheets = (payload: any) => {
    const activeUrl = sheetsWebhookUrl || GOOGLE_SHEETS_WEBHOOK_URL;
    if (!activeUrl) return;
    try {
      fetch(activeUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.error('Error sending POST to Google Sheets webhook:', err));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving user session', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error('Error saving appointments', e);
    }
  }, [appointments]);

  // Login as Client (Solo pide Nombre, sin correo ni contraseña)
  const loginAsClient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const session: UserSession = {
      role: 'client',
      name: trimmed,
    };
    setCurrentUser(session);
  };

  // Login as Owner (Correo: reybarbershop0808@gmail.com, Contraseña: admin2026)
  const loginAsOwner = (email: string, pass: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail === 'reybarbershop0808@gmail.com' && cleanPass === 'admin2026') {
      const session: UserSession = {
        role: 'owner',
        name: 'Rey (Dueño & Master)',
        email: cleanEmail,
      };
      setCurrentUser(session);
      return { success: true };
    }

    return {
      success: false,
      error: 'Credenciales inválidas. Correo o contraseña incorrectos.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addAppointment = (newAptData: Omit<Appointment, 'id' | 'code' | 'createdAt'>): Appointment => {
    const randomCode = `REY-${Math.floor(1000 + Math.random() * 9000)}`;
    const apt: Appointment = {
      ...newAptData,
      id: `apt-${Date.now()}`,
      code: randomCode,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [apt, ...prev]);

    // Send Real-time POST to Google Sheets Webhook
    sendToSheets({
      action: 'create',
      id: apt.id,
      code: apt.code,
      fecha: apt.date,
      hora: apt.time,
      cliente: apt.clientName,
      telefono: (apt.clientPhone && apt.clientPhone.trim() !== '') ? apt.clientPhone.trim() : 'Sin número',
      servicio: apt.serviceName,
      precio: apt.servicePriceRD,
      barbero: apt.barberName,
      estado: apt.status || 'Pendiente',
      fechaRegistro: apt.createdAt,
      appointment: apt
    });

    return apt;
  };

  const confirmAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'confirmada' } : a))
    );
    const target = appointments.find((a) => a.id === id);
    sendToSheets({
      action: 'update',
      id,
      code: target?.code,
      cliente: target?.clientName,
      fecha: target?.date,
      hora: target?.time,
      estado: 'confirmada',
      status: 'confirmada'
    });
  };

  const completeAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completada' } : a))
    );
    const target = appointments.find((a) => a.id === id);
    sendToSheets({
      action: 'update',
      id,
      code: target?.code,
      cliente: target?.clientName,
      fecha: target?.date,
      hora: target?.time,
      estado: 'completada',
      status: 'completada'
    });
  };

  // Cancelar / Desocupar turno -> Se marca automáticamente como 'disponible' en tiempo real
  const cancelAppointment = (id: string) => {
    const targetApt = appointments.find((a) => a.id === id);
    const date = targetApt?.date || new Date().toISOString().split('T')[0];
    const time = targetApt?.time || '10:30 AM';

    // Mark slot as disponible
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'disponible' as const } : a))
    );

    sendToSheets({
      action: 'update',
      id,
      code: targetApt?.code,
      cliente: targetApt?.clientName,
      fecha: date,
      hora: time,
      estado: 'disponible',
      status: 'disponible'
    });

    return {
      freedDate: date,
      freedTime: time,
    };
  };

  const deleteAppointment = (id: string) => {
    const target = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    sendToSheets({
      action: 'delete',
      id,
      code: target?.code,
      cliente: target?.clientName
    });
  };

  return (
    <BarberContext.Provider
      value={{
        currentUser,
        loginAsClient,
        loginAsOwner,
        logout,
        appointments,
        addAppointment,
        confirmAppointment,
        completeAppointment,
        cancelAppointment,
        deleteAppointment,
        sheetsWebhookUrl,
        setSheetsWebhookUrl,
        isLoadingSheets,
        refreshFromSheets,
      }}
    >
      {children}
    </BarberContext.Provider>
  );
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error('useBarber must be used within a BarberProvider');
  }
  return context;
};
