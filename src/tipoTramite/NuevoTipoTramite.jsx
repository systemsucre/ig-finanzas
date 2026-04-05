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

    const { setTipoTramite,setCodigo, setEstado } = setters;

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
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 animate-fade-in">
                        <div className="login-card shadow-clinical p-4 p-md-5 bg-white" style={{  marginTop:'2rem' }}>

                            {/* Encabezado Dinámico */}
                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">{id ? '📂' : '🆕'}</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">
                                    {id ? 'Actualizar Trámite' : 'Nuevo Tipo de Trámite'}
                                </h2>
                                <p className="text-muted small">Configuración de Servicios - KR Estudios</p>
                            </div>

                            <form className="row g-3" onSubmit={(e) => guardarTramite(e, id ? id : null)}>

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
                                <div className="col-12 p-3 text-end mt-4">
                                    <hr />
                                    <button
                                        type="submit"
                                        className={`btn ${id ? ` btn-info text-white` : ` btn-success`} px-5 py-2 fw-bold shadow-sm`}
                                    >
                                        {id ? 'ACTUALIZAR DATOS' : 'CREAR TRÁMITE'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default NuevoTipoTramite;