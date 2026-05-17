import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useUsuarios } from "../hooks/HookCustomUsuarios";
import { faInfoCircle, faCheckCircle, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    }, [id, usuariosFiltrados, setNombre, setAp1, setAp2, setCi, setCelular, setDireccion, setUsername, setIdRol, setEstado]);

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', marginTop:'3rem' }}>
            <section style={{ maxWidth: '780px', margin: '0 auto' }}>
                
                {/* CABECERA MINIMALISTA EXTERNA */}
                <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
                            Control de Accesos (RBAC)
                        </span>
                        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0, letterSpacing: '-0.5px' }}>
                            {id ? 'Actualizar Ficha de Usuario' : 'Registro de Nuevo Usuario'}
                        </h1>
                    </div>
                    {id && (
                        <span style={{ background: '#e2e8f0', color: '#334155', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '99px' }}>
                            ID: {id}
                        </span>
                    )}
                </div>

                <form onSubmit={(e) => guardarUsuario(e, id ? id : null)}>
                    
                    {/* TARJETA 1: DATOS PERSONALES */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '4px solid #0f172a' }}>
                        
                        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'rgba(15, 23, 42, 0.08)', color: '#0f172a', fontWeight: '700', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '6px' }} />
                                Bloque 1
                            </span>
                            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Información Personal y Civil</span>
                        </div>

                        {/* Grid: Nombre, Ap1, Ap2 */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.nombre} cambiarEstado={setters.setNombre}
                                    tipo='text' name='nombre' etiqueta='Nombre(s)'
                                    placeholder="Ej. Juan" ExpresionRegular={INPUT.NOMBRE}
                                />
                            </div>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.ap1} cambiarEstado={setters.setAp1}
                                    tipo='text' name='ap1' etiqueta='Primer Apellido'
                                    placeholder="Ej. Perez" ExpresionRegular={INPUT.NOMBRE}
                                />
                            </div>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.ap2} cambiarEstado={setters.setAp2}
                                    tipo='text' name='ap2' etiqueta='Segundo Apellido'
                                    placeholder="Ej. Gomez" ExpresionRegular={INPUT.NOMBRE}
                                    importante={false}
                                />
                            </div>
                        </div>

                        {/* Grid: CI, Celular, Rol */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.ci} cambiarEstado={setters.setCi}
                                    tipo='text' name='ci' etiqueta='C.I. / Documento'
                                    placeholder="1234567" ExpresionRegular={INPUT.CI}
                                />
                            </div>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.celular} cambiarEstado={setters.setCelular}
                                    tipo='text' name='celular' etiqueta='Celular de Contacto'
                                    placeholder="70000000" ExpresionRegular={INPUT.TELEFONO}
                                />
                            </div>
                            <div>
                                <Select1
                                    estado={estados.idRol} cambiarEstado={setters.setIdRol}
                                    lista={roles} 
                                    etiqueta="Perfil / Rol Asignado"
                                    Name="id_rol" ExpresionRegular={INPUT.ID}
                                />
                            </div>
                        </div>

                        {/* Dirección Completa */}
                        <div style={{ width: '100%' }}>
                            <InputUsuarioStandard
                                estado={estados.direccion} cambiarEstado={setters.setDireccion}
                                tipo='text' name='direccion' etiqueta='Dirección Domiciliaria'
                                placeholder="Av. Siempre Viva #123" ExpresionRegular={INPUT.DIRECCION}
                            />
                        </div>
                    </div>

                    {/* TARJETA 2: CREDENCIALES DE SISTEMA */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '4px solid #64748b' }}>
                        
                        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'rgba(100, 116, 139, 0.1)', color: '#64748b', fontWeight: '700', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <FontAwesomeIcon icon={faUserShield} style={{ marginRight: '6px' }} />
                                Bloque 2
                            </span>
                            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Credenciales de Acceso e Inicio de Sesión</span>
                        </div>

                        {/* Grid: Username y Password */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.username} cambiarEstado={setters.setUsername} mayusculas={false}
                                    tipo='text' name='username' etiqueta='Nombre de Usuario (Username)'
                                    placeholder="juan.perez" ExpresionRegular={INPUT.INPUT_USUARIO}
                                />
                            </div>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.password} cambiarEstado={setters.setPassword}
                                    tipo='text' name='password'
                                    etiqueta={id ? 'Nueva Contraseña (Opcional)' : 'Contraseña de Acceso'}
                                    placeholder={id ? "Dejar vacío para mantener actual" : "Asigne una contraseña segura"}
                                    ExpresionRegular={id ? null : INPUT.PASSWORD}
                                    importante={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* BARRA INFERIOR DE ACCIONES (ESTILO BANCO) */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'end', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', gap: '12px' }}>
                        
                        <button
                            type="button"
                            style={{ background: '#f1f5f9', border: 'none', color: '#475569', fontWeight: '600', fontSize: '14px', padding: '14px 28px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            style={{ background: '#0f172a', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '14px', padding: '14px 36px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)' }}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} />
                            <span>{id ? 'GUARDAR CAMBIOS' : 'REGISTRAR USUARIO'}</span>
                        </button>

                    </div>

                </form>
            </section>
        </main>
    );
};

export default NuevoUsuario;