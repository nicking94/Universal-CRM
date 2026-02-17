'use client';

import { CheckCircle2 } from 'lucide-react';

interface StatsProps {
  totalSeguimientos: number;
  totalClientes: number;
}

export default function Stats({ totalSeguimientos, totalClientes }: StatsProps) {
  return (
    <div className="stats-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ 
            flex: 1, 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>TOTAL SEGUIMIENTOS</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalSeguimientos}</span>
        </div>
        <div style={{ 
            flex: 1, 
            background: 'var(--secondary)', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            <CheckCircle2 size={24} />
            <div>
               <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>EN PIPELINE</span>
               <span style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'block' }}>{totalClientes}</span>
            </div>
        </div>
    </div>
  );
}
