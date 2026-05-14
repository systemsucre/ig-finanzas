
import md5 from 'md5';
import { useEffect, useState } from 'react';

import { INPUT, URL } from "./Auth/config";
import useAuth from "./Auth/useAuth";
import { ComponenteCheck, InputUsuarioStandard } from './components/input/elementos';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';


// src/utils/auditoria.js

export const getDatosAuditoria = async () => {
    const ua = navigator.userAgent;
    let navegadorReal = "Chromium / Desconocido";

    // 1. Detección de Navegadores (El orden importa)
    if (navigator.brave && await navigator.brave.isBrave()) {
        navegadorReal = "Brave";
    } else if (ua.includes("Opera") || ua.includes("OPR")) {
        navegadorReal = "Opera";
    } else if (ua.includes("Edg")) {
        navegadorReal = "Microsoft Edge";
    } else if (ua.includes("Firefox")) {
        navegadorReal = "Firefox";
    } else if (ua.includes("Chrome") && !ua.includes("Chromium")) {
        navegadorReal = "Google Chrome";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
        navegadorReal = "Safari (Apple)";
    }

    // 2. Detección de Sistema Operativo (Incluyendo iMac/iPhone)
    let so = "Otro";
    if (ua.includes("Win")) so = "Windows";
    if (ua.includes("Mac")) {
        // Diferenciamos si es iPad/iPhone o Computadora Mac (iMac/MacBook)
        so = (navigator.maxTouchPoints > 0) ? "iOS (iPad/iPhone)" : "macOS (iMac/MacBook)";
    }
    if (ua.includes("Linux")) so = "Linux";
    if (ua.includes("Android")) so = "Android";

    // 3. IP Pública (Servicio externo)
    let ipPublica = "No disponible";
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ipPublica = data.ip;
    } catch (e) {
        console.warn("Fallo al obtener IP");
    }

    return {
        // Identificación de Software
        navegador: navegadorReal,
        sistema_operativo: so,
        dispositivo: navigator.platform,
        idioma: navigator.language,

        // Hardware del Usuario
        pantalla: `${window.screen.width}x${window.screen.height}`,
        nucleos: navigator.hardwareConcurrency || 'N/D',
        ram_estimada: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/D',

        // Datos de Red y Entorno
        ip_publica: ipPublica,
        zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone,
        agente_completo: ua,
        
        // Metadata de sesión
        fecha_ingreso: new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' }),
        cookies_habilitadas: navigator.cookieEnabled
    };
};
const datosAuditoriaExtra = await getDatosAuditoria();


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
            // Definimos el objeto con los datos a enviar
            const body = {
                datosAuditoriaExtra,
                intel: usuario.campo,
                viva: md5(password.campo), // Sigue usando el hash md5 para la password
            };

            try {
                // Cambiamos axios.get por axios.post
                // Nota: En POST, el segundo argumento es el 'body', no se usa 'params'
                const response = await axios.post(URL, body);

                const json = response.data;

                if (json.ok) {
                    // Guardamos la sesión
                    localStorage.setItem('tiempo', new Date().getMinutes());
                    localStorage.setItem("token", json.token);
                    localStorage.setItem('username', json.username);
                    localStorage.setItem('nombre', json.nombre);
                    localStorage.setItem('rol', json.rol_des);
                    localStorage.setItem('numRol', json.numRol);
                    localStorage.setItem('id_', json.id_);
                    localStorage.setItem('entidad', json.entidad);
                    localStorage.setItem('moneda', json.moneda);
                    localStorage.setItem('idSesion', json.idSesion); // Guardamos el ID de sesión

                    // Si el usuario marcó "Recordarme", guardamos su nombre en localStorage

                    auth.login('ok');
                } else {
                    toast.error(json.msg);
                }
            } catch (error) {
                // Manejo de errores de conexión o servidor
                const errorMsg = error.response?.data?.msg || error.message;
                toast.error(errorMsg);
            }
        } else {
            toast.error('Introduzca sus credenciales de acceso');
        }
    };

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center vh-100">
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5 col-xl-4 animate-fade-in">

                        <div className="login-card shadow-clinical p-4 p-md-5" style={{ padding: '1rem' }}>
                            {/* Encabezado con Icono Animado */}
                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">💳</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">CONTAMAX</h2>
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
                                        placeholder={"mauri@mauri.com"}
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
                                    <a href="https://wa.me/+59171166513" className="text-primary fw-bold">¿Olvidó su clave?</a>
                                </div>

                                <button type="submit" className="btn btn-dark-clinical w-100 py-3 shadow-sm" >
                                    Iniciar Sesión <FontAwesomeIcon icon={faUnlock} />
                                </button>
                            </form>

                            <div className="mt-5 text-center border-top pt-4">
                                <p className="small text-muted mb-0">
                                    ¿Nuevo en el sistema? <br />
                                    <a href="https://wa.me/+59171166513" className="text-primary fw-bold text-decoration-none" target='_black'>Solicitar acceso al administrador</a>
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