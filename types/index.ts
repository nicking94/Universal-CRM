export type Etapa = 
  | 'Nuevo contacto'
  | 'Propuesta enviada'
  | 'Demo'
  | 'Lo piensa'
  | 'Seguimiento largo'
  | 'Ganado'
  | 'Perdido';

export type Prioridad = 'Hoy' | 'Atrasado' | 'Próximos días';

export interface Cliente {
  id?: number;
  nombre: string;
  rubro: string;
  telefono?: string;
  etapa: Etapa;
  fechaPrimerContacto: string; // ISO Date
  proximoSeguimiento: string; // ISO Date
  creadoEn: number;
  actualizadoEn: number;
}

export interface Nota {
  id?: number;
  clienteId: number;
  fecha: number;
  contenido: string;
}

export interface ClienteConPrioridad extends Cliente {
  prioridadCalculada: Prioridad;
}
