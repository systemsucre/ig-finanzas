import { faFileInvoiceDollar, faFilePdf } from "@fortawesome/free-solid-svg-icons"; // Icono más acorde a gastos/salidas
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { ColumnsTableTramites } from "./columnTableTramites";
import { useTramites } from "../hooks/HookCustomTramites";
import { LOCAL_URL } from '../Auth/config';

export function Movimientos() { 
    const {
        handleSearch,
        tramites,
        tramitesFiltrados,
        allListTramite,
        filterByEstado,
        cargando,
        filterByDelete,
        exportPDfTramites
    } = useTramites();
    const enCurso = tramites.filter(t => t.estado === 1).length;
    const paralizados = tramites.filter(t => t.estado === 2).length;
    const finalizados = tramites.filter(t => t.estado === 3).length;


    return (
        <>
            <main className="container-xl mt-5" style={{ maxWidth: "100%" }}>
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 p-2">Ver Movimientos</h3>
                      
                    </div>
                </div>

                <div className="panel-custom bg-white rounded shadow-sm p-1">
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex1 gap-2">
                                <button className="btn btn-light btn-sm border text-success fw-bold" onClick={allListTramite}>TODOS <span className="fw-bold mb-0 text-success">{tramites.length}</span></button>
                                <button className="btn btn-primary btn-sm border text-primary fw-bold" onClick={() => filterByEstado(1)}>EN CURSO <span className="fw-bold mb-0 text-primary">{enCurso}</span></button>
                                <button className="btn btn-warningd btn-sm border text-danger fw-bold" onClick={() => filterByEstado(0)}>PARALIZADOS <span className="fw-bold mb-0 text-danger">{paralizados}</span></button>
                                <button className="btn btn-warning1 btn-sm border text-warning fw-bold" onClick={() => filterByEstado(3)}>FINALIZADOS <span className="fw-bold mb-0 text-warning">{finalizados}</span></button>
                                {tramites.filter(t => t.eliminado == 0).length > 0 && (
                                    <button className="btn btn-danger btn-sm border text-white fw-bold" onClick={() => filterByDelete(0)}>
                                        RECICLAJE  (<span className="fw-bold mb-0 text-white">{tramites.filter(t => t.eliminado == 0).length}</span>)
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-md-end">
                            <div style={{ width: '100%', maxWidth: '300px', paddingLeft: '5px', paddingTop: '10px' }}>
                                <InputUsuarioSearch
                                    name="input-search-tramite"
                                    placeholder='Buscar por Codigo o numero...'
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
                                    className: 'btn btn-success py-1 px-3 x-small me-1',
                                    icono: faFileInvoiceDollar, // Nuevo icono de factura/dinero
                                    // Cambiamos la ruta a la lista de salidas
                                    enlace: LOCAL_URL + '/listar-salidas',
                                    label: 'Ver Gastos'
                                },
                                {
                                    boton: null,
                                    // Cambiamos a btn-success o btn-dark para diferenciarlo de "Editar"
                                    className: 'btn btn-info py-1 px-3 x-small me-1 ml-2',
                                    icono: faFileInvoiceDollar, // Nuevo icono de factura/dinero
                                    // Cambiamos la ruta a la lista de salidas
                                    enlace: LOCAL_URL + '/listar-ingresos',
                                    label: 'Ver ingresos'
                                },
                                {
                                    boton: (id_salida, row) => {  exportPDfTramites(window.innerWidth < 1100 ? 'b64' : "print", row) },
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

export default Movimientos;