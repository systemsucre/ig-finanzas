import {
    faEdit,
    faTrashAlt,
    faFilePdf,
    faPlus,
    faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomSalidas } from "../hooks/HookCustomSalidas";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ColumnsTableSalidas } from "./columnTableSalidas";
import { LOCAL_URL } from "../Auth/config";
import CabeceraTramite from "../components/cabeceraTramite";
import { useTramites } from "../hooks/HookCustomTramites"; // Hook adaptado previamente


// Expresión regular para validar UUID (v1 a v5)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaSalidas() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID del Trámite (ahora UUID)  

    const {
        salidasFiltradas,
        cargando,
        handleSearch,
        listarSalidas,
        eliminarSalida,
        exportPDf,
    } = UseCustomSalidas();

    const {
        tramites,
        cargarTramiteInfo

    } = useTramites();


    useEffect(() => {
        // Validación de seguridad: Si el ID no es un UUID válido, redirigimos
        if (id) {
            if (!UUID_REGEX.test(id)) {
                console.error("ID de trámite no válido (UUID esperado)");
                navigate(LOCAL_URL + "/auxiliar/lista-tramites"); // Redirigir a la lista general
                return;
            }
            listarSalidas(id);
            cargarTramiteInfo(id)

        }
    }, [id, navigate]);

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", padding: '3px' }}>
                <div className=" align-items-center mb-4 m-2">
                    <div className="d-flex justify-content-between align-items-center p-2">
                        <div>
                            <h3 className="text-dark fw-bold mb-0">Gestión de Gastos</h3>
                            <p className="text-muted mb-0 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                                Control de salidas económicas
                            </p>
                        </div>

                    </div>
                    <div className=" d-flex justify-content-end gap-2 " style={{ marginRight: '10px' }}>
                        {/* El botón nuevo gasto hereda el UUID correctamente */}
                        {tramites.length > 0 ?

                            tramites[0].estado === 1 ?
                                < button
                                    className="btn btn-success  fw-bold"
                                    onClick={() => {
                                        const rol = localStorage.getItem('numRol')
                                        let path = null
                                        rol == 3 ? path = 'cajero' : rol == 4 ? path = 'auxiliar' : rol ==2 ? path ='gerente':null
                                        navigate(LOCAL_URL + `/${path}/salidas/crear/${id}`)
                                    }
                                    }
                                    disabled={!id || !UUID_REGEX.test(id)}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="me-2" /> NUEVO GASTO
                                </button> : < button
                                    className="btn btn-success  fw-bold"
                                    disabled
                                >
                                    <FontAwesomeIcon icon={faPlus} className="me-2" /> NO DISPONIBLE{tramites[0].estado}
                                </button> : null
                        }
                        <button className=" btn btn-dark" style={{ marginLeft: '4px' }} onClick={() => {
                            const rol = localStorage.getItem('numRol')
                            let path = null
                            rol == 3 ? path = 'cajero' : rol == 4 ? path = 'auxiliar' : path = 'gerente'
                            navigate(LOCAL_URL + "/" + path + "/movimientos")
                        }
                        }>
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> VOLVER
                        </button>
                    </div>
                </div>

                {/* Renderizado de la Cabecera del Trámite */}
                <CabeceraTramite id={id} />

                <div className="panel-custom bg-white rounded shadow-sm p-2">
                    <div style={{ width: '100%', maxWidth: '300px', paddingLeft: '5px' }}>
                        <InputUsuarioSearch
                            name="input-search-salida"
                            placeholder="Filtrar por detalle..."
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableSalidas}
                            data={salidasFiltradas}
                            cargando={cargando}
                            funciones={[
                                {
                                    // 1. Bloqueo de funcionalidad: Si no es estado 1, la función es null
                                    boton: (tramites?.length > 0 && tramites[0].estado === 1)
                                        ? (id_salida, row) => {
                                            const rol = localStorage.getItem('numRol')
                                            let path = null
                                            rol == 3 ? path = 'cajero' : rol == 4 ? path = 'auxiliar' : 'gerente'
                                            navigate(`${LOCAL_URL}/${path}/salidas/editar/${row.id_tramite}/${id_salida}`)

                                        }
                                        : () => alert(),

                                    // 2. Bloqueo Visual: 'disabled' desactiva el click, el icono y el label
                                    // 'opacity-50' hace que todo el conjunto (icono + texto) se vea gris
                                    className: `btn btn-info py-1 px-3 x-small me-1 ${(tramites?.length > 0 && tramites[0].estado === 1) ? '' : 'disabled opacity-50'
                                        }`,

                                    icono: faEdit,
                                    label: 'Editar'
                                },
                                {
                                    boton: (tramites?.length > 0 && tramites[0].estado === 1) ? (id_salida, row) => {
                                        eliminarSalida(id_salida, id);
                                    } : null,
                                    className: `btn btn-danger py-1 px-3 x-small me-1 ${(tramites?.length > 0 && tramites[0].estado === 1) ? '' : 'disabled opacity-50'}`,
                                    icono: faTrashAlt,
                                    label: 'Eliminar'
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
            </main >
        </>
    );
}