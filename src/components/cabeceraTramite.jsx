import { useEffect } from 'react';
import { useTramites } from '../hooks/HookCustomTramites'

const CabeceraTramite = ({ id }) => {
    const {
        tramites,
        cargarTramiteInfo,
    } = useTramites();

    useEffect(() => {
        cargarTramiteInfo(id)
    }, [])

    return (
        tramites.length > 0 &&
        <div className="alert alert-success border-0 shadow-sm mb-4 " style={{ backgroundColor: '#e8f5e9', marginBottom: '15px', marginTop: '15px', padding: '10px' }}>
            <div className="row g-2 small">
                <div className="col-md-6 col-12">
                    <div>
                        <span className="fw-bold text-dark">EMPLEADOR: </span>
                        <strong className="text-success">{tramites[0].cliente_nombre}</strong>
                    </div>
                    <div>
                        <span className="fw-bold text-dark">TRÁMITE: </span>
                        <strong className="text-success">{tramites[0].codigo}</strong>
                    </div>
                    <div className="fw-bold text-dark">
                        TOTAL GASTADO: Bs. {tramites[0].total_gastos || 0}
                    </div>
                </div>
                <div className="col-md-6 col-12 text-md-end">

                    {localStorage.getItem('numRol') < 4 ? <>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            COSTO TOTAL: Bs. {tramites[0].costo}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            MONTO ABONADO: Bs. {tramites[0].total_ingresos}
                        </div>

                    </> : null}
                    <div className={`fw-bold ${tramites[0].saldoDisponible > 2000 ? `text-dark` : tramites[0].saldoDisponible < 1000 ? `text-danger` : `text-warning`}`} >
                        SALDO DISP.  BS. {tramites[0].saldoDisponible}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CabeceraTramite;