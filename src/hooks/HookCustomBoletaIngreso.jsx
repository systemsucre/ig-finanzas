import { useState } from "react";
import toast from 'react-hot-toast';

import { useNavigate } from "react-router-dom";
import ticketBoletaIngreso from "../pdfMake/boletaIngreso"; // Renombrado también el PDF
import { LOCAL_URL, name, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";

export const UseCustomBoletasIngreso = () => {
    const navigate = useNavigate();

    // ESTADOS PARA EDICIÓN (Compatibilidad)
    const [idBoleta, setIdBoleta] = useState({ campo: '', valido: null });
    const [idTramite, setIdTramite] = useState({ campo: '', valido: null });
    const [idCliente, setIdCliente] = useState({ campo: '', valido: null });
    const [monto, setMonto] = useState({ campo: '', valido: null });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [fechaSolicitud, setFechaSolicitud] = useState({ campo: new Date().toISOString().split('T')[0], valido: 'true' });

    // ESTADO PARA LISTADO Y MULTIPLES ITEMS
    const [boletas, setBoletas] = useState([]);
    const [boletasFiltradas, setBoletasFiltradas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [itemsBoleta, setItemsBoleta] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);

    // 1. LISTAR TODAS LAS BOLETAS (General)
    const listarBoletas = async () => {
        setCargando(true);
        // Ya no enviamos ID en el body porque el backend listará todo lo agrupado
        const res = await start(`${URL}boletas-ingreso/listar`, {});
        if (res) {
            setBoletas(res);
            setBoletasFiltradas(res);
        }
        setCargando(false);
    };


    const consultarDetalleBoleta = async (codigo_boleta) => {
        setCargando(true);
        const res = await start(`${URL}boletas-ingreso/detalles`, { codigo_boleta });
        if (res) {
            const datos = res[0];
            setIdCliente({ campo: datos.idCliente, valido: 'true' })
            setIdTramite({ campo: datos.idTramite, valido: 'true' })
            setFechaSolicitud({ campo: datos.fecha_solicitud?.split('T')[0], valido: 'true' })
            setItemsBoleta(res);
        }
        setCargando(false);
    };


    const cargarAuxiliares = async () => {
        const resClientes = await start(`${URL}boletas-ingreso/listar-clientes`);
        if (resClientes) setListaClientes(resClientes);
    };
    // 2. GUARDAR BOLETA MASIVA (Varios gastos en una boleta)
    const guardarBoletaMasiva = async (e, listaGastos) => {
        if (e) e.preventDefault();
        if (listaGastos.length === 0) return alert("Debe agregar al menos un ítem a la boleta.");

        const payload = {
            items: listaGastos,
            idCliente:idCliente.campo,
            fecha: fechaSolicitud.campo,
            idTramite: idTramite.campo,
            datosAuditoriaExtra
        };

        return await saveDB(
            `${URL}boletas-ingreso/crear-masivo`,
            payload,
            () => {

                console.log(`${LOCAL_URL}boletas-ingreso`)
                setTimeout(() => navigate(`${LOCAL_URL}/boletas-ingreso`), 1000);
            },
            setCargando
        );
    };


    // MODIFICAR BOLETA EXISTENTE
    const actualizarBoletaMasiva = async (codigo_boleta, listaGastos) => {

        // alert(codigo_boleta)
        if (listaGastos.length === 0) {
            toast.error("Debe haber al menos un ítem.");
            return;
        }

        const payload = {
            codigo_boleta,
            items: listaGastos,
            idCliente:idCliente.campo,
            fecha: fechaSolicitud.campo,
            idTramite: idTramite.campo,
            datosAuditoriaExtra
        };

        return await saveDB(
            `${URL}boletas-ingreso/actualizar-masivo/`,
            payload,
            () => {
                setTimeout(() => navigate(`${LOCAL_URL}/boletas-ingreso`), 1500);
            },
            setCargando,
        );


    };


    // 3. EXPORTAR PDF
    const exportarBoletaPDF = async (output, row) => {
        // Definimos la lógica de generación como una función asíncrona interna
        const generarDocumento = async () => {
            const response = await ticketBoletaIngreso(output, { itemsBoleta });

            if (!response?.success) {
                throw new Error(response?.message || "Error al generar el PDF");
            }

            if (output === "b64") {
                const blob = new Blob(
                    [new Uint8Array(atob(response.content).split("").map(c => c.charCodeAt(0)))],
                    { type: "application/pdf" }
                );
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = name + ` - Boleta_${row?.codigo_boleta || 'boleta'}.pdf`;
                link.click();
                // Pequeña pausa para asegurar la descarga antes de limpiar
                setTimeout(() => window.URL.revokeObjectURL(url), 100);
            }

            return "PDF descargado con éxito";
        };

        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando PDF profesional...',
            success: (msg) => <b>{msg}</b>,
            error: (err) => <b>{err.message}</b>,
        }, {
            style: {
                minWidth: '250px',
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            success: {
                duration: 4000,
                icon: '📄',
            },
        });
    };

    // 5. ACCIONES DE ESTADO (Ahora para Boletas)
    const ejecutarAccionBoleta = async (codigo, endpoint, msgConfirm, msgCarga) => {
        if (!window.confirm(msgConfirm)) return;

        const res = await start(`${URL}boletas-ingreso/${endpoint}`, {
            codigo, // ID interno de la boleta
            datosAuditoriaExtra
        }, msgCarga);

        // Al terminar, refrescamos la lista usando el ID del trámite relacionado
        if (res) navigate(`${LOCAL_URL}/boletas-ingreso`)
    };

    const aprobarBoleta = (codigo) =>
        ejecutarAccionBoleta(codigo, 'aprobar', "¿Aprobar esta boleta?", "Aprobando...");

    const rechazarBoleta = (id, id_tramite) =>
        ejecutarAccionBoleta(id, id_tramite, 'rechazar', "¿Rechazar esta boleta?", "Rechazando...");

    const despacharBoleta = (codigo) =>
        ejecutarAccionBoleta(codigo, 'despachar', "¿Marcar boleta como despachada?", "Despachando...");
    const aprovarDespacharBoleta = (codigo) =>
        ejecutarAccionBoleta(codigo, 'aprobar-despachar', "¿Marcar boleta como despachada?", "Despachando...");

    const habilitarEdicionBoleta = (codigo) =>
        ejecutarAccionBoleta(codigo, 'edicion', "¿Habilitar edición de la boleta?", "Habilitando...");

    const eliminarBoleta = (codigo) =>
        ejecutarAccionBoleta(codigo, 'eliminar', "¿Eliminar permanentemente esta boleta?", "Eliminando...");

    // 6. BUSCADOR POR NÚMERO DE BOLETA O DETALLE

    const handleSearchBoleta = (e) => {
        const busqueda = e.target.value.toLowerCase();

        const filtrados = boletas.filter(s => {
            // Convertimos todo a String y usamos el operador || "" para evitar errores con nulos
            const codigo = String(s.codigo || "").toLowerCase();
            const numero = String(s.numero_boleta || "").toLowerCase();
            const detalle = (s.solicitado_por || "").toLowerCase();

            return (
                codigo.includes(busqueda) ||
                numero.includes(busqueda) ||
                detalle.includes(busqueda)
            );
        });

        setBoletasFiltradas(filtrados);
    };



    return {
        boletas,
        itemsBoleta,
        boletasFiltradas,
        cargando,
        estados: { idBoleta, idTramite, monto, detalle, fechaSolicitud, idTramite, idCliente},
        setters: { setIdBoleta, setIdTramite, setMonto, setDetalle, setFechaSolicitud, setIdTramite, setIdCliente},
        listarBoletas,
        guardarBoletaMasiva,
        actualizarBoletaMasiva,
        exportarBoletaPDF,
        aprobarBoleta,
        rechazarBoleta,
        despacharBoleta,
        aprovarDespacharBoleta,
        habilitarEdicionBoleta,
        eliminarBoleta,
        handleSearchBoleta,
        consultarDetalleBoleta,
        listaClientes,
        cargarAuxiliares,
        handleSearch: (e) => {
            const busqueda = e.target.value.toLowerCase();
            setBoletasFiltradas(boletas.filter(b =>
                b.codigo_tramite?.toLowerCase().includes(busqueda) ||
                b.codigo_boleta?.toLowerCase().includes(busqueda)
            ));
        },
    };
};