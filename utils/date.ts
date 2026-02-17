import { Prioridad } from '../types';

// Helper to return current date in YYYY-MM-DD format based on LOCAL time
export function getTodayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse YYYY-MM-DD as local midnight
export function parseLocalYMD(dateStr: string): Date {
  // Append T00:00 to ensure we aren't dealing with UTC midnights potentially shifting dates
  // Actually, better to split and use constructor to be 100% sure of local parts
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d); // Local midnight
}

export function calcularPrioridad(proximoSeguimiento: string): Prioridad {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const seguimiento = parseLocalYMD(proximoSeguimiento);
  
  // Compare timestamps
  const tToday = today.getTime();
  const tSeg = seguimiento.getTime();

  if (tSeg === tToday) {
    return 'Hoy';
  } else if (tSeg < tToday) {
    return 'Atrasado';
  } else {
    return 'Próximos días';
  }
}

export function formatFecha(isoString: string): string {
  if (!isoString) return '';
  // isoString is YYYY-MM-DD. 
  // We want to just display DD/MM or DD Mon without timezone shift.
  const [y, m, d] = isoString.split('-').map(Number);
  
  // Format manually or use Date with correct construction
  // Manual format is safest for visual consistency
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

export function formatFechaHora(timestamp: number): string {
  const date = new Date(timestamp);
  return `[${date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}]`;
}
