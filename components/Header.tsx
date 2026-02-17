'use client';

import { Bell, UserPlus, Settings, Download, Upload, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useCRM } from '../hooks/useCRM';
import { useState } from 'react';
import * as XLSX from 'xlsx'; // Import here or in a helper
import { db } from '../lib/db'; // Direct access or via hook? Using helper is better.

// But wait, I can just use a simple state to show a dropdown or modal.
// Let's keep it simple: Add a "More" button that toggles a small menu.

export default function Header() {
  const { clientes, getAlerts } = useCRM();
  const alerts = getAlerts();
  const totalAlerts = alerts.today + alerts.delayed;
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleExport = async () => {
    // Dynamic import to avoid SSR issues if any, but client component involves imports normally.
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Universal CRM</h1>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowMenu(false); }} 
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', position: 'relative' }}
          >
            <Bell size={24} />
            {totalAlerts > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: -5, 
                right: -5, 
                background: 'var(--danger)', 
                color: 'white', 
                borderRadius: '50%', 
                width: '18px', 
                height: '18px', 
                fontSize: '10px', 
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
              background: 'white',
              color: 'var(--text-dark)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '1rem',
              zIndex: 1000,
              minWidth: '280px',
              maxHeight: '400px',
              overflowY: 'auto',
              marginTop: '10px'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Notificaciones</h3>
              
              {delayedClients.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 'bold', marginBottom: '4px' }}>ATRASADOS ({delayedClients.length})</p>
                  {delayedClients.map(c => (
                    <Link key={c.id} href={`/cliente/${c.id}`} onClick={() => setShowNotifications(false)}>
                      <div style={{ padding: '8px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', cursor: 'pointer' }}>
                        {c.nombre} <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>- {c.rubro}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {todayClients.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 'bold', marginBottom: '4px' }}>HOY ({todayClients.length})</p>
                  {todayClients.map(c => (
                    <Link key={c.id} href={`/cliente/${c.id}`} onClick={() => setShowNotifications(false)}>
                      <div style={{ padding: '8px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', cursor: 'pointer' }}>
                        {c.nombre} <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>- {c.rubro}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalAlerts === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--gray)', padding: '1rem' }}>No tienes seguimientos pendientes.</p>
              )}
            </div>
          )}
        </div>
        
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <Settings size={24} />
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'white',
              color: 'var(--text-dark)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  textAlign: 'left', 
                  padding: '8px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <Download size={16} /> Exportar
              </button>
              <button 
                onClick={handleImport}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  textAlign: 'left', 
                  padding: '8px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <Upload size={16} /> Importar
              </button>
            </div>
          )}
        </div>

        <Link href="/nuevo">
          <UserPlus size={24} />
        </Link>
      </div>
    </header>
  );
}
