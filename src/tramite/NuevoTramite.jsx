import { useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useTramites } from "../hooks/HookCustomTramites";
import { faCheckCircle, faInfoCircle, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormularioTramite = () => {
    const { id } = useParams(); 
    const isEdit = Boolean(id);

    const {
        auxiliares,
        estados,
        setters,
        guardarTramite,
        cargarTramitePorId, 
        cargando
    } = useTramites();

    // Efecto para cargar datos si es edición
    useEffect(() => {
        if (isEdit) {
            cargarTramitePorId(id);
        }
    }, [id, isEdit]);

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif',  marginTop:'3rem' }}>
            <section style={{ maxWidth: '780px', margin: '0 auto' }}>
                
                {/* CABECERA MINIMALISTA EXTERNA */}
                <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
                            Administración de Estructura
                        </span>
                        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0, letterSpacing: '-0.5px' }}>
                            {isEdit ? 'Editar Estructura de Caja' : 'Apertura de Nueva Caja'}
                        </h1>
                    </div>
                    {isEdit && estados?.codigo.campo && (
                        <span style={{ background: '#e2e8f0', color: '#334155', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '99px' }}>
                            EXP: {estados.codigo.campo}
                        </span>
                    )}
                </div>

                <form onSubmit={(e) => guardarTramite(e, id)}>
                    
                    {/* TARJETA PRINCIPAL: CONFIGURACIÓN GENERAL */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: '4px solid #0f172a' }}>
                        
                        {/* Alerta de Guía Informativa */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'start' }}>
                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#0f172a', fontSize: '16px', marginTop: '2px' }} />
                            <p style={{ margin: 0, color: '#475569', fontSize: '13px', fontWeight: '500', lineHeight: '1.5' }}>
                                Complete los campos del formulario. Asegúrese de ingresar información precisa y verificar las fechas asignadas para un correcto seguimiento de las operaciones y flujos de caja.
                            </p>
                        </div>

                        {/* Fila 1: Selectores y Fechas en Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                            <div>
                                <Select1
                                    estado={estados.idTipoTramite}
                                    cambiarEstado={setters.setIdTipoTramite}
                                    Name="id_tipo_tramite"
                                    lista={auxiliares.listaTipos}
                                    etiqueta="Tipo de Caja"
                                    msg="Seleccione el tipo de servicio"
                                    ExpresionRegular={INPUT.ID}
                                />
                            </div>

                            <div>
                                <Select1
                                    estado={estados.estado}
                                    cambiarEstado={setters.setEstado}
                                    Name="estado"
                                    lista={[{ value: 1, label: 'En curso' }, { value: 2, label: 'Paralizado' }, { value: 3, label: 'Finalizado' }]}
                                    etiqueta="Estado Operativo"
                                    msg="Cambiar Estado"
                                    ExpresionRegular={INPUT.ID}
                                />
                            </div>

                            <div>
                                <InputUsuarioStandard
                                    estado={estados.fechaIngreso}
                                    cambiarEstado={setters.setFechaIngreso}
                                    tipo='date'
                                    name='fecha_ingreso'
                                    etiqueta='Fecha Apertura'
                                />
                            </div>

                            <div>
                                <InputUsuarioStandard
                                    estado={estados.fechaFinalizacion}
                                    cambiarEstado={setters.setFechaFinalizacion}
                                    tipo='date'
                                    name='fecha_finalizacion'
                                    etiqueta='Fecha Cierre/Entrega'
                                />
                            </div>
                        </div>

                        {/* Fila 2: Descripciones Extensas (Textareas) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }}>
                            <div>
                                <InputUsuarioStandard
                                    estado={estados.detalle}
                                    cambiarEstado={setters.setDetalle}
                                    tipo='textarea'
                                    name='detalle'
                                    etiqueta='Descripción / Glosa de Apertura'
                                    placeholder="Detalle el propósito o alcance del control de caja..."
                                />
                            </div>

                            <div>
                                <InputUsuarioStandard
                                    estado={estados.otros}
                                    cambiarEstado={setters.setOtros}
                                    tipo='textarea'
                                    name='otros'
                                    etiqueta='Notas y Observaciones Internas'
                                    placeholder="Bitácora u observaciones adicionales..."
                                    importante={false}
                                />
                            </div>
                        </div>

                        {/* Fila 3: Configuración de Moneda Base */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
                            <div>
                                <Select1
                                    estado={estados.moneda}
                                    cambiarEstado={setters.setMoneda}
                                    Name="id_moneda"
                                    lista={auxiliares.monedas}
                                    etiqueta="Moneda Base"
                                    msg="Seleccione la moneda"
                                    ExpresionRegular={INPUT.ID}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'end', paddingBottom: '4px' }}>
                                <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500', fontStyle: 'italic' }}>
                                    * Todos los movimientos de ingresos/gastos vinculados se procesarán bajo esta denominación monetaria.
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* BARRA INFERIOR DE ACCIONES (ESTILO BANCO) */}
                    <div style={{  background: '#ffffff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'end', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', gap: '12px' }}>
                        
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
                            disabled={cargando}
                        >
                            <FontAwesomeIcon icon={isEdit ? faCheckCircle : faFolderPlus} />
                            <span>{cargando ? 'PROCESANDO...' : isEdit ? 'CONFIRMAR CAMBIOS' : 'AUTORIZAR APERTURA'}</span>
                        </button>

                    </div>

                </form>
            </section>
        </main>
    );
};

export default FormularioTramite;