import { faEdit, faTrashAlt, faCheck, faUserPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { useClientes } from "../hooks/HookCustomCliente"; // Importamos el hook de clientes
import { LOCAL_URL } from '../Auth/config';
import { columns } from "./columnTable"; // Importamos las columnas de clientes
import { useNavigate, } from "react-router-dom";
import { useState } from "react";

export function ListaClientes() {

    const navigate = useNavigate();
    // 1. Extraemos la lógica del Custom Hook de Clientes
    const [filtroEstado, setFiltroEstado] = useState('TODOS');

    const {
        clientesFiltrados,
        clientes,
        cargando,     
        toggleEstadoCliente,
        handleSearch,

        listUsuariosActivos, allList  
    } = useClientes();

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
                <div className="panel-custom  rounded shadow-sm mx-2"> 

                    <div className="banco-header-section">
                        <div className="banco-title-container">
                            <h3 className="banco-title-main">Clientes </h3>
                            <p className="banco-subtitle">Panel de gestión de clientes</p>
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
                                    Todos({clientes.length})
                                </button>
                                <button
                                    className={`banco-tab-item ${filtroEstado === 'ACTIVOS' ? 'active' : ''}`}
                                    onClick={() => {
                                        listUsuariosActivos();
                                        setFiltroEstado('ACTIVOS');
                                    }}>Activos ({clientesFiltrados.length})</button>
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
                                name="search-client"
                                placeholder='Buscar por nombre, CI o celular...'
                                onChange={handleSearch}
                                className="banco-input-search"
                            />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <DataTable
                            columns={columns}
                            data={clientesFiltrados}
                            progressPending={cargando}
                            funciones={[
                                {
                                    boton: (id) => {
                                        let path = null;
                                        const rol = parseInt(localStorage.getItem('numRol'))
                                        if (rol === 1) path = 'admin'
                                        if (rol === 2) path = 'gerente'
                                        if (rol === 3) path = 'cajero'
                                        navigate(`${LOCAL_URL}/${path}/editar-cliente/${id}`)
                                    },
                                    className: 'btn btn-info py-1 px-3 x-small',
                                    icono: faEdit,
                                    enlace: null,
                                    label: 'Editar'
                                },
                                {
                                    // Botón dinámico: Si está activo muestra Desactivar, si no, Activar
                                    boton: (id, row) => toggleEstadoCliente(id, row.estado),
                                    className: (id, row) => row.estado === 1 ? 'btn btn-danger py-1 px-3 x-small' : 'btn btn-success py-1 px-3 x-small',
                                    icono: (id, row) => row.estado === 1 ? faTrashAlt : faCheck,
                                    enlace: null,
                                    label: (id, row) => row.estado === 1 ? 'Desactivar' : 'Activar'
                                }
                            ]}
                        />
                    </div>
                </div>
            </main >
        </>
    );
}

export default ListaClientes;