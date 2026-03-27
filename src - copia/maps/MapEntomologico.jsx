import { MapContainer, TileLayer, useMap, LayersControl } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import html2canvas from "html2canvas";
import ExcelJS from 'exceljs';

const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE3MmFjYWRjY2QyYjQ4YmFiMTY4NmNiNDU2NTQyOWVkIiwiaCI6Im11cm11cjY0In0=';

import { getColorByMunicipios } from './utils/munColors';

import ComponenteGeoJSON from './utils/zoomMap'
import { useIsochroneWorker } from './hooks/useIsochroneWorker';
import { obtenerUbicacionDesdeCoords } from './utils/obtenerUbicacionDesdeCoords';
import ErrorBoundary from './utils/ErrorBoundary';
import { URL } from '../Auth/config';
import { Riesgo } from '../components/input/elementos';

// const ExcelJS = require('exceljs')







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


export default function MapEntomologico() {

    const { entidad, level } = useParams()

    const mapRef = useRef();
    const [geoDataEst, setGeoDataEst] = useState(null) // establecimientos de prueba
    const [ee2, setEe2] = useState(null) // establecimientos de prueba
    const [isochronasGeojson, setIsochronasGeojson] = useState(null);

    const [punto, setPunto] = useState([[-66.74428271566259, -14.848437947837388]]) // -16.508965967438613, -68.12248199947307

    const calcularIsocronas = useIsochroneWorker(apiKey);
    const [mensaje, setMensaje] = useState("");
    const [mes, setMes] = useState("");

    // useEffect(() => {
    //     if (!geoDataEst) return;

    //     calcularIsocronas(punto, 60, (resultados) => {
    //         setIsochronasGeojson(resultados);
    //     });
    // }, [geoDataEst]);

    useEffect(() => {

        let url = ''
        let url2 = ''
        if (level == 1) {
            url = URL + 'public-map/list-point-red-ento?' + new URLSearchParams({ red: 11 })
            url2 = URL + 'public-map/excel-ee2?' + new URLSearchParams({ entidad: 11, nivel: level })
        }
        if (level == 2) {
            url = URL + 'public-map/list-point-red-ento?' + new URLSearchParams({ red: entidad })
            url2 = URL + 'public-map/excel-ee2?' + new URLSearchParams({ entidad: entidad, nivel: level })
        }
        if (level == 3) {
            url = URL + 'public-map/list-point-municipio-ento?' + new URLSearchParams({ municipio: entidad })
            url2 = URL + 'public-map/excel-ee2?' + new URLSearchParams({ entidad: entidad, nivel: level })
        }
        if (level == 4) {

            url = URL + 'public-map/list-point-municipio-comunidad-ento?' + new URLSearchParams({ comunidad: entidad })
            url2 = URL + 'public-map/excel-ee2?' + new URLSearchParams({ entidad: entidad, nivel: level })

        }
        if (level == 5) {
            url = URL + 'public-map/list-point-comunidad-ento?' + new URLSearchParams({ comunidad: entidad })
            url2 = URL + 'public-map/excel-ee2?' + new URLSearchParams({ entidad: entidad, nivel: level })
        }

        fetch(url)
            .then((res) => res.json())
            .then((topoData) => {
                // console.log(topoData.data[0], "datos puntos por municipio");
                // console.log(topoData.data[0][0]?.properties?.id_mes, ' messsssss')
                setGeoDataEst(topoData.data[0] || []);
                setMes(topoData.data[0][0]?.properties?.id_mes)
            })
            .catch((err) => console.error("Error cargando datos:", err));

        fetch(url2)
            .then((res) => res.json())
            .then((topoData) => {
                // console.log(topoData.data[0], "datos puntos por municipio");
                // console.log(topoData.data)
                setEe2(topoData.data || []);
            })
            .catch((err) => console.error("Error cargando datos:", err));
    }, [entidad, level])



    // Exportar a Excel
    const exportarExcel1 = async () => {

        // console.log(mes, ' mes soicitado')
        fetch(URL + 'public-map/excel-ee1?' + new URLSearchParams({ entidad: entidad, mes: mes }))
            .then((res) => res.json())
            .then((listaCasaB) => {

                let listaCasa = listaCasaB.data
                console.log(listaCasa[0], ' datos eval')
                // if (listaCasa[0].length == 0) { toast.error('no hay datos para exportar'); return }

                const workbook = new ExcelJS.Workbook();
                workbook.creator = 'system sucre cel 71166513';
                workbook.lastModifiedBy = 'SYSTEM SUCRE';

                const principal = workbook.addWorksheet('EE-1 ', {

                    properties: {
                        tabColor: { argb: '1bbec0 ' }, showGridLines: false
                    },
                    pageSetup: {
                        paperSize: 9, orientation: 'landscape'
                    },

                })

                for (let index = 1; index < 1000; index++) {
                    principal.getColumn(index).width = 5
                }

                principal.columns.forEach((column) => {
                    column.alignment = { vertical: 'middle', wrapText: true }
                    column.font = { name: 'Arial', color: { argb: '595959' }, family: 2, size: 9, italic: false }
                })

                principal.mergeCells("A1:C5");




                // CONFIGURACION DE LOS TIRULOS, NOMBRE HOSPITAL, MESES Y GESTION
                // principal.addImage(imageId, { tl: { col: 0.6, row: 0.1 }, ext: { width: 100, height: 95 } })
                principal.mergeCells('F1:Z1');
                principal.getCell('F1').alignment = { vertical: 'center', horizontal: 'center' };
                principal.getCell("F1").font = { bold: 600, size: 11, color: { argb: "595959" }, italic: false, };
                principal.getCell('F1').value = 'MINISTERIO DE SALUD Y DEPORTES'
                principal.mergeCells('F2:Z2');
                principal.getCell("F2").font = { bold: 600, size: 11, color: { argb: "595959" }, italic: false, };
                principal.getCell('F2').alignment = { vertical: 'center', horizontal: 'center' };
                principal.getCell('F2').value = 'DIRECCION GENERAL DE EPIDEMIOLOGIA'
                principal.mergeCells('E3:AA3');
                principal.getCell("F3").font = { bold: 600, size: 11, color: { argb: "595959" }, italic: false, };
                principal.getCell('F3').alignment = { vertical: 'center', horizontal: 'center' };
                principal.getCell('F3').value = 'PROGRAMA NACIONAL DE ENFERMEDADES TRANSMITIDAS POR VECTORES - COMPONENTE CHAGAS'

                principal.mergeCells('E5:Z5');
                principal.getCell("F5").font = { bold: 600, size: 13, color: { argb: "595959" }, italic: false, };
                principal.getCell('F5').alignment = { vertical: 'center', horizontal: 'center' };
                principal.getCell('F5').value = 'PLANILLA DIARIA DE EVALUACION ENTOMOLOGICA EE-1'

                // principal.mergeCells('D4:H4');

                principal.mergeCells('A6:E6');
                principal.getCell('A6').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell("A6").font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                principal.getCell('A6').value = 'SEDES: CHUQUISACA'

                listaCasa[1].forEach((e, i) => {
                    principal.mergeCells('F6:J6');
                    principal.getCell('F6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("F6").font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell('F6').value = 'RED DE SALUD: ' + e.red

                    principal.mergeCells('K6:U6');
                    principal.getCell('K6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("K6").font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell('K6').value = 'E. SALUD: ' + e.hospital

                    principal.mergeCells('V6:AF6');
                    principal.getCell('V6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("V6").font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell('V6').value = 'MUNICIPIO: ' + e.municipio

                    principal.mergeCells('AG6:AJ6');
                    principal.getCell('AG6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("AG6").font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell('AG6').value = 'COMUNIDAD: ' + e.comunidad
                })


                principal.mergeCells('H7:N7');
                principal.getCell('H7').alignment = { vertical: 'center', horizontal: 'left' };
                principal.getCell("H7").font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                principal.getCell('H7').value = listaCasa[0].find(e => e.prerociado)?.prerociado ? listaCasa[0].find(e => e.prerociado)?.prerociado === 1 ? 'TIPO DE ACTIVIDAD: PRE-ROCIADO' : 'TIPO DE ACTIVIDAD: POST-ROCIADO' : null




                principal.mergeCells('A8:A10');
                principal.getCell('A8').value = 'N°C.V'
                principal.getCell('A8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('A8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('A8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('B8:C10');
                principal.getCell('B8').value = 'NOMBRE Y APELLIDO DE JEFE DE FAMILIA'
                principal.getCell('B8').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('B8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('B8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('B8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('D8:F9');
                principal.getCell('D8').value = 'HORA'
                principal.getCell('D8').alignment = { horizontal: 'center' }
                principal.getCell('D8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('D8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('D8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.mergeCells('D10:D10');
                principal.getCell('D10').value = 'INICIO'
                principal.getCell('D10').alignment = { horizontal: 'center' }
                principal.getCell('D10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('D10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('D10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.mergeCells('E10:E10');
                principal.getCell('E10').value = 'FINAL'
                principal.getCell('E10').alignment = { horizontal: 'center' }
                principal.getCell('E10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('E10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('E10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.mergeCells('F10:F10');
                principal.getCell('F10').value = 'TOTAL'
                principal.getCell('F10').alignment = { horizontal: 'center' }
                principal.getCell('F10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('F10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50 " }, };
                principal.getCell('F10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getColumn('G').width = 3
                principal.getRow('8').height = 30
                principal.getRow('9').height = 30

                principal.mergeCells('G8:G10');
                principal.getCell('G8').value = 'N° HABITANTES'
                principal.getCell('G8').alignment = { textRotation: 90 }
                principal.getCell('G8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('G8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('G8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getColumn('B').width = 10
                principal.getColumn('D').width = 7
                principal.getColumn('E').width = 7
                principal.getColumn('F').width = 7
                principal.getColumn('H').width = 4
                principal.getColumn('I').width = 5
                principal.getColumn('J').width = 4

                principal.getColumn('M').width = 3
                principal.getColumn('N').width = 3
                principal.getColumn('O').width = 3
                principal.getColumn('P').width = 3
                principal.getColumn('Q').width = 3
                principal.getColumn('R').width = 3
                principal.getColumn('S').width = 3
                principal.getColumn('T').width = 3
                principal.getColumn('U').width = 3
                principal.getColumn('V').width = 3
                principal.getColumn('X').width = 3
                principal.getColumn('W').width = 3
                principal.getColumn('Y').width = 3
                principal.getColumn('Z').width = 3
                principal.getColumn('AA').width = 3
                principal.getColumn('AB').width = 3
                principal.getColumn('AC').width = 4
                principal.getColumn('AD').width = 4
                principal.getColumn('AI').width = 15
                principal.getColumn('AJ').width = 9
                principal.getColumn('AK').width = 10


                principal.mergeCells('H8:H10');
                principal.getCell('H8').value = 'TOTAL HABITACIONES'
                principal.getCell('H8').alignment = { textRotation: 90, wrapText: true }
                principal.getCell('H8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('H8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('H8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('I8:J10');
                principal.getCell('I8').value = 'FECHA DE ULTIMO ROCIADO'
                principal.getCell('I8').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('I8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('I8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('I8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                principal.mergeCells('K8:L9');
                principal.getCell('K8').value = 'VIVIENDA MEJORADA'
                principal.getCell('K8').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('K8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('K8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('K8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.getCell('K10').value = 'INTRA'
                principal.getCell('K10').alignment = { horizontal: 'center' }
                principal.getCell('K10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('K10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('K10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.getCell('L10').value = 'PERI'
                principal.getCell('L10').alignment = { horizontal: 'center' }
                principal.getCell('L10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('L10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('L10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('M8:R8');
                principal.getCell('M8').value = 'N° EJEMPLARES CAPTURADOS'
                principal.getCell('M8').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('M8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('M8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('M8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('M9:N9');
                principal.getCell('M9').value = 'INTRA'
                principal.getCell('M9').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('M9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('M9').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('M9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.mergeCells('O9:P9');
                principal.getCell('O9').value = 'PERI'
                principal.getCell('O9').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('O9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('O9').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('O9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.mergeCells('Q9:R9');
                principal.getCell('Q9').value = 'TOTAL'
                principal.getCell('Q9').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('Q9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('Q9').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('Q9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('M10').value = 'N'
                principal.getCell('M10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('M10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('M10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('M10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('N10').value = 'A'
                principal.getCell('N10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('N10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('N10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('N10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('O10').value = 'N'
                principal.getCell('O10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('O10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('O10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('O10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('P10').value = 'A'
                principal.getCell('P10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('P10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('P10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('P10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('Q10').value = 'N'
                principal.getCell('Q10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('Q10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('Q10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('Q10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('R10').value = 'A'
                principal.getCell('R10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('R10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('R10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('R10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                principal.mergeCells('S8:AB8');
                principal.getCell('S8').value = 'LUGAR DE CAPTURA'
                principal.getCell('S8').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('S8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('S8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('S8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                principal.mergeCells('S9:V9');
                principal.getCell('S9').value = 'N° INTRA'
                principal.getCell('S9').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('S9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('S9').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('S9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.mergeCells('W9:AB9');
                principal.getCell('W9').value = 'N° PERI'
                principal.getCell('W9').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('W9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('W9').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('W9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };




                principal.getCell('S10').value = 'PD'
                principal.getCell('S10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('S10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('S10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('S10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('T10').value = 'CM'
                principal.getCell('T10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('T10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('T10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('T10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('U10').value = 'TH'
                principal.getCell('U10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('U10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('U10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('U10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('V10').value = 'OT'
                principal.getCell('V10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('V10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('V10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('V10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('W10').value = 'PD'
                principal.getCell('W10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('W10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('W10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('W10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('X10').value = 'GA'
                principal.getCell('X10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('X10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('X10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('X10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('Y10').value = 'CL'
                principal.getCell('Y10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('Y10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('Y10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('Y10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('Z10').value = 'CJ'
                principal.getCell('Z10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('Z10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('Z10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('Z10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('AA10').value = 'Z ó T'
                principal.getCell('AA10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AA10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AA10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AA10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.getCell('AB10').value = 'OT'
                principal.getCell('AB10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AB10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AB10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AB10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };




                principal.mergeCells('AC8:AH9');
                principal.getCell('AC8').value = 'PUNTO GEOGRAFICO DE LA VIVIENDA'
                principal.getCell('AC8').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AC8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AC8').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AC8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('AC10:AD10');
                principal.getCell('AC10').value = 'ALTURA'
                principal.getCell('AC10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AC10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AC10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AC10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('AE10:AF10');
                principal.getCell('AE10').value = 'LATITUD'
                principal.getCell('AE10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AE10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AE10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AE10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('AG10:AH10');
                principal.getCell('AG10').value = 'LONGITUD'
                principal.getCell('AG10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AG10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AG10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AG10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                principal.mergeCells('AI8:AI10');

                principal.getCell('AI10').value = 'TECNICO'
                principal.getCell('AI10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AI10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AI10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AI10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('AJ8:AJ10');
                principal.getCell('AJ10').value = 'TIPO ACTIVIDAD'
                principal.getCell('AJ10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AJ10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AJ10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AJ10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                principal.mergeCells('AK8:AK10');
                principal.getCell('AK10').value = 'MES EVALUACION'
                principal.getCell('AK10').alignment = { horizontal: 'center', wrapText: true }
                principal.getCell('AK10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                principal.getCell('AK10').font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                principal.getCell('AK10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



                let i = 11
                for (let d of listaCasa[0]) {

                    // console.log(listaCasa[0], ' habiaaa')
                    if (d.estado == 1) {
                        // console.log(' escribeine')
                        principal.mergeCells(`B` + i + `:C` + i);
                        principal.mergeCells(`I` + i + `:J` + i);
                        principal.mergeCells(`AC` + i + `:AD` + i);
                        principal.mergeCells(`AE` + i + `:AF` + i);
                        principal.mergeCells(`AG` + i + `:AH` + i);

                        principal.getCell(`A` + i).value = d.cv
                        principal.getCell(`B` + i).value = d.jefefamilia
                        principal.getCell(`D` + i).value = d.inicio
                        principal.getCell(`E` + i).value = d.final
                        principal.getCell(`F` + i).value = d.total
                        principal.getCell(`G` + i).value = d.habitantes
                        principal.getCell(`H` + i).value = d.num_hab
                        principal.getCell(`I` + i).value = d.fecha_rociado
                        principal.getCell(`K` + i).value = d.vm_intra == -1 ? '' : d.vm_intra ? 'SI' : 'NO'
                        principal.getCell(`L` + i).value = d.vm_peri == -1 ? '' : d.vm_peri ? 'SI' : 'NO'
                        principal.getCell(`M` + i).value = d.ecin
                        principal.getCell(`N` + i).value = d.ecia

                        principal.getCell(`O` + i).value = d.ecpn
                        principal.getCell(`P` + i).value = d.ecpa
                        principal.getCell(`Q` + i).value = d.cerrada ? 'C' : d.renuente ? 'R' : d.ecin + d.ecpn
                        principal.getCell(`R` + i).value = d.cerrada ? 'E' : d.renuente ? 'E' : d.ecia + d.ecpa
                        principal.getCell(`S` + i).value = d.cerrada ? 'R' : d.renuente ? 'N' : d.lcipd
                        principal.getCell(`T` + i).value = d.cerrada ? 'R' : d.renuente ? 'U' : d.lcicm

                        principal.getCell(`U` + i).value = d.cerrada ? 'A' : d.renuente ? 'E' : d.lcith
                        principal.getCell(`V` + i).value = d.cerrada ? 'D' : d.renuente ? 'N' : d.lciot
                        principal.getCell(`W` + i).value = d.cerrada ? 'A' : d.renuente ? 'E' : d.lcppd
                        principal.getCell(`X` + i).value = d.lcpga
                        principal.getCell(`Y` + i).value = d.lcpcl
                        principal.getCell(`Z` + i).value = d.lcpcj
                        principal.getCell(`AA` + i).value = d.lcpz
                        principal.getCell(`AB` + i).value = d.lcpot
                        principal.getCell(`AC` + i).value = d.altitud
                        principal.getCell(`AE` + i).value = d.longitud
                        principal.getCell(`AG` + i).value = d.latitud
                        principal.getCell(`AI` + i).value = d.author
                        principal.getCell(`AJ` + i).value = d.prerociado === 1 ? 'PREROCIADO' : d.prerociado === 2 ? 'POSTROCIADO' : null
                        principal.getCell(`AK` + i).value = d.mes

                        principal.getCell(`AC` + i).alignment = { horizontal: 'center', wrapText: true }
                        principal.getCell(`AE` + i).alignment = { horizontal: 'center', wrapText: true }
                        principal.getCell(`AG` + i).alignment = { horizontal: 'center', wrapText: true }
                        principal.getCell(`AI` + i).alignment = { horizontal: 'center', wrapText: true }
                        principal.getCell(`AJ` + i).alignment = { horizontal: 'center', wrapText: true }
                        principal.getCell(`AK` + i).alignment = { horizontal: 'center', wrapText: true }

                        principal.getCell(`A` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`B` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`D` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`E` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`F` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`G` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`H` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`I` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`K` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`L` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`M` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`N` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`O` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`P` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`Q` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`R` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`S` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`T` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }

                        principal.getCell(`U` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`V` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`W` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`X` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`Y` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`Z` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AA` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AB` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AC` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AE` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AG` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AI` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AJ` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AK` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }



                        principal.getCell(`A` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`B` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`D` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`E` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`F` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`G` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`H` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`I` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`K` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`L` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`M` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`N` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`O` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`P` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`Q` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`R` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`S` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`T` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`U` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`V` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`W` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`X` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`Y` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`Z` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`AA` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AB` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AC` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AE` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AG` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AI` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AJ` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AK` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`A` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`B` + i).font = { bold: 400, size: 7, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`D` + i).font = { bold: 600, size: 6, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`E` + i).font = { bold: 600, size: 6, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`F` + i).font = { bold: 600, size: 6, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`G` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`H` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`I` + i).font = { bold: 600, size: 7, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`K` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`L` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`M` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`N` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`O` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`P` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`Q` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`R` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`S` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`T` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`U` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`V` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`W` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`X` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`Y` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`Z` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AA` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AB` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AC` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AE` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AG` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AI` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AJ` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AK` + i).font = { bold: 600, size: 8, italic: false, color: { argb: "2c3e50" }, };

                        i++
                    }
                }


                workbook.xlsx.writeBuffer().then(data => {
                    const blob = new Blob([data], {
                        type: "aplication/vnd.openxmlformats-officedocumets.spreadshhed.sheed",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = 'EE-1-.xlsx';
                    anchor.click();
                    window.URL.revokeObjectURL(url);
                })
            })
            .catch((err) => console.error("Error cargando datos:", err));
    };

    const exportarExcel2 = async () => {
        // console.log(mes, ' mes soicitado')
        fetch(URL + 'public-map/excel-ee2?' + new URLSearchParams({ entidad: entidad, nivel: level }))
            .then((res) => res.json())
            .then((listaCasaB) => {

                let lista = listaCasaB.data
                console.log(lista, ' datos eval')
                // if (listaCasa[0].length == 0) { toast.error('no hay datos para exportar'); return }

                if (lista.length > 0) {
                    const workbook = new ExcelJS.Workbook();
                    workbook.creator = 'system sucre cel 71166513';
                    workbook.lastModifiedBy = 'SYSTEM SUCRE';

                    const principal = workbook.addWorksheet('EE-2', {
                        properties:
                        {
                            tabColor: { argb: '1bbec0 ' }, showGridLines: false
                        },
                        pageSetup: {
                            paperSize: 9, orientation: 'landscape'
                        },

                    })

                    for (let index = 1; index < 1000; index++) {
                        principal.getColumn(index).width = 5
                    }

                    principal.columns.forEach((column) => {
                        column.alignment = { vertical: 'middle', wrapText: true }
                        column.font = { name: 'Arial', color: { argb: '595959' }, family: 2, size: 9, italic: false }
                    })
                    principal.mergeCells("A1:C5");

                    // const imageId = workbook.addImage({
                    //     base64: sedes,
                    //     extension: 'png',
                    // })


                    // CONFIGURACION DE LOS TIRULOS, NOMBRE HOSPITAL, MESES Y GESTION
                    // principal.addImage(imageId, { tl: { col: 0.6, row: 0.1 }, ext: { width: 100, height: 95 } })
                    principal.mergeCells('E1:AS1');
                    principal.getCell('E1').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell("E1").font = { bold: 600, size: 11, color: { argb: "595959" }, italic: false, };
                    principal.getCell('E1').value = 'MINISTERIO DE SALUD Y DEPORTES'
                    principal.mergeCells('E2:AS2');
                    principal.getCell("E2").font = { bold: 600, size: 11, color: { argb: "595959" }, italic: false, };
                    principal.getCell('E2').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell('E2').value = 'DIRECCION GENERAL DE EPIDEMIOLOGIA'
                    principal.mergeCells('E3:AS3');
                    principal.getCell("E3").font = { bold: 600, size: 11, color: { argb: "595959" }, italic: false, };
                    principal.getCell('E3').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell('E3').value = 'PROGRAMA NACIONAL DE ENFERMEDADES TRANSMITIDAS POR VECTORES - COMPONENTE CHAGAS'

                    principal.mergeCells('F5:AP5');
                    principal.getCell("F5").font = { bold: 600, size: 13, color: { argb: "595959" }, italic: false, };
                    principal.getCell('F5').alignment = { vertical: 'center', horizontal: 'center' };
                    principal.getCell('F5').value = 'CONSOLIDADO DE EVALUACION ENTOMOLOGICA EE-2'

                    // principal.mergeCells('D4:H4');

                    principal.mergeCells('A6:L6');
                    principal.getCell('A6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("A6").font = { bold: 600, size: 8, color: { argb: "595959" }, italic: false, };
                    principal.getCell('A6').value = 'SERVICIO DEPARTAMENTAL DE SALUD: CHUQUISACA'


                    principal.mergeCells('M6:T6');
                    principal.getCell('M6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("M6").font = { bold: 600, size: 7, color: { argb: "595959" }, italic: false, };
                    principal.getCell('M6').value = 'RED DE SALUD: ' + lista.find(e => e.nombre_red)?.nombre_red

                    principal.mergeCells('U6:AH6');
                    principal.getCell('U6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("U6").font = { bold: 600, size: 7, color: { argb: "595959" }, italic: false, };
                    principal.getCell('U6').value = 'MUNICIPIO: ' + lista.find(e => e.nombre_municipio)?.nombre_municipio

                    principal.mergeCells('AI6:AV6');
                    principal.getCell('AI6').alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell("AI6").font = { bold: 600, size: 7, color: { argb: "595959" }, italic: false, };
                    principal.getCell('AI6').value = 'EST. DE SALUD: '



                    principal.mergeCells('A8:A10');
                    principal.getCell('A8').value = 'N°'
                    principal.getCell('A8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('A8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('A8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('B8:C10');
                    principal.getCell('B8').value = 'COMUNIDAD O BARRIO'
                    principal.getCell('B8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('B8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('B8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('B8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                    principal.mergeCells('D8:E9');
                    principal.getCell('D8').value = 'EVALUACION VIV.'
                    principal.getCell('D8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('D8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('D8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('D8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('D10:D10');
                    principal.getCell('D10').value = 'PRE. ROC'
                    principal.getCell('D10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('D10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('D10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('D10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('E10:E10');
                    principal.getCell('E10').value = 'POST. ROC'
                    principal.getCell('E10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('E10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('E10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('E10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };







                    principal.mergeCells('F8:G9');
                    principal.getCell('F8').value = 'FECHA DE EJECUCION'
                    principal.getCell('F8').alignment = { horizontal: 'center', wrapText: true }

                    principal.getCell('F8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('F8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('F8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                    principal.getCell('F10').value = 'FINAL'
                    principal.getCell('F10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('F10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('F10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('F10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('G10').value = 'FINAL'
                    principal.getCell('G10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('G10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('G10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('G10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getRow('8').height = 30
                    principal.getRow('9').height = 30
                    principal.getRow('10').height = 30

                    principal.mergeCells('H8:H10');
                    principal.getCell('H8').value = 'TOTAL HABITANTES'
                    principal.getCell('H8').alignment = { textRotation: 90, horizontal: 'center', wrapText: true }
                    principal.getCell('H8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('H8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('H8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };




                    principal.mergeCells('I8:I10');
                    principal.getCell('I8').value = 'TOTAL HABITACIONES'
                    principal.getCell('I8').alignment = { textRotation: 90, horizontal: 'center', wrapText: true }
                    principal.getCell('I8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('I8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('I8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



                    principal.getColumn('A').width = 3
                    principal.getColumn('B').width = 7
                    principal.getColumn('D').width = 3
                    principal.getColumn('E').width = 3
                    principal.getColumn('F').width = 6
                    principal.getColumn('G').width = 6
                    principal.getColumn('H').width = 2
                    principal.getColumn('I').width = 2
                    principal.getColumn('J').width = 3
                    principal.getColumn('K').width = 3
                    principal.getColumn('L').width = 3
                    principal.getColumn('M').width = 3
                    principal.getColumn('N').width = 3
                    principal.getColumn('O').width = 3
                    principal.getColumn('P').width = 3
                    principal.getColumn('Q').width = 3
                    principal.getColumn('R').width = 3
                    principal.getColumn('S').width = 3
                    principal.getColumn('T').width = 3
                    principal.getColumn('U').width = 3
                    principal.getColumn('V').width = 3
                    principal.getColumn('W').width = 3
                    principal.getColumn('X').width = 3
                    principal.getColumn('Y').width = 3
                    principal.getColumn('Z').width = 3
                    principal.getColumn('T').width = 3
                    principal.getColumn('U').width = 3
                    principal.getColumn('V').width = 3

                    principal.getColumn('W').width = 3
                    principal.getColumn('X').width = 3
                    principal.getColumn('Z').width = 2


                    principal.getColumn('AA').width = 2
                    principal.getColumn('AB').width = 2
                    principal.getColumn('AC').width = 2
                    principal.getColumn('AD').width = 2
                    principal.getColumn('AE').width = 2
                    principal.getColumn('AF').width = 2
                    principal.getColumn('AG').width = 2
                    principal.getColumn('AH').width = 2
                    principal.getColumn('AI').width = 2
                    principal.getColumn('AJ').width = 2
                    principal.getColumn('AK').width = 2
                    principal.getColumn('AL').width = 2
                    principal.getColumn('AM').width = 2
                    principal.getColumn('AN').width = 2
                    principal.getColumn('AO').width = 2
                    principal.getColumn('AP').width = 2
                    principal.getColumn('AQ').width = 2
                    principal.getColumn('AR').width = 2
                    principal.getColumn('AS').width = 2

                    principal.getColumn('AT').width = 6
                    principal.getColumn('AU').width = 6
                    principal.getColumn('AV').width = 6
                    principal.getColumn('AW').width = 6
                    principal.getColumn('AY').width = 10


                    principal.mergeCells('J8:M8');
                    principal.getCell('J8').value = 'VIVIENDAS'
                    principal.getCell('J8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('J8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('J8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('J8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('J9:J10');
                    principal.getCell('J9').value = 'EXIST'
                    principal.getCell('J9').alignment = { horizontal: 'center' }
                    principal.getCell('J9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('J9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('J9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('K9:K10');
                    principal.getCell('K9').value = 'PROG'
                    principal.getCell('K9').alignment = { horizontal: 'center' }
                    principal.getCell('K9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('K9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('K9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('L9:L10');
                    principal.getCell('L9').value = 'EVAL'
                    principal.getCell('L9').alignment = { horizontal: 'center' }
                    principal.getCell('L9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('L9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('L9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('M9:M10');
                    principal.getCell('M9').value = '% COB'
                    principal.getCell('M9').alignment = { horizontal: 'center' }
                    principal.getCell('M9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('M9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('M9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('N8:S8');
                    principal.getCell('N8').value = 'INDICADOR DE INFESTACION'
                    principal.getCell('N8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('N8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('N8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('N8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('N9:N10');
                    principal.getCell('N9').value = 'POSIT (+)'
                    principal.getCell('N9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('N9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('N9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('N9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('O9:O10');
                    principal.getCell('O9').value = '%IIV'
                    principal.getCell('O9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('O9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('O9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('O9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('P9:P10');
                    principal.getCell('P9').value = '(+) INTRA'
                    principal.getCell('P9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('P9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('P9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('P9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('Q9:Q10');
                    principal.getCell('Q9').value = '% III'
                    principal.getCell('Q9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('Q9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('Q9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('Q9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('R9:R10');
                    principal.getCell('R9').value = '(+) PERI'
                    principal.getCell('R9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('R9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('R9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('R9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('S9:S10');
                    principal.getCell('S9').value = '% IIP'
                    principal.getCell('S9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('S9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('S9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('S9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                    principal.mergeCells('T8:Y8');
                    principal.getCell('T8').value = 'INDICADOR DE INFESTACION DE COLONIAS'
                    principal.getCell('T8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('T8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('T8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('T8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('T9:T10');
                    principal.getCell('T9').value = 'VIV (+) CON NINFAS'
                    principal.getCell('T9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('T9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('T9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('T9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('U9:U10');
                    principal.getCell('U9').value = '%IIC'
                    principal.getCell('U9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('U9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('U9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('U9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('V9:V10');
                    principal.getCell('V9').value = '(+) INTRA'
                    principal.getCell('V9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('V9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('V9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('V9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('W9:W10');
                    principal.getCell('W9').value = '% ICI'
                    principal.getCell('W9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('W9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('W9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('W9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('X9:X10');
                    principal.getCell('X9').value = '(+) PERI'
                    principal.getCell('X9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('X9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('X9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('X9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.mergeCells('Y9:Y10');
                    principal.getCell('Y9').value = '% ICP'
                    principal.getCell('Y9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('Y9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('Y9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('Y9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



                    principal.mergeCells('Z8:AC8');
                    principal.getCell('Z8').value = 'VIVIENDAS MEJORADAS'
                    principal.getCell('Z8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('Z8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('Z8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('Z8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('Z9:AA9');
                    principal.getCell('Z9').value = 'INTRA'
                    principal.getCell('Z9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('Z9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('Z9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('Z9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('Z10').value = 'SI'
                    principal.getCell('Z10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('Z10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('Z10').font = { size: 4, talic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('Z10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AA10').value = 'NO'
                    principal.getCell('AA10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AA10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AA10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AA10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('AB9:AC9');
                    principal.getCell('AB9').value = 'PERI'
                    principal.getCell('AB9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AB9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AB9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AB9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('AB10').value = 'SI'
                    principal.getCell('AB10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AB10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AB10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AB10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AC10').value = 'NO'
                    principal.getCell('AC10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AC10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AC10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AC10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };




                    principal.mergeCells('AD8:AI8');
                    principal.getCell('AD8').value = 'N° DE EJEMPLARES CAPTURADOS'
                    principal.getCell('AD8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AD8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AD8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AD8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('AD9:AE9');
                    principal.getCell('AD9').value = 'INTRA'
                    principal.getCell('AD9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AD9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AD9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AD9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AD10').value = 'N'
                    principal.getCell('AD10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AD10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AD10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AD10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AE10').value = 'A'
                    principal.getCell('AE10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AE10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AE10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AE10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('AF9:AG9');
                    principal.getCell('AF9').value = 'PERI'
                    principal.getCell('AF9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AF9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AF9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AF9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('AF10').value = 'N'
                    principal.getCell('AF10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AF10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AF10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AF10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AG10').value = 'A'
                    principal.getCell('AG10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AG10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AG10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AG10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



                    principal.mergeCells('AH9:AI9');
                    principal.getCell('AH9').value = 'TOTAL'
                    principal.getCell('AH9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AH9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AH9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AH9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('AH10').value = 'N'
                    principal.getCell('AH10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AH10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AH10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AH10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AI10').value = 'A'
                    principal.getCell('AI10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AI10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AI10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AI10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };







                    principal.mergeCells('AJ8:AS8');
                    principal.getCell('AJ8').value = 'LUGAR DE CAPTURA'
                    principal.getCell('AJ8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AJ8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AJ8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AJ8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('AJ9:AM9');
                    principal.getCell('AJ9').value = 'N° INTRA'
                    principal.getCell('AJ9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AJ9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AJ9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AJ9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AJ10').value = 'PD'
                    principal.getCell('AJ10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AJ10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AJ10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AD10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AK10').value = 'CM'
                    principal.getCell('AK10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AK10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AK10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AK10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('AL10').value = 'TH'
                    principal.getCell('AL10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AL10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AL10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AL10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AM10').value = 'OT'
                    principal.getCell('AM10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AM10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AM10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AM10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



                    principal.mergeCells('AN9:AS9');
                    principal.getCell('AN9').value = 'N° PERI'
                    principal.getCell('AN9').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AN9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AN9').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AN9').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AN10').value = 'PD'
                    principal.getCell('AN10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AN10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AN10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AN10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AO10').value = 'GA'
                    principal.getCell('AO10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AO10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AO10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AO10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AP10').value = 'CL'
                    principal.getCell('AP10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AP10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AP10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AP10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('AQ10').value = 'CJ'
                    principal.getCell('AQ10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AQ10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AQ10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AQ10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AR10').value = 'Z ó T'
                    principal.getCell('AR10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AR10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AR10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AR10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    principal.getCell('AS10').value = 'OT'
                    principal.getCell('AS10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AS10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AS10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AS10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



                    principal.mergeCells('AT8:AV9');
                    principal.getCell('AT8').value = 'PUNTO GEOGRAFICO'
                    principal.getCell('AT8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AT8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AT8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AT8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('AT10').value = 'ALTURA'
                    principal.getCell('AT10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AT10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AT10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AT10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                    principal.getCell('AU10').value = 'LATITUD'
                    principal.getCell('AU10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AU10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AU10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AU10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.getCell('AV10').value = 'LONGITUD'
                    principal.getCell('AV10').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AV10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AV10').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AV10').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    principal.mergeCells('AW8:AX10');
                    principal.getCell('AW8').value = 'EVALUADOR(A)'
                    principal.getCell('AW8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AW8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AW8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AW8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


                    principal.mergeCells('AY8:AY10');
                    principal.getCell('AY8').value = 'MES EVALUACION'
                    principal.getCell('AY8').alignment = { horizontal: 'center', wrapText: true }
                    principal.getCell('AY8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1bbec0' }, }
                    principal.getCell('AY8').font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell('AY8').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



                    let i = 11
                    let j = 1
                    for (let d of lista) {
                        principal.mergeCells(`B` + i + `:C` + i);

                        principal.getCell(`A` + i).value = j
                        principal.getCell(`B` + i).value = d.comunidad
                        principal.getCell(`D` + i).value = d.prerociado ? d.prerociado === 1 ? 'SI' : 'NO' : '-'
                        principal.getCell(`E` + i).value = d.prerociado ? d.prerociado === 2 ? 'SI' : 'NO' : '-'
                        principal.getCell(`F` + i).value = d.inicio
                        principal.getCell(`G` + i).value = d.final
                        principal.getCell(`H` + i).value = parseInt(d.habitantes)
                        principal.getCell(`I` + i).value = parseInt(d.num_hab)
                        principal.getCell(`J` + i).value = d.viv_existentes
                        principal.getCell(`K` + i).value = d.num_viviendas_actual
                        principal.getCell(`L` + i).value = d.evaluadas
                        principal.getCell(`M` + i).value = parseInt(d.cob)
                        principal.getCell(`N` + i).value = d.viv_pos
                        principal.getCell(`O` + i).value = parseFloat(d.iiv)
                        principal.getCell(`P` + i).value = d.pos_intra
                        principal.getCell(`Q` + i).value = parseFloat(d.iii)
                        principal.getCell(`R` + i).value = d.pos_peri
                        principal.getCell(`S` + i).value = parseFloat(d.iip)
                        principal.getCell(`T` + i).value = d.pos_ninfas

                        principal.getCell(`U` + i).value = parseFloat(d.iic) || 0
                        principal.getCell(`V` + i).value = d.pos_ninfas_intra
                        principal.getCell(`W` + i).value = parseFloat(d.ici) || 0
                        principal.getCell(`X` + i).value = d.pos_ninfas_peri
                        principal.getCell(`Y` + i).value = parseFloat(d.icp) || 0
                        principal.getCell(`Z` + i).value = d.vm_intra_si
                        principal.getCell(`AA` + i).value = d.vm_intra_no
                        principal.getCell(`AB` + i).value = d.vm_peri_si
                        principal.getCell(`AC` + i).value = d.vm_peri_no
                        principal.getCell(`AD` + i).value = parseInt(d.ecin)
                        principal.getCell(`AE` + i).value = parseInt(d.ecia)

                        principal.getCell(`AF` + i).value = parseInt(d.ecpn)
                        principal.getCell(`AG` + i).value = parseInt(d.ecpa)

                        principal.getCell(`AH` + i).value = parseInt(d.ecin) + parseInt(d.ecpn)
                        principal.getCell(`AI` + i).value = parseInt(d.ecia) + parseInt(d.ecpa)
                        principal.getCell(`AJ` + i).value = parseInt(d.lcipd)
                        principal.getCell(`AK` + i).value = parseInt(d.lcicm)

                        principal.getCell(`AL` + i).value = parseInt(d.lcith)
                        principal.getCell(`AM` + i).value = parseInt(d.lciot)
                        principal.getCell(`AN` + i).value = parseInt(d.lcppd)
                        principal.getCell(`AO` + i).value = parseInt(d.lcpga)
                        principal.getCell(`AP` + i).value = parseInt(d.lcpcl)
                        principal.getCell(`AQ` + i).value = parseInt(d.lcpcj)
                        principal.getCell(`AR` + i).value = parseInt(d.lcpz)
                        principal.getCell(`AS` + i).value = parseInt(d.lcpot)
                        principal.getCell(`AT` + i).value = parseInt(d.altitud)
                        principal.getCell(`AU` + i).value = parseFloat(d.latitud)
                        principal.getCell(`AV` + i).value = parseFloat(d.longitud)
                        principal.mergeCells(`AW` + i + `:AX` + i);
                        principal.getCell(`AW` + i).value = d.author
                        principal.getCell(`AY` + i).value = d.mes



                        principal.getCell(`A` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`B` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`D` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`E` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`F` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`G` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`H` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`I` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`J` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`K` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`L` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`M` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`N` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`O` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`P` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`Q` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`R` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`S` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`T` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }

                        principal.getCell(`U` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`V` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`W` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`X` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`Y` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`Z` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AA` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AB` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AC` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AE` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AF` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AD` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AG` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }

                        principal.getCell(`AH` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AI` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AJ` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AK` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AL` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AM` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AN` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AO` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AP` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AQ` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AR` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AS` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AT` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AU` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AV` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AW` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }
                        principal.getCell(`AY` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: !d.estado ? 'fadbd8' : 'ffffff' }, }





                        principal.getCell(`A` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`B` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`D` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`E` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`F` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`G` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`H` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`I` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`J` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`K` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`L` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`M` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`N` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`O` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`P` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`Q` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`R` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`S` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`T` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`U` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`V` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`W` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`X` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`Y` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`Z` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`AA` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AB` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AC` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AE` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AD` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AF` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AG` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AH` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AI` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AJ` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AK` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AL` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`A` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AM` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AN` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AO` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AP` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AQ` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AR` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AS` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AT` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AU` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        principal.getCell(`AV` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AW` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        principal.getCell(`AY` + i).border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };


                        principal.getCell(`A` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`B` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`D` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`E` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`F` + i).font = { size: 4.5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`G` + i).font = { size: 4.5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`H` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`I` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`J` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`K` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`L` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`M` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`N` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`O` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`P` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`Q` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`R` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`S` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`T` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`U` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`V` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`W` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`X` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`Y` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`Z` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AA` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AB` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AC` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AD` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AC` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AE` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AF` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AG` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AH` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AI` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AJ` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AK` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AL` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AM` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AN` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AO` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AP` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AQ` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AR` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AS` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AT` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AU` + i).font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AV` + i).font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AW` + i).font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                        principal.getCell(`AY` + i).font = { size: 4, italic: false, color: { argb: "2c3e50" }, };
                        i++
                        j++
                    }

                    principal.mergeCells(`B` + i + `:C` + i);


                    principal.getCell(`A` + i).value = '-'
                    principal.getCell(`B` + i).value = lista.length + ' comunidad(s)'
                    principal.getCell(`B` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`D` + i).value = '-'
                    principal.getCell(`E` + i).value = '-'
                    principal.getCell(`F` + i).value = '-'
                    principal.getCell(`G` + i).font = '-';
                    principal.getCell(`H` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.habitantes), 0)
                    principal.getCell(`I` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.num_hab), 0)
                    principal.getCell(`H` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`I` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`J` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.viv_existentes), 0)
                    principal.getCell(`K` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.num_viviendas_actual), 0)
                    principal.getCell(`J` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`K` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`L` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.evaluadas), 0)
                    principal.getCell(`M` + i).value = '-'
                    principal.getCell(`L` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };


                    principal.getCell(`N` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.viv_pos), 0)
                    principal.getCell(`N` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`P` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.pos_intra), 0)
                    principal.getCell(`P` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`R` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.pos_peri), 0)
                    principal.getCell(`R` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`T` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.pos_ninfas), 0)
                    principal.getCell(`T` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`V` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.pos_ninfas_intra), 0)
                    principal.getCell(`V` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`X` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.pos_ninfas_peri), 0)
                    principal.getCell(`X` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`Z` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.vm_intra_si), 0)
                    principal.getCell(`Z` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AA` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.vm_intra_no), 0)
                    principal.getCell(`AA` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AB` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.vm_peri_si), 0)
                    principal.getCell(`AB` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`AC` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.vm_peri_no), 0)
                    principal.getCell(`AC` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`AD` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecin), 0)
                    principal.getCell(`AD` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AE` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecia), 0)
                    principal.getCell(`AE` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AF` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecpn), 0)
                    principal.getCell(`AF` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AG` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecpa), 0)
                    principal.getCell(`AG` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`AH` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecin), 0) + lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecpn), 0)
                    principal.getCell(`AH` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AI` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecia), 0) + lista.reduce((acumulador, actual) => acumulador + parseInt(actual.ecpa), 0)
                    principal.getCell(`AI` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };


                    principal.getCell(`AJ` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcipd), 0)
                    principal.getCell(`AJ` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`AK` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcicm), 0)
                    principal.getCell(`AK` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AL` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcith), 0)
                    principal.getCell(`AL` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AM` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lciot), 0)
                    principal.getCell(`AM` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AN` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcppd), 0)
                    principal.getCell(`AN` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AO` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcpga), 0)
                    principal.getCell(`AO` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AP` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcpcl), 0)
                    principal.getCell(`AP` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };

                    principal.getCell(`AQ` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcpcj), 0)
                    principal.getCell(`AQ` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AR` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcpz), 0)
                    principal.getCell(`AR` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };
                    principal.getCell(`AS` + i).value = lista.reduce((acumulador, actual) => acumulador + parseInt(actual.lcpot), 0)
                    principal.getCell(`AS` + i).font = { size: 5, italic: false, color: { argb: "2c3e50" }, };




                    principal.getCell(`A` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`B` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`D` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`E` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }

                    principal.getCell(`F` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`G` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`H` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`I` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`J` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`K` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`L` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`M` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`N` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`O` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`P` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`Q` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`R` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`S` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`T` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }

                    principal.getCell(`U` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`V` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`W` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`X` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`Y` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`Z` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9 ' }, }
                    principal.getCell(`AA` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`AB` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }

                    principal.getCell(`AC` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`AE` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }
                    principal.getCell(`AG` + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e5e7e9' }, }



                    principal.mergeCells(`A` + (i + 3) + `:D` + (i + 3));
                    principal.getCell(`A` + (i + 3)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`A` + (i + 3)).font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`A` + (i + 3)).value = 'LUGAR DE CAPTURA'


                    principal.mergeCells(`A` + (i + 4) + `:C` + (i + 4));
                    principal.getCell(`A` + (i + 4)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`A` + (i + 4)).font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`A` + (i + 4)).value = 'INTRA DOMICILIO'

                    principal.mergeCells(`D` + (i + 4) + `:Z` + (i + 4));
                    principal.getCell(`D` + (i + 4)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`D` + (i + 4)).font = { size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`D` + (i + 4)).value = '(PD)=PARED (TH)=TECHO (OT)=OTROS (CM)=CAMA'

                    principal.mergeCells(`A` + (i + 5) + `:C` + (i + 5));
                    principal.getCell(`A` + (i + 5)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`A` + (i + 5)).font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`A` + (i + 5)).value = 'PERI DOMICILIO'

                    principal.mergeCells(`D` + (i + 5) + `:Z` + (i + 5));
                    principal.getCell(`D` + (i + 5)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`D` + (i + 5)).font = { size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`D` + (i + 5)).value = "(PD)=PARED (CL)=CORRAL (GA)=GALLINERO (CJ)=CONEJERA (Z ö T)=ZARZO O TRO (OT)=OTROS"


                    principal.mergeCells(`A` + (i + 6) + `:C` + (i + 6));
                    principal.getCell(`A` + (i + 6)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`A` + (i + 6)).font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`A` + (i + 6)).value = 'VIVIENDA MEJORADA'

                    principal.mergeCells(`D` + (i + 6) + `:N` + (i + 6));
                    principal.getCell(`D` + (i + 6)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`D` + (i + 6)).font = { size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`D` + (i + 6)).value = "ANOTAR SI/NO EN LAS CASILLAS DE INTRA Y PERI DOMICILIO"


                    principal.mergeCells(`A` + (i + 8) + `:N` + (i + 8));
                    principal.getCell(`A` + (i + 8)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`A` + (i + 8)).font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`A` + (i + 8)).value = 'USUARIO GENERADOR:    ' + localStorage.getItem('nombre')

                    principal.mergeCells(`U` + (i + 8) + `:AH` + (i + 8));
                    principal.getCell(`U` + (i + 8)).alignment = { vertical: 'center', horizontal: 'left' };
                    principal.getCell(`U` + (i + 8)).font = { bold: 600, size: 9, color: { argb: "595959" }, italic: false, };
                    principal.getCell(`U` + (i + 8)).value = 'FIRMA:                                .................................'

                    workbook.xlsx.writeBuffer().then(data => {
                        const blob = new Blob([data], {
                            type: "aplication/vnd.openxmlformats-officedocumets.spreadshhed.sheed",
                        });
                        const url = window.URL.createObjectURL(blob);
                        const anchor = document.createElement('a');
                        anchor.href = url;
                        anchor.download = 'EE-2CONSOLIDADO.xlsx';
                        anchor.click();
                        window.URL.revokeObjectURL(url);
                    })
                }
            })
            .catch((err) => console.error("Error cargando datos:", err));

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
        window.location.href = "/smd/eleccion-tipo-mapa-entologico"
    };


    return (
        < div className='mt-3'>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", marginLeft: '1rem' }}>
                {
                    level > 3 ?
                        <button onClick={exportarExcel1}>📊 Exportar a Excel EE1</button> :
                        <button onClick={exportarExcel2}>📊 Exportar a Excel EE2</button>
                }
                <button onClick={() => descargarImagen()}>🖼️ Descargar Imagen</button>
                <button onClick={salirMapa}>🚪 Salir</button>
            </div>

            {mensaje ?
                <p className="loading-text" style={{ fontSize: '0.9rem', color: '#888' }}>
                    Descargando imagen...
                </p> : null}
            <div className="contenedor" ref={mapRef}>
                <div className="detalles">
                    <h4>Mapa de Evaluacion entomologica</h4>

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
                            {level > 3 ? <div className="detalle-item">
                                <span className="detalle-label">Establecimiento de Salud </span>
                                <span className="detalle-valor">{geoDataEst[0]?.properties?.hospital || '-'}</span>
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
                    {geoDataEst ? <>
                        <div className="detalles-grid">

                            <div className="detalle-item">
                                <span className="detalle-label">Comunidad Evaluada</span>
                                <span className="detalle-valor">
                                    {

                                        parseInt(geoDataEst[0]?.properties?.ee1) === 1 ? 'SI' : 'NO' || '-'
                                    }
                                </span>
                            </div>

                            {level > 3 ?
                                <div className="detalle-item">
                                    <Riesgo nivel={geoDataEst[0]?.properties?.nivelriego || '-'} />
                                </div> : null
                            }

                            <div className="detalle-item">
                                <span className="detalle-label">Total viviendas</span>
                                <span className="detalle-valor">
                                    {
                                        geoDataEst?.length || '-'
                                    }
                                    
                                </span>
                            </div>

                            {/* {ee2 && geoDataEst && level > 3 &&
                                <> <div className="detalle-item">
                                    <span className="detalle-label">Viviendas evaluadas</span>
                                    <span className="detalle-valor">
                                        {level < 4 ?
                                            ee2.reduce((acumulador, objeto) => {
                                                // Usamos Number() por seguridad en caso de que el valor venga como string o sea undefined
                                                return acumulador + (Number(objeto.evaluadas) || 0);
                                            }, 0)
                                            :
                                            ee2[0].evaluadas

                                        }
                                    </span>

                                </div>
                                    <div className="detalle-item">
                                        <span className="detalle-label">Cobertura</span>

                                        <span className="detalle-valor">
                                            {
                                                level < 4 ?
                                                    ((ee2.reduce((acumulador, objeto) => {
                                                        // Usamos Number() por seguridad en caso de que el valor venga como string o sea undefined
                                                        return acumulador + (Number(objeto.evaluadas) || 0);
                                                    }, 0) * 100) / geoDataEst?.length).toFixed(2) + '%'
                                                    :
                                                    ee2[0].cob
                                            }
                                        </span>

                                    </div>
                                </>
                            } */}
                            <div className="detalle-item">
                                <span className="detalle-label">Viviendas positivas</span>
                                <span className="detalle-valor" style={{ color: 'red' }}>
                                    {
                                        geoDataEst.filter(item => parseInt(item?.properties?.ejemplares) > 0).length
                                    }
                                </span>
                            </div>

                            <div className="detalle-item">
                                <span className="detalle-label">Viviendas negativas</span>
                                <span className="detalle-valor" >
                                    {
                                        geoDataEst.filter(item => item?.properties?.ejemplares < 1).length
                                    }
                                </span>
                            </div>

                            <div className="detalle-item">
                                <span className="detalle-label">Poblacion total</span>
                                <span className="detalle-valor">{geoDataEst.reduce((total, item) => {
                                    const valor = Number(item?.properties?.habitantes);
                                    return total + (isNaN(valor) ? 0 : valor);
                                }, 0)}</span>
                            </div>
                            {/* <div className="detalle-item">
                            <span className="detalle-label">poblacion total afectada</span>
                            <span className="detalle-valor" style={{ color: 'red' }}>{geoDataEst.filter(item => item?.properties?.ejemplares > 0).reduce((total, item) => {
                                const valor = Number(item?.properties?.habitantes);
                                return total + (isNaN(valor) ? 0 : valor);
                            }, 0)}</span>
                        </div> */}

                            <div className="detalle-item">
                                <span className="detalle-label">Ultima Evaluación </span>
                                {geoDataEst[0]?.properties?.fecha_ultima_evaluacion
                                    ? <span className="detalle-valor">{
                                        new Intl.DateTimeFormat('es-ES', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        }).format(new Date(
                                            geoDataEst[0]?.properties?.fecha_ultima_evaluacion?.split('/')[2],
                                            geoDataEst[0]?.properties?.fecha_ultima_evaluacion?.split('/')[1],
                                            geoDataEst[0]?.properties?.fecha_ultima_evaluacion?.split('/')[0],

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


                            {/* <br /> */}




                        </div>
                        <div className="detalles-grid">
                            <div className="detalle-item">
                                <span className="detalle-valor"> {'Vivieda negativa'}
                                    <span className={`riesgo-circulo ${'cero'}`}></span>
                                </span>

                                <span className="detalle-valor"> {'Vivienda positiva'}
                                    <span className={`riesgo-circulo ${'alto'}`}></span>
                                </span>
                            </div>
                        </div>

                    </>

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
                                    zoom={level == 1 ? 8 : level == 2 ? 8 : level == 3 ? 9 : level > 3 ? 14 : 7}
                                    style={{ height: "93%", width: "100%" }}
                                >
                                    <LayersControl position="topright">
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
                                    <ComponenteGeoJSON geoDataEst={geoDataEst} ento={true} />
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


