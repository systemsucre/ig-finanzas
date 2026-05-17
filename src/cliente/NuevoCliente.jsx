import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { useClientes } from "../hooks/HookCustomCliente"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faUserCheck } from '@fortawesome/free-solid-svg-icons';

const NuevoCliente = () => {
    const { id } = useParams();

    // 1. Extraemos lógica del Hook de Clientes
    const {
        estados,
        setters,
        guardarCliente,
        clientesFiltrados
    } = useClientes();

    const {
        setNombre, setAp1, setAp2, setCi,
        setCelular, setDireccion, setEstado
    } = setters;

    // 2. Efecto para cargar datos en modo Edición
    useEffect(() => {
        if (id && clientesFiltrados.length > 0) {
            const cliente = clientesFiltrados.find(c => c.id === parseInt(id));
            if (cliente) {
                setNombre({ campo: cliente.nombre, valido: 'true' });
                setAp1({ campo: cliente.ap1, valido: 'true' });
                setAp2({ campo: cliente.ap2 || '', valido: 'true' });
                setCi({ campo: cliente.ci, valido: 'true' });
                setCelular({ campo: cliente.celular || '', valido: 'true' });
                setDireccion({ campo: cliente.direccion || '', valido: 'true' });
                setEstado({ campo: cliente.estado, valido: 'true' });
            }
        }
    }, [id, clientesFiltrados, setNombre, setAp1, setAp2, setCi, setCelular, setDireccion, setEstado]);

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif',  marginTop:'3rem' }}>
            <section style={{ maxWidth: '780px', margin: '0 auto' }}>
                
                {/* CABECERA MINIMALISTA EXTERNA */}
                <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
                            Base de Datos Centralizada
                        </span>
                        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0, letterSpacing: '-0.5px' }}>
                            {id ? 'Actualizar Ficha de Cliente' : 'Apertura de Registro'}
                        </h1>
                    </div>
                    {id && (
                        <span style={{ background: '#e2e8f0', color: '#334155', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '99px' }}>
                            ID: {id}
                        </span>
                    )}
                </div>

                <form onSubmit={(e) => guardarCliente(e, id ? id : null)}>
                    
                    {/* TARJETA PRINCIPAL: DATOS DE IDENTIDAD */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '4px solid #0f172a' }}>
                        
                        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'rgba(15, 23, 42, 0.08)', color: '#0f172a', fontWeight: '700', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '6px' }} />
                                Sección 1
                            </span>
                            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Información Civil y de Identidad</span>
                        </div>

                        {/* Fila 1: Nombre, Ap1, Ap2 en Grid Limpio */}
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
                                    placeholder="Opcional" ExpresionRegular={INPUT.NOMBRE}
                                    importante={false}
                                />
                            </div>
                        </div>

                        {/* Fila 2: CI / NIT y Celular */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.ci} cambiarEstado={setters.setCi}
                                    tipo='text' name='ci' etiqueta='C.I. / NIT'
                                    placeholder="Documento oficial" ExpresionRegular={INPUT.CI}
                                />
                            </div>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.celular} cambiarEstado={setters.setCelular}
                                    tipo='text' name='celular' etiqueta='Teléfono de Contacto'
                                    placeholder="7XXXXXXX" ExpresionRegular={INPUT.TELEFONO}
                                />
                            </div>
                        </div>

                        {/* Fila 3: Dirección Completa */}
                        <div style={{ width: '100%' }}>
                            <InputUsuarioStandard
                                estado={estados.direccion} cambiarEstado={setters.setDireccion}
                                tipo='text' name='direccion' etiqueta='Dirección Domiciliaria'
                                placeholder="Calle, Número, Zona" ExpresionRegular={INPUT.DIRECCION}
                            />
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
                            <FontAwesomeIcon icon={id ? faCheckCircle : faUserCheck} />
                            <span>{id ? 'CONFIRMAR ACTUALIZACIÓN' : 'AUTORIZAR REGISTRO'}</span>
                        </button>

                    </div>

                </form>
            </section>
        </main>
    );
};

export default NuevoCliente;