import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useUsuarios } from "../hooks/HookCustomUsuarios";

const NuevoUsuario = () => {
    // 1. Obtenemos el ID de la URL
    const { id } = useParams();

    // 2. Extraemos el objeto setters del Hook
    const {
        estados,
        setters,
        roles,
        guardarUsuario,
        usuariosFiltrados
    } = useUsuarios();

    // 3. DESESTRUCTURACIÓN: Extraemos las funciones individuales del objeto setters
    // Las funciones de estado (setState) son estables por naturaleza en React
    const {
        setNombre, setAp1, setAp2, setCi,
        setCelular, setDireccion, setUsername,
        setIdRol, setEstado
    } = setters;

    // 4. Efecto corregido
    useEffect(() => {
        if (id && usuariosFiltrados.length > 0) {
            const user = usuariosFiltrados.find(u => u.id === parseInt(id));
            if (user) {
                setNombre({ campo: user.nombre, valido: 'true' });
                setAp1({ campo: user.ap1, valido: 'true' });
                setAp2({ campo: user.ap2 || '', valido: 'true' });
                setCi({ campo: user.ci, valido: 'true' });
                setCelular({ campo: user.celular || '', valido: 'true' });
                setDireccion({ campo: user.direccion || '', valido: 'true' });
                setUsername({ campo: user.username, valido: 'true' });
                setIdRol({ campo: user.id_rol, valido: 'true' });
                setEstado({ campo: user.estado, valido: 'true' });
            }
        }
        // IMPORTANTE: Aquí pasamos las funciones desestructuradas, NO el objeto 'setters'
    }, [id, usuariosFiltrados, setNombre, setAp1, setAp2, setCi, setCelular, setDireccion, setUsername, setIdRol, setEstado]);

    return (
        <main className="container-xl mt-5" style={{ minHeight: '100vh' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-11 col-lg-9 col-xl-8 animate-fade-in">
                        <div className="login-card shadow-clinical p-4 p-md-5 bg-white" style={{ borderRadius: '15px' }}>

                            {/* Encabezado Dinámico */}
                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">{id ? '📝' : '👤'}</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">
                                    {id ? 'Actualizar Usuario' : 'Registro de Usuario'}
                                </h2>
                                <p className="text-muted small">Gestión de Personal - KR Estudios</p>
                            </div>

                            <form className="row g-3" onSubmit={(e) => guardarUsuario(e, id ? id : null)}>

                                {/* Datos Personales */}
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.nombre} cambiarEstado={setters.setNombre}
                                        tipo='text' name='nombre' etiqueta='Nombre *'
                                        placeholder="Ej. Juan" ExpresionRegular={INPUT.NOMBRE}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ap1} cambiarEstado={setters.setAp1}
                                        tipo='text' name='ap1' etiqueta='Primer Apellido *'
                                        placeholder="Ej. Perez" ExpresionRegular={INPUT.NOMBRE}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ap2} cambiarEstado={setters.setAp2}
                                        tipo='text' name='ap2' etiqueta='Segundo Apellido'
                                        placeholder="Ej. Gomez" ExpresionRegular={INPUT.NOMBRE}
                                        importante = {false}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.ci} cambiarEstado={setters.setCi}
                                        tipo='text' name='ci' etiqueta='C.I. *'
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
                                    <Select1
                                        estado={estados.idRol} cambiarEstado={setters.setIdRol}
                                        lista={roles} // Usando la lista del Hook (DB)
                                        etiqueta="Rol de Usuario *"
                                        Name="id_rol" ExpresionRegular={INPUT.ID}
                                    />
                                </div>

                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={estados.direccion} cambiarEstado={setters.setDireccion}
                                        tipo='text' name='direccion' etiqueta='Dirección'
                                        placeholder="Av. Siempre Viva #123" ExpresionRegular={INPUT.DIRECCION}
                                    />
                                </div>

                                {/* Credenciales de Acceso */}
                                <div className="col-12 mt-4">
                                    <hr className="text-muted" />
                                    <p className="fw-bold text-primary small mb-3">CREDENCIALES DE SISTEMA</p>
                                </div>

                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.username} cambiarEstado={setters.setUsername} mayusculas ={false}
                                        tipo='text' name='username' etiqueta='Nombre de Usuario *'
                                        placeholder="juan.perez" ExpresionRegular={INPUT.INPUT_USUARIO}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.password} cambiarEstado={setters.setPassword}
                                        tipo='text' name='password'
                                        etiqueta={id ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}
                                        placeholder="Dejar en blanco para no cambiar"
                                        ExpresionRegular={id ? null : INPUT.PASSWORD}
                                        importante = {false}
                                    />
                                </div>

                                <div className="col-12 p-3 text-end">
                                    <button type="submit" className={`btn ${id ? ` btn-info` : ` btn-success`} px-5 py-2 fw-bold shadow-sm`}>
                                        {id ? 'GUARDAR CAMBIOS' : 'REGISTRAR USUARIO'}
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

export default NuevoUsuario;