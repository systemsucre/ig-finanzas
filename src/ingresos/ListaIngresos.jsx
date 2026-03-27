import {
    faFilePdf,
    faPlus,
    faEdit,
    faTrash,
    faHandHoldingUsd, faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomIngresos } from "../hooks/HookCustomIngresosCajero"; // Hook adaptado previamente
import { useTramites } from "../hooks/HookCustomTramites"; // Hook adaptado previamente
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ColumnsTableIngresos } from "./columnTableIngresos"; // Columnas adaptadas previamente
import { LOCAL_URL } from "../Auth/config";
import CabeceraTramite from "../components/cabeceraTramite";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaIngresosTramite() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID del trámite

    const {
        ingresosFiltrados,
        cargando,
        handleSearch,
        listarIngresos, // Cambiado de listarSalidas
        eliminarIngreso,
        exportPDfIngresos,
    } = UseCustomIngresos();

    const {
        tramites,
    } = useTramites();




    useEffect(() => {
        if (id) {
            if (!UUID_REGEX.test(id)) {
                navigate(LOCAL_URL + "/cajero/lista-tramites");
                return;
            }
            listarIngresos(id);
        }
    }, [id]);

    // Cálculo de totales para el resumen
    const totalRecaudado = ingresosFiltrados.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

    const funciones = parseInt(localStorage.getItem('numRol')) === 3 ? [
        {
            boton: (id_ingreso) => {
                // alert(`${LOCAL_URL}/cajero/editar-ingreso/${id}/${id_ingreso}`);
                navigate(`${LOCAL_URL}/editar-ingreso/${id}/${id_ingreso}`);
            },
            className: 'btn btn-info py-1 px-3 x-small me-1',
            icono: faEdit,
            label: 'Editar'
        },
        {
            boton: (id_salida, row) => { exportPDfIngresos(window.innerWidth < 1100 ? 'b64' : "print", row) },
            className: 'btn btn-pdf py-1 px-3 x-small me-1',
            icono: faFilePdf,
            label: 'Recibo'
        },
        {
            boton: (id_ingreso) => eliminarIngreso(id_ingreso),
            className: 'btn btn-danger py-1 px-3 x-small',
            icono: faTrash,
            label: 'Eliminar'
        }
    ] :
        [
            {
                boton: (id_salida, row) => { exportPDfIngresos(window.innerWidth < 1100 ? 'b64' : "print", row) },
                className: 'btn btn-pdf py-1 px-3 x-small me-1',
                icono: faFilePdf,
                label: 'Recibo'
            },
        ]

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", padding: '3px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 m-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 text-titulos">Historial de Ingresos y Abonos</h3>
                        <p className="text-muted mb-0 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Gestión Financiera - Control de Pagos por Trámite
                        </p>
                    </div>
                </div>

                <div className=" d-flex justify-content-end gap-2 " style={{ marginRight: '10px' }}>
                    {/* El botón nuevo gasto hereda el UUID correctamente */}
                    {tramites.length > 0 && parseInt(localStorage.getItem('numRol')) === 3 ?

                        tramites[0].estado === 1 ?
                            < button
                                className="btn btn-success  fw-bold"
                                onClick={() => navigate(LOCAL_URL + `/crear-ingreso/${id}`)}
                                disabled={!id || !UUID_REGEX.test(id)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> REGISTRAR PAGO
                            </button> : < button
                                className="btn btn-success  fw-bold"
                                disabled
                            >
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> NO DISPONIBLE
                            </button> : null
                    }
                    <button className=" btn btn-dark" style={{ marginLeft: '4px' }} onClick={() => {
                       
                        navigate(LOCAL_URL + "/movimientos")
                    }
                    }>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> VOLVER
                    </button>
                </div>

                <CabeceraTramite id={id} />

                <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2">
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-light p-2 rounded border">
                                    <FontAwesomeIcon icon={faHandHoldingUsd} className="text-success me-2" />
                                    <span className="fw-bold">Total en Caja: </span>
                                    <span className="text-success fw-bold">CLP. {totalRecaudado.toLocaleString('es-BO')}</span>
                                </div>
                                <span className="text-muted small">({ingresosFiltrados.length} registros)</span>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                            <div style={{ width: '100%', maxWidth: '300px' }}>
                                <InputUsuarioSearch
                                    name="input-search-ingreso"
                                    placeholder="Buscar abono o detalle..."
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableIngresos}
                            data={ingresosFiltrados}
                            cargando={cargando}
                            funciones={funciones}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}