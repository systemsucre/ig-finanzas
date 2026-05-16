import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { useTipoTramite } from "../hooks/HookCustomTipoTramite"; // Hook de trámites

const NuevoTipoTramite = () => {
    const { id } = useParams();

    // 1. Extraemos lógica del Hook de Trámites
    const {
        estados,
        setters,
        guardarTramite,
        tramitesFiltrados
    } = useTipoTramite();

    const { setTipoTramite, setCodigo, setEstado } = setters;

    // 2. Efecto para cargar datos en modo Edición
    useEffect(() => {
        if (id && tramitesFiltrados.length > 0) {
            const tramite = tramitesFiltrados.find(t => t.id === parseInt(id));
            if (tramite) { 
                setTipoTramite({ campo: tramite.tipo_tramite, valido: 'true' });
                setCodigo({ campo: tramite.codigo, valido: 'true' });
                setEstado({ campo: tramite.estado, valido: 'true' });
            }
        }
    }, [id, tramitesFiltrados, setTipoTramite, setEstado]);

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-11 col-lg-10 animate-fade-in">

                        <div className="login-card shadow-banking border-0 bg-white" style={{ borderRadius: '24px', overflow: 'hidden' }}>

                            <div className="p-4 text-center cabecera-formulario">
                                <h3 className="h4 fw-bold m-0 text-uppercase tracking-wider">
                                    {id ? 'Actualizar Tipo Tramite' : 'Apertura de Tipo de Trámite'}
                                </h3>
                            </div>
                            <div className="p-4 p-md-5">
                                <form className="row" onSubmit={(e) => guardarTramite(e, id ? id : null)}>

                                    {/* Sección de Datos del Trámite */}
                                    <div className="col-md-5">
                                        <InputUsuarioStandard
                                            estado={estados.tipo_tramite}
                                            cambiarEstado={setters.setTipoTramite}
                                            tipo='text'
                                            name='tipo_tramite'
                                            etiqueta='Nombre del Tipo de Trámite *'
                                            placeholder="Ej. Transferencia de Inmueble"
                                            ExpresionRegular={INPUT.DIRECCION} // Usamos dirección por permitir espacios y caracteres mixtos
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <InputUsuarioStandard
                                            estado={estados.codigo}
                                            cambiarEstado={setters.setCodigo}
                                            tipo='text'
                                            name='codigo'
                                            etiqueta='Codigo Tipo Trámite'
                                            placeholder="Ej. ADM (de 1 a 5 letras)"
                                            ExpresionRegular={INPUT.CODIGO_ENTIDAD} // Usamos dirección por permitir espacios y caracteres mixtos
                                        />
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="col-12 d-flex flex-column flex-md-row justify-content-end gap-3 mt-5 pt-4 border-top">
                                        <button
                                            type="button"
                                            className="btn btn-banking-cancel order-2 order-md-1"
                                            onClick={() => window.history.back()}
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            type="submit"
                                            className={`btn ${id ? 'btn-banking-blue' : 'btn-banking-gold'} order-1 order-md-2 px-5`}
                                        >
                                            {/* <FontAwesomeIcon icon={faCheckCircle} className="me-2" /> */}
                                            <span>              {id ? 'ACTUALIZAR' : ' REGISTRAR'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default NuevoTipoTramite;