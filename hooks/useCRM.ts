import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Cliente, ClienteConPrioridad, Etapa, Prioridad } from '../types';
import { calcularPrioridad } from '../utils/date';

export function useCRM() {
  const clientes = useLiveQuery(async () => {
    const all = await db.clientes.toArray();
    return all.map(c => ({
      ...c,
      prioridadCalculada: calcularPrioridad(c.proximoSeguimiento)
    })) as ClienteConPrioridad[];
  });

  const rubros = useLiveQuery(async () => {
    const all = await db.clientes.toArray();
    const uniqueRubros = Array.from(new Set(all.map(c => c.rubro).filter(Boolean)));
    return uniqueRubros;
  });

  const addCliente = async (cliente: Omit<Cliente, 'id' | 'creadoEn' | 'actualizadoEn'>) => {
    return await db.clientes.add({
      ...cliente,
      creadoEn: Date.now(),
      actualizadoEn: Date.now()
    });
  };

  const updateEtapa = async (id: number, etapa: Etapa) => {
    return await db.clientes.update(id, { etapa, actualizadoEn: Date.now() });
  };

  const updateSeguimiento = async (id: number, proximoSeguimiento: string) => {
    return await db.clientes.update(id, { proximoSeguimiento, actualizadoEn: Date.now() });
  };

  const getAlerts = () => {
    if (!clientes) return { today: 0, delayed: 0 };
    const today = clientes.filter(c => c.prioridadCalculada === 'Hoy').length;
    const delayed = clientes.filter(c => c.prioridadCalculada === 'Atrasado').length;
    return { today, delayed };
  };

  const getTotalSeguimientos = async () => {
    return await db.notas.count();
  };

  const deleteCliente = async (id: number) => {
    await db.notas.where('clienteId').equals(id).delete();
    return await db.clientes.delete(id);
  };

  return {
    clientes,
    rubros,
    addCliente,
    updateEtapa,
    updateSeguimiento,
    getAlerts,
    getTotalSeguimientos,
    deleteCliente
  };
}

export function useClient(id: number) {
  const cliente = useLiveQuery(async () => {
    const c = await db.clientes.get(id);
    if (!c) return undefined;
    
    return {
      ...c,
      prioridadCalculada: calcularPrioridad(c.proximoSeguimiento)
    } as ClienteConPrioridad;
  }, [id]);

  const notas = useLiveQuery(async () => {
    return await db.notas.where('clienteId').equals(id).reverse().sortBy('fecha');
  }, [id]);

  const addNota = async (contenido: string) => {
    return await db.notas.add({
      clienteId: id,
      fecha: Date.now(),
      contenido
    });
  };

  const deleteNota = async (notaId: number) => {
    return await db.notas.delete(notaId);
  };

  const updateClientField = async (field: keyof Cliente, value: any) => {
    return await db.clientes.update(id, { [field]: value, actualizadoEn: Date.now() });
  };

  return {
    cliente,
    notas,
    addNota,
    updateClientField,
    deleteNota
  };
}
