import {  faFileDownload, faChartLine, } from "@fortawesome/free-solid-svg-icons";
import { InputUsuarioStandard, Select1 } from "../components/input/elementos";
import { UseCustomHonorarios } from "../hooks/HookCustomHonorarios";
import { INPUT,  } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ReportesHonorarios() {
    const { estados, setters, listarHonorariosReporte } = UseCustomHonorarios();

    return (
        <>
            <style>{`
                .report-container { background: #f8f9fa; min-height: 100vh; padding: 5px; }
                .report-card { 
                    background: white; 
                    border-radius: 15px; 
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
                    border: none;
                    padding: 5px;
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
                            <h3 className="text-dark fw-bold mb-0">Reportes de Honorarios</h3>
                            {/* <p className="text-muted mb-0 small text-uppercase">Gestión Económica de Trámites</p> */}
                        </div>
                    </div>


                    <div className="report-card">
                        <div className="row g-4">
                     

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

                                    <div className="col-md-12 m-auto">
                                        <button className="btn-report btn-ingresos py-3"
                                            onClick={() => listarHonorariosReporte(estados.desde.campo, estados.hasta.campo)}>
                                            <FontAwesomeIcon icon={faChartLine} /> Generar Reporte
                                        </button>
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