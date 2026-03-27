

export const getColorByRegion = (regionName) => {
  const colors = {
    "Valles": '#FF5733',
    "Metropolitana": '#33C1FF',
    "Trópico": '#33FF57',
    "Cono Sur": '#FFC300',
    "Andina": '#8E44AD',
    "Chapare": '#2ECC71',
    "Pando": '#FFC300',
    "Beni": '#a12d2dff',
    "Santa Cruz": '#2ECC71',
  };
  return colors[regionName] || '#999'; // color por defecto
};
