import { faUnlock } from "@fortawesome/free-solid-svg-icons";
import { INPUT, LOCAL_URL } from "../Auth/config";
import { ComponenteInputUserDisabled, InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useMiPerfil } from "../hooks/HookCustomMiPerfil";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MiPerfil = () => {
    const navigate = useNavigate()

    // 2. Extraemos el objeto setters del Hook
    const {
        estados,
        setters,
        actualizar,
    } = useMiPerfil();

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow-clinical p-4 p-md-5 bg-white" style={{ borderTop: `10px #0d6efd`, marginTop:'2rem' }} >

                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">{'👤'}</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">
                                    {'Actualizar mi Perfil'}
                                </h2>
                                <p className="text-muted small">{localStorage.getItem('entidad')}</p>
                            </div>

                            <div className="row g-3" >

                                {/* Datos Personales */}
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.nombre}
                                        tipo='text' name='nombre' etiqueta='Nombre '
                                        placeholder="Ej. Juan" ExpresionRegular={INPUT.NOMBRE}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ap1} cambiarEstado={setters.setAp1}
                                        tipo='text' name='ap1' etiqueta='Primer Apellido'
                                        placeholder="Ej. Perez" ExpresionRegular={INPUT.NOMBRE}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ap2} cambiarEstado={setters.setAp2}
                                        tipo='text' name='ap2' etiqueta='Segundo Apellido'
                                        placeholder="Ej. Gomez" ExpresionRegular={INPUT.NOMBRE}
                                        importante={false}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ci} cambiarEstado={setters.setCi}
                                        tipo='text' name='ci' etiqueta='C.I.'
                                        placeholder="1234567" ExpresionRegular={INPUT.CI}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.celular} cambiarEstado={setters.setCelular}
                                        tipo='text' name='celular' etiqueta='Celular'
                                        placeholder="70000000" ExpresionRegular={INPUT.TELEFONO}
                                    />
                                </div>


                                <div className="col-md-4">
                                    <ComponenteInputUserDisabled
                                        estado={estados.idRol}
                                        tipo='text' name='celular' etiqueta='Rol'
                                        placeholder="70000000" 
                                    />
                                </div>

                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={estados.direccion} cambiarEstado={setters.setDireccion}
                                        tipo='text' name='direccion' etiqueta='Dirección'
                                        placeholder="Av. Siempre Viva #123" ExpresionRegular={INPUT.DIRECCION}
                                    />
                                </div>
                                <div className="col-12 p-3 text-end">
                                    <button type="submit" className={`btn ${` btn-success`} px-5 py-2 fw-bold shadow-sm`} onClick={(e) => actualizar(e)}>
                                        {'ACTUALIZAR '}
                                    </button>
                                     <button type="submit"  className={`btn ${` btn-danger`} px-5 py-2 fw-bold shadow-sm`} style={{ marginLeft: '5px' }} onClick={(e) => navigate(`${LOCAL_URL + '/c-pass'}`)} >
                                        <FontAwesomeIcon icon={faUnlock} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MiPerfil;