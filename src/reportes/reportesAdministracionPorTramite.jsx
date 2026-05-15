import { faArrowLeft, faFileDownload, faChartLine, faFileInvoiceDollar, faWallet } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { InputUsuarioStandard } from "../components/input/elementos";
import { useReportes } from "../hooks/HookCustomReportes";
import { useNavigate } from "react-router-dom";
import { INPUT, LOCAL_URL } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ReportesAdministracionPorTramite() {
    const navigate = useNavigate();
    const { estados, setters, listaTramite, reporteSalidas, reporteIngresos, reporteGeneral } = useReportes();


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#ffffff', // Fondo blanco limpio
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // Azul suave al enfocar
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            borderRadius: '8px',
            padding: '4px',
            '&:hover': { borderColor: '#3b82f6' },
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '8px',
            boxShadow:
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            marginTop: '8px',
        }),
        option: (provided, state) => ({
            ...provided,
            padding: '12px 16px', // Más espacio para que no se sienta apretado
            backgroundColor: state.isSelected
                ? '#eff6ff'
                : state.isFocused
                    ? '#f3f4f6'
                    : 'transparent',
            color: state.isSelected ? '#1d4ed8' : '#374151',
            fontWeight: state.isSelected ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderBottom: '1px solid #f3f4f6', // Separador sutil entre items
            '&:active': { backgroundColor: '#dbeafe' },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
        }),
    };
    return (
        <>

            <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
                <div className="panel-custom rounded shadow-sm mx-2">
                    <div className="banco-header-section">

                        <div className="banco-title-container">
                            <h3 className="banco-title-main">Reportes Individual de Caja</h3>
                            <p className="banco-subtitle">Generar reportes individuales por caja</p>
                        </div>
                    </div>


                    <div className="p-4 p-md-5 mt-5" style={{backgroundColor:'white', padding: '2rem', }}>
                        <div className="row g-4">
                            {/* Selector de Trámite */}
                            <div className="col-lg-12">
                                <label className="custom-label">Seleccionar Caja <span className="text-danger">*</span></label>
                                <Select
                                    styles={customStyles}
                                    placeholder={'Seleccione caja...'}
                                    options={listaTramite}
                                    components={{ Option: CustomOption }} // <-- Aquí aplicamos la personalización
                                    getOptionLabel={(e) => `${e.label} (${e.simbolo})`} // Limpio para el buscador
                                    getOptionValue={(e) => e.value}
                                    onChange={(e) => setters.setTramite({ campo: e ? e.value : '', valido: e ? 'true' : 'false' })}

                                    value={
                                        listaTramite.find(t => t.value === estados.tramite.campo) || null
                                    }
                                    isSearchable={true}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            {/* Filtros de Fecha */}
                            <div className="col-md-6">
                                <InputUsuarioStandard
                                    estado={estados.desde}
                                    cambiarEstado={setters.setDesde}
                                    tipo='date'
                                    name='desde'
                                    etiqueta={'Desde (Fecha Inicial)'}
                                    ExpresionRegular={INPUT.FECHA}
                                />
                            </div>
                            <div className="col-md-6">
                                <InputUsuarioStandard
                                    estado={estados.hasta}
                                    cambiarEstado={setters.setHasta}
                                    tipo='date'
                                    name='hasta'
                                    etiqueta={'Hasta (Fecha Final)'}
                                    ExpresionRegular={INPUT.FECHA}
                                />
                            </div>

                            <div className=" row mt-5 text-center">
                                <div className=" col-md-4 col-12 mb-4">
                                    <button
                                        type="button"
                                        className="btn btn-banking-blue order-2 order-md-1"
                                        onClick={() => reporteSalidas(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}
                                    >
                                        <FontAwesomeIcon icon={faWallet} />
                                        Reporte Salidas
                                    </button>
                                </div>
                                {parseInt(localStorage.getItem('numRol')) < 4 ? <>
                                    <div className=" col-md-4 col-12 mb-4">

                                        <button
                                            type="submit"
                                            className={`btn btn-banking-gold order-1 order-md-2 `}
                                            onClick={() => reporteIngresos(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}

                                        >
                                            <FontAwesomeIcon icon={faFileInvoiceDollar} />
                                            <span>              Reporte Ingresos</span>
                                        </button>
                                    </div>
                                    <div className="col-md-4 col-12 mb-4">
                                        <button
                                            type="submit"
                                            className={`btn btn-banking-blue order-1 order-md-2`}
                                            onClick={() => reporteGeneral(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}

                                        >
                                            <FontAwesomeIcon icon={faChartLine} />
                                            <span>  Balance General</span>
                                        </button>
                                    </div>
                                </> : null}
                            </div>
                        </div>
                    </div>

                    {/* Footer Informativo */}
                    <div className="mt-4 text-center">
                        <p className="text-muted small">
                            <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                            Los reportes generados se descargarán automáticamente en formato .xlsx (Excel)
                        </p>
                    </div>
                </div >
            </main>
        </>
    );
}

import { components } from 'react-select';

// Este componente personaliza cómo se ve cada fila en la lista desplegable
const CustomOption = (props) => {
    return (
        <components.Option {...props}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <strong>{props.data.label}</strong>
                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                        Moneda: {props.data.simbolo} | Saldo: {props.data.saldoDisponible}
                    </div>
                    <div
                        style={{ fontSize: '0.55em', color: '#444444', fontWeight: '100' }}
                    >
                        {props.data.detalle.substring(0, 40)}
                    </div>
                </div>
            </div>
        </components.Option>
    );
};
