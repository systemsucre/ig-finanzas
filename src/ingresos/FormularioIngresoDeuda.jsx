import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { INPUT, LOCAL_URL } from '../Auth/config';
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { UseCustomIngresos } from '../hooks/HookCustomIngresosCajero'; // Asegúrate de que el nombre coincida
import { useTramites } from '../hooks/HookCustomTramites'; // Hook adaptado previamente
import { listaEstado } from '../data/estadoIngresos';

const FormularioIngresoDeuda = () => {
  const { id_tramite, id } = useParams(); // id_tramite (nuevo) | id (editar)
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const {
    estados,
    setters,
    handleGuardarPendiente, // Nuestra función unificada del Hook
    cargarIngresoPorId,
    cargarAuxiliares,
    listaClientes,
    cargando,
  } = UseCustomIngresos();

  const { listarTramitesActivos, tramitesFiltradosBoleta } = useTramites();

  // 1. Efecto para EDICIÓN

  useEffect(() => {
    if (isEdit && id && UUID_REGEX.test(id)) {
      cargarIngresoPorId(id);
      cargarAuxiliares();
      listarTramitesActivos();
    }
  }, [id, isEdit]);

  // 2. Efecto para NUEVO INGRESO (vincular trámite)
  useEffect(() => {
    if (!isEdit) {
      cargarAuxiliares();
      listarTramitesActivos();
    }
  }, [isEdit]);

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

  const customStyles_ = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#ffffff', // Fondo blanco limpio
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // Azul suave al enfocar
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      borderRadius: '8px',
      padding: '5px',
      fontSize: '14px',

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
      padding: '5px 16px', // Más espacio para que no se sienta apretado
      backgroundColor: state.isSelected
        ? '#eff6ff'
        : state.isFocused
          ? '#f3f4f6'
          : 'transparent',
      color: state.isSelected ? '#1d4ed8' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '12px',

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
                  <span style={{ fontSize: '3.5rem' }}>
                    {isEdit ? '📝' : '⏳'}
                  </span>
                </div>
                <h2
                  className="h3 fw-bold text-success text-uppercase"
                  style={{ marginTop: '0' }}
                >
                  {isEdit
                    ? 'Editar Registro de Ingreso Pendiente'
                    : 'Nuevo Ingreso Pendiente'}
                </h2>
                <p className="text-muted small">Ingresos pendientes de pago</p>
              </div>

              {/* Info del Trámite Contextual */}

              <form
                className="row g-3"
                onSubmit={(e) => handleGuardarPendiente(e, isEdit)}
              >
                {/* MONTO (Si lo incluiste en tu tabla) */}
                <div className="col-md-6">
                  <Select1
                    estado={estados.idCliente}
                    cambiarEstado={setters.setIdCliente}
                    Name="id_cliente"
                    lista={listaClientes}
                    etiqueta="Acreedor"
                    msg="Busque y seleccione al cliente"
                    ExpresionRegular={INPUT.ID}
                  />
                </div>

                <div className="col-md-6">
                  <InputUsuarioStandard
                    estado={estados.monto}
                    cambiarEstado={setters.setMonto}
                    tipo="number"
                    name="monto"
                    etiqueta={'Monto Pendiente'}
                    placeholder="0.00"
                    ExpresionRegular={INPUT.NUMEROS_MONEY}
                  />
                </div>

                <div className="col-md-6">
                  <label className="hospital-label w-100 mb-2">CAJA</label>

                  <Select
                    styles={customStyles}
                    placeholder={'Seleccione caja...'}
                    options={tramitesFiltradosBoleta}
                    components={{ Option: CustomOption }} // <-- Aquí aplicamos la personalización
                    getOptionLabel={(e) => `${e.label} (${e.simbolo})`} // Limpio para el buscador
                    getOptionValue={(e) => e.value}
                    onChange={(e) => {
                      setters.setIdTramite({
                        campo: e.value,
                        valido: 'true',
                      });
                    }}
                    value={
                      tramitesFiltradosBoleta.find(
                        (opt) => opt.value === estados.idTramite.campo,
                      ) || null
                    }
                    isSearchable={true}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                {/* FECHA INGRESO */}
                <div className="col-md-6">
                  <InputUsuarioStandard
                    estado={estados.fechaIngreso}
                    cambiarEstado={setters.setFechaIngreso}
                    tipo="date"
                    name="fecha_ingreso"
                    etiqueta={'Fecha Vencimiento'}
                  />
                </div>

                {/* DETALLE */}
                <div className="col-12">
                  <InputUsuarioStandard
                    estado={estados.detalle}
                    cambiarEstado={setters.setDetalle}
                    tipo="textarea"
                    name="detalle"
                    etiqueta={'Concepto del Pago Pendiente/ Observaciones'}
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
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        PROCESANDO...
                      </>
                    ) : isEdit ? (
                      'GUARDAR CAMBIOS'
                    ) : (
                      'REGISTRAR PENDIENTE'
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
import { components } from 'react-select';

// Este componente personaliza cómo se ve cada fila en la lista desplegable
const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <strong>{props.data.label}</strong>
          <div style={{ fontSize: '0.8em', color: '#666' }}>
            Moneda: {props.data.simbolo} | Saldo: {props.data.saldoDisponible}
          </div>
          <div
            style={{ fontSize: '0.55em', color: '#444444', fontWeight: '100' }}
          >
            {props.data.detalle.substring(0, 40)}
          </div>
        </div>
      </div>
    </components.Option>
  );
};

export default FormularioIngresoDeuda;
