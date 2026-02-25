'use client';
import { use, useState, useEffect } from 'react';
import { useClient, useCRM } from '../../../hooks/useCRM';
import ClientOnly from '../../../components/ClientOnly';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Send, Save, AlertCircle, Trash2, Edit2, Phone, Store, User, MessageCircle, CheckCircle } from 'lucide-react';
import { Etapa, Prioridad } from '../../../types';
import { formatFechaHora, getTodayISO } from '../../../utils/date';
import { getStatusColor } from '../../../utils/colors';
import { RUBROS_PREDEFINIDOS } from '../../../constants/rubros';

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
  const { cliente, notas, addNota, updateClientField, deleteNota, updateNota } = useClient(clientId);
  const { deleteCliente } = useCRM();
  const router = useRouter();
  
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    nombre: '',
    rubro: '',
    telefono: ''
  });

  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

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

  const handleStageChange = async (newEtapa: Etapa) => {
    if (newEtapa === cliente.etapa) return;
    const originEtapa = cliente.etapa;
    await updateClientField('etapa', newEtapa);
    await addNota(`🔄 Etapa cambiada: ${originEtapa} ➔ ${newEtapa}`);
  };

  const handleCompleteFollowUp = async () => {
    if (!completionNote.trim() || !nextFollowUpDate) {
      alert('Por favor, ingresa una nota y la próxima fecha de seguimiento.');
      return;
    }
    
    await addNota(`✅ Seguimiento completado: ${completionNote}`);
    await updateClientField('proximoSeguimiento', nextFollowUpDate);
    setShowCompletionForm(false);
    setCompletionNote('');
  };

  const handleUpdateNote = async (notaId: number) => {
    if (!editingNoteContent.trim()) return;
    await updateNota(notaId, editingNoteContent);
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  const openWhatsApp = () => {
    if (!cliente.telefono) return;
    const cleanPhone = cliente.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const statusColor = getStatusColor(cliente.etapa);
  const headerBg = statusColor || 'var(--primary)';
  const isDelayed = cliente.prioridadCalculada === 'Atrasado';
  const isToday = cliente.prioridadCalculada === 'Hoy';
  const badgeColor = isToday ? 'var(--warning)' : 
                     isDelayed ? 'var(--danger)' : 'var(--secondary)';

  return (
    <ClientOnly>
      <div style={{ 
        background: 'var(--bg-light)', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          background: headerBg, 
          color: 'white', 
          padding: '1rem 1.5rem', 
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease',
          width: '100%'
        }}>
          <Link href="/">
            <ArrowLeft color="white" />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{cliente.nombre}</h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{cliente.rubro}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            {cliente.telefono && (
              <button onClick={openWhatsApp} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <MessageCircle size={20} />
              </button>
            )}
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

        <div className="content" style={{ paddingBottom: '100px' }}>
          {/* Contact Info Card (Quick Link) */}
          {!isEditing && cliente.telefono && (
            <div 
              className="card" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer',
                borderLeft: '5px solid #25D366', // WhatsApp Green
                animation: 'fadeIn 0.3s ease'
              }} 
              onClick={openWhatsApp}
            >
              <div style={{ background: '#25D366', padding: '8px', borderRadius: '50%', color: 'white' }}>
                <Phone size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 'bold', textTransform: 'uppercase' }}>WhatsApp</p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>{cliente.telefono}</p>
              </div>
              <MessageCircle size={20} color="#25D366" />
            </div>
          )}

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
                    <Store size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ paddingLeft: '35px', background: 'var(--white)', color: 'var(--text-dark)' }}
                      value={editValues.rubro}
                      onChange={(e) => setEditValues({...editValues, rubro: e.target.value})}
                      list="rubros-list-edit"
                    />
                    <datalist id="rubros-list-edit">
                      {RUBROS_PREDEFINIDOS.map(r => (
                        <option key={r} value={r} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 'bold' }}>Teléfono</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input 
                      type="tel" 
                      className="input-field" 
                      style={{ paddingLeft: '35px', background: 'var(--white)', color: 'var(--text-dark)' }}
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
          <div className="card">
            <p className="input-label" style={{ fontWeight: 'bold', marginBottom: '12px' }}>Etapa actual</p>
            <div style={{ 
              display: 'flex', 
              gap: '0.6rem', 
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}>
              {ETAPAS.map(etapa => (
                <button
                  key={etapa}
                  onClick={() => handleStageChange(etapa)}
                  className={`btn-stage ${cliente.etapa === etapa ? 'active' : ''}`}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '30px',
                    border: cliente.etapa === etapa ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: cliente.etapa === etapa ? 'var(--primary)' : 'var(--white)',
                    color: cliente.etapa === etapa ? 'white' : 'var(--text-dark)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: cliente.etapa === etapa ? '0 5px 15px rgba(45, 120, 185, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  {etapa}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Section */}
          {(isToday || isDelayed) && !showCompletionForm && cliente.etapa !== 'Ganado' && cliente.etapa !== 'Perdido' && (
            <div className="card" style={{ 
              background: isDelayed ? 'rgba(231, 76, 60, var(--card-tint-bg))' : 'rgba(243, 156, 18, var(--card-tint-bg))',
              borderColor: isDelayed ? 'rgba(231, 76, 60, var(--card-tint-border))' : 'rgba(243, 156, 18, var(--card-tint-border))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: isDelayed ? 'var(--danger)' : 'var(--warning)' }}>
                  {isDelayed ? '⚠️ Seguimiento Atrasado' : '📅 Seguimiento para Hoy'}
                </p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>¿Ya realizaste el contacto?</p>
              </div>
              <button 
                onClick={() => {
                  setNextFollowUpDate(getTodayISO());
                  setShowCompletionForm(true);
                }}
                className="btn" 
                style={{ 
                  background: isDelayed ? 'var(--danger)' : 'var(--warning)', 
                  color: 'white', 
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}
              >
                <CheckCircle size={16} /> Completar
              </button>
            </div>
          )}

          {showCompletionForm && (
            <div className="card" style={{ borderLeft: '5px solid var(--success)', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--success)' }}>Registrar Seguimiento</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 'bold' }}>Nota del seguimiento</label>
                  <textarea 
                    className="input-field" 
                    placeholder="¿Qué se habló? ¿Hubo algún acuerdo?"
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    rows={3}
                    style={{ background: 'var(--white)', color: 'var(--text-dark)', resize: 'none' }}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 'bold' }}>Próxima fecha de contacto</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={nextFollowUpDate} 
                    min={getTodayISO()}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    style={{ background: 'var(--white)', color: 'var(--text-dark)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1, background: 'var(--success)' }} onClick={handleCompleteFollowUp}>
                    <Save size={18} /> Guardar
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCompletionForm(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

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
              {cliente.etapa !== 'Ganado' && cliente.etapa !== 'Perdido' && (
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
              )}
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
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => {
                            setEditingNoteId(nota.id!);
                            setEditingNoteContent(nota.contenido);
                          }} 
                          style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteNote(nota.id!)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                   </div>
                   {editingNoteId === nota.id ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <textarea 
                        className="input-field"
                        value={editingNoteContent}
                        onChange={(e) => setEditingNoteContent(e.target.value)}
                        rows={3}
                        style={{ background: 'var(--bg-light)', color: 'var(--text-dark)', resize: 'none', width: '100%' }}
                       />
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <button 
                          className="btn btn-primary" 
                          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleUpdateNote(nota.id!)}
                         >
                           Guardar
                         </button>
                         <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                          onClick={() => setEditingNoteId(null)}
                         >
                           Cancelar
                         </button>
                       </div>
                     </div>
                   ) : (
                     <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-dark)' }}>{nota.contenido}</p>
                   )}
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
          width: '100%',
          display: 'flex',
          gap: '0.8rem',
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
