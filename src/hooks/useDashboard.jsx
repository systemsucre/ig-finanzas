import { useCallback, useEffect, useState } from "react";
import { URL } from "../Auth/config";
import { start } from '../service/service';

export const useDashboard = () => {
    const [moneda, setMoneda] = useState({
        campo: parseInt(localStorage.getItem('moneda')) || 1,
        valido: 'true'
    });

    const [cajas, setCajas] = useState([]);
    const [stats, setStats] = useState([]);
    const [monedas, setMonedas] = useState([]);
    const [kpis, setKpis] = useState({ ingresos: 0, gastos: 0, saldo: 0, activos: 0 });
    const [cargando, setCargando] = useState(true);

    // FUNCIÓN ÚNICA DE CARGA
    const cargarDatos = useCallback(async (idMonedaManual) => {
        // alert(idMonedaManual, 'moneda desde select')
        const idMoneda = idMonedaManual || moneda.campo;
        if (!idMoneda) return;

        setCargando(true);
        try {
            // 1. Obtener datos (KPIs y Stats en una o dos llamadas según tu API)
            // Agregamos el parámetro de moneda a AMBAS llamadas para evitar el undefined
            const data = await start(`${URL}comuun/stats-mensuales`, { moneda: idMoneda });

            if (data && Array.isArray(data)) {
                // Calcular KPIs
                const totales = data.reduce((acc, curr) => ({
                    ingresos: acc.ingresos + (parseFloat(curr.ingresos) || 0),
                    gastos: acc.gastos + (parseFloat(curr.gastos) || 0),
                }), { ingresos: 0, gastos: 0 });

                setKpis({
                    ...totales,
                    saldo: totales.ingresos - totales.gastos,
                    activos: 0 // Ajustar según tu lógica de 'estado' si viene en el array
                });

                // Formatear Stats para el gráfico
                const nombresMeses = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                const datosLimpios = data.map(item => ({
                    mes: nombresMeses[item.mes] || 'S/N',
                    ingresos: parseFloat(item.ingresos) || 0,
                    gastos: parseFloat(item.gastos) || 0
                }));
                setStats(datosLimpios);
            }
        } catch (error) {
            console.error("Error en dashboard:", error);
        } finally {
            setCargando(false);
        }
    }, [moneda.campo]);

    const listarConfiguracion = async () => {
        const [resMonedas, resCajas] = await Promise.all([
            start(`${URL}comuun/listar-monedas`),
            start(`${URL}comuun/listar-cajas`)
        ]);
        if (resMonedas) setMonedas(resMonedas);
        if (resCajas) setCajas(resCajas);
    };

    // Solo se ejecuta al montar el componente
    useEffect(() => {
        listarConfiguracion();
        cargarDatos();
    }, []);

    return {
        kpis, stats, moneda, setMoneda,
        monedas, cajas, cargando,
        refresh: cargarDatos // Esta función ahora acepta un ID opcional
    };
};