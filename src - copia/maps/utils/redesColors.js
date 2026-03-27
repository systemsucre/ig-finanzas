

export const getColorByRedes = (regionName) => {
  const colors = {
    "PUNATA": '#FF5733',
    "VILLA TUNARI": '#33C1FF',
    "IVIRGARZAMA": '#33FF57',
    "INDEPENDENCIA": '#FFC300',
    "TAPACARI": '#8E44AD',
    "QUILLACOLLO": '#2ECC71',
    // Colores adicionales aleatorios
    "SACABA": '#FF33A8',
    "CAPINOTA": '#33FFEC',
    "TOTORA": '#FF8C33',
    "AIQUILE": '#A833FF',
    "MIZQUE": '#33FFB5',
    "TARATA": '#FF3333',
    "COCHABAMBA CERCADO": '#3375FF',
    
  };
  return colors[regionName] || '#999'; // color por defecto
};
