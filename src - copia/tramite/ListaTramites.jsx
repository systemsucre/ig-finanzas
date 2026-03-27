import {  faEdit, faTrashAlt,  faRecycle, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { ColumnsTableTramites } from "./columnTableTramites";
import { useTramites as UseTramites } from "../hooks/HookCustomTramites"; // Asegúrate que el path sea correcto
import { LOCAL_URL } from '../Auth/config';

export function ListaTramites() {
    // Extraemos las funciones y estados del custom hook
    const {
        handleSearch, tramites,
        tramitesFiltrados,
        allList,
        filterByEstado,
        cargando,
        eliminarTramite,
        filterByDelete,
        exportPDfTramites
    } = UseTramites();

    // Cálculos para las estadísticas (Cards)
    const enCurso = tramites.filter(t => t.estado === 1).length;
    const paralizados = tramitesFiltrados.filter(t => t.estado === 2).length;
    const finalizados = tramitesFiltrados.filter(t => t.estado === 3).length;

    return (
        <>
            <main className="container-xl mt-5" style={{ maxWidth: "100%" }}>
                {/* Encabezado */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 p-2">Gestión de Cajas</h3>
                    </div>
                </div>

                <div className="panel-custom bg-white rounded shadow-sm p-1">
                    {/* BARRA DE ACCIONES: Filtros y Buscador */}
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex1 gap-2">
                                <button className="btn btn-light btn-sm border text-success fw-bold" onClick={allList}>TODOS <span className="fw-bold mb-0 text-success">{tramites.length}</span></button>
                                <button className="btn btn-primary btn-sm border text-primary fw-bold" onClick={() => filterByEstado(1)}>EN CURSO <span className="fw-bold mb-0 text-primary">{enCurso}</span></button>
                                <button className="btn btn-warning btn-sm border text-warning fw-bold" onClick={() => filterByEstado(2)}>PARALIZADOS <span className="fw-bold mb-0 text-warning">{paralizados}</span></button>
                                <button className="btn btn-warning btn-sm border text-warning fw-bold" onClick={() => filterByEstado(3)}>FINALIZADOS <span className="fw-bold mb-0 text-warning">{finalizados}</span></button>
                                {tramites.filter(t => t.eliminado == 0).length > 0 ? <button className="btn btn-warning btn-sm border text-danger fw-bold" onClick={() => filterByDelete(0)}>RECICLAJE <span className="fw-bold mb-0 text-danger">{tramites.filter(t => t.eliminado == 0).length}</span></button> : null}
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-md-end">
                            <div style={{ width: '100%', maxWidth: '300px', paddingTop: '10px' }}>
                                <InputUsuarioSearch
                                    name="input-search-tramite"
                                    placeholder='Buscar por código, empleador o tipo...'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Datos */}
                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableTramites}
                            data={tramitesFiltrados}
                            cargando={cargando}
                            funciones={[
                                {
                                    boton: null,
                                    className: 'btn btn-info py-1 px-3 x-small me-1',
                                    icono: faEdit,
                                    enlace: (() => {
                                        const rol = parseInt(localStorage.getItem('numRol'));
                                        let base = '';
                                        if (rol === 1) base = '/admin';
                                        else if (rol === 2) base = '/gerente';
                                        else if (rol === 3) base = '/cajero';

                                        return `${LOCAL_URL}${base}/editar-caja`;
                                    })(),
                                    label: 'Editar'
                                },
                       
                                {
                                    boton: (id, row) => eliminarTramite(id, row.eliminado === 1 ? 0 : 1), // Ejemplo para paralizar/activar 
                                    className: (id, row) => row.eliminado === 1 ? 'btn btn-danger py-1 px-3 x-small' : 'btn btn-warning py-1 px-3 x-small',
                                    icono: (id, row) => row.eliminado === 1 ? faTrashAlt : faRecycle,
                                    enlace: null,
                                    label: (id, row) => row.eliminado === 1 ? 'Eliminar' : 'Restaurar'
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

export default ListaTramites;