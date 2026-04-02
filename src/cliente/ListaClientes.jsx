import { faEdit, faTrashAlt, faCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { useClientes } from "../hooks/HookCustomCliente"; // Importamos el hook de clientes
import { LOCAL_URL } from '../Auth/config';
import { columns } from "./columnTable"; // Importamos las columnas de clientes
import { Link } from "react-router-dom";

export function ListaClientes() {
    // 1. Extraemos la lógica del Custom Hook de Clientes
    const {
        clientesFiltrados,
        cargando,
        toggleEstadoCliente,
        handleSearch,

        listUsuariosActivos, allList
    } = useClientes();

    return (
        <>
            <main className="container-xl mt-5">
                <div className="d-flex justify-content-between align-items-center p-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 text-titulos">Gestión de Clientes</h3>
                     
                    </div>

                </div>

                <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2">
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
                                    name="search-client"
                                    placeholder='Buscar por nombre, CI o celular...'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={clientesFiltrados}
                        progressPending={cargando}
                        funciones={[
                            {
                                boton: null,
                                className: 'btn btn-info py-1 px-3 x-small',
                                icono: faEdit,
                                enlace: LOCAL_URL + '/admin/editar-empleador',
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
            </main>
        </>
    );
}

export default ListaClientes;