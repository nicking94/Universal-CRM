'use client';
import { useState, useEffect } from 'react';
import { useCRM } from '../hooks/useCRM';
import { seedDatabase } from '../lib/db';
import ClientOnly from '../components/ClientOnly';
import Header from '../components/Header';
import Stats from '../components/Stats';
import SearchInput from '../components/SearchInput';
import Filters from '../components/Filters';
import ClientCard from '../components/ClientCard';
import AlertBanner from '../components/AlertBanner';

export default function Home() {
  const { clientes, rubros, getAlerts, getTotalSeguimientos } = useCRM();
  const [filter, setFilter] = useState<'Todos' | 'Hoy' | 'Atrasados' | 'Semana'>('Todos');
  const [rubroFilter, setRubroFilter] = useState<string>('Todos');
  const [etapaFilter, setEtapaFilter] = useState<string>('Todos Etapas');
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [totalSeguimientos, setTotalSeguimientos] = useState(0);

  useEffect(() => {
    seedDatabase().then(() => {
      getTotalSeguimientos().then(setTotalSeguimientos);
    });
  }, []);

  useEffect(() => {
    const alerts = getAlerts();
    if (alerts.today > 0 || alerts.delayed > 0) {
      setShowAlert(true);
    }
  }, [clientes]);

  const filteredClientes = clientes?.filter(c => {
    // Stage/Date Filter
    if (filter === 'Hoy' && c.prioridadCalculada !== 'Hoy') return false;
    if (filter === 'Atrasados' && c.prioridadCalculada !== 'Atrasado') return false;
    if (filter === 'Semana') {
        const next = new Date(c.proximoSeguimiento);
        const soon = new Date();
        soon.setDate(soon.getDate() + 7);
        if (next > soon || next < new Date(new Date().setHours(0,0,0,0))) return false;
    }

    // Rubro Filter
    if (rubroFilter !== 'Todos' && c.rubro !== rubroFilter) return false;

    // Etapa Filter
    if (etapaFilter !== 'Todos Etapas' && c.etapa !== etapaFilter) return false;

    // Search
    if (search && !c.nombre.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  const alerts = getAlerts();

  return (
    <ClientOnly>
      <Header />

      <main className="content">
        {showAlert && (
          <AlertBanner 
            today={alerts.today} 
            delayed={alerts.delayed} 
            onClose={() => setShowAlert(false)} 
          />
        )}

        <Stats totalSeguimientos={totalSeguimientos} totalClientes={clientes?.length || 0} />

        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

        <Filters 
          filter={filter} 
          setFilter={setFilter} 
          rubroFilter={rubroFilter} 
          setRubroFilter={setRubroFilter} 
          rubros={rubros} 
          etapaFilter={etapaFilter}
          setEtapaFilter={setEtapaFilter}
        />

        <div className="client-grid" style={{ marginTop: '1rem' }}>
          {filteredClientes?.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--gray)', marginTop: '2rem', gridColumn: '1 / -1' }}>No se encontraron clientes.</p>
          )}
          {filteredClientes?.map((c) => (
            <ClientCard key={c.id} cliente={c} />
          ))}
        </div>
      </main>
    </ClientOnly>
  );
}
