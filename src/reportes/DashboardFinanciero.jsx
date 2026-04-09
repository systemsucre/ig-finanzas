import { useState, useEffect } from 'react';
import Select from 'react-select';

import { useDashboard } from '../hooks/useDashboard';
// 1. SOLO importa lo que pertenece a recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { faArrowUp, faArrowDown, faWallet, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 2. Define CardKPI AQUÍ AFUERA (o dentro del componente, pero no lo importes de recharts)
const CardKPI = ({ titulo, monto, icono, color, moneda, monedas, tipo = 'Numerico' }) => (
    <div className="col-md-3 col-sm-6" >
        <div className="card border-0 shadow-sm p-3 mb-3" style={{ borderRadius: '15px', background: 'rgba(255,255,255 ,.2)' }}  >
            <div className="d-flex align-items-center ">
                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${color}15`, color: color }}>
                    <FontAwesomeIcon icon={icono} size="lg" />
                </div>
                <div className='' style={{ width: '65%' }}>
                    <p className="text-center text-white small mb-0 fw-bold">{titulo}</p>
                    <h5 className="text-white text-center fw-bold mb-0"> {tipo === 'porcentaje' ? '%' : monedas.find(e => e.value === moneda.campo)?.simbolo} {Number(monto || 0).toLocaleString()}</h5>
                </div>

            </div>


        </div>
    </div>
);

const DashboardFinanciero = () => {
    const { kpis, stats, moneda, setMoneda, monedas, refresh, cargarDashboardAux, cargando, cajas, } = useDashboard();
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMontado(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (cargando) return <div className="p-5 text-center">Cargando métricas...</div>;


    // console.log(kpis, ' comsolidado')

    return (
        <main className="container-xl mt-5" style={{ maxWidth: "100%", marginTop: '2rem' }}>
            <div>
                <h3 className="text-dark fw-bold mb-0 p-2 text-titulos">Gestión Financiera {new Date().getFullYear()}</h3>
            </div>
            <div className="panel-custom  rounded shadow-sm p-2 mx-2" >
                {/* Fila de Cards KPI - Ahora sí funcionará */}
                <div className="row g-3 mb-4">
                    <CardKPI titulo="INGRESOS" monto={kpis.ingresos} icono={faArrowUp} color="#10b981" moneda={moneda} monedas={monedas} />
                    <CardKPI titulo="GASTOS" monto={kpis.gastos} icono={faArrowDown} color="#f43f5e" moneda={moneda} monedas={monedas} />
                    <CardKPI titulo="SALDO NETO" monto={kpis.saldo} icono={faWallet} color="#6366f1" moneda={moneda} monedas={monedas} />
                    <CardKPI titulo="REI <70" monto={(kpis.gastos / kpis.ingresos) * 100} icono={faClipboardList} color="#f59e0b" moneda={moneda} monedas={monedas} tipo={'porcentaje'} />
                </div>

                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px', minHeight: '450px' }}>
                    <h6 className="text-white fw-bold mb-4" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Flujo de Caja Mensual ({monedas.find(e => e.value === moneda.campo)?.simbolo})</h6>
                    <div className="col-md-4">
                        <label className="text-white">Seleccionar Moneda </label>
                        <Select
                            placeholder='Busque por código caja...'
                            onChange={(e) => {
                                if (e) {
                                    const nuevoId = e.value;
                                    setMoneda({ campo: nuevoId, valido: 'true' });
                                    localStorage.setItem('moneda', nuevoId);
                                    // Llamamos a la función unificada pasando el nuevo ID directamente
                                    refresh(nuevoId);
                                }
                            }}
                            options={monedas}
                            value={monedas.find(opt => opt.value === moneda.campo) || null}
                            isSearchable={true}
                            isClearable={true}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: 'transparent', // Fondo transparente
                                    borderRadius: '10px',
                                    padding: '5px',
                                    borderColor: '#dee2e6',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#dee2e6'
                                    }
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: '#fff' // Color del texto seleccionado (blanco para que resalte sobre el fondo oscuro)
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: 'rgba(255, 255, 255, 0.7)' // Color del placeholder semi-transparente
                                }),
                                menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#ffffff', // Fondo de la lista desplegable blanco
                                    borderRadius: '10px',
                                    zIndex: 9999 // Asegura que se vea por encima de otros elementos
                                }),
                                option: (base, { isFocused, isSelected }) => ({
                                    ...base,
                                    backgroundColor: isSelected
                                        ? '#10b981' // Color si está seleccionado (verde esmeralda)
                                        : isFocused
                                            ? '#f1f5f9' // Color al pasar el mouse (gris muy claro)
                                            : '#ffffff', // Color por defecto
                                    color: isSelected ? '#fff' : '#333', // Texto oscuro en la lista para legibilidad
                                    cursor: 'pointer',
                                    '&:active': {
                                        backgroundColor: '#10b981'
                                    }
                                })
                            }}
                        />
                    </div>
                    <div style={{
                        width: '100%',
                        // marginTop: '1rem',
                        height: '350px',
                        minWidth: 0,        // Evita que el flexbox colapse a -1
                        minHeight: '350px', // Asegura que el alto no sea 0
                        position: 'relative'
                    }}>
                        {montado && stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    key={stats.length + moneda.campo} // <-- ESTO ES CLAVE
                                    data={stats}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="mes"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val.toLocaleString()}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${monedas.find(e => e.value === moneda.campo)?.simbolo} ${Number(value).toLocaleString()}`, '']}
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" align="right" height={36} />
                                    <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="gastos" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted italic">
                                {cargando ? "Cargando datos..." : "No hay datos para mostrar."}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado derecho: Salud Financiera */}
                <h6 className="text-white fw-bold mb-4 " style={{ fontSize: '1rem', marginTop: '2rem' }} >Otros indicadores</h6>
                <div className="row g-3 mb-4">

                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4">
                                <h1 className="text-white display-5 fw-bold">
                                    {((kpis.saldo / kpis.ingresos) * 100 || 0).toFixed(1)}%
                                </h1>
                                <p className="text-white">Margen de Utilidad Neta</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 mb-4 "  >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4">
                                <h1 className="text-white display-5 fw-bold">
                                    {(kpis.ingresos / kpis.gastos || 0).toFixed(1)}
                                </h1>
                                <p className="text-white">RATIO</p>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 mb-4" >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4">
                                <h1 className="text-white display-5 fw-bold" style={{ fontSize: '2rem', paddingTop: '2.5rem', paddingBottom: '.55rem' }}>
                                    {(kpis.ingresos / cajas.length || 0).toFixed(2)}
                                </h1>
                                <p className="text-white">Indicadores Operativos Ingresos vs Cajas</p>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-4 " style={{ marginBottom: '7rem' }} >
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '15px', height: '100%' }}>

                            <div className="py-4">
                                <h1 className="text-white display-5 fw-bold" style={{ fontSize: '2rem', paddingTop: '2.5rem', paddingBottom: '.55rem' }}>
                                    {(kpis.gastos / cajas.length || 0).toFixed(2)}
                                </h1>
                                <p className="text-white">Indicadores Operativos Salidas vs Cajas</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardFinanciero;