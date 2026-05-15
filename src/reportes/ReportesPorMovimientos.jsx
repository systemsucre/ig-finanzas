import { faFileDownload, faFileInvoiceDollar, faWallet } from "@fortawesome/free-solid-svg-icons";
import { InputUsuarioStandard, Select1 } from "../components/input/elementos";
import { useReportes } from "../hooks/HookCustomReportes";
import { INPUT } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ReportesMovimientos() {
    const { estados, setters, monedas, reportesTodasSalidas, reportesTodosIngresos } = useReportes();

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
                <div className="panel-custom rounded shadow-sm mx-2">


                    <div className="banco-header-section">

                        <div className="banco-title-container">
                            <h3 className="banco-title-main">Reportes de Movimientos</h3>
                            <p className="banco-subtitle">Generar reportes de todos los movimientos de ingresos y egresos</p>
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
                                <h6 className="text-center mb-4 text-muted text-uppercase small fw-bold">Generar Archivos Excel</h6>
                                <div className="row g-3 text-center">
                                    <div className="col-md-6 col-12 mb-4">
                                        <button
                                            className={`btn btn-banking-blue order-1 order-md-2 `}
                                            onClick={() => reportesTodasSalidas(estados.desde.campo, estados.hasta.campo)}>
                                            <FontAwesomeIcon icon={faWallet} /> Reporte Salidas
                                        </button>
                                    </div>
                                    {parseInt(localStorage.getItem('numRol')) < 4 ?
                                        <div className="col-md-6 col-12 mb-4">
                                            <button
                                                className={`btn btn-banking-gold order-1 order-md-2 `}
                                                onClick={() => reportesTodosIngresos(estados.desde.campo, estados.hasta.campo)}>
                                                <FontAwesomeIcon icon={faFileInvoiceDollar} /> Reporte Ingresos
                                            </button>
                                        </div>

                                        : null}
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