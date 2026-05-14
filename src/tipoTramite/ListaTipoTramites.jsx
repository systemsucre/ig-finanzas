import { faEdit, faTrashAlt, faCheck, faSearch, } from "@fortawesome/free-solid-svg-icons";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { useTipoTramite } from "../hooks/HookCustomTipoTramite"; // Hook adaptado
import { LOCAL_URL } from '../Auth/config';
import { columns } from "./columnTable"; // Asegúrate de definir columnas para trámites
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    const [filtroEstado, setFiltroEstado] = useState('TODOS');

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
                <div className="panel-custom  rounded shadow-sm mx-2">
                    <div className="banco-header-section">
                        <h3 className="banco-title-main">Tipos de Trámite</h3>
                        <p className="banco-subtitle">
                            Configuración de categorías y servicios KR Estudios
                        </p>
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
                                    Todos
                                </button>
                                <button
                                    className={`banco-tab-item ${filtroEstado === 'ACTIVOS' ? 'active' : ''}`}
                                    onClick={() => {
                                        listActivos();
                                        setFiltroEstado('ACTIVOS');
                                    }}>Activos ({tramitesFiltrados.length})</button>
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
                                name="search-tramite"
                                placeholder='Buscar por tipo tramite ...'
                                onChange={handleSearch}
                                className="banco-input-search"
                            />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <DataTable
                            columns={columns}
                            data={tramitesFiltrados}
                            progressPending={cargando}
                            funciones={[
                                {
                                    boton: null,
                                    className: 'btn btn-info py-1 px-3 x-small me-1',
                                    icono: faEdit,
                                    enlace: LOCAL_URL + '/admin/editar-tipo-tramite',
                                    label: 'Editar'
                                },
                                {
                                    // Lógica de eliminación lógica (activar/desactivar)
                                    boton: (id, row) => toggleEstadoTramite(id, row.estado),
                                    className: (id, row) => row.estado === 1 ? 'btn btn-danger py-1 px-3 x-small me-1' : 'btn btn-success py-1 px-3 x-small me-1',
                                    icono: (id, row) => row.estado === 1 ? faTrashAlt : faCheck,
                                    enlace: null,
                                    label: (id, row) => row.estado === 1 ? 'Desactivar' : 'Activar'
                                }
                            ]}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

export default ListaTipoTramite;