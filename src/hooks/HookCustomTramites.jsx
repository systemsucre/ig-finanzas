import { useState, useEffect, useCallback } from "react";
import toast from 'react-hot-toast';

import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { useNavigate } from "react-router-dom";
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";
import reporteConsolidoTramite from "../pdfMake/tramite";
import reporteConsolidoTramiteAuxiliar from "../pdfMake/tramiteAuxiliar";

export const useTramites = () => {
    const navigate = useNavigate();

    // --- ESTADOS PARA FORMULARIO (Tabla tramites) ---
    const [idTipoTramite, setIdTipoTramite] = useState({ campo: '', valido: null });
    const [fechaIngreso, setFechaIngreso] = useState({ campo: '', valido: null });
    const [fechaFinalizacion, setFechaFinalizacion] = useState({ campo: '', valido: null });
    const [plazo, setPlazo] = useState({ campo: 0, valido: 'true' });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [costo, setCosto] = useState({ campo: 0.00, valido: 'true' });
    const [codigo, setCodigo] = useState({ campo: '', valido: null });
    const [otros, setOtros] = useState({ campo: '', valido: 'true' });
    const [moneda, setMoneda] = useState({ campo: parseInt(localStorage.getItem('moneda')) || null, valido: parseInt(localStorage.getItem('moneda')) || null });
    const [estado, setEstado] = useState({ campo: 1, valido: 'true' }); // 1: En curso, 0: Paralizado

    // --- ESTADOS PARA LISTADO Y AUXILIARES ---
    const [tramites, setTramites] = useState([]);
    const [monedas, setMonedas] = useState([]);
    const [tramitesFiltrados, setTramitesFiltrados] = useState([]);
    const [tramitesFiltradosBoleta, setTramitesFiltradosBoleta] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Listas para los Selects del formulario
    const [listaTipos, setListaTipos] = useState([]);

    // 1. LISTAR TRÁMITES (Principal)
    const listarTramites = useCallback(async () => {
        setCargando(true);
        const res = await start(`${URL}comuun/listar-tramites`,);
        // alert()
        if (res) {
            setTramites(res);
            const activos = res.filter(t => t.eliminado > 0);
            // setTramites(activos);
            setTramitesFiltrados(activos);
        }
        setCargando(false);
    }, []);

    // 1.1 LISTAR TRÁMITES (Activos)
    const listarTramitesActivos = async () => {
        setCargando(true);
        const res = await start(`${URL}comuun/listar-tramites`,);
        // alert()
        if (res) {
            setTramites(res);
            const activos = res.filter(t => t.eliminado > 0 && t.estado === 1);
            // setTramites(activos);
            // console.log(activos, ' tramites activos')  
            setTramitesFiltradosBoleta(activos);  
        }
        setCargando(false);
    };

    // 2. CARGAR AUXILIARES (Para los combobox del formulario)
    const cargarAuxiliares = useCallback(async () => {
        const resTipos = await start(`${URL}tramites/listar-tipo-tramites`);
        if (resTipos) setListaTipos(resTipos);
        const resMonedas = await start(`${URL}tramites/listar-monedas`);
        if (resMonedas) setMonedas(resMonedas);
    }, []);


    // cargamos la informacion del tramite. (costo, etc), 
    const cargarTramiteInfo = async (id) => {
        // alert('tramite ' + id)
        setCargando(true);
        const res = await start(`${URL}comuun/listar-tramites`, { id }); // Debes crear este endpoint
        if (res) {
            // console.log(res,' codigo', id)
            setTramites(res)
        }
        setCargando(false);
    };
    // Cargar Tramite por Id desde la BD, para garantizar la veracidad de la informacion
    const cargarTramitePorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}comuun/obtener-tramite`, { id }); // Debes crear este endpoint
        if (res) {
            // console.log(res,' codigo', id)
            setTramites(res)
            setCodigo({ campo: res.codigo, valido: 'true' });
            setIdTipoTramite({ campo: res.id_tipo_tramite, valido: 'true' });
            setFechaIngreso({ campo: res.fecha_ingreso.split('T')[0], valido: 'true' });
            setFechaFinalizacion({ campo: res.fecha_finalizacion.split('T')[0], valido: 'true' });
            setEstado({ campo: res.estado, valido: 'true' });
            setCosto({ campo: res.costo, valido: 'true' });
            setDetalle({ campo: res.detalle || '', valido: 'true' });
            setOtros({ campo: res.otros || '', valido: 'true' });
            setMoneda({ campo: res.id_moneda, valido: 'true' });
        }
        setCargando(false);
    };
    // 3. GUARDAR O ACTUALIZAR
    const guardarTramite = async (e, idParaEditar = null) => {
        if (e) e.preventDefault();

        const data = {
            fecha_ingreso: fechaIngreso.campo,
            fecha_finalizacion: fechaFinalizacion.campo,
            plazo: plazo.campo,
            id_tipo_tramite: idTipoTramite.campo,
            detalle: detalle.campo,
            costo: costo.campo,
            otros: otros.campo,
            estado: estado.campo,
            id_moneda: moneda.campo,
            usuario: 1, // ID usuario sesión
            fecha_: new Date().toISOString(), // Para created_at o modified_at,
            datosAuditoriaExtra
        };

        const endpoint = `${URL}tramites/${idParaEditar ? 'editar' : 'crear'}`;
        const payload = idParaEditar ? { ...data, id: idParaEditar } : data;

        const res = await saveDB(
            endpoint,
            payload,
            () => {
                listarTramites();
                const rol = parseInt(localStorage.getItem('numRol'));
                let base = '';
                if (rol === 1) base = '/admin';
                else if (rol === 2) base = '/gerente';
                else if (rol === 3) base = '/cajero';


                setTimeout(() => navigate(`${LOCAL_URL}${base}/lista-cajas`), 1000);
            },
            setCargando
        );
        return res;
    };

    // Función para ELIMINACIÓN LÓGICA
    const eliminarTramite = async (id, estadoActual) => {
        const msgConfirm = estadoActual === 1 ? 'Restaurar Tramite' : 'Eliminar Tramite?';

        // Usamos una confirmación clara para evitar accidentes
        if (window.confirm(msgConfirm)) {

            // Enviamos el ID y el nuevo estado (0 = Eliminado)
            // Usamos la misma lógica de enviar al endpoint de actualización de estado
            const res = await start(`${URL}tramites/eliminar-logica`, {
                id,
                estado: estadoActual, datosAuditoriaExtra // Estado de eliminación lógica
            }, estadoActual === 1 ? 'Restaurando Tramite.....' : 'Eliminando tramite ........');

            if (res) {
                // Si el backend responde correctamente, refrescamos la lista
                listarTramites();
            }
        }
    };

    // EXPORTAR PDF
    const exportPDfTramites = async (output, row) => {
        // Definimos la lógica dentro de una función interna para pasarla al toast
        const generarProceso = async () => {
            // 1. Obtener ingresos
            const ingresos = await start(`${URL}comuun/ingresos`, { id: row.id });

            // 2. Obtener salidas
            const salidas = await start(`${URL}comuun/salidas`, { id: row.id });

            // 2.1. Obtener datos del tramite
            const tramite = await start(`${URL}comuun/listar-tramites`, { id: row.id });

            if (!tramite || tramite.length === 0) {
                throw new Error("No se encontraron datos del trámite.");
            }

            // 3. Generar el PDF (Pasamos el output dinámico)

            let response = null
            if (parseInt(localStorage.getItem('numRol')) === 4)
                response = await reporteConsolidoTramiteAuxiliar(output, {
                    tramite: tramite[0],
                    ingresos,
                    salidas
                });
            else
                response = await reporteConsolidoTramite(output, {
                    tramite: tramite[0],
                    ingresos,
                    salidas
                });

            if (!response?.success) {
                throw new Error(response?.message || "Error al generar PDF");
            }

            // 4. Si es descarga (b64), procesar el archivo
            if (output === "b64") {
                const byteCharacters = atob(response.content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });

                const nombreArchivo = `Reporte_Tramite_${row.codigo || row.id}.pdf`;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = nombreArchivo;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }

            return "PDF generado con éxito";
        };

        // Ejecutamos el toast que envuelve toda la promesa
        toast.promise(generarProceso(), {
            loading: 'Obteniendo datos y generando PDF...',
            success: (msg) => <b>{msg}</b>,
            error: (err) => <b>{err.message.toString()}</b>,
        });
    };

    // 5. BÚSQUEDA FILTRADA
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        if (!busqueda) {    
            setTramitesFiltrados(tramites);
            return;
        }

        const filtrados = tramites.filter((t) => (
            (t.codigo && t.codigo.toLowerCase().includes(busqueda)) ||
            // Convertimos a String y usamos optional chaining
            (t.numero && String(t.numero).includes(busqueda))
        ));
        setTramitesFiltrados(filtrados);
    };

    // 6. FILTROS RÁPIDOS
    const filterByEstado = (est) => { setTramitesFiltrados(tramites.filter(t => t.estado == est)) };
    const filterByDelete = () => setTramitesFiltrados(tramites.filter(t => t.eliminado == 0));
    const allList = () => setTramitesFiltrados(tramites);

    useEffect(() => {
        listarTramites();
        if (localStorage.getItem('numRol') != 4)
            cargarAuxiliares();

        // listarTramites, cargarAuxiliares
    }, []);

    return {
        tramitesFiltrados, tramites,tramitesFiltradosBoleta,
        auxiliares: { listaTipos, monedas },
        handleSearch,
        cargando,
        estados: {
            idTipoTramite, fechaIngreso, codigo, moneda,
            fechaFinalizacion, plazo, detalle, costo, otros, estado
        },
        setters: {
            setIdTipoTramite, setFechaIngreso, setMoneda,
            setFechaFinalizacion, setPlazo, setDetalle, setCosto, setOtros, setEstado
        },
        guardarTramite,
        listarTramitesActivos,
        filterByEstado,
        allList,
        cargarTramitePorId,
        cargarTramiteInfo,
        eliminarTramite,
        filterByDelete,
        exportPDfTramites
    };
};