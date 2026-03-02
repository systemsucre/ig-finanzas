import {
    faFilePdf,
    faCheck,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomSalidasCajero } from "../hooks/HookCustomSalidasCajero";
import { UseCustomSalidas } from "../hooks/HookCustomSalidas";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ColumnsTableSalidas } from "./columnTableSalidas";
import { LOCAL_URL } from "../Auth/config";
import CabeceraTramite from "../components/cabeceraTramite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaSalidasCajero() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [filtroEstado, setFiltroEstado] = useState(2); // Estado local para el filtro gerencial

    const {
        salidasFiltradas,
        cargando,
        handleSearch,
        listarSalidas,
        despacharSalida,
    } = UseCustomSalidasCajero();

    const {
        exportPDf
    } = UseCustomSalidas();

    useEffect(() => {
        if (id) {
            if (!UUID_REGEX.test(id)) {
                navigate(LOCAL_URL + "/auxiliar/lista-tramites");
                return;
            }
            listarSalidas(id);
        }
    }, [id]);

    // Lógica de filtrado para el nivel gerencial
    // Asumiendo: estado 1 = Pendiente, 1 = Aprobado, 2 = Rechazado
    const dataFiltrada = salidasFiltradas.filter(s => {
        if (filtroEstado === 'TODOS') return true;
        return s.estado === filtroEstado;
    });

    // Contadores para los botones
    const countPendientes = salidasFiltradas.filter(s => s.estado === 1).length;
    const countAprobados = salidasFiltradas.filter(s => s.estado === 2).length;
    const countRechazados = salidasFiltradas.filter(s => s.estado === 4).length;

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", padding: '3px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 m-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 text-titulos">Panel de Aprobación de Gastos</h3>
                        <p className="text-muted mb-0 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Nivel Gerencial - Revisión y Aprobación
                        </p>
                    </div>
                </div>

                <div className=" d-flex justify-content-end gap-2 " style={{ marginRight: '10px' }}>
                    <button className=" btn btn-dark" style={{ marginLeft: '4px' }} onClick={() => {
                        const path = parseInt(localStorage.getItem('numRol')) === 2 ? 'gerente' : 'cajero'
                        navigate(LOCAL_URL + "/" + path + "/movimientos")
                    }
                    }>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> VOLVER
                    </button>
                </div>

                {/* Cabecera de información del Trámite */}
                <CabeceraTramite id={id} />

                {/* --- SECCIÓN DE FILTROS GERENCIALES --- */}
                <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2">
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm border text-success fw-bold" onClick={() => setFiltroEstado('TODOS')}>TODOS <span className="fw-bold mb-0 text-success">({salidasFiltradas.length})</span></button>
                                <button className="btn btn-warning btn-sm border text-warning fw-bold" onClick={() => setFiltroEstado(1)}>SOLICITADOS <span className="fw-bold mb-0 text-warning">{countPendientes}</span></button>
                                <button className="btn btn-primary btn-sm border text-primary fw-bold" onClick={() => setFiltroEstado(2)}>APROBADOS <span className="fw-bold mb-0 text-primary">{countAprobados}</span></button>
                                <button className="btn btn-warning btn-sm border text-danger fw-bold" onClick={() => setFiltroEstado(4)}>RECHAZADOS <span className="fw-bold mb-0 text-danger">{countRechazados}</span></button>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end ">
                            <div style={{ width: '100%', maxWidth: '300px', paddingRight: '10px' }}>
                                <InputUsuarioSearch
                                    name="input-search-salida"
                                    placeholder="Buscar en esta lista..."
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableSalidas}
                            data={dataFiltrada}
                            cargando={cargando}
                            funciones={[
                                {
                                    // Solo habilitar Aprobar si está Pendiente (estado 0) 
                                    boton: (id_salida, row) => {
                                        // alert(row.estado)
                                        if (row.estado == 2) despacharSalida(id_salida, row.id_tramite);
                                    },
                                    className: (id, row) => `btn btn-success py-1 px-3 x-small me-1 ${row.estado !== 2 ? 'disabled opacity-50' : ''}`,
                                    icono: faCheck,
                                    label: 'Despachar'
                                },
                                {
                                    boton: (id_salida, row) => { exportPDf(window.innerWidth < 1100 ? 'b64' : "print", row) },
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