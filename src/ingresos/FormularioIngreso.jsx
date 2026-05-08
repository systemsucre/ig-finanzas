import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { INPUT, LOCAL_URL } from '../Auth/config';
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { UseCustomIngresos } from '../hooks/HookCustomIngresosCajero'; // Asegúrate de que el nombre coincida
import { useTramites } from '../hooks/HookCustomTramites'; // Hook adaptado previamente

const FormularioIngreso = () => {
  const { id_tramite, id } = useParams(); // id_tramite (nuevo) | id (editar)
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const {
    estados,
    setters,
    handleGuardar, // Nuestra función unificada del Hook
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
      padding: '0px',
      fontSize: '12px',

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
      fontSize: '10px',

      borderBottom: '1px solid #f3f4f6', // Separador sutil entre items
      '&:active': { backgroundColor: '#dbeafe' },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
    }),
  };

  // 1. Definimos si el select debe estar deshabilitado
  const isForzado = estados.tipoIngreso === 1;

  // 2. Ajustamos el valor que se muestra en el Select
  // Si es forzado, mostramos el valor 2. Si no, mostramos el valor que tenga el estado.
  const valorSelect = isForzado
    ? listaEstado.find((opt) => opt.value === 2)
    : listaEstado.find((opt) => opt.value === estados.estado.campo) || null;
  //   console.log(estados.idCliente, listaClientes);

  const opcionesFiltradas =
    estados.tipoIngreso === 0
      ? listaEstado.filter((opt) => opt.value !== 2)
      : listaEstado;
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
                    {isEdit ? '📝' : '📥'}
                  </span>
                </div>
                <h2
                  className="h3 fw-bold text-success text-uppercase"
                  style={{ marginTop: '0' }}
                >
                  {isEdit
                    ? 'Editar Registro de Ingreso'
                    : 'Nuevo Ingreso / Abono'}
                </h2>
              </div>

              {/* Info del Trámite Contextual */}

              <form
                className="row g-3"
                onSubmit={(e) => handleGuardar(e, isEdit)}
              >
                {/* MONTO (Si lo incluiste en tu tabla) */}
                <div className="col-md-6">
                  <InputUsuarioStandard
                    estado={estados.monto}
                    cambiarEstado={setters.setMonto}
                    tipo="number"
                    name="monto"
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

                {/* <div className="col-md-6 switch-container">
                  <label className="d-flex align-items-center gap-2">
                    <input
                      name="estado_ingreso"
                      className="switch-input"
                      type="radio"
                      value={0}
                      onChange={(e) => {
                        setters.setTipoIngreso(parseInt(e.target.value));
                        if (estados.estado.campo === 2)
                          if (!parseInt(e.target.value))
                            setters.setEstado({ campo: null, valido: null });
                      }}
                      checked={estados.tipoIngreso === 0}
                    />
                    <span>Pendiente</span>
                  </label>

                  <input
                    id="switch-liquidado"
                    name="estado_ingreso"
                    className="switch-input"
                    type="radio"
                    value={1}
                    onChange={(e) => {
                      setters.setTipoIngreso(parseInt(e.target.value));
                      setters.setEstado({ campo: 2, valido: 'true' });
                    }}
                    checked={estados.tipoIngreso === 1}
                  />
                  <label
                    htmlFor="switch-liquidado"
                    className="switch-label"
                  ></label>

                  <label htmlFor="switch-liquidado">Liquidado (Pagado)</label>
                </div>

                <div className="col-md-6">
                  <label className="hospital-label w-100 mb-2">
                    Estado Ingreso<span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    styles={customStyles_}
                    name="estado"
                    id="estado"
                    placeholder={'Seleccione...'}
                    // Deshabilitamos si tipoIngreso es 1
                    isDisabled={isForzado}
                    onChange={(e) => {
                      // Si está forzado, esta función no se ejecutará por el disabled,
                      // pero por seguridad bloqueamos cambios manuales
                      if (!isForzado) {
                        const valor = e ? e.value : null;
                        setters.setEstado({ campo: valor, valido: 'true' });
                      }
                    }}
                    options={opcionesFiltradas}
                    value={valorSelect}
                    isSearchable={!isForzado}
                    isClearable={!isForzado}
                    styles={{
                      ...customStyles_,
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div> */}
                <div className="col-md-12">
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

                <div className="col-md-6">
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

                {/* FECHA INGRESO */}
                <div className="col-md-6">
                  <InputUsuarioStandard
                    estado={estados.fechaIngreso}
                    cambiarEstado={setters.setFechaIngreso}
                    tipo="date"
                    name="fecha_ingreso"
                    etiqueta={'Fecha de Cobro'}
                  />
                </div>

                {/* DETALLE */}
                <div className="col-12">
                  <InputUsuarioStandard
                    estado={estados.detalle}
                    cambiarEstado={setters.setDetalle}
                    tipo="textarea"
                    name="detalle"
                    etiqueta={'Concepto del Pago / Observaciones'}
                    placeholder="Ej: Pago inicial, Cancelación de trámite, etc."
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
                      'REGISTRAR INGRESO'
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
import { listaEstado } from '../data/estadoIngresos';

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

export default FormularioIngreso;
