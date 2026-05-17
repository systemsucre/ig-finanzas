import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { useTipoTramite } from "../hooks/HookCustomTipoTramite"; 
import { faCheckCircle, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NuevoTipoTramite = () => {
    const { id } = useParams();

    // 1. Extraemos lógica del Hook de Trámites
    const {
        estados,
        setters,
        guardarTramite,
        tramitesFiltrados
    } = useTipoTramite();

    const { setTipoTramite, setCodigo, setEstado } = setters;

    // 2. Efecto para cargar datos en modo Edición (Bug de dependencias corregido)
    useEffect(() => {
        if (id && tramitesFiltrados.length > 0) {
            const tramite = tramitesFiltrados.find(t => t.id === parseInt(id));
            if (tramite) { 
                setTipoTramite({ campo: tramite.tipo_tramite, valido: 'true' });
                setCodigo({ campo: tramite.codigo, valido: 'true' });
                setEstado({ campo: tramite.estado, valido: 'true' });
            }
        }
    }, [id, tramitesFiltrados, setTipoTramite, setCodigo, setEstado]);

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', marginTop:'3rem' }}>
            <section style={{ maxWidth: '680px', margin: '0 auto' }}>
                
                {/* CABECERA MINIMALISTA EXTERNA */}
                <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
                            Configuración Global
                        </span>
                        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0, letterSpacing: '-0.5px' }}>
                            {id ? 'Actualizar Tipo de Caja' : 'Apertura de Tipo de Caja'}
                        </h1>
                    </div>
                </div>

                <form onSubmit={(e) => guardarTramite(e, id ? id : null)}>
                    
                    {/* TARJETA PRINCIPAL: DATOS E IDENTIFICADORES */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '4px solid #0f172a' }}>
                        
                        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'rgba(15, 23, 42, 0.08)', color: '#0f172a', fontWeight: '700', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: '6px' }} />
                                Estructura
                            </span>
                            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Categorización de flujos de cajas</span>
                        </div>

                        {/* Grid de 2 Columnas balanceadas */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.tipo_tramite}
                                    cambiarEstado={setters.setTipoTramite}
                                    tipo='text'
                                    name='tipo_tramite'
                                    etiqueta='Tipo de caja'
                                    placeholder="Ej. Transferencia de Inmueble"
                                    ExpresionRegular={INPUT.DIRECCION} 
                                />
                            </div>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.codigo}
                                    cambiarEstado={setters.setCodigo}
                                    tipo='text'
                                    name='codigo'
                                    etiqueta='Código de Identificación'
                                    placeholder="Ej. FAM"
                                    ExpresionRegular={INPUT.CODIGO_ENTIDAD} 
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
                            <span>{id ? 'CONFIRMAR CAMBIOS' : 'REGISTRAR CATEGORÍA'}</span>
                        </button>

                    </div>

                </form>
            </section>
        </main>
    );
};

export default NuevoTipoTramite;