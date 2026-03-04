import { faEdit, faTrashAlt, faCheck,  } from "@fortawesome/free-solid-svg-icons";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { useTipoTramite } from "../hooks/HookCustomTipoTramite"; // Hook adaptado
import { LOCAL_URL } from '../Auth/config';
import { columns } from "./columnTable"; // Asegúrate de definir columnas para trámites

export function ListaTipoTramite() {
    // 1. Extraemos la lógica del Custom Hook de Tipo Trámite
    const {
        tramitesFiltrados,
        cargando,
        toggleEstadoTramite,
        handleSearch,
        listActivos, 
        allList
    } = useTipoTramite();

    return (
        <>
            <main className="container-xl mt-5">
                <div className="d-flex justify-content-between align-items-center p-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0">Categoria de Caja</h3>
                        <p className="text-muted mb-0 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Configuración de categorías y servicios - {localStorage.getItem('entidad')}
                        </p>
                    </div>
                    
                </div>

                <div className="panel-custom mt-3">
                    <div className="d-flex align-items-center mb-3 bg-white p-3 shadow-sm row m-0">
                        <div className="col-sm-6">
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm border" onClick={allList}>Todos</button>
                                <button className="btn btn-light btn-sm border text-primary" onClick={listActivos}>Activos</button>
                            </div>
                        </div>
                        <div className="col-sm-6 d-flex justify-content-end">
                            <div style={{ width: '280px' }}>
                                <InputUsuarioSearch
                                    name="search-tramite"
                                    placeholder='Buscar por nombre de caja...'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={tramitesFiltrados}
                        progressPending={cargando}
                        funciones={[
                            {
                                boton: null,
                                className: 'btn btn-info py-1 px-3 x-small',
                                icono: faEdit,
                                enlace: LOCAL_URL + '/admin/editar-tipo-caja',
                                label: 'Editar'
                            },
                            {
                                // Lógica de eliminación lógica (activar/desactivar)
                                boton: (id, row) => toggleEstadoTramite(id, row.estado),
                                className: (id, row) => row.estado === 1 ? 'btn btn-danger py-1 px-3 x-small' : 'btn btn-success py-1 px-3 x-small',
                                icono: (id, row) => row.estado === 1 ? faTrashAlt : faCheck,
                                enlace: null,
                                label: (id, row) => row.estado === 1 ? 'Desactivar' : 'Activar'
                            }
                        ]}
                    />
                </div>
            </main>
        </>
    );
}

export default ListaTipoTramite;