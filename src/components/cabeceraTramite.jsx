import { useEffect } from 'react';
import { useTramites } from '../hooks/HookCustomTramites'

const CabeceraTramite = ({ id }) => {

    const {
        tramites,
    } = useTramites();


    if (tramites.length === 0) return null;

    const tramite = tramites.find(t => String(t.id) === String(id))
    // console.log(tramite.simbolo, ' tramites en cabecera')

    // --- LÓGICA DE BALANCE BI-COLOR ---
    const ingresos = parseFloat(tramite.total_ingresos) || 0;
    const gastos = parseFloat(tramite.total_gastos) || 0;
    const saldo = parseFloat(tramite.saldoDisponible) || 0;
    const estado = tramite.estado;

    // Calculamos los porcentajes respecto al total de ingresos
    // Usamos Math.min/max para que la barra no se rompa si los gastos superan los ingresos
    const porcentajeGasto = ingresos > 0 ? Math.min((gastos / ingresos) * 100, 100) : 0;
    const porcentajeSaldo = 100 - porcentajeGasto;

    return (
        <div className="alert alert-success border-0 shadow-sm mb-4" style={{ borderRadius: '10px', backgroundColor: 'rgba(255,255,255,.7)', padding: '10px', margin: '5px', }}>
            <div className="row g-2 small">
                <div className="col-md-6 col-12">
                    {/* <div>
                        <span className="fw-bold text-dark">EMPLEADOR: </span>
                        <strong className="text-success">{tramite.cliente_nombre}</strong>
                    </div> */}
                    <div>
                        <span className="fw-bold text-dark">CAJA: </span>
                        <strong className="text-success">{tramite.codigo}</strong>
                    </div>
                    <div className="fw-bold text-dark">
                        ESTADO CAJA: <span className={
                            estado === 1 ? 'text-success' :
                                estado === 2 ? 'text-warning' :
                                    estado === 3 ? 'text-info' : '-'}

                        > {
                                estado === 1 ? 'EN CURSO' :
                                    estado === 2 ? 'PARALIZADO' :
                                        estado === 3 ? 'FNALIZADO' : '-'
                            }</span>
                    </div>

                </div>

                <div className="col-md-6 col-12 text-md-end">
                    {localStorage.getItem('numRol') < 4 && (
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            ABONO TOTAL RECIBIDO: <span className="fw-bold">{tramite.simbolo} {ingresos.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        TOTAL GASTADO: <span className="text-danger">{tramite.simbolo} {gastos.toFixed(2)}</span>
                    </div>
                    <div className="fw-bold text-dark">
                        SALDO DISPONIBLE: <span className="text-success">{tramite.simbolo} {saldo.toFixed(2)}</span>
                    </div>

                </div>
            </div>

            {saldo > 0 ?
                < div className="mt-3">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.75rem' }}>
                        <span className="fw-bold text-danger">GASTADO ({porcentajeGasto.toFixed(1)}%)</span>|
                        <span className="fw-bold " style={{ color: '#1bbec0' }}>A FAVOR ({porcentajeSaldo.toFixed(1)}%)</span>
                    </div>

                    {/* Contenedor principal de la barra */}
                    <div style={{
                        height: '14px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '7px',
                        overflow: 'hidden',
                        display: 'flex', // Esto permite que las dos barras internas convivan
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        {/* PARTE ROJA: GASTOS */}
                        <div style={{
                            width: `${porcentajeGasto}%`,
                            height: '100%',
                            backgroundColor: '#f43f5e', // Rojo
                            transition: 'width 0.6s ease'
                        }}></div>

                        {/* PARTE VERDE: DINERO A FAVOR */}
                        <div style={{
                            width: `${porcentajeSaldo}%`,
                            height: '100%',
                            backgroundColor: '#1bbec0', // Verde
                            transition: 'width 0.6s ease'
                        }}></div>
                    </div>


                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.65rem', color: '#6c757d' }}>
                        <span>Total Abonado:    </span> <span>{tramite.simbolo + ingresos.toFixed(2)}</span>
                    </div>
                </div>
                : null}
        </div >
    );
};

export default CabeceraTramite;