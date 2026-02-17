'use client';

interface AlertBannerProps {
  today: number;
  delayed: number;
  onClose: () => void;
}

export default function AlertBanner({ today, delayed, onClose }: AlertBannerProps) {
  if (today === 0 && delayed === 0) return null;

  return (
    <div style={{ 
      background: '#eaf6ff', 
      border: '1px solid var(--tertiary)', 
      padding: '1rem', 
      borderRadius: '12px', 
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      animation: 'slideIn 0.3s ease-out'
    }}>
       <div>
          <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Seguimientos pendientes</p>
          <p style={{ fontSize: '0.85rem' }}>
            Hoy: <strong>{today}</strong> | Atrasados: <strong>{delayed}</strong>
          </p>
       </div>
       <button onClick={onClose} style={{ border: 'none', background: 'none', color: 'var(--gray)', cursor: 'pointer' }}>
         ✕
       </button>
    </div>
  );
}
