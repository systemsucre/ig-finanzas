import {
    faFilePdf,
    faPlus,
    faEdit,
    faTrash,
    faFileInvoiceDollar, faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomHonorarios } from "../hooks/HookCustomHonorarios"; // El hook que creamos
import { useNavigate,} from "react-router-dom";
import { useEffect } from "react";
import { ColumnsTableHonorarios } from "./columnTableHonorarios"; // Deberás crear este archivo de columnas
import { LOCAL_URL } from "../Auth/config";


export function ListaHonorariosTramite() {
    const navigate = useNavigate();

    const {
        honorariosFiltrados,
        cargando,
        handleSearch,
        listarHonorarios,
        eliminarHonorario,
        exportPDfIngresos,
        // exportPDfHonorarios, // Actívalo cuando tengas el generador de PDF
    } = UseCustomHonorarios();



    useEffect(() => {
        listarHonorarios();
    }, []);

    // Cálculo del total de honorarios devengados
    const totalHonorarios = honorariosFiltrados.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

    // Definición de acciones según Rol (3 = Cajero/Admin con permisos)
    const funciones = parseInt(localStorage.getItem('numRol')) <= 3 ? [
        {
            boton: (id_honorario) => {
                const rol = parseInt(localStorage.getItem('numRol'))
                const path = rol === 1?'admin':rol === 2 ? 'gerente':rol ===3?'cajero':''
                navigate(`${LOCAL_URL}/${path}/editar-honorario/${id_honorario}`);
            },
            className: 'btn btn-info py-1 px-3 x-small me-1',
            icono: faEdit,
            label: 'Editar'
        },
        {
            boton: (id_honorario, row) => { exportPDfIngresos(window.innerWidth < 1100 ? 'b64' : "print",row) },
            className: 'btn btn-pdf py-1 px-3 x-small me-1',
            icono: faFilePdf,
            label: 'Recibo'
        },
        {
            boton: (id_honorario) => eliminarHonorario(id_honorario),
            className: 'btn btn-danger py-1 px-3 x-small',
            icono: faTrash,
            label: 'Eliminar'
        }
    ] : [
        /* Acciones para roles de solo lectura */
    ];

    return (
        <>
            <main className="container-xl mt-3" style={{ maxWidth: "100%", padding: '5px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 m-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 text-titulos">Honorarios Profesionales</h3>
                      
                    </div>
                </div>



                <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2">
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-light p-2 rounded border">
                                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-primary me-2" />
                                    <span className="fw-bold">Total Honorarios: </span>
                                    <span className="text-primary fw-bold">Bs. {totalHonorarios.toLocaleString('es-BO')}</span>
                                </div>
                                <span className="text-muted small">({honorariosFiltrados.length} recibos)</span>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                            <div style={{ width: '100%', maxWidth: '300px' }}>
                                <InputUsuarioSearch
                                    name="search-honorarios"
                                    placeholder="Buscar por cliente o codigo tramite ..."
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableHonorarios}
                            data={honorariosFiltrados}
                            cargando={cargando}
                            funciones={funciones}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}