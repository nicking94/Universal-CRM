'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCRM } from '../../hooks/useCRM';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTodayISO } from '../../utils/date';

export default function NewClient() {
  const router = useRouter();
  const { addCliente, rubros } = useCRM();
  const [nombre, setNombre] = useState('');
  const [rubro, setRubro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !rubro) return;
    
    setLoading(true);
    try {
      const today = getTodayISO();
      await addCliente({
        nombre,
        rubro,
        etapa: 'Nuevo contacto',
        fechaPrimerContacto: today,
        proximoSeguimiento: today,
      } as any);
      
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
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
             <ArrowLeft color="white" />
          </Link>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Nuevo Cliente</h1>
        </div>
      </div>

      <main className="content">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Nombre del Cliente</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej: Juan Pérez"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Rubro</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej: Kiosco, Ferretería..."
                value={rubro}
                onChange={e => setRubro(e.target.value)}
                required
                list="rubros-list"
              />
              <datalist id="rubros-list">
                {rubros?.map(r => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
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
