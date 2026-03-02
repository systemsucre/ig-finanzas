import { useState, } from "react";
import { URL } from '../Auth/config';
import { start } from '../service/service';
import { generarReporteFinanciero } from "../reportes/reportes";
import { useCallback } from "react";
import { useEffect } from "react";
import { generarReporteResumen } from "../reportes/generarReporteConsolidado";

export const useReportes = () => {

    // --- ESTADOS PARA FORMULARIO  ---

    const [estado, setEstado] = useState({ campo: 4, valido: 'true' });
    const [desde, setDesde] = useState({ campo: '', valido: null });
    const [hasta, setHasta] = useState({ campo: '', valido: null }); // 
    const [tramite, setTramite] = useState({ campo: '', valido: null }); // 
    const [listaTramite, setListaTramite] = useState([]); // 

    // 1. LISTAR TRÁMITES (Principal)
    const listarTramites = useCallback(async () => {
        const res = await start(`${URL}comuun/listar-tramites`,);  
        // alert()
        if (res) {
            // console.log(res, '  lista tramites')
            setListaTramite(res);
        }
    }, []);


    const reporteSalidas = async (id, desde, hasta) => {
        // const data = await getSalidasExcel(id, desde, hasta);
        const data = await start(`${URL}comuun/salidas-excel`, { id, desde, hasta });

        const tramite = (await start(`${URL}comuun/listar-tramites`, { id }))[0];
        // console.log(data, '  salidas')

        await generarReporteFinanciero('SALIDAS', data, tramite, { desde, hasta });
    };


    const reporteIngresos = async (id, desde, hasta) => {
        // const data = await getIngresosExcel(id, desde, hasta);
        const data = await start(`${URL}comuun/ingresos-excel`, { id, desde, hasta });
        const tramite = (await start(`${URL}comuun/listar-tramites`, { id }))[0];
        await generarReporteFinanciero('INGRESOS', data, tramite, { desde, hasta });
    };


    const reporteGeneral = async (id, desde, hasta) => {
        const ingresos = await await start(`${URL}comuun/ingresos-excel`, { id, desde, hasta });
        const salidas = await start(`${URL}comuun/salidas-excel`, { id, desde, hasta });
        const tramite = (await start(`${URL}comuun/listar-tramites`, { id }))[0];

        // Combinar y normalizar datos
        const mixto = [
            ...ingresos.map(i => ({ ...i, tipo_mov: 'INGRESO', fecha: i.fecha_ingreso })),
            ...salidas.map(s => ({ ...s, tipo_mov: 'SALIDA', fecha: s.fecha_solicitud }))
        ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        await generarReporteFinanciero('GENERAL', mixto, tramite, { desde, hasta });
    };


    const reporteConsolidado = async (desde, hasta, estado) => {


        const data = (await start(`${URL}comuun/reporte-consolidado`, { desde, hasta, estado, }));

        if (data && data.length > 0) {
            await generarReporteResumen(data, { desde, hasta });
        } else {
            alert("No hay movimientos en el rango de fechas seleccionado");
        }
    };


    useEffect(() => {
        listarTramites();
    }, []);

    return {
        estados: { desde, hasta, tramite, estado },
        setters: { setDesde, setHasta, setTramite, setEstado },
        listaTramite,
        reporteSalidas,
        reporteIngresos,
        reporteGeneral,
        reporteConsolidado
    };
};