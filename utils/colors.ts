export function stringToColor(str: string) {
  if (!str) return 'var(--tertiary)';
  
  // Use a hash of the string to pick a color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // High contrast colors for both light and dark modes
  const colors = [
    '#3498db', // Blue
    '#9b59b6', // Purple
    '#f1c40f', // Yellow
    '#e67e22', // Orange
    '#1abc9c', // Teal
    '#d35400', // Burnt Orange
    '#c0392b', // Deep Red
    '#8e44ad', // Deep Purple
    '#2980b9', // Strong Blue
    '#16a085', // Sea Green
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function getStatusColor(etapa: string) {
  switch (etapa) {
    case 'Ganado':
      return 'var(--won)';
    case 'Perdido':
      return 'var(--lost)';
    default:
      return null;
  }
}
