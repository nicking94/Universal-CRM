import { Prioridad } from '../types';

export function calcularPrioridad(proximoSeguimiento: string): Prioridad {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const seguimiento = new Date(proximoSeguimiento);
  seguimiento.setHours(0, 0, 0, 0);

  if (seguimiento.getTime() === today.getTime()) {
    return 'Hoy';
  } else if (seguimiento.getTime() < today.getTime()) {
    return 'Atrasado';
  } else {
    return 'Próximos días';
  }
}

export function formatFecha(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

export function formatFechaHora(timestamp: number): string {
  const date = new Date(timestamp);
  return `[${date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}]`;
}
