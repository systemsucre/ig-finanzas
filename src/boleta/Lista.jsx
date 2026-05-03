import {

    faEye,
    faPlus,
    faSearch
} from "@fortawesome/free-solid-svg-icons";

import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomBoletas } from "../hooks/HookCustomBoleta"; // Nombre actualizado
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ColumnsTable } from "./columnTable";
import { LOCAL_URL } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export function ListaBoleta() {
    const navigate = useNavigate();
    const [filtroEstado, setFiltroEstado] = useState('TODOS');


    const {
        boletasFiltradas, // Actualizado
        cargando,
        handleSearchBoleta, // Actualizado
        listarBoletas, // Actualizado
    } = UseCustomBoletas();

    useEffect(() => {
        listarBoletas()
    }, []);


    const idUsuarioActual = parseInt(localStorage.getItem('id_'));
    const dataFiltrada = boletasFiltradas.filter(b => {
        // Si el filtro es 'MIOS', filtramos por el ID del usuario
        if (filtroEstado === 'MIOS') {
            return b.usuario_solicita_id === idUsuarioActual;
        }
        // Si el filtro es 'TODOS', pasan todas
        if (filtroEstado === 'TODOS') return true;

        // De lo contrario, filtramos por el estado numérico (1, 2, 3...)
        return b.estado === filtroEstado;
    });

    // Contadores actualizados
    // const countSolicitados = boletasFiltradas.filter(b => b.estado === 1).length;
    // const countAprobados = boletasFiltradas.filter(b => b.estado === 2).length;
    // const countDespachados = boletasFiltradas.filter(b => b.estado === 3).length;
    // const countRechazados = boletasFiltradas.filter(b => b.estado === 4).length;
    const mios = boletasFiltradas.filter(b => b.usuario_solicita_id === parseInt(localStorage.getItem('id_'))).length;

    return (
        <>
            <main className="container-xl mt-2" >
                <div className="d-flex justify-content-between align-items-center mb-4 m-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 text-titulos">Gestión de Boletas de Gasto</h3>
                    </div>

                </div>

                <div className="panel-custom rounded shadow-sm  mx-2">

                    <div className="banco-filter-row">
                        {/* Contenedor de Filtros (Segmented Control) */}
                        <div className="banco-tabs-container">
                            <button
                                className={`banco-tab-item ${filtroEstado === 'MIOS' ? 'active' : ''}`}
                                onClick={() => setFiltroEstado('MIOS')}
                            >
                                Mis Boletas <span className="banco-tab-count">({mios})</span>
                            </button>
                            <button
                                className={`banco-tab-item ${filtroEstado === 'TODOS' ? 'active' : ''}`}
                                onClick={() => setFiltroEstado('TODOS')}
                            >
                                Todas <span className="banco-tab-count">({boletasFiltradas.length})</span>
                            </button>
                        </div>

                        {/* Buscador Estilizado */}
                        <div className="banco-search-wrapper">
                            {/* Icono de lupa posicionado absolutamente dentro del wrapper */}
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
                                name="search-boleta"
                                placeholder="Buscar por nro o solicitante..."
                                onChange={handleSearchBoleta}
                                className="banco-input-search"
                            />
                        </div>
                    </div>



                    <div className="table-responsive">

                        <DataTable
                            columns={ColumnsTable}
                            data={dataFiltrada}
                            cargando={cargando}
                            funciones={[
                                {
                                    boton: (id_ingreso, row) => {
                                        navigate(`${LOCAL_URL}/detalle-boleta/${row.codigo_boleta}`);
                                    },
                                    className: 'btn btn-info py-1 px-3 x-small me-1 text-end',
                                    icono: faEye,
                                    label: 'VER BOLETA'
                                },
                            ]}
                        />
                    </div>
                </div>

            </main>
        </>
    );
}