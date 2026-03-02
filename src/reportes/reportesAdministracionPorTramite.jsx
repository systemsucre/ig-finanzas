import { faArrowLeft, faFileDownload, faChartLine, faFileInvoiceDollar, faWallet } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { InputUsuarioStandard } from "../components/input/elementos";
import { useReportes } from "../hooks/HookCustomReportes";
import { useNavigate } from "react-router-dom";
import { INPUT, LOCAL_URL } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ReportesAdministracionPorTramite() {
    const navigate = useNavigate();
    const { estados, setters, listaTramite, reporteSalidas, reporteIngresos, reporteGeneral } = useReportes();

    return (
        <>
            <style>{`
                .report-container { background: #f8f9fa; min-height: 100vh; padding: 20px; }
                .report-card { 
                    background: white; 
                    border-radius: 15px; 
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
                    border: none;
                    padding: 30px;
                }
                .section-title {
                    border-left: 5px solid #1B4F72;
                    padding-left: 15px;
                    margin-bottom: 10px;
                    margin-top: 40px;
                }
                .btn-report {
                    transition: all 0.3s ease;
                    border-radius: 10px;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    height:40px;
                    margin-bottom:20px;

                }
                .btn-report:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                .btn-general { background: #1B4F72; color: white; border: none; }
                .btn-general:hover { background: #153d5a; color: white; }
                .btn-salidas { background: #e74c3c; color: white; border: none; }
                .btn-salidas:hover { background: #c0392b; color: white; }
                .btn-ingresos { background: #27ae60; color: white; border: none; }
                .btn-ingresos:hover { background: #1e8449; color: white; }
                .custom-label { font-weight: 600; color: #444; font-size: 0.9rem; margin-bottom: 8px; display: block; }
            `}</style>

            <main className="report-container">
                <div className="container">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="section-title">
                            <h3 className="text-dark fw-bold mb-0">Reportes Individual por Caja</h3>
                            <p className="text-muted mb-0 small text-uppercase">Constrol Económica de Caja</p>
                        </div>
                    </div>

                    <div className=" d-flex justify-content-end gap-2 " style={{ marginBottom: '10px' }}>
                        <button className=" btn btn-dark" style={{ marginLeft: '4px' }} onClick={() => {
                            const path = parseInt(localStorage.getItem('numRol')) === 2 ? 'gerente/movimientos' : parseInt(localStorage.getItem('numRol')) === 3 ? 'cajero/movimientos' : parseInt(localStorage.getItem('numRol')) === 1 ? 'admin/lista-caja' : 'auxiliar/lista-caja'
                            navigate(LOCAL_URL + "/" + path )
                        }
                        }>
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> VOLVER
                        </button>
                    </div>

                    <div className="report-card">
                        <div className="row g-4">
                            {/* Selector de Trámite */}
                            <div className="col-lg-12">
                                <label className="custom-label">Seleccionar caja <span className="text-danger">*</span></label>
                                <Select
                                    placeholder='Busque por tramite...'
                                    onChange={(e) => setters.setTramite({ campo: e ? e.value : '', valido: e ? 'true' : 'false' })}
                                    options={listaTramite}
                                    value={listaTramite.find(opt => opt.value === estados.tramite.campo) || null}
                                    isSearchable={true}
                                    isClearable={true}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '10px',
                                            padding: '5px',
                                            borderColor: '#dee2e6',
                                            boxShadow: 'none'
                                        })
                                    }}
                                />
                            </div>

                            {/* Filtros de Fecha */}
                            <div className="col-md-6">
                                <InputUsuarioStandard
                                    estado={estados.desde}
                                    cambiarEstado={setters.setDesde}
                                    tipo='date'
                                    name='desde'
                                    etiqueta={'Desde (Fecha Inicial)'}
                                    ExpresionRegular={INPUT.FECHA}
                                />
                            </div>
                            <div className="col-md-6">
                                <InputUsuarioStandard
                                    estado={estados.hasta}
                                    cambiarEstado={setters.setHasta}
                                    tipo='date'
                                    name='hasta'
                                    etiqueta={'Hasta (Fecha Final)'}
                                    ExpresionRegular={INPUT.FECHA}
                                />
                            </div>

                            {/* Botones de Acción */}
                            <div className="col-12 mt-5">
                                <div className="p-3 bg-light rounded-3">
                                    <h6 className="text-center mb-4 text-muted text-uppercase small fw-bold">Generar Archivos Excel</h6>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <button className="btn-report btn-salidas py-3"
                                                onClick={() => reporteSalidas(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}>
                                                <FontAwesomeIcon icon={faWallet} /> Reporte Salidas
                                            </button>
                                        </div>
                                        {parseInt(localStorage.getItem('numRol') )<4 ? <>
                                            <div className="col-md-4">
                                                <button className="btn-report btn-ingresos py-3"
                                                    onClick={() => reporteIngresos(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}>
                                                    <FontAwesomeIcon icon={faFileInvoiceDollar} /> Reporte Ingresos
                                                </button>
                                            </div>
                                            <div className="col-md-4">
                                                <button className="btn-report btn-general py-3"
                                                    onClick={() => reporteGeneral(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}>
                                                    <FontAwesomeIcon icon={faChartLine} /> Balance General
                                                </button>
                                            </div>
                                        </> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Informativo */}
                    <div className="mt-4 text-center">
                        <p className="text-muted small">
                            <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                            Los reportes generados se descargarán automáticamente en formato .xlsx (Excel)
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}