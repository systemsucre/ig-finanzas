import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE3MmFjYWRjY2QyYjQ4YmFiMTY4NmNiNDU2NTQyOWVkIiwiaCI6Im11cm11cjY0In0=';



const RegionMap = () => {

  const [geoDataLimiteDepto, setGeoDataLimiteDepto] = useState(null)
  const [geoDataLimiteMun, setGeoDataLimiteMun] = useState(null)
  const [geoDataCentrosPoblados, setGeoDataCentrosPoblados] = useState(null)

  useEffect(() => {

    fetch('http://localhost:3005/limites/bol_lim_dpto.json')
      .then((res) => res.json())
      .then((topoData) => {
        setGeoDataLimiteDepto(topoData)
      });

    fetch('http://localhost:3005/scz_munic/sms_redes_salud_limites_planif.geojson')
      .then((res) => res.json())
      .then((topoData) => {
        setGeoDataLimiteMun(topoData)
      });

    fetch('http://localhost:3005/test/isocronas.geojson')
      .then((res) => res.json())
      .then((topoData) => {
        setGeoDataCentrosPoblados(topoData)
      })


  }, []);

  useEffect(() => { geoDataCentrosPoblados && runAnalysis()  }, [geoDataCentrosPoblados])

  const getRoute = async (origen, destino) => {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const body = {
      coordinates: [origen, destino]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    const summary = data.routes[0].summary;

    return {
      distancia_km: (summary.distance / 1000).toFixed(2),
      duracion_min: (summary.duration / 60).toFixed(1)
    };
  };


  const runAnalysis = async () => {
    const menores = geoDataCentrosPoblados.features.filter(f =>
      f.properties.num_categoria === 1
    );

    const mayores = geoDataCentrosPoblados.features.filter(f =>
      f.properties.num_categoria === 2
    );

    for (const menor of menores) {
      const origen = menor.geometry.coordinates;

      // Encuentra el hospital más cercano (simplificado)
      const destino = mayores[0].geometry.coordinates;

      const resultado = await getRoute(origen, destino);

      console.log(`🔹 ${menor.properties.centro_salud} → ${mayores[0].properties.centro_salud}`);
      console.log(`📍 Distancia: ${resultado.distancia_km} km`);
      console.log(`⏱️ Tiempo estimado: ${resultado.duracion_min} minutos\n`);
    }
  };




  return (
    geoDataLimiteDepto && geoDataLimiteMun
      && geoDataCentrosPoblados
      ? <MapContainer center={[-17.4, -66.2]} zoom={8} style={{ height: '100vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <GeoJSON data={geoDataLimiteDepto} style={{ color: '#1f1f1fff' }} />
        <GeoJSON data={geoDataLimiteMun} style={{ color: '#df1937ff' }} />
        <GeoJSON data={geoDataCentrosPoblados} style={{ color: '#333' }}

          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<strong>${feature.properties.centro_salud}</strong><br/>${feature.properties.ubicacion}`);
          }}


        />
      </MapContainer> : null
  );
};

export default RegionMap;
