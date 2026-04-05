import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCustomBoletas } from "../hooks/HookCustomBoleta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {


    faFilePdf,
    faCheck,

    faClock, faCircleCheck, faUserTie, faEdit,
    faTrash,
    faArrowLeft
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
                <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2" style={{marginTop:'6rem'}} >
                    <div className="card-header  border-bottom py-4 px-4 mt-3 ">
                        <div className="align-items-center">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <h4 className="fw-bold mb-0 text-dark" style={{ margin: '0', padding: '0' }}>
                                    CODIGO  <span className="codigo-boleta text-primary ms-2" >{codigo}</span>
                                </h4>
                            </div>
                            <div className="d-flex align-items-center gap-3 mb-3">

                                <h4 className="fw-bold mb-0 text-dark " style={{ margin: '0', padding: '0', marginBottom: '1rem' }}>
                                    NUMERO BOLETA  <span className="codigo-boleta text-primary ms-2">{itemsBoleta && itemsBoleta.length > 0 ? itemsBoleta[0].numero_boleta : 'S/N'}</span>
                                </h4>
                            </div>
                            <span style={{ ...styles.badgeStatus, background: infoCabecera?.estado === 3 ? '#dcfce7' : '#fef9c3', fontSize: '16px', color: infoCabecera?.estado === 3 ? '#166534' : '#854d0e' }}>
                                <FontAwesomeIcon icon={infoCabecera?.estado === 3 ? faCircleCheck : faClock} className="me-2" />
                                {infoCabecera?.estado === 3 ? 'TRANSACCIÓN FINALIZADA' : 'PENDIENTE DE DESPACHO'}
                            </span>
                        </div>
                    </div>
                    <div className="card-body bg-light border-bottom py-4 px-4 mt-3">
                        <button className="btn btn-pdf btn-lg px-4 shadow-sm" onClick={() => exportarBoletaPDF('print', infoCabecera)}>
                            <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                        </button>
                        {
                            itemsBoleta && itemsBoleta.length > 0 &&
                                itemsBoleta[0].usuario_solicita_id === parseInt(localStorage.getItem('id_')) ? <>
                                <button className="btn btn-info btn-lg px-4 shadow-sm" onClick={() => navigate(`${LOCAL_URL}/modificar-boleta/${codigo}`)}>
                                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                                </button>
                                <button className="btn btn-danger btn-lg px-4 shadow-sm" onClick={() => eliminarBoleta(codigo)}>
                                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                                </button>
                            </>
                                : null
                        }

                        <button className="btn btn-secondary btn-lg px-4 shadow-sm" style={{ marginLeft: '10px' }} onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Volver
                        </button>

                    </div>

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