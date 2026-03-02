import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import ticketSalidaIndividual from "../pdfMake/salida";
import fileDownload from "js-file-download";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";

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


    // 4. GUARDAR (CREAR / EDITAR)
    const guardarSalida = async (e, idParaEditar = null) => {
        if (e) e.preventDefault();

        const data = {
            id_tramite: idTramite.campo,
            monto: monto.campo,
            detalle: detalle.campo,
            fecha_solicitud: fechaSolicitud.campo,
            datosAuditoriaExtra
        };

        const endpoint = `${URL}salidas/${idParaEditar ? 'editar' : 'crear'}`;
        const payload = idParaEditar ? { ...data, id: id.campo } : data;

        return await saveDB(
            endpoint,
            payload,
            () => {
                // Si estamos editando, refrescamos la lista de ese trámite antes de irnos
                listarSalidas(idTramite.campo);
                const rol = localStorage.getItem('numRol')
                let path = null
                rol == 3 ? path = 'cajero' : rol == 4 ? path = 'auxiliar' :path = 'gerente'
                const rutaDestino = LOCAL_URL + '/'+path+'/listar-salidas/' + idTramite.campo;

                console.log(rutaDestino, '   ruta destino')
                setTimeout(() => {
                    navigate(rutaDestino);
                }, 1000);
            },
            setCargando
        );
    };

    // 5. ACCIONES DE ESTADO (Centralizadas para refrescar la lista correctamente)
    const ejecutarAccion = async (id, id_tramite, endpoint, msgConfirm, msgCarga) => {
        if (!window.confirm(msgConfirm)) return;

        const res = await start(`${URL}salidas/${endpoint}`, {
            id,
            datosAuditoriaExtra
        }, msgCarga);

        if (res) listarSalidas(id_tramite); // Refrescamos usando el ID del trámite padre
    };

    const aprobarSalida = (id, id_tramite) =>
        ejecutarAccion(id, id_tramite, 'aprobar', "¿Aprobar solicitud?", "Aprobando...");

    const rechazarSalida = (id, id_tramite) =>
        ejecutarAccion(id, id_tramite, 'rechazar', "¿Rechazar solicitud?", "Rechazando...");

    const despacharSalida = (id, id_tramite) =>
        ejecutarAccion(id, id_tramite, 'despachar', "¿Despachar salida?", "Despachando...");

    const eliminarSalida = (id, id_tramite) =>
        ejecutarAccion(id, id_tramite, 'eliminar', "¿Eliminar solicitud de gasto?", "Eliminando...");


    // EXPORTAR PDF
    const exportPDf = async (output, row) => {
        // Generamos el PDF con el objeto 'row'}
        console.log("Iniciando exportación...", { output, row });

        const response = await ticketSalidaIndividual(output, { salida: row });
        console.log(response, ' reponse')
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
            s.codigo_tramite?.toLowerCase().includes(busqueda) ||
            s.detalle?.toLowerCase().includes(busqueda)
        );
        setSalidasFiltradas(filtrados);
    };


    return {
        salidas, salidasFiltradas, cargando,
        estados: { idTramite, monto, detalle, fechaSolicitud },
        setters: { setIdTramite, setMonto, setDetalle, setFechaSolicitud },
        listarSalidas,
        guardarSalida,
        aprobarSalida,
        rechazarSalida,
        despacharSalida,
        eliminarSalida,
        exportPDf,
        handleSearch,
        cargarSalidaPorId,
        allList: () => setSalidasFiltradas(salidas),
    };

};