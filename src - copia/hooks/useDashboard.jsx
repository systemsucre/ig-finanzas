import { useCallback, useEffect, useState } from "react";
import { URL } from "../Auth/config";
import { start } from '../service/service';

export const useDashboard = () => {
    const [stats, setStats] = useState([]);
    const [kpis, setKpis] = useState({ ingresos: 0, gastos: 0, saldo: 0, activos: 0 });
    const [cargando, setCargando] = useState(true);

    const cargarDashboard = useCallback(async () => {
        setCargando(true);
        try {
            // 1. Obtener KPIs
            const dataConsolidada = await start(`${URL}comuun/stats-mensuales`, { 
                desde: new Date(new Date().getFullYear(), 0, 1),
                estado: 4 
            });

            if (dataConsolidada) {
                const totales = dataConsolidada.reduce((acc, curr) => ({
                    ingresos: acc.ingresos + (parseFloat(curr.total_ingresos) || 0),
                    gastos: acc.gastos + (parseFloat(curr.total_gastos) || 0),
                    activos: acc.activos + (curr.estado === 1 ? 1 : 0)
                }), { ingresos: 0, gastos: 0, activos: 0 });

                setKpis({ ...totales, saldo: totales.ingresos - totales.gastos });
            }
            
            // 2. Cargar Stats Mensuales (Los datos que me mostraste)
            const mensual = await start(`${URL}comuun/stats-mensuales`); 
            
            if (mensual) {
                const nombresMeses = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                
                const datosLimpios = mensual.map(item => ({
                    mes: nombresMeses[item.mes], // Convierte 3 en "Mar"
                    ingresos: parseFloat(item.ingresos), // Convierte "34219500" en número
                    gastos: parseFloat(item.gastos)    // Convierte "96444.00" en número
                }));
                
                setStats(datosLimpios);
            }
        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargarDashboard(); }, [cargarDashboard]);

    return { kpis, stats, cargando, refresh: cargarDashboard };
};