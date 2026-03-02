import { LayersControl, MapContainer, TileLayer, useMap, } from 'react-leaflet';
import { Col, Row } from 'reactstrap'
import "leaflet/dist/leaflet.css";
import { redirect, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import html2canvas from "html2canvas";

const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE3MmFjYWRjY2QyYjQ4YmFiMTY4NmNiNDU2NTQyOWVkIiwiaCI6Im11cm11cjY0In0=';

import { getColorByMunicipios } from './utils/munColors';

import ComponenteGeoJSON from './utils/zoomMap'
import { useIsochroneWorker } from './hooks/useIsochroneWorker';
import { obtenerUbicacionDesdeCoords } from './utils/obtenerUbicacionDesdeCoords';
import ErrorBoundary from './utils/ErrorBoundary';
import { URL } from '../Auth/config';
import { Riesgo } from '../components/input/elementos';







// Componente para forzar el recalculo del tamaño
function FixMapSize() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 500);
    }, [map]);
    return null;
}
export default function MapEstratificado() {

    const { entidad, level } = useParams()

    const mapRef = useRef();
    const [geoDataEst, setGeoDataEst] = useState(null) // establecimientos de prueba
    const [isochronasGeojson, setIsochronasGeojson] = useState(null);

    const [punto, setPunto] = useState([[-66.74428271566259, -14.848437947837388]]) // -16.508965967438613, -68.12248199947307

    const calcularIsocronas = useIsochroneWorker(apiKey);
    const [mensaje, setMensaje] = useState("");

    // useEffect(() => {
    //     if (!geoDataEst) return;

    //     calcularIsocronas(punto, 60, (resultados) => {
    //         setIsochronasGeojson(resultados);
    //     });
    // }, [geoDataEst]);

    useEffect(() => {

        let url = ''
        if (level == 1)
            url = URL + 'public-map/list-point-red?' + new URLSearchParams({ red: 11 })
        if (level == 2)
            url = URL + 'public-map/list-point-red?' + new URLSearchParams({ red: entidad })
        if (level == 3)
            url = URL + 'public-map/list-point-municipio?' + new URLSearchParams({ municipio: entidad })

        if (level == 4) {
            url = URL + 'public-map/list-point-municipio-comunidad?' + new URLSearchParams({ comunidad: entidad })
        }
        if (level == 5)
            url = URL + 'public-map/list-point-comunidad?' + new URLSearchParams({ comunidad: entidad })

        fetch(url)
            .then((res) => res.json())
            .then((topoData) => {
                // console.log(topoData.data[0], "datos puntos por municipio");
                // console.log(topoData.data[0])
                setGeoDataEst(topoData.data[0] || []);
                if (topoData.data[0].length < 1) {
                    alert('Zona seleccionada fuera de riesgo ')
                    window.location.href = "/smd/eleccion-tipo-mapa-estratificado"
                }
            })
            .catch((err) => console.error("Error cargando datos:", err));
    }, [entidad, level])



    // Exportar a Excel
    const exportarExcel = () => {

    };

    // Descargar imagen del mapa
    const descargarImagen = () => {

        if (geoDataEst.length > 0) {
            setMensaje("📸 Descargando imagen...");

            const elemento = mapRef.current;

            html2canvas(elemento, {
                useCORS: true,
                scale: 2
            }).then((canvas) => {
                const link = document.createElement("a");
                link.download = "captura.png";
                link.href = canvas.toDataURL("image/png");
                link.click();

                setMensaje("✅ Imagen descargada");

                // Ocultar mensaje después de 2 segundos
                setTimeout(() => setMensaje(""), 2000);
            }).catch(() => {
                setMensaje("❌ Error al descargar imagen");
                setTimeout(() => setMensaje(""), 2000);
            });
        }
        else {
            alert('mapa no disponible...')
        }
    };

    // Salir del mapa
    const salirMapa = () => {
        // alert("Saliendo del mapa...");
        // Aquí podrías hacer navegación con react-router: navigate("/inicio")
        window.location.href = "/smd/eleccion-tipo-mapa-estratificado"
    };


    return (
        < div className='mt-3'>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", marginLeft: '1rem' }}>
                {/* <button onClick={exportarExcel}>📊 Exportar a Excel</button> */}
                <button onClick={() => descargarImagen()}>🖼️ Descargar Imagen</button>
                <button onClick={salirMapa}>🚪 Salir</button>
            </div>

            {mensaje ?
                <p className="loading-text" style={{ fontSize: '0.9rem', color: '#888' }}>
                    Descargando imagen...
                </p> : null}
            <div className="contenedor" ref={mapRef}>
                <div className="detalles">
                    <h4>Mapa de Riesgo entomolomógico</h4>

                    <h3>Detalles</h3>
                    {geoDataEst ?
                        <div className="detalles-grid">
                            <div className="detalle-item">
                                <span className="detalle-label">Pais o Region</span>
                                <span className="detalle-valor">BOLIVIA</span>
                            </div>
                            <div className="detalle-item">
                                <span className="detalle-label">Departamento</span>
                                <span className="detalle-valor">CHUQUISACA</span>
                            </div>
                            {level > 1 ? <div className="detalle-item">
                                <span className="detalle-label">Red de Salud</span>
                                <span className="detalle-valor">{geoDataEst[0]?.properties?.red}</span>
                            </div> : null}
                            {level > 2 ? <div className="detalle-item">
                                <span className="detalle-label">Municipio</span>
                                <span className="detalle-valor">{geoDataEst[0]?.properties?.municipio}</span>
                            </div> : null}
                            {level > 3 ? <div className="detalle-item">
                                <span className="detalle-label">Localidad</span>
                                <span className="detalle-valor">{geoDataEst[0]?.properties?.comunidad}</span>
                            </div> : null}
                            <div className="detalle-item">
                                <span className="detalle-label">Coordenada referencial</span>
                                <span className="detalle-valor">{geoDataEst[0]?.geometry?.coordinates[1] + ', ' + geoDataEst[0]?.geometry?.coordinates[0]}</span>
                            </div>
                        </div> : <div className="skeleton-card">
                            <div className="skeleton-line title"></div>
                            <div className="skeleton-line detail"></div>
                            <div className="skeleton-line detail"></div>
                        </div>}
                    <h3>Enfoque Estadístico de Salud</h3>
                    {geoDataEst ? <div className="detalles-grid">


                        {level > 3 ? <div className="detalle-item">
                            <span className="detalle-label">Establecimiento de Salud </span>
                            <span className="detalle-valor">{geoDataEst[0]?.properties?.hospital || '-'}</span>
                        </div> : null}
                        {level > 3 ? <div className="detalle-item">
                            <span className="detalle-label">Comunidad Evaluada </span>
                            <span className="detalle-valor">{parseInt(geoDataEst[0]?.properties?.ee1) === 1 ? 'SI' : 'NO'}</span>
                        </div> : null}
                        {level > 3 ?
                            <div className="detalle-item">
                                <Riesgo nivel={geoDataEst[0]?.properties?.nivelriego || '-'} />
                            </div> : null
                        }
                        <div className="detalle-item">
                            <span className="detalle-label">Total viviendas afectadas</span>
                            <span className="detalle-valor">{geoDataEst?.length || '-'}</span>
                        </div>
                        <div className="detalle-item">
                            <span className="detalle-label">poblacion total afectada</span>
                            <span className="detalle-valor">{geoDataEst.reduce((total, item) => {
                                const valor = Number(item?.properties?.habitantes);
                                return total + (isNaN(valor) ? 0 : valor);
                            }, 0)}</span>
                        </div>
                        <div className="detalle-item">
                            <span className="detalle-label">Ultima Evaluación </span>
                            {geoDataEst[0]?.properties?.fecha_ultima_evaluacion
                                ? <span className="detalle-valor">{
                                    new Intl.DateTimeFormat('es-ES', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    }).format(new Date(
                                        geoDataEst[10]?.properties?.fecha_ultima_evaluacion?.split('/')[2],
                                        geoDataEst[10]?.properties?.fecha_ultima_evaluacion?.split('/')[1],
                                        geoDataEst[10]?.properties?.fecha_ultima_evaluacion?.split('/')[0],

                                    )).replace(/^(\d{2}) de (\w)/, (match, p1, p2) => {
                                        return `${p1} de ${p2.toUpperCase()}`;
                                    }).replace(' de 20', ', 20')
                                }</span> : null}
                        </div>
                        {/* <div className="detalle-item">
                            <span className="detalle-label">Índice de Breteau</span>
                            <span className="detalle-valor">5.2%</span>
                        </div>
                        <div className="detalle-item">
                            <span className="detalle-label">Responsable</span>
                            <span className="detalle-valor">Dr. Arana</span>
                        </div> */}


                        {level < 4 ?

                            <div className="detalle-item">
                                <span className="detalle-label">Riesgo </span>
                                <span className="detalle-valor"> {'BAJO'}
                                    <span className={`riesgo-circulo ${'bajo'}`}></span>
                                </span>
                                <span className="detalle-valor"> {'MEDIO'}
                                    <span className={`riesgo-circulo ${'medio'}`}></span>
                                </span>
                                <span className="detalle-valor"> {'ALTO'}
                                    <span className={`riesgo-circulo ${'alto'}`}></span>
                                </span>

                            </div> : null
                        }


                    </div>



                        : <div className="skeleton-card">
                            <div className="skeleton-line title"></div>
                            <div className="skeleton-line detail"></div>
                            <div className="skeleton-line detail"></div>
                        </div>}

                </div>


                {/* <div class="container-evaluacion">

                    <h4>Mapa de Evaluación Entomológica</h4>
                    <div class="mapa-placeholder">
                        <p>[ El mapa se carga aquí ]</p>
                    </div>

                    <h4>Detalles</h4>
                    <div class="detalles-grid">
                        <div class="detalle-item">
                            <span class="detalle-label">Localidad</span>
                            <span class="detalle-valor">Sector Norte - Zona A</span>
                        </div>
                        <div class="detalle-item">
                            <span class="detalle-label">Fecha de Muestreo</span>
                            <span class="detalle-valor">24 de Mayo, 2024</span>
                        </div>
                        <div class="detalle-item">
                            <span class="detalle-label">Índice de Breteau</span>
                            <span class="detalle-valor">5.2%</span>
                        </div>
                        <div class="detalle-item">
                            <span class="detalle-label">Responsable</span>
                            <span class="detalle-valor">Dr. Arana</span>
                        </div>
                    </div>

                </div> */}

                <div className="mapa">

                    {
                        geoDataEst ?
                            <div id="map">

                                <MapContainer
                                    center={[geoDataEst[0]?.x || -20.228372, geoDataEst[0]?.y || -63.789004]}
                                    zoom={level == 1 ? 8 : level == 2 ? 8 : level == 3 ? 9 : level > 3 ? 11 : 7}
                                    style={{ height: "93%", width: "100%" }}
                                >
                                    <LayersControl position="topleft">
                                        {/* Vista estándar OpenStreetMap */}
                                        <LayersControl.BaseLayer checked name="Mapa Callejero">
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                                        </LayersControl.BaseLayer>

                                        {/* Vista satelital (Google o Esri) */}
                                        <LayersControl.BaseLayer name="Mapa Satelital">
                                            <TileLayer url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={["mt0", "mt1", "mt2", "mt3"]} maxZoom={20} attribution="Map data © Google" />
                                        </LayersControl.BaseLayer>

                                        {/* Vista de relieve (OpenTopoMap) */}
                                        <LayersControl.BaseLayer name="Mapa de Relieve">
                                            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="Map data © OpenTopoMap contributors" />
                                        </LayersControl.BaseLayer>
                                    </LayersControl>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <ComponenteGeoJSON geoDataEst={geoDataEst} />
                                    <FixMapSize />
                                </MapContainer>
                            </div> :
                            <p>Generando Mapa</p>}
                </div>
            </div>
        </div>
    );
}


































































































// import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Popup } from 'react-leaflet';
// import { useParams } from 'react-router-dom';


// import { useEffect, useState } from 'react';
// const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE3MmFjYWRjY2QyYjQ4YmFiMTY4NmNiNDU2NTQyOWVkIiwiaCI6Im11cm11cjY0In0=';

// import { getColorByMunicipios } from './utils/munColors';

// import ComponenteGeoJSON from './utils/zoomMap'
// import { useIsochroneWorker } from './hooks/useIsochroneWorker';
// import { obtenerUbicacionDesdeCoords } from './utils/obtenerUbicacionDesdeCoords';
// import ErrorBoundary from './utils/ErrorBoundary';
// import { URL } from '../Auth/config'
// import Menu from '../menu/menu_1';
// // import { start } from '../service/service';





// const MapEstratificado = () => {


//     const { entidad, level } = useParams()


//     const [rutaGeojson, setRutaGeojson] = useState(null); // ruta calculada
//     const [infoRuta, setInfoRuta] = useState(null);  // informacion de la ruta
//     const [geoDataEst, setGeoDataEst] = useState(null) // establecimientos de prueba



//     const [geoDataLimiteMun, setGeoDataLimiteMun] = useState(null)
//     const [geoDataTRansporteTerrestre, setGeoDataTransporteTerrestre] = useState(null)



//     const [isochronasGeojson, setIsochronasGeojson] = useState(null);
//     const calcularIsocronas = useIsochroneWorker(apiKey);

//     const [ubicacionGeneral, setUbicacionGeneral] = useState(null);
//     const [ubicacionEspecifico, setUbicacionEspecifico] = useState(null);
//     const [punto, setPunto] = useState([[-66.74428271566259, -14.848437947837388]]) // -16.508965967438613, -68.12248199947307


//     useEffect(() => {
//         if (!geoDataEst) return;

//         calcularIsocronas(punto, 60, (resultados) => {
//             setIsochronasGeojson(resultados);
//         });
//     }, [geoDataEst]);


//     const ClickHandler = () => {
//         useMapEvents({
//             click: async (e) => {
//                 const { lat, lng } = e.latlng;

//                 const locationInfo = await obtenerUbicacionDesdeCoords(lat, lng);

//                 setUbicacionGeneral({
//                     lat,
//                     lng,
//                     ...locationInfo.general
//                 });

//                 setUbicacionEspecifico({
//                     lat,
//                     lng,
//                     ...locationInfo.especifico
//                 });

//             }
//         });

//         return null;
//     };


//     useEffect(() => {
//         // start(URL + 'public-map/list-point-comunidad')

//         let url = ''
//         if (level == 1)
//             url = URL + 'public-map/list-point-red?' + new URLSearchParams({ red: 11 })
//         if (level == 2)
//             url = URL + 'public-map/list-point-red?' + new URLSearchParams({ red: entidad })
//         if (level == 3)
//             url = URL + 'public-map/list-point-municipio?' + new URLSearchParams({ municipio: entidad })

//         if (level == 4) {
//             url = URL + 'public-map/list-point-municipio-comunidad?' + new URLSearchParams({ comunidad: entidad })
//         }
//         if (level == 5)
//             url = URL + 'public-map/list-point-comunidad?' + new URLSearchParams({ comunidad: entidad })

//         fetch(URL + 'public-map/list-point-red?' + new URLSearchParams({ red: entidad }))
//             .then((res) => res.json())
//             .then((topoData) => {
//                 console.log(topoData.data, ' datos puntos por municipio')
//                 // const data = topoData.features.filter((feature) => {
//                 //     const categoria = feature.properties?.sedes;
//                 //     return (
//                 //         categoria === 'COCHABAMBA'
//                 //     );
//                 // })
//                 // console.log(topoData.data[0], ' coordenadas recibidas')

//                 setGeoDataEst(topoData.data[0])
//             });

//         fetch(URL + 'geoBo/mun_cb.geojson')
//             .then((res) => res.json())
//             .then((topoData) => {
//                 setGeoDataLimiteMun(topoData)
//             });

//         // fetch('http://localhost:3005/geoBo/5-6regiones.geojson')
//         fetch(URL + 'bol_caminos.geojson')
//             .then((res) => res.json())
//             .then((topoData) => {
//                 setGeoDataTransporteTerrestre(topoData)
//             });


//         fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
//             method: 'POST',
//             headers: {
//                 'Authorization': apiKey,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 coordinates: [
//                     [-66.1560952333, -17.4005763011], // origen
//                     [-66.1492710985, -17.3862330668]  // destino
//                 ]
//             })
//         })
//             .then(res => res.json())
//             .then(data => {
//                 setRutaGeojson(data);
//                 const summary = data.features[0].properties.summary;
//                 setInfoRuta({
//                     distanciaKm: (summary.distance / 1000).toFixed(2),
//                     duracionMin: (summary.duration / 60).toFixed(1)
//                 });
//             });
//     }, []);




//     const style_ = (feature) => ({
//         color: '#333',
//         weight: 1,
//         fillColor: getColorByMunicipios(feature.properties.NOM_MUN),
//         fillOpacity: 0.5
//     });


//     return (
//         <>
//             <Menu />
//             {
//                 // rutaGeojson &&
//                 geoDataEst &&
//                 // geoDataLimiteMun &&
//                 // geoDataTRansporteTerrestre &&

//                 <MapContainer center={[geoDataEst[0]?.x, geoDataEst[0]?.y

//                 ]} zoom={9} style={{ height: '100vh', width:'100vh' }}>
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


//                     {/* <GeoJSON data={geoDataLimiteMun} style={style_}
//                 onEachFeature={(feature, layer) => {
//                     layer.bindPopup(`<span>Municipio: </span><strong>${feature.properties.NOM_MUN || 'Sin nombre'}</strong>`);
//                 }}
//             /> */}

//                     <ComponenteGeoJSON geoDataEst={geoDataEst} />
//                     <GeoJSON
//                         data={rutaGeojson}
//                         style={{ color: 'red', weight: 4 }}
//                         onEachFeature={(feature, layer) => {
//                             if (infoRuta) {
//                                 layer.bindPopup(
//                                     `<strong>Ruta entre establecimientos</strong><br/>
//                                      Distancia: ${infoRuta.distanciaKm} km<br/>
//                                      Duración: ${infoRuta.duracionMin} minutos
//                                      `
//                                 );
//                             }
//                         }}
//                     />

//                     {isochronasGeojson &&
//                         isochronasGeojson.map((geojson, idx) => (
//                             <GeoJSON
//                                 key={idx}
//                                 data={geojson}
//                                 style={{ color: '#00bcd4', weight: 2, fillOpacity: 0.3 }}
//                                 onEachFeature={(feature, layer) => {
//                                     const tiempoSegundos = feature.properties.value;
//                                     const tiempoMinutos = Math.round(tiempoSegundos / 60);
//                                     layer.bindPopup(`<strong>Área accesible en ${tiempoMinutos} minutos</strong>`);
//                                 }}

//                             />
//                         ))}


//                     {/* < GeoJSON data={geoDataTRansporteTerrestre}
//                 onEachFeature={(feature, layer) => {
//                     layer.bindPopup(`<strong>${feature.properties.DETALLE}</strong><br/>`);
//                 }}
//                 style={{ color: '#e388e644' }}
//             /> */}
//                     <ErrorBoundary>
//                         <ClickHandler setUbicacion={setUbicacionGeneral} />
//                     </ErrorBoundary>

//                     {ubicacionGeneral && (
//                         <Marker position={[ubicacionGeneral.lat, ubicacionGeneral.lng]}>
//                             <Popup>
//                                 <strong>Ubicación:</strong><br />
//                                 País: {ubicacionGeneral.país}<br />
//                                 Departamento: {ubicacionGeneral.departamento}<br />
//                                 Ciudad: {ubicacionGeneral.ciudad}<br />
//                                 Coordenadas: {ubicacionGeneral.lat.toFixed(5)}, {ubicacionGeneral.lng.toFixed(5)}
//                             </Popup>
//                         </Marker>
//                     )}

//                 </MapContainer>
//             }
//         </>

//     );
// };

// export default MapEstratificado;


