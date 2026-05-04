import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCustomBoletas } from "../hooks/HookCustomBoleta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {


    faFilePdf,
    faCheck,

    faClock, faCircleCheck, faUserTie, faEdit,
    faTrash,
    faArrowLeft,
    faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import { ColumnsTableDetalle } from './columnTableDetalle';
import DataTable from "../components/DataTable";
import { LOCAL_URL } from '../Auth/config';


export const DetallesBoleta = () => {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [infoCabecera, setInfoCabecera] = useState(null);

    const {
        consultarDetalleBoleta,
        exportarBoletaPDF,

        aprobarBoleta,
        aprovarDespacharBoleta,
        rechazarBoleta,
        despacharBoleta,
        eliminarBoleta,
        habilitarEdicionBoleta,

        itemsBoleta,
        cargando
    } = UseCustomBoletas();

    useEffect(() => {
        const cargarDatos = async () => {
            await consultarDetalleBoleta(codigo);
        };
        cargarDatos();
    }, [codigo]);

    // Actualizamos la cabecera cuando lleguen los items
    useEffect(() => {
        if (itemsBoleta && itemsBoleta.length > 0) {
            setInfoCabecera(itemsBoleta[0]);
        }
    }, [itemsBoleta]);


    const styles = {
        card: { borderRadius: '16px', border: 'none', overflow: 'hidden' },
        headerIcon: { width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' },
        financeBox: { backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '12px', borderLeft: '4px solid #4e73df' },
        tableHeader: { backgroundColor: '#2c3e50', color: '#fff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' },
        badgeStatus: { padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }
    };
    // console.log(itemsBoleta)
    return (
        !cargando ?
            <main className="container-xl mt-5">

                {/* CUERPO - TABLA DE ITEMS */}
                <div className="panel-custom bg-whited rounded shadow-sm  mx-2" style={{ marginTop: '6rem' }} >

                    <div className="banco-nav-header">
                        <button className="banco-btn-back" onClick={() => navigate(-1)}>
                            <FontAwesomeIcon  icon={faChevronLeft   } />
                        </button>
                        <h1 className="banco-nav-title">Volver a Lista de Boletas</h1>
                    </div>

                    <div className="banco-card-header">
                        <div className="banco-info-main">
                            {/* Etiqueta superior sutil */}
                            <p className="banco-label-top">
                                BOLETA <span className="banco-id-secondary">{codigo}</span>
                            </p>

                            {/* Identificador Principal (como el saldo) */}
                            <h2 className="banco-monto-principal">
                                #{itemsBoleta && itemsBoleta.length > 0 ? itemsBoleta[0].numero_boleta : 'S/N'}
                            </h2>

                            <p className="banco-label-sub">Número de Boleta</p>
                        </div>

                        <hr className="banco-divider" />

                        <div className="banco-info-grid">
                            <div className="banco-grid-item">
                                <span className="banco-grid-label">Estado actual</span>
                                {/* Badge sutil estilo BancoEstado */}
                                <span style={{
                                    ...styles.badgeStatus,
                                    background: 'transparent',
                                    padding: '0',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: infoCabecera?.estado === 3 ? '#38a169' : '#d69e2e'
                                }}>
                                    <FontAwesomeIcon icon={infoCabecera?.estado === 3 ? faCircleCheck : faClock} className="me-2" />
                                    {infoCabecera?.estado === 3 ? 'Finalizada' : 'Pendiente despacho'}
                                </span>
                            </div>

                            <div className="banco-grid-item text-end">
                                <span className="banco-grid-label">Total Boleta</span>
                                <span className="banco-grid-value">
                                    {
                                        itemsBoleta.reduce((acumulador, item) => {
                                            // Convertimos el string "10.00" a número flotante
                                            return acumulador + parseFloat(item.monto);
                                        }, 0)?.toFixed(2)} {itemsBoleta[0]?.simbolo}
                                </span>
                            </div>
                        </div>

                        <button className="banco-btn-cartolas" onClick={() => exportarBoletaPDF(window.innerWidth < 1100 ? 'b64' : "print", infoCabecera)}>
                            Ver Detalles <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                        </button>
                    </div>
                    {itemsBoleta && itemsBoleta.length > 0 &&
                        itemsBoleta[0].usuario_solicita_id === parseInt(localStorage.getItem('id_')) && (
                            <div className="banco-actions-container">
                                <button
                                    className="banco-btn-secondary edit"
                                    onClick={() => navigate(`${LOCAL_URL}/modificar-boleta/${codigo}`)}
                                >
                                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                                    Editar Boleta
                                </button>

                                <button
                                    className="banco-btn-secondary delete"
                                    onClick={() => eliminarBoleta(codigo)}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                                    Eliminar
                                </button>
                            </div>
                        )}

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableDetalle}
                            data={itemsBoleta}
                            cargando={cargando}
                            funciones={[]}
                        />
                    </div>
                </div>

            </main > : <p style={{ margin: '10rem' }}>cargando</p>
    );
};