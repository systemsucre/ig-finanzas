import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';


import { getColorByRegion } from './utils/regionColors';
import { getColorByRedes } from './utils/redesColors';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const RegionReferencias = () => {


  const [geoDataLimiterRegiones, setGeoDataLimiteRegiones] = useState(null)
  const [geoDataRedes, setGeoDataRedes] = useState(null)



  useEffect(() => {

    fetch('http://localhost:3005/geoBo/5-6regiones.geojson')
      .then((res) => res.json())
      .then((topoData) => {
        setGeoDataLimiteRegiones(topoData)
      });

    fetch('http://localhost:3005/geoBo/redes-cb.geojson')
      .then((res) => res.json())
      .then((topoData) => {
        setGeoDataRedes(topoData)
      })
  },
    []);




  const style = (feature) => ({
    color: '#333',
    weight: 1,
    fillColor: getColorByRegion(feature.properties.region),
    fillOpacity: 0.5
  });

  const style_ = (feature) => ({
    color: '#333',
    weight: 1,
    fillColor: getColorByRedes(feature.properties.nombrered),
    fillOpacity: 0.5
  });






  return (
    geoDataLimiterRegiones && geoDataRedes ? <MapContainer center={[-17.4, -66.2]} zoom={8} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <GeoJSON data={geoDataLimiterRegiones} style={style}
      
          onEachFeature={(feature, layer) => {
          layer.bindPopup('Región : ' + feature.properties.region || 'Sin nombre');
        }}

      />
      {/* <GeoJSON data={geoDataRedes} style={style_}

        onEachFeature={(feature, layer) => {
          layer.bindPopup('RED: ' + feature.properties.nombrered || 'Sin nombre');
        }}

      /> */}
    </MapContainer> : null
  );
};

export default RegionReferencias 
