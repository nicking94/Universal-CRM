import { ClienteConPrioridad } from '../types';
import { formatFecha } from '../utils/date';
import { Layers, Calendar, ChevronRight, Phone } from 'lucide-react';
import Link from 'next/link';
import { getStatusColor, stringToColor } from '../utils/colors';

interface ClientCardProps {
  cliente: ClienteConPrioridad;
}

export default function ClientCard({ cliente }: ClientCardProps) {
  const badgeClass = `badge badge-${cliente.prioridadCalculada.toLowerCase().replace('ó', 'o').replace(' ', '-')}`;
  
  const statusColor = getStatusColor(cliente.etapa);
  const clientGeneratedColor = stringToColor(cliente.nombre || cliente.rubro || 'Sin Nombre');
  const cardBorderColor = statusColor || clientGeneratedColor;
  
  // If no name, the user said orange
  const isAnonymous = !cliente.nombre || cliente.nombre.toLowerCase().includes('cliente');
  const finalBorderColor = isAnonymous ? '#e67e22' : cardBorderColor;

  return (
    <Link href={`/cliente/${cliente.id}`}>
      <div className="card" style={{ 
        borderLeft: `5px solid ${finalBorderColor}`,
        background: statusColor ? `${statusColor}15` : 'var(--white)' // Light tint if won/lost
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', fontWeight: 700 }}>{cliente.nombre || 'Sin nombre'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={14} /> {cliente.rubro}
              </p>
              {cliente.telefono && (
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> {cliente.telefono}
                </p>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '8px', color: statusColor || 'var(--text-dark)' }}>
              {cliente.etapa}
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
          <ChevronRight size={20} color={finalBorderColor} />
        </div>
      </div>
    </Link>
  );
}
