'use client';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="input-group" style={{ position: 'relative' }}>
      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
      <input 
        type="text" 
        className="input-field" 
        placeholder="Buscar cliente..." 
        style={{ paddingLeft: '40px' }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
