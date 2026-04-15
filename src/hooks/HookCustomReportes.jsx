import { useState, } from "react";
import { URL } from '../Auth/config';
import { start } from '../service/service';
import { generarReporteFinanciero } from "../reportes/reportes";
import { useCallback } from "react";
import { useEffect } from "react";
import { generarReporteResumen } from "../reportes/generarReporteConsolidado";
import toast from "react-hot-toast";
import { reportesMovimientos } from "../reportes/reportesMovimientos";

export const useReportes = () => {

    // --- ESTADOS PARA FORMULARIO  ---

    const [estado, setEstado] = useState({ campo: 4, valido: 'true' });
    const [desde, setDesde] = useState({ campo: '', valido: null });
    const [hasta, setHasta] = useState({ campo: '', valido: null }); // 
    const [tramite, setTramite] = useState({ campo: '', valido: null }); // 
    const [moneda, setMoneda] = useState({ campo: parseInt(localStorage.getItem('moneda')) || null, valido: parseInt(localStorage.getItem('moneda')) || null });

    const [listaTramite, setListaTramite] = useState([]); // 
    const [monedas, setMonedas] = useState([]);

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
        const generarDocumento = async () => {
            // const data = await getSalidasExcel(id, desde, hasta);
            const data = await start(`${URL}comuun/salidas-excel`, { id, desde, hasta });

            const tramite = (await start(`${URL}comuun/listar-tramites`, { id }))[0];
            // console.log(data, '  salidas')

            if (data.length > 0) {
                await generarReporteFinanciero('SALIDAS', data, tramite, { desde, hasta });
                return "EXCEL descargado con éxito";
            }
            else
                alert("No hay movimientos en el rango de fechas seleccionado");
        }
        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando EXCEL profesional...',
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


    const reporteIngresos = async (id, desde, hasta) => {

        const generarDocumento = async () => {
            // const data = await getIngresosExcel(id, desde, hasta);
            const data = await start(`${URL}comuun/ingresos-excel`, { id, desde, hasta });
            const tramite = (await start(`${URL}comuun/listar-tramites`, { id }))[0];
            if (data.length > 0) {
                await generarReporteFinanciero('INGRESO', data, tramite, { desde, hasta });
                return "EXCEL descargado con éxito";
            }
            else alert("No hay movimientos en el rango de fechas seleccionado");

        }

        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando EXCEL profesional...',
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




    const reporteGeneral = async (id, desde, hasta) => {

        const generarDocumento = async () => {

            const ingresos = await await start(`${URL}comuun/ingresos-excel`, { id, desde, hasta });
            const salidas = await start(`${URL}comuun/salidas-excel`, { id, desde, hasta });
            const tramite = (await start(`${URL}comuun/listar-tramites`, { id }))[0];

            // Combinar y normalizar datos
            const mixto = [
                // Asegúrate de incluir i.cliente_nombre o como se llame en tu DB
                ...ingresos.map(i => ({
                    ...i,
                    tipo_mov: 'INGRESO',
                    fecha: i.fecha_ingreso,
                    cliente_nombre: i.cliente_nombre || i.cliente // <--- AGREGAR ESTO
                })),
                ...salidas.map(s => ({
                    ...s,
                    tipo_mov: 'SALIDA',
                    fecha: s.fecha_solicitud,
                    cliente_nombre: '-' // Las salidas no tienen cliente pagador
                }))
            ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

            if (mixto.length > 0) {

                await generarReporteFinanciero('GENERAL', mixto, tramite, { desde, hasta });
                return "EXCEL descargado con éxito";
            }
            else alert("No hay movimientos en el rango de fechas seleccionado");
        };

        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando EXCEL profesional...',
            success: (msg) => <b>{msg || 'Reporte excel generado'}</b>,
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


    const reportesTodasSalidas = async (desde, hasta) => {
        // alert('todas')
        const generarDocumento = async () => {
            // const data = await getSalidasExcel(id, desde, hasta);
            const data = await start(`${URL}comuun/salidas-excel`, { desde, hasta,moneda:moneda.campo }); 


            if (data.length > 0) {
                await reportesMovimientos('SALIDAS', data, { desde, hasta });
                return "Excel descargado con éxito";
            }
            else
                alert("No hay movimientos en el rango de fechas seleccionado");
        }
        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando EXCEL profesional...',
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


    const reportesTodosIngresos = async (desde, hasta) => {

        const generarDocumento = async () => {
            // const data = await getIngresosExcel(id, desde, hasta);
            const data = await start(`${URL}comuun/ingresos-excel`, { desde, hasta, moneda:moneda.campo });
            if (data.length > 0) {
                await reportesMovimientos('INGRESOS', data, { desde, hasta });
                return "Excel descargado con éxito";
            }
            else alert("No hay movimientos en el rango de fechas seleccionado");

        }

        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando EXCEL profesional...',
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


    const reporteConsolidado = async (desde, hasta, estado) => {

        const generarDocumento = async () => {
            const data = (await start(`${URL}comuun/reporte-consolidado`, { desde, hasta, estado, moneda:moneda.campo}));

            if (data && data.length > 0) {
                await generarReporteResumen(data, { desde, hasta });
            } else {
                alert("No hay movimientos en el rango de fechas seleccionado");
            }
        }
        // Ejecutamos la promesa con los mensajes automáticos
        toast.promise(generarDocumento(), {
            loading: 'Generando reporte Excel...',
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

    const listarMonedas = async () => {
        const resMonedas = await start(`${URL}comuun/listar-monedas`);
        if (resMonedas) setMonedas(resMonedas);
    }
    useEffect(() => {
        listarTramites();
        listarMonedas()
    }, []);

    return {
        estados: { desde, hasta, tramite, estado, moneda },
        setters: { setDesde, setHasta, setTramite, setEstado, setMoneda },
        listaTramite,
        monedas,
        reporteSalidas,
        reportesTodosIngresos,
        reportesTodasSalidas,
        reporteIngresos,
        reporteGeneral,
        reporteConsolidado
    };
};