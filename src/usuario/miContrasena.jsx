import { INPUT } from "../Auth/config";
import { ComponenteInputUserDisabled, InputUsuarioStandard } from '../components/input/elementos';
import { useMiPerfil } from "../hooks/HookCustomMiPerfil";
import { faKey, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MiContrasena = () => {

    // 2. Extraemos el objeto setters del Hook
    const {
        estados,
        setters,
        recet_,
    } = useMiPerfil();

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', marginTop:'3rem'}}>
            <section style={{ maxWidth: '820px', margin: '0 auto' }}>
                
                {/* CABECERA MINIMALISTA EXTERNA */}
                <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
                            Seguridad de la Cuenta
                        </span>
                        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0, letterSpacing: '-0.5px' }}>
                            Configuración de Credenciales
                        </h1>
                    </div>
                </div>

                {/* TARJETA PRINCIPAL: CAMBIO DE CONTRASEÑA */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '4px solid #0f172a' }}>
                    
                    <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: 'rgba(15, 23, 42, 0.08)', color: '#0f172a', fontWeight: '700', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '6px' }} />
                            Autenticación
                        </span>
                        <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Actualización periódica de contraseñas</span>
                    </div>

                    {/* Grid de 4 columnas: Todo alineado en una sola fila limpia */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '20px' }}>
                        <div>
                            <InputUsuarioStandard
                                estado={estados.pass} cambiarEstado={setters.setPass} mayusculas={false}
                                tipo='password' name='pass' etiqueta='Contraseña Actual'
                                placeholder="••••••" ExpresionRegular={INPUT.PASSWORD}
                            />
                        </div>
                        <div>
                            <InputUsuarioStandard
                                estado={estados.pass1} cambiarEstado={setters.setPass1} mayusculas={false}
                                tipo='password' name='pass1' etiqueta='Nueva Contraseña'
                                placeholder="••••••" ExpresionRegular={INPUT.PASSWORD}
                            />
                        </div>
                        <div>
                            <InputUsuarioStandard
                                estado={estados.pass2} cambiarEstado={setters.setPass2} mayusculas={false}
                                tipo='password' name='username' etiqueta='Confirmar Nueva'
                                placeholder="••••••" ExpresionRegular={INPUT.PASSWORD}
                            />
                        </div>
                        <div>
                            <ComponenteInputUserDisabled
                                estado={estados.user}
                                tipo='text'
                                etiqueta={'Identificador / Usuario'}
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
                        onClick={(e) => recet_(e)}
                    >
                        <FontAwesomeIcon icon={faKey} />
                        <span>ACTUALIZAR CONTRASEÑA</span>
                    </button>

                </div>

            </section>
        </main>
    );
};

export default MiContrasena;