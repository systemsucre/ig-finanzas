export const formatearFechaYHora = (fechaISO) => {
    if (!fechaISO) return "";

    const fecha = new Date(fechaISO);
    
    // Configuración para la fecha larga en español
    const opcionesFecha = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };

    const fechaLarga = fecha.toLocaleDateString('es-ES', opcionesFecha);
    
    // Extraer la hora si existe (asumiendo formato ISO T00:00:00)
    const tieneHora = fechaISO.includes('T');
    const hora = tieneHora ? fechaISO.split('T')[1].substring(0, 5) : null;

    return {
        fechaLarga: fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1),
        hora: hora ? `${hora} h` : ""
    };
};