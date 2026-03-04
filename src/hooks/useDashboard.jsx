import { useState, useEffect, useCallback } from 'react';
import { start } from '../service/service';
import { URL } from '../Auth/config';

export const useDashboard = () => {
    const [stats, setStats] = useState([]);
    const [kpis, setKpis] = useState({ ingresos: 0, gastos: 0, saldo: 0, activos: 0 });
    const [cargando, setCargando] = useState(true);

    const cargarDashboard = useCallback(async () => {
        setCargando(true);
        // 1. Obtenemos el consolidado que ya tienes hecho
        const dataConsolidada = await start(`${URL}comuun/dash-1`, { 
            desde: new Date(new Date().getFullYear(), 0, 1), // Desde el 1 de enero
            estado: 4 
        });

        // 2. Cálculo de KPIs Globales
        if (dataConsolidada) {
            const totales = dataConsolidada.reduce((acc, curr) => ({
                ingresos: acc.ingresos + curr.total_ingresos,
                gastos: acc.gastos + curr.total_gastos,
                activos: acc.activos + (curr.estado === 1 ? 1 : 0)
            }), { ingresos: 0, gastos: 0, activos: 0 });

            setKpis({
                ...totales,
                saldo: totales.ingresos - totales.gastos
            });
        }
        
        // 3. (Opcional) Cargar stats mensuales para el gráfico
        // const mensual = await start(`${URL}comuun/stats-mensuales`);
        // setStats(mensual);

        setCargando(false);
    }, []);

    useEffect(() => { cargarDashboard(); }, [cargarDashboard]);

    return { kpis, stats, cargando, refresh: cargarDashboard };
};