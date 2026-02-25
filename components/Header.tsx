'use client';

import { Bell, UserPlus, Settings, Download, Upload, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useCRM } from '../hooks/useCRM';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const { clientes, getAlerts } = useCRM();
  const { theme, toggleTheme } = useTheme();
  const alerts = getAlerts();
  const totalAlerts = alerts.today + alerts.delayed;
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleExport = async () => {
    const { exportData } = await import('../utils/excel');
    await exportData();
    setShowMenu(false);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const { importData } = await import('../utils/excel');
        await importData(file);
      }
    };
    input.click();
    setShowMenu(false);
  };

  const delayedClients = clientes?.filter(c => c.prioridadCalculada === 'Atrasado') || [];
  const todayClients = clientes?.filter(c => c.prioridadCalculada === 'Hoy') || [];

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Universal CRM</h1>
      </div>
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        
        <button 
          onClick={toggleTheme} 
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Cambiar tema"
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowMenu(false); }} 
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <Bell size={22} />
            {totalAlerts > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: -5, 
                right: -5, 
                background: 'var(--danger)', 
                color: 'white', 
                borderRadius: '50%', 
                width: '16px', 
                height: '16px', 
                fontSize: '9px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                fontWeight: 'bold'
              }}>
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
             <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'var(--white)',
              color: 'var(--text-dark)',
              boxShadow: 'var(--shadow)',
              borderRadius: '8px',
              padding: '1rem',
              zIndex: 1000,
              minWidth: '260px',
              maxHeight: '400px',
              overflowY: 'auto',
              marginTop: '10px'
            }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--bg-light)', paddingBottom: '0.5rem' }}>Notificaciones</h3>
              
              {delayedClients.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 'bold', marginBottom: '4px' }}>ATRASADOS ({delayedClients.length})</p>
                  {delayedClients.map(c => (
                    <Link key={c.id} href={`/cliente/${c.id}`} onClick={() => setShowNotifications(false)}>
                      <div style={{ padding: '8px', borderBottom: '1px solid var(--bg-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                        {c.nombre} <span style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>- {c.rubro}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {todayClients.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 'bold', marginBottom: '4px' }}>HOY ({todayClients.length})</p>
                  {todayClients.map(c => (
                    <Link key={c.id} href={`/cliente/${c.id}`} onClick={() => setShowNotifications(false)}>
                      <div style={{ padding: '8px', borderBottom: '1px solid var(--bg-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                        {c.nombre} <span style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>- {c.rubro}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalAlerts === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--gray)', padding: '1rem', fontSize: '0.85rem' }}>No hay pendientes.</p>
              )}
            </div>
          )}
        </div>
        
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Settings size={22} />
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'var(--white)',
              color: 'var(--text-dark)',
              boxShadow: 'var(--shadow)',
              borderRadius: '8px',
              padding: '0.5rem',
              zIndex: 1000,
              minWidth: '150px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginTop: '10px'
            }}>
              <button 
                onClick={handleExport}
                className="btn-menu"
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'inherit' }}
              >
                <Download size={16} /> Exportar Excel
              </button>
              <button 
                onClick={handleImport}
                className="btn-menu"
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'inherit' }}
              >
                <Upload size={16} /> Importar Excel
              </button>
            </div>
          )}
        </div>

        <Link href="/nuevo" style={{ display: 'flex', alignItems: 'center' }}>
          <UserPlus size={22} />
        </Link>
      </div>
    </header>
  );
}
