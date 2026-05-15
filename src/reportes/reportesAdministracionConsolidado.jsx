import { faArrowLeft, faFileDownload, faChartLine, faFileInvoiceDollar, faWallet } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { InputUsuarioStandard, Select1 } from "../components/input/elementos";
import { useReportes } from "../hooks/HookCustomReportes";
import { INPUT, LOCAL_URL } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ReportesAdministracionConsolidado() {
    const { estados, setters, monedas, reporteConsolidado } = useReportes();

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
                <div className="panel-custom rounded shadow-sm mx-2">
                    {/* Header */}
                    <div className="banco-header-section">

                        <div className="banco-title-container">
                            <h3 className="banco-title-main">Reporte Consolidado de Caja</h3>
                            <p className="banco-subtitle">Generar reportes consolidados por caja</p>
                        </div>
                    </div>

                    <div className="p-4 p-md-5 mt-5" style={{ backgroundColor: 'white', padding: '2rem', }}>
                        <div className="row g-4">
                            <div className="col-md-12">
                                <Select1
                                    estado={estados.moneda}
                                    cambiarEstado={setters.setMoneda}
                                    Name="id_moneda"
                                    lista={monedas}
                                    etiqueta="Moneda"
                                    msg="Seleccione la moneda"
                                    ExpresionRegular={INPUT.ID}
                                />
                            </div>
                            <div className="col-md-4">
                                <Select1
                                    estado={estados.estado}
                                    cambiarEstado={setters.setEstado}
                                    Name="estado"
                                    lista={[{ value: 4, label: 'Todos' }, { value: 1, label: 'En curso' }, { value: 2, label: 'Paralizado' }, { value: 3, label: 'Finalizado' },]}
                                    etiqueta="Estado Caja"
                                    msg="Cambiar Estado"
                                    ExpresionRegular={INPUT.ID}
                                />
                            </div>

                            {/* Filtros de Fecha */}
                            <div className="col-md-4">
                                <InputUsuarioStandard
                                    estado={estados.desde}
                                    cambiarEstado={setters.setDesde}
                                    tipo='date'
                                    name='desde'
                                    etiqueta={'Desde (Fecha Inicial)'}
                                    ExpresionRegular={INPUT.FECHA}
                                />
                            </div>
                            <div className="col-md-4">
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
                                <h6 className="text-center mb-4 text-muted text-uppercase small fw-bold">Generar Archivos Excel</h6>

                                <div className="col-md-12 m-auto text-center">

                                    <button
                                        type="submit"
                                        className={`btn btn-banking-gold order-1 order-md-2 px-5`}
                                        onClick={() => reporteConsolidado(estados.desde.campo, estados.hasta.campo, estados.estado.campo)}
                                    >
                                        <FontAwesomeIcon icon={faFileInvoiceDollar} />
                                        <span>              Reporte Consolidado</span>
                                    </button>
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