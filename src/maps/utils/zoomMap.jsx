import { GeoJSON, Marker, useMap, useMapEvents } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png'; // o tu propio ícono

import L from 'leaflet';

import { useEffect, useState, useRef } from 'react';



function getSVGIcon(zoom, tipo) {
    let size
    if (zoom > 19) size = 20
    if (zoom < 19) size = 12
    if (zoom < 15) size = 10
    if (zoom < 13) size = 7
    if (zoom < 11) size = 4.5
    if (zoom < 9) size = 4
    if (zoom < 7) size = 3
    if (zoom < 5) size = 2.5
    if (zoom < 3) size = 2

    // console.log(zoom, ' zoom actual , tamaño: ', size)

    let svg;
    if (tipo >= 1 && tipo <= 2) {
        svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#05b021ff" stroke="#fff" stroke-width="5"/>
        </svg>
        `;
    } else if (tipo >= 3 && tipo <= 4) {
        svg = `
          <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#ccff02ff" stroke="#fff" stroke-width="5"/>
        </svg>
        `;

    } else if (tipo >= 5 && tipo <= 6) {
        svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#ff0202ff" stroke="#fff" stroke-width="5"/>
        </svg>
        `;

    }
    else {
        // Fallback genérico
        svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#02eeffff" stroke="#fff" stroke-width="5"/>
        </svg>
        `;

    }
    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

function getSVGIconEntoRed(zoom) {
    // alert('red')
    let size
    if (zoom > 19) size = 20
    if (zoom < 19) size = 12
    if (zoom < 15) size = 10
    if (zoom < 13) size = 7
    if (zoom < 11) size = 4.5
    if (zoom < 9) size = 4
    if (zoom < 7) size = 3
    if (zoom < 5) size = 2.5
    if (zoom < 3) size = 2

    const svg = `
                    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="40" fill="#ff0202ff" stroke="#fff" stroke-width="5"/>
                    </svg>
        `;

    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

function getSVGIconEntoAzul(zoom) {
    let size
    if (zoom > 19) size = 20
    if (zoom < 19) size = 12
    if (zoom < 15) size = 10
    if (zoom < 13) size = 7
    if (zoom < 11) size = 4.5
    if (zoom < 9) size = 4
    if (zoom < 7) size = 3
    if (zoom < 5) size = 2.5
    if (zoom < 3) size = 2


    const svg = `
                    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="40" fill="green" stroke="#fff" stroke-width="5"/>
                    </svg>
        `;


    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

function getSVGIconTransparente(zoom) {
    let size
    if (zoom > 19) size = 20
    if (zoom < 19) size = 12
    if (zoom < 15) size = 10
    if (zoom < 13) size = 7
    if (zoom < 11) size = 4.5
    if (zoom < 9) size = 4
    if (zoom < 7) size = 3
    if (zoom < 5) size = 2.5
    if (zoom < 3) size = 2


    const svg = `
                    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fff" stroke-width="5"/>
                    </svg>
        `;


    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}



export default function ComponenteGeoJSON({ geoDataEst, ento = false }) {

    // alert(ento)
    const iconCache = useRef({});

    function getMemoizedIcon(zoom, tipo) {
        const key = `${zoom}-${tipo}`;
        if (!iconCache.current[key]) {
            iconCache.current[key] = getSVGIcon(zoom, tipo);
        }
        return iconCache.current[key];
    }

    function getMemoizedIconRed(zoom, tipo) {
        const key = `${zoom}-${tipo}`;
        if (!iconCache.current[key]) {
            iconCache.current[key] = getSVGIconEntoRed(zoom);
        }
        return iconCache.current[key];
    }

    function getMemoizedIconBlue(zoom, tipo) {
        const key = `${zoom}-${tipo}`;

        if (!iconCache.current[key]) {
            iconCache.current[key] = getSVGIconEntoAzul(zoom);
        }

        return iconCache.current[key];
    }

    function getMemoizedIconTransparente(zoom, tipo) {
        const key = `${zoom}-${tipo}`;

        if (!iconCache.current[key]) {
            iconCache.current[key] = getSVGIconTransparente(zoom);
        }

        return iconCache.current[key];
    }



    const [zoom, setZoom] = useState(8);
    const map = useMapEvents({
        zoomend: () => setZoom(map.getZoom()),
    });


    return (
        <GeoJSON data={geoDataEst} style={{ color: '#333' }}

            key={`geojson-${zoom}`} // fuerza re-render
            pointToLayer={(feature, latlng) => {
                let icon = null
                const tipo = feature.properties.riesgo;
                const ejemplares = parseInt(feature.properties.ejemplares);

                if (parseInt(feature?.properties?.ee1) > 0) {
                    if (!ento) icon = getMemoizedIcon(zoom, tipo);
                    if (ento) {
                        if (ejemplares < 1) {
                            icon = getMemoizedIconBlue(zoom, tipo + 'blue', ejemplares)
                        }
                        else {
                            icon = getMemoizedIconRed(zoom, tipo + 'red', ejemplares)
                        }
                    }
                } else {
                    icon = getMemoizedIconTransparente(zoom, tipo + 'red', ejemplares)
                }
                return L.marker(
                    latlng,
                    { icon });
            }}

            onEachFeature={(feature, layer) => {

                // Mostrar nombre como tooltip si el zoom es alto

                if (parseInt(feature.properties.ee1) > 0) {
                    const nombre = `
                            <strong> ${'Jefe de familia : '}  ${feature.properties.jefefamilia + ' ' + zoom}</strong><br/>
                            <strong>  Riesgo:</strong> ${feature.properties.nivelriego} <br/>
                            <strong>  Comunidad:</strong> ${feature.properties.comunidad} <br/>
                            <strong>  Municipio:</strong> ${feature.properties.municipio || '-'} <br/>
                            <strong>  Red de Salud:</strong> ${feature.properties.red || '-'} <br/>
                            <strong>  Ejemplares encontrados:</strong> ${feature.properties.ejemplares} <br/>
                            <strong>  Numero Habitaciones:</strong> ${feature.properties.habitaciones} <br/>
                            <strong>  Numero Habitantes:</strong> ${feature.properties.habitantes} <br/>
                                            <strong>  Vivienda mejorada por dentro : </strong> ${feature.properties.vmintra} <br/>
                            <strong>  Vivienda mejorada por fuera : </strong> ${feature.properties.vmperi} <br/>
                            <strong>  Numero C.V.:</strong> ${feature.properties.cv} <br/>

                        <strong> Coordenadas </strong> lat: ${feature.properties.latitud}, lon: ${feature.properties.longitud}<br/>


                            <strong> VIVIENDA ${feature.properties.estado} </strong> <br/>

                            <strong> </strong>Gestión evaluacion ${feature.properties.mes || '-'} <br/>
                            <strong> </strong> Fecha Cargado de datos ${feature.properties.fecha} <br/>
                            <strong> </strong> ${feature.properties.negativa || '-'} <br/>
                            <strong> </strong> ${feature.properties.cerrada || '-'} <br/>
                            <strong> </strong> ${feature.properties.renuente || '-'} <br/>
                            <strong> </strong>Usuario ${feature.properties.author || '-'} <br/>
                 `
                    // if (zoom >= 18) {
                    layer.bindTooltip(nombre, {
                        permanent: false,
                        direction: 'top',
                        className: 'hospital-label',
                    }).openTooltip();
                    layer.on('click', () => {
                        layer.unbindTooltip();
                    });
                }

            }}

        >
        </GeoJSON>
    )
}



