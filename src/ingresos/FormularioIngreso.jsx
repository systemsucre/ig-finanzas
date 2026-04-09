import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { INPUT, LOCAL_URL } from "../Auth/config";
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { UseCustomIngresos } from "../hooks/HookCustomIngresosCajero"; // Asegúrate de que el nombre coincida
import CabeceraTramite from '../components/cabeceraTramite';
import { useTramites } from "../hooks/HookCustomTramites"; // Hook adaptado previamente


const FormularioIngreso = () => {
    const { id_tramite, id } = useParams(); // id_tramite (nuevo) | id (editar)
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const {
        estados,
        setters,
        handleGuardar, // Nuestra función unificada del Hook
        cargarIngresoPorId,
        cargarAuxiliares,
        listaClientes,
        cargando,
    } = UseCustomIngresos();

    const {
        cargarTramitePorId,
    } = useTramites();

    // 1. Efecto para EDICIÓN

    useEffect(() => {
        if (isEdit && id && UUID_REGEX.test(id)) {  
            cargarIngresoPorId(id);
            cargarAuxiliares()
            if (id_tramite && cargarTramitePorId) cargarTramitePorId(id_tramite);
        }
    }, [id, isEdit]);

    // 2. Efecto para NUEVO INGRESO (vincular trámite)
    useEffect(() => {
        if (!isEdit && id_tramite && UUID_REGEX.test(id_tramite)) {
            setters.setIdTramite({
                campo: id_tramite,
                valido: 'true'
            });
            cargarAuxiliares()
        }
    }, [id_tramite, isEdit]);

    const lista = [{ value: 'EFECTIVO', label: 'EFECTIVO' }, { value: 'TRANFERENCIA', label: 'TRANFERENCIA' }, { value: 'CHEQUE', label: 'CHEQUE' },]
    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>

            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow p-4 p-md-5 bg-white" style={{  border: 'none', marginTop:'2rem' }}>

                            {/* Encabezado dinámico */}
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <span style={{ fontSize: '3.5rem' }}>{isEdit ? '📝' : '📥'}</span>
                                </div>
                                <h2 className="h3 fw-bold text-success text-uppercase" style={{marginTop:'0'}}>
                                    {isEdit ? 'Editar Registro de Ingreso' : 'Nuevo Ingreso / Abono'}
                                </h2>
                                <p className="text-muted small">Registro de dinero percibido para trámites</p>
                            </div>

                            {/* Info del Trámite Contextual */}
                            <CabeceraTramite id={id_tramite} />


                            <form className="row g-3" onSubmit={(e) => handleGuardar(e, isEdit)}>
                                {/* MONTO (Si lo incluiste en tu tabla) */}
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.monto}
                                        cambiarEstado={setters.setMonto}
                                        tipo='number'
                                        name='monto'
                                        etiqueta={'Monto Recibido'} 
                                        placeholder="0.00"
                                        ExpresionRegular={INPUT.NUMEROS_MONEY}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Select1
                                        estado={estados.idCliente}
                                        cambiarEstado={setters.setIdCliente}
                                        Name="id_cliente"
                                        lista={listaClientes}
                                        etiqueta="Cliente / Empleador"
                                        msg="Busque y seleccione al cliente"
                                        ExpresionRegular={INPUT.ID}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="hospital-label w-100 mb-2">
                                        Tipo Pago<span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <Select
                                        name='tipo'
                                        id='tipo'
                                        placeholder={'Seleccione...'}
                                        onChange={(e) => {
                                            const valor = e.value;
                                            setters.setTipo({ campo: valor, valido: 'true' });
                                        }}
                                        options={lista}
                                        // react-select necesita el objeto completo, lo buscamos en la lista por su ID
                                        value={lista.find(opt => opt.value === estados.tipo.campo) || null}
                                        isSearchable={true}
                                        isClearable={true}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '8px',
                                                minHeight: '45px',
                                                borderColor: estados.tipo.valido === 'true' ? '#1ed12d' : estados.tipo.valido === 'false' ? '#dc3545' : '#dee2e6',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    borderColor: estados.tipo.valido === 'true' ? '#1ed12d' : estados.tipo.valido === 'false' ? '#dc3545' : '#86b7fe'
                                                }
                                            })
                                        }}
                                    />
                                </div>



                                {/* FECHA INGRESO */}
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.fechaIngreso}
                                        cambiarEstado={setters.setFechaIngreso}
                                        tipo='date'
                                        name='fecha_ingreso'
                                        etiqueta={'Fecha de Cobro'}
                                    />
                                </div>

                                {/* DETALLE */}
                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={estados.detalle}
                                        cambiarEstado={setters.setDetalle}
                                        tipo='textarea'
                                        name='detalle'
                                        etiqueta={'Concepto del Pago / Observaciones'}
                                        placeholder="Ej: Pago inicial, Cancelación de trámite, etc."
                                    />
                                </div>

                                {/* ACCIONES */}
                                <div className="col-12 d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-4"
                                        onClick={() => navigate(-1)}
                                    >
                                        CANCELAR
                                    </button>

                                    <button
                                        type="submit"
                                        className={`btn ${isEdit ? 'btn-info' : 'btn-success'} px-5 fw-bold`}
                                        disabled={cargando}
                                    >
                                        {cargando ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>PROCESANDO...</>
                                        ) : (
                                            isEdit ? 'GUARDAR CAMBIOS' : 'REGISTRAR INGRESO'
                                        )}
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

export default FormularioIngreso;