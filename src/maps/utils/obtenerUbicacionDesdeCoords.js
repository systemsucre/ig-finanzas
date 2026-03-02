export async function obtenerUbicacionDesdeCoords(lat, lng) {

    const res = await fetch(`http://localhost:3005/api/reverse-geocode?lat=${lat}&lon=${lng}`)
        .catch(e => {
            alert('Error Al procesar el punto')
        });

    // 1: INFORMACION GENERAL
    // 2: INFORMACION ESPECIFICO
    if (res.ok) {
        const data = await res?.json();
        const general = data[0]
        const especifico = data[1]

        return {
            general: {
                país: general.address?.country,
                departamento: general.address?.state || general.address?.region,
                ciudad: general.address?.city || general.address?.town || general.address?.village,
                latitud: lat,
                longitud: lng
            },
            especifico
        }
    } else {
        alert('Informacion no encontrada...');
        return [
            {},
            {}
        ]
    }
}
