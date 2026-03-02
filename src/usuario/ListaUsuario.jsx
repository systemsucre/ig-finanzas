import { faCheck, faEdit, faTrashAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { useUsuarios } from "../hooks/HookCustomUsuarios"; 
import { LOCAL_URL } from '../Auth/config';
import { columns } from "./columnTable";
import { Link } from "react-router-dom";

export function ListaUsuarios() {
    const {
        usuariosFiltrados,
        cargando,
        eliminarUsuario, // Esta función en tu hook maneja (id, estado)
        handleSearch,
        allList,
        listUsuariosActivos
    } = useUsuarios();

    return (
        <>
            <main className="container-xl mt-3">
                <div className="d-flex justify-content-between align-items-center p-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0">Gestión de Usuarios</h3>
                        <p className="text-muted mb-0 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Administración de personal y permisos del sistema
                        </p>
                    </div>
                  
                </div>

                <div className="panel-custom mt-3">
                    <div className="d-flex align-items-center mb-3 bg-white p-3 shadow-sm row m-0">
                        <div className="col-sm-6">
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm border" onClick={allList}>Todos</button>
                                <button className="btn btn-light btn-sm border text-primary" onClick={listUsuariosActivos}>Activos</button>
                            </div>
                        </div>
                        <div className="col-sm-6 d-flex justify-content-end">
                            <div style={{ width: '280px' }}>
                                <InputUsuarioSearch
                                    name="search-user"
                                    placeholder='Buscar por nombre, CI o usuario...'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={usuariosFiltrados}
                        progressPending={cargando}
                        funciones={[
                            {
                                boton: null,
                                className: 'btn btn-info py-1 px-3 x-small',
                                icono: faEdit,
                                enlace: LOCAL_URL + '/admin/editar-usuario',
                                label: 'Editar'
                            },
                            {
                                // Lógica dinámica para el botón de estado
                                boton: (id, row) => eliminarUsuario(id, row.estado === 1 ? 0 : 1),
                                className: (id, row) => row.estado === 1 ? 'btn btn-danger py-1 px-3 x-small' : 'btn btn-success py-1 px-3 x-small',
                                icono: (id, row) => row.estado === 1 ? faTrashAlt : faCheck,
                                label: (id, row) => row.estado === 1 ? 'Desactivar' : 'Activar',
                                enlace: null
                            }
                        ]}
                    />
                </div>
            </main>
        </>
    );
}

export default ListaUsuarios;