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
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-11 col-lg-10 animate-fade-in">

                        <div className="login-card shadow-banking border-0 bg-white" style={{ borderRadius: '24px', overflow: 'hidden' }}>

                            <div className="p-4 text-center cabecera-formulario">
                                <h2 className="h4 fw-bold m-0 text-uppercase tracking-wider">
                                    {'Cambiar contraseña'}
                                </h2>
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
                                <div className="col-12 d-flex flex-column flex-md-row justify-content-end gap-3 mt-5 pt-4 border-top">

                                    <button
                                        type="button"
                                        className="btn btn-banking-cancel order-2 order-md-1"
                                        onClick={() => window.history.back()}
                                    >
                                        CANCELAR
                                    </button>
                                    <button type="submit"

                                        className={`btn  btn-banking-blue order-1 order-md-2 px-5`}


                                        onClick={(e) => recet_(e)}>
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