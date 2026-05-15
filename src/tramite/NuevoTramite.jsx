import { useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para capturar el ID de la URL
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useTramites } from "../hooks/HookCustomTramites";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormularioTramite = () => {
    const { id } = useParams(); // Si existe 'id', estamos en modo EDICIÓN
    const isEdit = Boolean(id);

    const {
        auxiliares,
        estados,
        setters,
        guardarTramite,
        cargarTramitePorId, // Debes añadir esta función a tu Hook
        cargando
    } = useTramites();

    // Efecto para cargar datos si es edición
    useEffect(() => {
        if (isEdit) {
            cargarTramitePorId(id);
        }
    }, [id, isEdit]);


    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#F8FAFC' }}>

            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow-banking border-0 bg-white" style={{ borderRadius: '24px', overflow: 'hidden' }}>

                            {/* Encabezado Dinámico */}
                            <div className="p-4 text-center cabecera-formulario">
                                <h2 className="h4 fw-bold m-0 text-uppercase tracking-wider">
                                    {isEdit ? 'Editar caja' : 'Apertura de caja'}
                                </h2>
                                <p className="text-muted small">
                                    {isEdit ? `Modificando expediente: ${estados?.codigo.campo}` : ''}
                                </p>
                            </div>
                            <div className="p-4 p-md-5">
                                <form className="row g-3" onSubmit={(e) => guardarTramite(e, id)}>
                                    <div className="col-12 mb-2">
                                        <span className="badge bg-light text-primary p-2 px-3 rounded-pill">
                                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                      datos generales: Completa los campos del formulario. Asegúrate de ingresar información precisa para un mejor seguimiento.
                                        </span>
                                    </div>
                                    <div className="col-md-3">
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

                                    <div className="col-md-3">
                                        <Select1
                                            estado={estados.estado}
                                            cambiarEstado={setters.setEstado}
                                            Name="estado"
                                            lista={[{ value: 1, label: 'En curso' }, { value: 2, label: 'Paralizado' }, { value: 3, label: 'Finalizado' },]}
                                            etiqueta="Estado Caja"
                                            msg="Cambiar Estado"
                                            ExpresionRegular={INPUT.ID}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputUsuarioStandard
                                            estado={estados.fechaIngreso}
                                            cambiarEstado={setters.setFechaIngreso}
                                            tipo='date'
                                            name='fecha_ingreso'
                                            etiqueta={'Fecha Ingreso'}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputUsuarioStandard
                                            estado={estados.fechaFinalizacion}
                                            cambiarEstado={setters.setFechaFinalizacion}
                                            tipo='date'
                                            name='fecha_finalizacion'
                                            etiqueta={'Fecha Entrega'}
                                        />
                                    </div>

                                    {/* <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.costo}
                                        cambiarEstado={setters.setCosto}
                                        tipo='number'
                                        name='Ingreso Estimado'
                                        etiqueta={'Costo Total (Bs) *'}
                                        ExpresionRegular={INPUT.NUMEROS_P}
                                    />
                                </div>  */}

                                    <div className="col-12 mb-2">
                                        <InputUsuarioStandard
                                            estado={estados.detalle}
                                            cambiarEstado={setters.setDetalle}
                                            tipo='textarea'
                                            name='detalle'
                                            etiqueta={'Detalle del caja'}
                                            placeholder={"Descripción del caso..."}
                                        />
                                    </div>

                                    <div className="col-12 mb-4">
                                        <InputUsuarioStandard
                                            estado={estados.otros}
                                            cambiarEstado={setters.setOtros}
                                            tipo='textarea'
                                            name='otros'
                                            etiqueta={'Notas Adicionales'}
                                            placeholder={"Observaciones..."}
                                            importante={false}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <Select1
                                            estado={estados.moneda}
                                            cambiarEstado={setters.setMoneda}
                                            Name="id_moneda"
                                            lista={auxiliares.monedas}
                                            etiqueta="Moneda"
                                            msg="Seleccione la moneda"
                                            ExpresionRegular={INPUT.ID}
                                        />
                                    </div>


                                    <div className="col-12 d-flex flex-column flex-md-row justify-content-end gap-3 mt-5 pt-4 border-top">
                                        <button
                                            type="button"
                                            className="btn btn-banking-cancel order-2 order-md-1"
                                            onClick={() => window.history.back()}
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            type="submit"
                                            className={`btn ${id ? 'btn-banking-blue' : 'btn-banking-gold'} order-1 order-md-2 px-5`}
                                        >
                                            {/* <FontAwesomeIcon icon={faCheckCircle} className="me-2" /> */}
                                            <span>                   {cargando ? 'PROCESANDO...' : isEdit ? 'GUARDAR CAMBIOS' : 'REGISTRAR'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default FormularioTramite;