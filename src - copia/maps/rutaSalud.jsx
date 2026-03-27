import { MapContainer, TileLayer, GeoJSON, } from 'react-leaflet';


import { useEffect, useState } from 'react';
const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE3MmFjYWRjY2QyYjQ4YmFiMTY4NmNiNDU2NTQyOWVkIiwiaCI6Im11cm11cjY0In0=';

import { getColorByMunicipios } from './utils/munColors';

import ComponenteGeoJSON from './utils/zoomMap'


const RutaSalud = () => {
    const [rutaGeojson, setRutaGeojson] = useState(null); // ruta calculada
    const [infoRuta, setInfoRuta] = useState(null);  // informacion de la ruta
    const [geoDataEst, setGeoDataEst] = useState(null) // establecimientos de prueba
    const [geoDataLimiteMun, setGeoDataLimiteMun] = useState(null)
    const [geoDataTRansporteTerrestre, setGeoDataTransporteTerrestre] = useState(null)


    useEffect(() => {
        fetch('http://localhost:3005/geoBo/est.geojson')
            .then((res) => res.json())
            .then((topoData) => {
                const data = topoData.features.filter((feature) => {
                    const categoria = feature.properties?.sedes;
                    return (
                        categoria === 'COCHABAMBA'
                    );
                })
                setGeoDataEst(data)
            });

        fetch('http://localhost:3005/geoBo/mun_cb.geojson')
            .then((res) => res.json())
            .then((topoData) => {
                setGeoDataLimiteMun(topoData)
            });

        fetch('http://localhost:3005/bol_caminos.geojson')
            .then((res) => res.json())
            .then((topoData) => {
                setGeoDataTransporteTerrestre(topoData)
            });


        fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
            method: 'POST',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coordinates: [
                    [-66.74428271566259,-14.848437947837388], // origen 
                    [-66.76164345887278, -14.800230488464413]  // destino -14.673989621845143, -66.69691112936658
                ]
            })
        })
            .then(res => res.json())
            .then(data => {
                setRutaGeojson(data);
                const summary = data.features[0].properties.summary;
                setInfoRuta({
                    distanciaKm: (summary.distance / 1000).toFixed(2),
                    duracionMin: (summary.duration / 60).toFixed(1)
                });
            });
    }, []);




    const style_ = (feature) => ({
        color: '#333',
        weight: 1,
        fillColor: getColorByMunicipios(feature.properties.NOM_MUN),
        fillOpacity: 0.5
    });


    return (
        rutaGeojson &&
        geoDataEst &&
        geoDataLimiteMun &&
        geoDataTRansporteTerrestre &&

        <MapContainer center={[-14.84, -66.74]} zoom={11} style={{ height: '100vh' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/*             
            <GeoJSON data={geoDataLimiteMun} style={style_}
                onEachFeature={(feature, layer) => {
                    layer.bindPopup(`<span>Municipio: </span><strong>${feature.properties.NOM_MUN || 'Sin nombre'}</strong>`);
                }}
            /> */}

            {/* <ComponenteGeoJSON geoDataEst={geoDataEst} /> */}
            <GeoJSON
                data={rutaGeojson}
                style={{ color: 'red', weight: 4 }}
                onEachFeature={(feature, layer) => {
                    if (infoRuta) {
                          layer.bindPopup(
                            `<strong>Ruta de operaciones y lugar de intervención </strong><br/>
                 Distancia: ${infoRuta.distanciaKm} km<br/>
                 Duración: ${infoRuta.duracionMin} minutos`
                        );
                    }
                }}
            />

            {/* < GeoJSON data={geoDataTRansporteTerrestre}
                onEachFeature={(feature, layer) => {
                    layer.bindPopup(`<strong>${feature.properties.DETALLE}</strong><br/>`);
                }}
                style={{ color: '#82471dff' }}
            /> */}

        </MapContainer>
    );
};

export default RutaSalud;
