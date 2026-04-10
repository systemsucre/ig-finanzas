import { INPUT } from "../Auth/config";
import { ComponenteInputUserDisabled, InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useMiPerfil } from "../hooks/HookCustomMiPerfil";

const MiContrasena = () => {


    // 2. Extraemos el objeto setters del Hook
    const {
        estados,
        setters,
        recet_,
    } = useMiPerfil();

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow-clinical p-4 p-md-5 bg-white" style={{ borderTop: `10px #0d6efd`, marginTop: '2rem' }} >

                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">{'👤'}</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">
                                    {'Cambiar mi contraseña'}
                                </h2>
                                <p className="text-muted small">{localStorage.getItem('entidad')}</p>
                            </div>

                            <div className="row g-3" >

                                {/* Credenciales de Acceso */}
                                <div className="col-12 mt-4">
                                    <hr className="text-muted" />
                                    <p className="fw-bold text-primary small mb-3">CREDENCIALES DE SISTEMA</p>
                                </div>

                                <div className="col-md-3">
                                    <InputUsuarioStandard
                                        estado={estados.pass} cambiarEstado={setters.setPass} mayusculas={false}
                                        tipo='text' name='pass' etiqueta='Contraseña actual'
                                        placeholder="*****" ExpresionRegular={INPUT.PASSWORD}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <InputUsuarioStandard
                                        estado={estados.pass1} cambiarEstado={setters.setPass1} mayusculas={false}
                                        tipo='text' name='pass1' etiqueta='nueva contraseña'
                                        placeholder="*****" ExpresionRegular={INPUT.PASSWORD}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <InputUsuarioStandard
                                        estado={estados.pass2} cambiarEstado={setters.setPass2} mayusculas={false}
                                        tipo='text' name='username' etiqueta='Confirmar Contraseña'
                                        placeholder="******" ExpresionRegular={INPUT.PASSWORD}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <ComponenteInputUserDisabled
                                        estado={estados.user}
                                        tipo='text'
                                        etiqueta={'Username'}
                                    />
                                </div>
                                <div className="col-12 p-3 text-end">
                                    <button type="submit" className={`btn ${` btn-success`} px-5 py-2 fw-bold shadow-sm`} onClick={(e) => recet_(e)}>
                                        {'ACTUALIZAR CONTRASEÑA'}
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

export default MiContrasena;