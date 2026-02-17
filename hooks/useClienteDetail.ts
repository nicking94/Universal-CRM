import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Nota } from '../types';
import { calcularPrioridad } from '../utils/date';

export function useClienteDetail(id: number) {
  const cliente = useLiveQuery(async () => {
    const c = await db.clientes.get(id);
    if (!c) return null;
    return {
      ...c,
      prioridadCalculada: calcularPrioridad(c.proximoSeguimiento)
    };
  }, [id]);

  const notas = useLiveQuery(async () => {
    return await db.notas
      .where('clienteId')
      .equals(id)
      .reverse()
      .sortBy('fecha');
  }, [id]);

  const addNota = async (contenido: string) => {
    if (!contenido.trim()) return;
    return await db.notas.add({
      clienteId: id,
      fecha: Date.now(),
      contenido
    });
  };

  return {
    cliente,
    notas,
    addNota
  };
}
