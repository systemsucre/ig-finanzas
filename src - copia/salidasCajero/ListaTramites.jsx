import { faFileInvoiceDollar, faFilePdf } from "@fortawesome/free-solid-svg-icons"; // Icono más acorde a gastos/salidas
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { ColumnsTableTramites } from "../tramite/columnTableTramites";
import { useTramites } from "../hooks/HookCustomTramites";
import { LOCAL_URL } from '../Auth/config';

export function ListaTramitesCajero() {
    const {
        handleSearch,
        tramites,
        tramitesFiltrados,
        allListTramite,
        filterByEstado,
        cargando,
        filterByDeleteTramite,
        exportPDfTramites
    } = useTramites();

    const enCurso = tramites.filter(t => t.estado === 1).length;
    const paralizados = tramites.filter(t => t.estado === 0).length;

    return (
        <>
            <main className="container-xl mt-5" style={{ maxWidth: "100%" }}>
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 p-2">Gestion de Movimientos</h3>
                        <p className="text-muted mb-0 small text-uppercase p-2" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Panel de control de movimientos - KR Estudios
                        </p>
                    </div>
                </div>

                <div className="panel-custom bg-white rounded shadow-sm p-1">
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm border text-success fw-bold" onClick={allListTramite}>TODOS <span className="fw-bold mb-0 text-success">{tramites.length}</span></button>
                                <button className="btn btn-primary btn-sm border text-primary fw-bold" onClick={() => filterByEstado(1)}>EN CURSO <span className="fw-bold mb-0 text-primary">{enCurso}</span></button>
                                <button className="btn btn-warning btn-sm border text-warning fw-bold" onClick={() => filterByEstado(0)}>PARALIZADOS <span className="fw-bold mb-0 text-warning">{paralizados}</span></button>
                                {tramites.filter(t => t.eliminado == 0).length > 0 && (
                                    <button className="btn btn-warning btn-sm border text-danger fw-bold" onClick={() => filterByDeleteTramite(0)}>
                                        RECICLAJE <span className="fw-bold mb-0 text-danger">{tramites.filter(t => t.eliminado == 0).length}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-md-end">
                            <div style={{ width: '100%', maxWidth: '300px', paddingLeft: '5px', paddingTop: '10px' }}>
                                <InputUsuarioSearch
                                    name="input-search-tramite"
                                    placeholder='Buscar por código, cliente o tipo...'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableTramites}
                            data={tramitesFiltrados}
                            cargando={cargando}
                            funciones={[
                                {
                                    boton: null,
                                    // Cambiamos a btn-success o btn-dark para diferenciarlo de "Editar"
                                    className: 'btn btn-danger py-1 px-3 x-small me-1',
                                    icono: faFileInvoiceDollar, // Nuevo icono de factura/dinero
                                    // Cambiamos la ruta a la lista de salidas
                                    enlace: (() => {
                                        const rol = parseInt(localStorage.getItem('numRol'));
                                        let base = '';
                                        if (rol === 1) base = '/admin';
                                        else if (rol === 2) base = '/gerente';
                                        else if (rol === 3) base = '/cajero';

                                        return `${LOCAL_URL}${base}/listar-salidas`;
                                    })(),
                                    label: 'Ver Gastos'
                                },
                                {
                                    boton: null,
                                    // Cambiamos a btn-success o btn-dark para diferenciarlo de "Editar"
                                    className: 'btn btn-info py-1 px-3 x-small me-1 ml-2',
                                    icono: faFileInvoiceDollar, // Nuevo icono de factura/dinero
                                    // Cambiamos la ruta a la lista de salidas
                                    enlace: (() => {
                                        const rol = parseInt(localStorage.getItem('numRol'));
                                        let base = '';
                                        if (rol === 1) base = '/admin';
                                        else if (rol === 2) base = '/gerente';
                                        else if (rol === 3) base = '/cajero';

                                        return `${LOCAL_URL}${base}/listar-ingresos`;
                                    })(),
                                    label: 'Ver Ingresos'
                                },
                                {
                                    boton: (id_salida, row) => { exportPDfTramites(window.innerWidth < 1100 ? 'b64' : "print", row) },

                                    className: 'btn btn-secondary py-1 px-3 x-small',
                                    icono: faFilePdf,
                                    label: 'PDF'
                                }
                            ]}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

export default ListaTramitesCajero;