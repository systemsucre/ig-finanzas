import { useState,  } from "react";
import { URL } from '../Auth/config';
import {  start } from '../service/service';
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";

export const UseCustomSalidasCajero = () => {

    // ESTADOS DEL FORMULARIO
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
        // alert(id)
        if (!id) return;
        const res = await start(`${URL}salidas-cajero/listar`, { id });
        if (res) {
            setSalidas(res);
            setSalidasFiltradas(res);
        }
    };

    // 3. CARGAR PARA EDICIÓN
    const cargarSalidaPorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}salidas-cajero/obtener-salida`, { id });
        if (res) {
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


    // 5. ACCIONES DE ESTADO (Centralizadas para refrescar la lista correctamente)
    const ejecutarAccion = async (id, id_tramite, endpoint, msgConfirm, msgCarga) => {
        if (!window.confirm(msgConfirm)) return;

        const res = await start(`${URL}salidas-cajero/${endpoint}`, {
            id,
            datosAuditoriaExtra
        }, msgCarga);

        if (res) listarSalidas(id_tramite); // Refrescamos usando el ID del trámite padre
    };

    const despacharSalida = (id, id_tramite) =>
        ejecutarAccion(id, id_tramite, 'despachar', "Despachar solicitud?", "Despachando...");

 

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
        despacharSalida,
        handleSearch,
        cargarSalidaPorId,
        allList: () => setSalidasFiltradas(salidas),
    };
};