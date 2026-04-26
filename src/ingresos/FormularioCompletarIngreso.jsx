import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { INPUT, LOCAL_URL } from '../Auth/config';
import {
  InputUsuarioStandard,
  InputUsuarioStandarDisabled,
  Select1,
} from '../components/input/elementos';
import { UseCustomIngresos } from '../hooks/HookCustomIngresosCajero'; // Asegúrate de que el nombre coincida
import { useTramites } from '../hooks/HookCustomTramites'; // Hook adaptado previamente
import { listaEstado } from '../data/estadoIngresos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollar } from '@fortawesome/free-solid-svg-icons';

const FormularioCompletarIngreso = () => {
  const { id } = useParams(); // id_tramite (nuevo) | id (editar)
  const navigate = useNavigate();

  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const {
    estados,
    setters,
    handleCompletarPagoPendientes, // Nuestra función unificada del Hook
    cargarIngresoPorId,
    cargando,
  } = UseCustomIngresos();

  // 1. Efecto para EDICIÓN

  useEffect(() => {
    if (UUID_REGEX.test(id)) {
      cargarIngresoPorId(id);
    }
  }, [id]);

  const lista = [
    { value: 'EFECTIVO', label: 'EFECTIVO' },
    { value: 'TRANFERENCIA', label: 'TRANFERENCIA' },
    { value: 'CHEQUE', label: 'CHEQUE' },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#ffffff', // Fondo blanco limpio
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // Azul suave al enfocar
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      borderRadius: '8px',
      padding: '4px',
      '&:hover': { borderColor: '#3b82f6' },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      marginTop: '8px',
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '12px 16px', // Más espacio para que no se sienta apretado
      backgroundColor: state.isSelected
        ? '#eff6ff'
        : state.isFocused
          ? '#f3f4f6'
          : 'transparent',
      color: state.isSelected ? '#1d4ed8' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderBottom: '1px solid #f3f4f6', // Separador sutil entre items
      '&:active': { backgroundColor: '#dbeafe' },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
    }),
  };

  return (
    <main
      className="login-wrapper d-flex align-items-center justify-content-center py-5"
      style={{ minHeight: '100vh' }}
    >
      <section className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
            <div
              className="login-card shadow p-4 p-md-5 bg-white"
              style={{ border: 'none', marginTop: '2rem' }}
            >
              {/* Encabezado dinámico */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <span style={{ fontSize: '3.5rem' }}>{'⏳'}</span>
                </div>
                <h2
                  className="h3 fw-bold text-success text-uppercase"
                  style={{ marginTop: '0' }}
                >
                  Completar Pago
                </h2>
                <p className="text-muted small">Ingresos pendientes de pago</p>
              </div>

              {/* Info del Trámite Contextual */}

              <form
                className="row g-3"
                onSubmit={(e) => handleCompletarPagoPendientes(e)}
              >
                <div className="col-md-12">
                  <label className="hospital-label w-100 mb-2">
                    Tipo Pago<span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    styles={customStyles}
                    name="tipo"
                    id="tipo"
                    placeholder={'Seleccione...'}
                    onChange={(e) => {
                      const valor = e.value;
                      setters.setTipo({ campo: valor, valido: 'true' });
                    }}
                    options={lista}
                    // react-select necesita el objeto completo, lo buscamos en la lista por su ID
                    value={
                      lista.find((opt) => opt.value === estados.tipo.campo) ||
                      null
                    }
                    isSearchable={true}
                    isClearable={true}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '8px',
                        minHeight: '45px',
                        borderColor:
                          estados.tipo.valido === 'true'
                            ? '#1ed12d'
                            : estados.tipo.valido === 'false'
                              ? '#dc3545'
                              : '#dee2e6',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor:
                            estados.tipo.valido === 'true'
                              ? '#1ed12d'
                              : estados.tipo.valido === 'false'
                                ? '#dc3545'
                                : '#86b7fe',
                        },
                      }),
                    }}
                  />
                </div>
                <div className="col-md-4">
                  <InputUsuarioStandard
                    estado={estados.monto}
                    cambiarEstado={setters.setMonto}
                    tipo="number"
                    name="monto"
                    etiqueta={'Monto a Cobrar'}
                    placeholder="0.00"
                    ExpresionRegular={INPUT.NUMEROS_MONEY}
                  />
                </div>

                <div className="col-md-4">
                  <InputUsuarioStandarDisabled
                    estado={estados.monto}
                    etiqueta={'Monto Adeudado'}
                  />
                </div>

                {/* FECHA INGRESO */}
                <div className="col-md-4">
                  <InputUsuarioStandard
                    estado={estados.fechaIngreso}
                    cambiarEstado={setters.setFechaIngreso}
                    tipo="date"
                    name="fecha_ingreso"
                    etiqueta={'Fecha de Pago'}
                  />
                </div>

                <div className="col-12">
                  <InputUsuarioStandard
                    estado={estados.numeroReferencia}
                    cambiarEstado={setters.setNumeroReferencia}
                    name="Numeroreferencia"
                    etiqueta={'Numero de referencia'}
                    placeholder="Ej. num boleta, factura etc."
                    importante={false}
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
                    className={`btn btn-success px-5 fw-bold`}
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        PROCESANDO...
                      </>
                    ) : (
                      <>
                        COMPLETAR
                        <FontAwesomeIcon icon={faDollar} />
                      </>
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

export default FormularioCompletarIngreso;
