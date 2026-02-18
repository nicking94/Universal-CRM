'use client';
import { Calendar, Layers, Store } from 'lucide-react';

interface FiltersProps {
  filter: 'Todos' | 'Hoy' | 'Atrasados' | 'Semana';
  setFilter: (f: 'Todos' | 'Hoy' | 'Atrasados' | 'Semana') => void;
  rubroFilter: string;
  setRubroFilter: (r: string) => void;
  rubros?: string[];
  etapaFilter?: string;
  setEtapaFilter?: (e: string) => void;
  stageCounts?: Record<string, number>;
  delayedCount?: number;
}

const ETAPAS = ['Todos Etapas', 'Nuevo contacto', 'Propuesta enviada', 'Demo', 'Lo piensa', 'Seguimiento largo', 'Ganado', 'Perdido'];

export default function Filters({ filter, setFilter, rubroFilter, setRubroFilter, rubros, etapaFilter = 'Todos Etapas', setEtapaFilter, stageCounts, delayedCount }: FiltersProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
      
      {/* Priority/Date Filters */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 500 }}>
          <Calendar size={14} /> <span>Período / Prioridad</span>
        </div>
        <div className="filters-container">
          {['Todos', 'Hoy', 'Atrasados', 'Semana'].map((f) => (
            <div 
              key={f} 
              className={`filter-chip ${filter === f ? 'active' : ''} ${f === 'Atrasados' ? 'atrasado-chip' : ''}`}
              onClick={() => setFilter(f as any)}
            >
              {f} {f === 'Atrasados' && delayedCount !== undefined && delayedCount > 0 && `(${delayedCount})`}
            </div>
          ))}
        </div>
      </div>

      {/* Stage Filters */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 500 }}>
          <Layers size={14} /> <span>Etapa</span>
        </div>
        <div className="filters-container">
          {setEtapaFilter && ETAPAS.map((e) => (
            <div 
              key={e} 
              className={`filter-chip ${etapaFilter === e ? 'active' : ''}`}
              onClick={() => setEtapaFilter(e)}
              style={{
                fontWeight: '700', // Bold stages
                ...(etapaFilter === e ? { background: 'var(--primary)', color: 'white' } : {})
              }}
            >
              {e.replace('Todos Etapas', 'Todas')} {stageCounts && stageCounts[e] !== undefined && stageCounts[e] > 0 && `(${stageCounts[e]})`}
            </div>
          ))}
        </div>
      </div>

      {/* Rubro Filters */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 500 }}>
          <Store size={14} /> <span>Rubro</span>
        </div>
        <div className="filters-container">
          <div 
            className={`filter-chip ${rubroFilter === 'Todos' ? 'active' : ''}`}
            onClick={() => setRubroFilter('Todos')}
          >
            Todos
          </div>
          {rubros?.map((r) => (
            <div 
              key={r} 
              className={`filter-chip ${rubroFilter === r ? 'active' : ''}`}
              onClick={() => setRubroFilter(r)}
            >
              {r}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
