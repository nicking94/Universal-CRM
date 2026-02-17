import { ClienteConPrioridad } from '../types';
import { formatFecha } from '../utils/date';
import { Layers, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ClientCardProps {
  cliente: ClienteConPrioridad;
}

export default function ClientCard({ cliente }: ClientCardProps) {
  const badgeClass = `badge badge-${cliente.prioridadCalculada.toLowerCase().replace('ó', 'o').replace(' ', '-')}`;

  return (
    <Link href={`/cliente/${cliente.id}`}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', fontWeight: 600 }}>{cliente.nombre}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={14} /> {cliente.rubro} • {cliente.etapa}
            </p>
          </div>
          <span className={badgeClass}>
            {cliente.prioridadCalculada}
          </span>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> Seg: {formatFecha(cliente.proximoSeguimiento)}
          </p>
          <ChevronRight size={20} color="var(--tertiary)" />
        </div>
      </div>
    </Link>
  );
}
