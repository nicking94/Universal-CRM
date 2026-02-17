'use client';

import { use, useState } from 'react';
import { useClient } from '../../../hooks/useCRM';
import ClientOnly from '../../../components/ClientOnly';
import Link from 'next/link';
import { ArrowLeft, Calendar, Send, Save, AlertCircle } from 'lucide-react';
import { Etapa, Prioridad } from '../../../types';
import { formatFechaHora } from '../../../utils/date';

const ETAPAS: Etapa[] = [
  'Nuevo contacto',
  'Propuesta enviada',
  'Demo',
  'Lo piensa',
  'Seguimiento largo',
  'Ganado',
  'Perdido'
];

const PRIORIDADES_MAP: Record<Prioridad, string> = {
  'Hoy': 'var(--danger)',
  'Atrasado': 'var(--danger)',
  'Próximos días': 'var(--secondary)'
};

export default function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const clientId = parseInt(id);
  const { cliente, notas, addNota, updateClientField } = useClient(clientId);
  const [newNote, setNewNote] = useState('');

  if (!cliente) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Cargando cliente...</p>
      <Link href="/" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'block' }}>Volver</Link>
    </div>
  );

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addNota(newNote);
    setNewNote('');
  };

  const badgeColor = cliente.prioridadCalculada === 'Hoy' ? 'var(--warning)' : 
                     cliente.prioridadCalculada === 'Atrasado' ? 'var(--danger)' : 'var(--secondary)';

  return (
    <ClientOnly>
      <div style={{ background: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          background: 'var(--primary)', 
          color: 'white', 
          padding: '1rem', 
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Link href="/">
            <ArrowLeft color="white" />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{cliente.nombre}</h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{cliente.rubro}</p>
          </div>
          <div style={{ 
            background: badgeColor, 
            padding: '4px 8px', 
            borderRadius: '12px', 
            fontSize: '0.7rem', 
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {cliente.prioridadCalculada}
          </div>
        </div>

        <div className="content">
          {/* Stage Selector */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <p className="input-label">Etapa actual</p>
            <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '0.5rem' }}>
              {ETAPAS.map(etapa => (
                <button
                  key={etapa}
                  onClick={() => updateClientField('etapa', etapa)}
                  className={`btn-stage ${cliente.etapa === etapa ? 'active' : ''}`}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: cliente.etapa === etapa ? '2px solid var(--primary)' : '1px solid #ddd',
                    background: cliente.etapa === etapa ? 'var(--primary)' : 'white',
                    color: cliente.etapa === etapa ? 'white' : 'var(--text-dark)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {etapa}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Primer Contacto</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={cliente.fechaPrimerContacto} 
                  onChange={(e) => updateClientField('fechaPrimerContacto', e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Próximo Seguimiento</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={cliente.proximoSeguimiento} 
                  onChange={(e) => updateClientField('proximoSeguimiento', e.target.value)}
                  style={{ 
                    border: cliente.prioridadCalculada === 'Atrasado' ? '2px solid var(--danger)' : 
                            cliente.prioridadCalculada === 'Hoy' ? '2px solid var(--warning)' : '1px solid #ddd'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notes (Chat) */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--gray)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Historial</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notas?.map(nota => (
                <div key={nota.id} style={{ 
                  background: 'white', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  borderLeft: '4px solid var(--tertiary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                       {formatFechaHora(nota.fecha)}
                     </span>
                  </div>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{nota.contenido}</p>
                </div>
              ))}
              {notas?.length === 0 && <p style={{ color: 'var(--gray)', textAlign: 'center', fontSize: '0.9rem' }}>No hay notas aún.</p>}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: 'white', 
          padding: '1rem', 
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <input 
            type="text" 
            placeholder="Agregar nota..." 
            className="input-field"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            style={{ borderRadius: '25px' }}
          />
          <button 
            onClick={handleAddNote}
            className="btn btn-primary" 
            style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </ClientOnly>
  );
}
