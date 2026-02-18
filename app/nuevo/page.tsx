'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCRM } from '../../hooks/useCRM';
import { ArrowLeft, User, Phone, Store } from 'lucide-react';
import Link from 'next/link';
import { getTodayISO } from '../../utils/date';
import { RUBROS_PREDEFINIDOS } from '../../constants/rubros';

export default function NewClient() {
  const router = useRouter();
  const { addCliente, rubros } = useCRM();
  const [nombre, setNombre] = useState('');
  const [rubro, setRubro] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  // Mix existing rubros with predefined ones
  const allRubros = Array.from(new Set([...(rubros || []), ...RUBROS_PREDEFINIDOS]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre && !rubro) return;
    
    setLoading(true);
    try {
      const today = getTodayISO();
      await addCliente({
        nombre: nombre || 'Sin nombre',
        rubro: rubro || 'Sin rubro',
        telefono,
        etapa: 'Nuevo contacto',
        fechaPrimerContacto: today,
        proximoSeguimiento: today,
      });
      
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Error al crear cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh' }}>
      <header className="header" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
             <ArrowLeft color="white" />
          </Link>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Nuevo Cliente</h1>
        </div>
      </header>

      <main className="content">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 'bold' }}>Nombre del Cliente</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '35px', background: 'var(--white)', color: 'var(--text-dark)' }}
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
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
                  placeholder="Ej: Kiosco, Ferretería..."
                  value={rubro}
                  onChange={e => setRubro(e.target.value)}
                  list="rubros-list"
                />
              </div>
              <datalist id="rubros-list">
                {allRubros.sort().map(r => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 'bold' }}>Teléfono</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                <input 
                  type="tel" 
                  className="input-field" 
                  style={{ paddingLeft: '35px', background: 'var(--white)', color: 'var(--text-dark)' }}
                  placeholder="Ej: 1122334455"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Crear Cliente'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
