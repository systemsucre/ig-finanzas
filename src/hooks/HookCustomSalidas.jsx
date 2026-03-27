import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import ticketSalidaIndividual from "../pdfMake/salida";
import {  URL } from '../Auth/config';
import {  start } from '../service/service';

export const UseCustomSalidas = () => {
    const navigate = useNavigate();

    // ESTADOS DEL FORMULARIO
    const [id, setId] = useState({ campo: '', valido: null });
    const [idTramite, setIdTramite] = useState({ campo: '', valido: null });
    const [monto, setMonto] = useState({ campo: '', valido: null });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [fechaSolicitud, setFechaSolicitud] = useState({ campo: '', valido: null });

    // ESTADOS DE DATOS

    const [salidas, setSalidas] = useState([]);
    const [salidasFiltradas, setSalidasFiltradas] = useState([]);
    const [cargando, setCargando] = useState(false);

    // 2. LISTAR SALIDAS (Corregido para usar el estado correcto)
    const listarSalidas = async (id) => {
        if (!id) return;
        const res = await start(`${URL}salidas/listar`, { id });
        if (res) {
            // console.log(res)
            setSalidas(res);
            setSalidasFiltradas(res);
        }
    };

    // 3. CARGAR PARA EDICIÓN
    const cargarSalidaPorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}salidas/obtener-salida`, { id });
        if (res) {
            setId({ campo: res[0].id, valido: 'true' });
            setIdTramite({ campo: res[0].id_tramite, valido: 'true' });
            setMonto({ campo: res[0].monto, valido: 'true' });
            setDetalle({ campo: res[0].detalle, valido: 'true' });
            setFechaSolicitud({
                campo: res[0].fecha_solicitud?.split('T')[0],
                valido: 'true'
            });
        }
        setCargando(false);
    };




    // EXPORTAR PDF
    const exportPDf = async (output, row) => {
        // Generamos el PDF con el objeto 'row'}
        // console.log("Iniciando exportación...", { output, row });

        const response = await ticketSalidaIndividual(output, { salida: row });
        // console.log(response, ' reponse')
        if (!response?.success) {
            alert(response?.message);
            return;
        }

        if (output === "b64") {
            const byteCharacters = atob(response.content);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            const nombreArchivo = `Salida_${row.numero + ' Tramite ' + row.codigo_tramite || 'sin-numero'}.pdf`;

            // MÉTODO DE DESCARGA NATIVO (A prueba de fallos)
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log("3. Descarga iniciada");
        }

    };

    // 6. BUSCADORES
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = salidas.filter(s =>
            s.codigo_boleta?.toLowerCase().includes(busqueda) ||
            s.detalle?.toLowerCase().includes(busqueda) 
        );
        setSalidasFiltradas(filtrados);
    };


    return {
        salidas, salidasFiltradas, cargando,
        estados: { idTramite, monto, detalle, fechaSolicitud },
        setters: { setIdTramite, setMonto, setDetalle, setFechaSolicitud },
        listarSalidas,
    
        exportPDf,
        handleSearch,
        cargarSalidaPorId,
        allList: () => setSalidasFiltradas(salidas),
    };

};