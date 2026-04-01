
import md5 from 'md5';
import { useEffect, useState } from 'react';

import { INPUT, LOCAL_URL, URL } from "./Auth/config";
import useAuth from "./Auth/useAuth";
import { ComponenteCheck, InputUsuarioStandard } from './components/input/elementos';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomeLogin = () => {

    const [usuario, setUsuario] = useState({ campo: null, valido: null })
    const [password, setPassword] = useState({ campo: null, valido: null })
    const [recordarme, setRecordarme] = useState(false);
    const auth = useAuth()

    useEffect(() => {
        const recordado = localStorage.getItem('recordarUsuario');
        const usuarioGuardado = localStorage.getItem('nombreUsuario');

        // console.log(usuarioGuardado)
        if (recordado === 'true') {
            if (usuarioGuardado != null) {
                setUsuario({ ...usuario, campo: usuarioGuardado, valido: 'true' });
                setRecordarme(true);
            } else {
                setUsuario({ campo: null, valido: null });
                setRecordarme(false);
            }
        }
    }, []);



    const handleCheckboxChange = (e) => {
        const estaMarcado = e.target.checked;
        setRecordarme(estaMarcado);

        // Si el usuario desmarca, borramos el dato; si marca, lo guardamos
        if (estaMarcado) {
            if (usuario.campo) {
                localStorage.setItem('recordarUsuario', 'true');
                localStorage.setItem('nombreUsuario', usuario.campo);
            }
        } else {
            localStorage.removeItem('recordarUsuario');
            localStorage.removeItem('nombreUsuario'); // Limpiar también el usuario si existe
        }
    };
    const iniciarSesion = async (e) => {
        e.preventDefault();
        if (usuario.campo && password.campo) {
            // auth.login('ok')
            // localStorage.setItem('numRol', 1)
            axios.get(URL, {
                params: {
                    'intel': usuario.campo,
                    'power': '8989389892njn89h8982njcnjnskdjcn909u09j3oi2n3i2093j2kn3k23',
                    'viva': md5(password.campo),
                    'tigo': 'juana',
                    'start': 'garay',
                    'pass': '7827huin3jnud3978EEy9uhn88839j8nld32d23d32dcdsvDFDEewrer',
                }
            }).then(json => {

                if (json.data.ok) {
                    localStorage.setItem('tiempo', new Date().getMinutes())
                    localStorage.setItem("token", json.data.token)
                    localStorage.setItem('username', json.data.username)
                    localStorage.setItem('nombre', json.data.nombre)
                    localStorage.setItem('rol', json.data.rol_des)
                    localStorage.setItem('numRol', json.data.numRol)
                    localStorage.setItem('id_', json.data.id_)
                    localStorage.setItem('entidad', json.data.entidad)
                    localStorage.setItem('moneda', json.data.moneda)
                    auth.login('ok')
                }
                else
                    toast.error(json.data.msg)
            }).catch(function (error) {
                toast.error(error.toJSON().message);
            });
        } else toast.error('Introduzca sus credenciales de acceso')
    }


    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center vh-100">
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5 col-xl-4 animate-fade-in">

                        <div className="login-card shadow-clinical p-4 p-md-5">
                            {/* Encabezado con Icono Animado */}
                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">💳</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">IGFinanzas</h2>
                                <p className="text-muted small">Gestión de gastos</p>
                            </div>

                            <form onSubmit={iniciarSesion} >
                                {/* Campo Email */}
                                <div className="mb-4">
                                    <InputUsuarioStandard
                                        estado={usuario}
                                        cambiarEstado={setUsuario}
                                        tipo='text'
                                        name='usuario'
                                        msg={'Usa entre 4 y 16 letras o números.'}
                                        mayusculas={false}
                                        ExpresionRegular={INPUT.INPUT_USUARIO}
                                        etiqueta={'Usuario'}
                                        placeholder={"ejemplo@hospital.com"}
                                        logo={false}
                                    />
                                </div>

                                {/* Campo Password */}
                                <div className="mb-4">
                                    <InputUsuarioStandard
                                        estado={password}
                                        cambiarEstado={setPassword}
                                        tipo='password'
                                        name='contraseña'
                                        msg={"Longitud permitida: 4 a 12 caracteres."}
                                        mayusculas={false}
                                        ExpresionRegular={INPUT.PASSWORD}
                                        etiqueta={'contraseña'}
                                        placeholder={"*******"}
                                        logo={false}
                                    />
                                </div>

                                <div className="d-flex justify-content-between mb-4 small">
                                    <ComponenteCheck
                                        name='recordarme'
                                        estado={recordarme}
                                        onChange={handleCheckboxChange}
                                        etiqueta='Recordarme'
                                    />
                                    <a href="#" className="text-primary fw-bold">¿Olvidó su clave?</a>
                                </div>

                                <button type="submit" className="btn btn-dark-clinical w-100 py-3 shadow-sm" >
                                    Iniciar Sesión
                                </button>
                            </form>

                            <div className="mt-5 text-center border-top pt-4">
                                <p className="small text-muted mb-0">
                                    ¿Nuevo en el sistema? <br />
                                    <a href="#" className="text-primary fw-bold text-decoration-none">Solicitar acceso al administrador</a>
                                </p>
                            </div>
                        </div>

                        {/* Footer de Seguridad */}
                        <div className="text-center mt-4 animate-delayed">
                            <p className="text-muted-light x-small">
                                🔒 Conexión segura de grado médico SSL/TLS
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomeLogin