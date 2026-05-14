import { faCheck, faEdit, faSearch, faTrashAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { useUsuarios } from "../hooks/HookCustomUsuarios";
import { LOCAL_URL } from '../Auth/config';
import { columns } from "./columnTable";
import { Link } from "react-router-dom";
import { useState } from "react";

export function ListaUsuarios() {
    const {
        usuarios,
        usuariosFiltrados,
        cargando,
        eliminarUsuario, // Esta función en tu hook maneja (id, estado)
        handleSearch,
        allList,
        listUsuariosActivos
    } = useUsuarios();

    const [filtroEstado, setFiltroEstado] = useState('TODOS');

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
                <div className="panel-custom  rounded shadow-sm mx-2">

                    <div className="banco-header-section">
                        <div className="banco-title-container">
                            <h3 className="banco-title-main">Gestión de Usuarios </h3>
                            <p className="banco-subtitle">  Administración de personal y permisos del sistema</p>
                        </div>
                    </div>


                    <div className="banco-filter-row">
                        <div className="banco-tabs-container">
                            <div className="d-flex1  gap-2">

                                <button
                                    className={`banco-tab-item ${filtroEstado === 'TODOS' ? 'active' : ''}`}
                                    onClick={() => {
                                        allList
                                        setFiltroEstado('TODOS')
                                    }}>
                                    Todos({usuarios.length})
                                </button>
                                <button
                                    className={`banco-tab-item ${filtroEstado === 'ACTIVOS' ? 'active' : ''}`}
                                    onClick={() => {
                                        listUsuariosActivos();
                                        setFiltroEstado('ACTIVOS');
                                    }}>
                                    Activos ({usuariosFiltrados.length})</button>
                            </div>
                        </div>

                        <div className="banco-search-wrapper">
                            <FontAwesomeIcon
                                icon={faSearch}
                                style={{
                                    position: 'absolute',
                                    left: '18px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8e8e93',
                                    zIndex: 1
                                }}
                            />
                            <input
                                name="search-user"
                                placeholder='Buscar por nombre, CI o usuario...'
                                onChange={handleSearch}
                                className="banco-input-search"
                            />
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
            </main >
        </>
    );
}

export default ListaUsuarios;