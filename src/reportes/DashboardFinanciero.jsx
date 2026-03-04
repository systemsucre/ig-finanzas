import React, { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { faArrowUp, faArrowDown, faWallet, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DashboardFinanciero = () => {
    const { kpis, stats, cargando } = useDashboard();
    
    // TRUCO MAESTRO: Estado para controlar el primer renderizado real
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        // Una vez que el componente se monta, esperamos un suspiro para que el DOM se estabilice
        const timer = setTimeout(() => setMontado(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (cargando) return <div className="p-5 text-center">Cargando datos...</div>;

    const CardKPI = ({ titulo, monto, icono, color }) => (
        <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 mb-3" style={{ borderRadius: '15px' }}>
                <div className="d-flex align-items-center">
                    <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${color}15`, color: color }}>
                        <FontAwesomeIcon icon={icono} size="lg" />
                    </div>
                    <div>
                        <p className="text-muted small mb-0 fw-bold">{titulo}</p>
                        <h5 className="fw-bold mb-0">Bs. {monto.toLocaleString()}</h5>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <h3 className="fw-bold text-dark mb-4">Métricas de Gestión {new Date().getFullYear()}</h3>

            <div className="row g-3 mb-4">
                <CardKPI titulo="INGRESOS" monto={kpis.ingresos} icono={faArrowUp} color="#10b981" />
                <CardKPI titulo="GASTOS" monto={kpis.gastos} icono={faArrowDown} color="#f43f5e" />
                <CardKPI titulo="SALDO NETO" monto={kpis.saldo} icono={faWallet} color="#6366f1" />
                <CardKPI titulo="TRÁMITES" monto={kpis.activos} icono={faClipboardList} color="#f59e0b" />
            </div>

            <div className="row">
                <div className="col-lg-8 col-md-12 mb-4">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px', minHeight: '450px' }}>
                        <h6 className="fw-bold mb-4">Flujo Mensual de Caja</h6>
                        
                        {/* Contenedor con altura fija y desborde controlado */}
                        <div style={{ width: '100%', height: '350px', position: 'relative' }}>
                            {montado && stats.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                                    <BarChart 
                                        data={stats}
                                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="mes" 
                                            tick={{fill: '#64748b', fontSize: 11}}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis 
                                            tick={{fill: '#64748b', fontSize: 11}}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip 
                                            cursor={{fill: '#f8fafc'}}
                                            contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                        />
                                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px'}} />
                                        <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar dataKey="gastos" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                    Preparando visualización...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-12">
                    <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>
                        <h6 className="fw-bold mb-4">Salud Financiera</h6>
                        <div className="py-4">
                            <h1 className="display-5 fw-bold" style={{ color: '#1e293b' }}>
                                {((kpis.saldo / kpis.ingresos) * 100 || 0).toFixed(1)}%
                            </h1>
                            <p className="text-muted">Margen Operativo Neto</p>
                        </div>
                        <div className="progress mb-3" style={{ height: '12px', borderRadius: '10px' }}>
                            <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${Math.max(0, (kpis.saldo / kpis.ingresos) * 100)}%` }}
                            ></div>
                        </div>
                        <p className="small text-muted">
                            El capital disponible representa una reserva positiva para la entidad.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardFinanciero;