import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { UseCustomHonorarios } from "../hooks/HookCustomHonorarios";
import { useTramites } from "../hooks/HookCustomTramites";

const FormularioHonorario = () => {
    const { id } = useParams(); // id_tramite (nuevo) | id (editar)
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const {
        estados,
        setters,
        handleGuardar,
        cargarHonorarioPorId,
        cargando,
    } = UseCustomHonorarios();

    const { tramitesFiltrados } = useTramites();

    // 1. Efecto para EDICIÓN
    useEffect(() => {
        if (isEdit && id && UUID_REGEX.test(id)) {
            cargarHonorarioPorId(id);
        }
    }, [id, isEdit]);


    const opcionesPago = [
        { value: 'Efectivo', label: 'EFECTIVO' },
        { value: 'Transferencia', label: 'TRANSFERENCIA' },
        { value: 'Depósito', label: 'DEPÓSITO' },
        { value: 'Cheque', label: 'CHEQUE' },
    ];

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow p-4 p-md-5 bg-white" style={{  borderTop: `10px solid ${isEdit ? '#0dcaf0' : '#0d6efd'}` }}>

                            {/* Encabezado */}
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <span style={{ fontSize: '3.5rem' }}>{isEdit ? '✍️' : '⚖️'}</span>
                                </div>
                                <h2 className="h3 fw-bold text-primary text-uppercase">
                                    {isEdit ? 'Editar Cobro de Honorario' : 'Registrar Honorarios Profesionales'}
                                </h2>
                            </div>

                            {/* Info del Trámite */}

                            <form className="row g-3" onSubmit={(e) => handleGuardar(e, isEdit)}>

                                {/* MONTO */}
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.monto}
                                        cambiarEstado={setters.setMonto}
                                        tipo='number'
                                        name='monto'
                                        etiqueta={'Monto Honorario (Bs) '}
                                        placeholder="0.00"
                                        ExpresionRegular={INPUT.NUMEROS_MONEY}
                                    />
                                </div>

                                {/* TIPO PAGO */}
                                <div className="col-md-4">
                                    <label className="hospital-label w-100 mb-2">
                                        Método de Pago<span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <Select
                                        name='tipo_pago'
                                        placeholder={'Seleccione...'}
                                        onChange={(e) => setters.setTipoPago({ campo: e.value, valido: 'true' })}
                                        options={opcionesPago}
                                        value={opcionesPago.find(opt => opt.value === estados.tipoPago.campo) || null}
                                        isSearchable={false}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '8px',
                                                minHeight: '45px',
                                                borderColor: estados.tipoPago.valido === 'true' ? '#0d6efd' : '#dee2e6',
                                            })
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.fechaIngreso}
                                        cambiarEstado={setters.setFechaIngreso}
                                        tipo='date'
                                        name='fecha_ingreso'
                                        etiqueta={'Fecha de Cobro '}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="hospital-label w-100 mb-2">
                                        Trámite<span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <Select
                                        placeholder={'Seleccione...'}
                                        onChange={(e) => setters.setIdTramite({ campo: e.value, valido: 'true' })}

                                        options={tramitesFiltrados}
                                        // Usamos .find asegurándonos de que ambos valores existan y coincidan
                                        value={
                                            tramitesFiltrados.find(opt => String(opt.value) === String(estados.idTramite.campo)) || null
                                        }
                                        isSearchable={true}
                                        isClearable={true}
                                        styles={{

                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '8px',
                                                minHeight: '45px',
                                            })
                                        }}
                                    />
                                </div>
                                {/* FECHA */}


                                {/* DESCRIPCIÓN */}
                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={estados.descripcion}
                                        cambiarEstado={setters.setDescripcion}
                                        tipo='textarea'
                                        name='descripcion'
                                        etiqueta={'Descripción del Servicio '}
                                        placeholder="Ej: Elaboración de memorial, Asesoría legal, Honorarios éxito, etc."
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
                                        className={`btn ${isEdit ? 'btn-info' : 'btn-success'} px-5 fw-bold text-white`}
                                        disabled={cargando}
                                    >
                                        {cargando ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>PROCESANDO...</>
                                        ) : (
                                            isEdit ? 'ACTUALIZAR HONORARIO' : 'REGISTRAR COBRO'
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

export default FormularioHonorario;