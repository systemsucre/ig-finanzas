import {

    faEye,
    faPlus
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


    const idUsuarioActual = parseInt(localStorage.getItem('id'));
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
    const mios = boletasFiltradas.filter(b => b.usuario_solicita_id === parseInt(localStorage.getItem('id'))).length;

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", padding: '3px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 m-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 text-titulos">Gestión de Boletas de Gasto</h3>
                    </div>

                </div>
                <div className=" d-flex justify-content-end gap-2 " style={{ marginBottom: '10px' }}>
                    < button
                        className="btn btn-success  fw-bold"
                        onClick={() => navigate(LOCAL_URL + `/nueva-boleta`)}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" /> REGISTRAR BOLETA
                    </button>
                </div>

                <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2">
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-xl-8 ">
                            <div className="d-flex1  gap-2">
                                <button className={`btn btn-sm border fw-bold ${filtroEstado === 'MIOS' ? 'btn-dark' : 'text-success'}`}
                                    onClick={() => setFiltroEstado('MIOS')}>
                                    MIS BOLETAS <span>({mios})</span>
                                </button>
                                <button className="btn  btn-sm border text-primary fw-bold" onClick={() => setFiltroEstado('TODOS')}>TODOS <span className="fw-bold mb-0 text-primary">({boletasFiltradas.length})</span></button>
                                {/* <button className="btn  btn-sm border text-warning fw-bold" onClick={() => setFiltroEstado(1)}>SOLICITADOS <span className="fw-bold mb-0 text-warning">{countSolicitados}</span></button>
                                <button className="btn  btn-sm border text-primary fw-bold" onClick={() => setFiltroEstado(2)}>APROBADOS <span className="fw-bold mb-0 text-primary">{countAprobados}</span></button>
                                <button className="btn  btn-sm border text-success fw-bold" onClick={() => setFiltroEstado(3)}>DESPACHADOS <span className="fw-bold mb-0 text-success">{countDespachados}</span></button> */}
                                {/* <button className="btn  btn-sm border text-danger fw-bold" onClick={() => setFiltroEstado(4)}>RECHAZADOS <span className="fw-bold mb-0 text-danger">{countRechazados}</span></button> */}
                            </div>
                        </div>


                        <div className="col-xl-4 ">
                            <InputUsuarioSearch
                                name="search-boleta"
                                placeholder="Buscar por Nro/código Boleta o solicitante "
                                onChange={handleSearchBoleta}
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