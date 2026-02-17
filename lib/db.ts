import Dexie, { type Table } from 'dexie';
import { Cliente, Nota } from '../types';

export class CRMDatabase extends Dexie {
  clientes!: Table<Cliente>;
  notas!: Table<Nota>;

  constructor() {
    super('CRM_Whatsapp_DB');
    this.version(1).stores({
      clientes: '++id, nombre, rubro, etapa, proximoSeguimiento, actualizadoEn',
      notas: '++id, clienteId, fecha'
    });
  }
}

export const db = new CRMDatabase();

// Seed data
export async function seedDatabase() {
  // No test data
  return;
}
