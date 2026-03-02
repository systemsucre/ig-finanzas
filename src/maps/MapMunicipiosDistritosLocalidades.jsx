import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';


import { getColorByMunicipios } from './utils/munColors';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const MapMunicipiosDistritosLocalidades = () => {


  const [geoDataMunicipios, setGeoDataMunicipios] = useState(null)
  const [geoDataDistritos, setGeoDataDistritos] = useState(null)
  const [geoDataLocalidades, setGeoDataLocalidades] = useState(null)
  const [geoDataDepto, setGeoDataDepto] = useState(null)



  useEffect(() => {

    fetch('http://localhost:3005/limites/municipios_339_pob2012_ed.geojson')
      .then((res) => res.json())
      .then((data) => {
        const amazonia = data.features.filter((municipio) => municipio.properties.NOM_DEP === "Beni" || municipio.properties.NOM_DEP === "Pando" || municipio.properties.NOM_DEP === "Santa Cruz" 
        // || municipio.properties.NOM_DEP === "Cochabamba"
      )
        setGeoDataMunicipios(amazonia)
      });

    fetch('http://localhost:3005/limites/bol_lim_dpto.json')
      .then((res) => res.json())
      .then((data) => {
        setGeoDataDepto(data)
      });

    fetch('http://localhost:3005/geoBo/distritos.geojson')
      .then((res) => res.json())
      .then((data) => {
        setGeoDataDistritos(data)
      });
    fetch('http://localhost:3005/geoBo/localidades_eje_met.geojson')
      .then((res) => res.json())
      .then((data) => {
        setGeoDataLocalidades(data)
      });
  },
    []);

  const style_ = (feature) => ({
    color: '#000000ff',
    weight: 1,
    fillColor: getColorByMunicipios(feature.properties.NOM_MUN),
    fillOpacity: 0.5 
  });

  return (
    geoDataMunicipios && geoDataDepto && geoDataLocalidades ? <MapContainer center={[-17.4, -66.2]} zoom={8} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
            <GeoJSON data={geoDataMunicipios} style={style_}

        onEachFeature={(feature, layer) => {
          layer.bindPopup(`<span>Municipio: </span><strong>${feature.properties.NOM_MUN || 'Sin nombre'}</strong>`);
        }}

      />

      {/* <GeoJSON data={geoDataDepto} 
      style={style_}

        onEachFeature={(feature, layer) => {
          layer.bindPopup(`<span>Departamento: </span><strong>${feature.properties.NOM_DEP || 'Sin nombre'}</strong>`);
        }}

      /> */}

      {/* 
      <GeoJSON data={geoDataLocalidades} style={{color:'#f22f2f'}}
        onEachFeature={(feature, layer) => {
          layer.bindPopup(`<span>Municipio: </span><strong>${feature.properties.designaci || 'Sin nombre'}</strong>`);
        }}
      /> */}

    </MapContainer> : null
  );
};

export default MapMunicipiosDistritosLocalidades;
