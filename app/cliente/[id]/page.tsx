'use client';
import { use, useState, useEffect } from 'react';
import { useClient, useCRM } from '../../../hooks/useCRM';
import ClientOnly from '../../../components/ClientOnly';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Send, Save, AlertCircle, Trash2, Edit2, Phone, Briefcase, User } from 'lucide-react';
import { Etapa, Prioridad } from '../../../types';
import { formatFechaHora } from '../../../utils/date';
import { getStatusColor } from '../../../utils/colors';

const ETAPAS: Etapa[] = [
  'Nuevo contacto',
  'Propuesta enviada',
  'Demo',
  'Lo piensa',
  'Seguimiento largo',
  'Ganado',
  'Perdido'
];

export default function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const clientId = parseInt(id);
  const { cliente, notas, addNota, updateClientField, deleteNota } = useClient(clientId);
  const { deleteCliente } = useCRM();
  const router = useRouter();
  
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    nombre: '',
    rubro: '',
    telefono: ''
  });

  useEffect(() => {
    if (cliente) {
      setEditValues({
        nombre: cliente.nombre,
        rubro: cliente.rubro,
        telefono: cliente.telefono || ''
      });
    }
  }, [cliente]);

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

  const handleDeleteClient = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente y todas sus notas?')) {
      await deleteCliente(clientId);
      router.push('/');
    }
  };

  const handleDeleteNote = async (notaId: number) => {
    if (window.confirm('¿Eliminar esta nota?')) {
      await deleteNota(notaId);
    }
  };

  const handleSaveEdits = async () => {
    await updateClientField('nombre', editValues.nombre);
    await updateClientField('rubro', editValues.rubro);
    await updateClientField('telefono', editValues.telefono);
    setIsEditing(false);
  };

  const statusColor = getStatusColor(cliente.etapa);
  const headerBg = statusColor || 'var(--primary)';
  const badgeColor = cliente.prioridadCalculada === 'Hoy' ? 'var(--warning)' : 
                     cliente.prioridadCalculada === 'Atrasado' ? 'var(--danger)' : 'var(--secondary)';

  return (
    <ClientOnly>
      <div style={{ background: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '100px' }}>
        {/* Header */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          background: headerBg, 
          color: 'white', 
          padding: '1rem', 
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease'
        }}>
          <Link href="/">
            <ArrowLeft color="white" />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{cliente.nombre}</h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{cliente.rubro}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
               <Edit2 size={18} />
            </button>
            <button onClick={handleDeleteClient} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
               <Trash2 size={18} />
            </button>
            <div style={{ 
              background: badgeColor, 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '0.65rem', 
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              {cliente.prioridadCalculada}
            </div>
          </div>
        </div>

        <div className="content">
          {/* Editing Area */}
          {isEditing && (
            <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold' }}>Editar Información</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 'bold' }}>Nombre</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ paddingLeft: '35px' }}
                      value={editValues.nombre}
                      onChange={(e) => setEditValues({...editValues, nombre: e.target.value})}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 'bold' }}>Rubro</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ paddingLeft: '35px' }}
                      value={editValues.rubro}
                      onChange={(e) => setEditValues({...editValues, rubro: e.target.value})}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 'bold' }}>Teléfono</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input 
                      type="tel" 
                      className="input-field" 
                      style={{ paddingLeft: '35px' }}
                      value={editValues.telefono}
                      onChange={(e) => setEditValues({...editValues, telefono: e.target.value})}
                    />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleSaveEdits}>
                  <Save size={18} /> Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {/* Stage Selector */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <p className="input-label" style={{ fontWeight: 'bold' }}>Etapa actual</p>
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
                    background: cliente.etapa === etapa ? 'var(--primary)' : 'var(--white)',
                    color: cliente.etapa === etapa ? 'white' : 'var(--text-dark)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
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
                <label className="input-label" style={{ fontWeight: 'bold' }}>Primer Contacto</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={cliente.fechaPrimerContacto} 
                  onChange={(e) => updateClientField('fechaPrimerContacto', e.target.value)}
                  style={{ background: 'var(--white)', color: 'var(--text-dark)' }}
                />
              </div>
              <div>
                <label className="input-label" style={{ fontWeight: 'bold' }}>Próximo Seguimiento</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={cliente.proximoSeguimiento} 
                  onChange={(e) => updateClientField('proximoSeguimiento', e.target.value)}
                  style={{ 
                    background: 'var(--white)',
                    color: 'var(--text-dark)',
                    border: cliente.prioridadCalculada === 'Atrasado' ? '2px solid var(--danger)' : 
                            cliente.prioridadCalculada === 'Hoy' ? '2px solid var(--warning)' : '1px solid #ddd'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notes (Chat) */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Historial de Notas</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {notas?.map(nota => (
                <div key={nota.id} style={{ 
                  background: 'var(--white)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  boxShadow: 'var(--shadow)',
                  borderLeft: '4px solid var(--tertiary)',
                  position: 'relative',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                       {formatFechaHora(nota.fecha)}
                     </span>
                     <button onClick={() => handleDeleteNote(nota.id!)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>
                       <Trash2 size={14} />
                     </button>
                  </div>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-dark)' }}>{nota.contenido}</p>
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
          background: 'var(--white)', 
          padding: '1rem', 
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 100
        }}>
          <input 
            type="text" 
            placeholder="Escribe una nota..." 
            className="input-field"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            style={{ borderRadius: '25px', background: 'var(--bg-light)', color: 'var(--text-dark)' }}
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
