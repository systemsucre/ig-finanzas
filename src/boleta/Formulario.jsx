import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCustomBoletas } from '../hooks/HookCustomBoleta';
import { useTramites } from '../hooks/HookCustomTramites';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesSquare } from '@fortawesome/free-solid-svg-icons';

export const FormularioBoleta = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const { listarTramitesActivos, tramitesFiltradosBoleta } = useTramites();
  const {
    guardarBoletaMasiva,
    actualizarBoletaMasiva,
    consultarDetalleBoleta,
    itemsBoleta,
    cargando,
  } = UseCustomBoletas();

  const [itemsForm, setItemsForm] = useState([]);
  // 1. Carga inicial de datos
  useEffect(() => {
    listarTramitesActivos();
    if (codigo) {
      consultarDetalleBoleta(codigo);
    } else {
      agregarFila(); // Iniciar con una fila si es nuevo
    }
  }, [codigo]);

  // 2. Sincronización de datos del backend (Modo Edición)
  useEffect(() => {
    if (codigo && itemsBoleta.length > 0) {
      const itemsMapeados = itemsBoleta.map((item) => ({
        // Asegúrate de que 'item.id_tramite' sea el UUID que viene del backend
        id_tramite: item.value || item.id,
        monto: item.monto,
        detalle: item.detalle,
        fecha:
          item.fecha_solicitud?.split('T')[0] ||
          new Date().toISOString().split('T')[0],
      }));
      setItemsForm(itemsMapeados);
    }
  }, [itemsBoleta, codigo]);

  const agregarFila = () => {
    setItemsForm([
      ...itemsForm,
      {
        id_tramite: '',
        monto: '',
        detalle: '',
        fecha: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const actualizarFila = (index, field, value) => {
    const nuevosItems = [...itemsForm];
    nuevosItems[index][field] = value;
    setItemsForm(nuevosItems);
  };

  const eliminarFila = (index) => {
    if (itemsForm.length === 1 && !codigo) return;
    setItemsForm(itemsForm.filter((_, i) => i !== index));
  };

  const handleGuardar = async (e) => {
    if (e) e.preventDefault();

    // Validación: Verificar que no haya campos vacíos
    const incompleto = itemsForm.some(
      (i) => !i.id_tramite || !i.monto || !i.detalle,
    );
    if (incompleto)
      return toast.error('Por favor, completa todos los campos de la tabla');

    try {
      if (codigo) {
        // alert(codigo)
        await actualizarBoletaMasiva(codigo, itemsForm);
      } else {
        await guardarBoletaMasiva(e, itemsForm);
      }
      // Opcional: navigate('/boletas') tras éxito si el hook no lo hace
    } catch (error) {
      toast.error('Error al procesar la operación');
    }
  };

  const totalBoleta = itemsForm.reduce(
    (acc, curr) => acc + (Number(curr.monto) || 0),
    0,
  );

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
          <div
            className="login-card shadow-clinical p-4 p-md-5 bg-white"
            style={{ borderTop: `10px solid  #0d6efd`, marginTop: '2rem' }}
          >
            <div className="form-boleta-container">
              <div className="text-center">
                <span style={{ fontSize: '3rem' }}>{codigo ? '📝' : '📑'}</span>
              </div>
              <h2 className="titulo-boleta" style={{ marginTop: '8px' }}>
                {codigo ? `Modificar Boleta` : 'Nueva Boleta de Gastos'}
              </h2>
              {codigo && (
                <p className="text-center">
                  {' '}
                  <span className="badge bg-info text-dark">
                    Editando Código: {codigo}
                  </span>
                </p>
              )}
              {tramitesFiltradosBoleta.length > 0 ? (
                <form
                  onSubmit={handleGuardar}
                  onKeyDown={(e) => {
                    // Si la tecla es "Enter", evitamos que el formulario se envíe
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  style={{ marginTop: '10px' }}
                >
                  {itemsForm.map((item, index) => (
                    <div className="item-gasto-row" key={index}>
                      {/* Indicador visual de fila */}
                      <div className="item-number">ITEM #{index + 1}</div>

                      {/* Botón eliminar arriba a la derecha */}
                      {itemsForm.length > 1 && (
                        <button
                          type="button"
                          className="btn-eliminar-fila"
                          onClick={() => eliminarFila(index)}
                          title="Eliminar este gasto"
                        >
                          <FontAwesomeIcon icon={faTimesSquare} />
                        </button>
                      )}

                      <div className="row g-3">
                        <div className="col-md-6 mt-3">
                          <label className="form-label-profesional">CAJA</label>

                          <Select
                            styles={customStyles}
                            placeholder={'Seleccione caja...'}
                            options={tramitesFiltradosBoleta}
                            components={{ Option: CustomOption }} // <-- Aquí aplicamos la personalización
                            getOptionLabel={(e) => `${e.label} (${e.simbolo})`} // Limpio para el buscador
                            getOptionValue={(e) => e.value}
                            onChange={(e) =>
                              actualizarFila(
                                index,
                                'id_tramite',
                                e ? e.value : '',
                              )
                            }
                            value={
                              tramitesFiltradosBoleta.find(
                                (opt) =>
                                  String(opt.value) === String(item.id_tramite),
                              ) || null
                            }
                            isSearchable={true}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>

                        <div className="col-md-3 mt-3">
                          <label className="form-label-profesional">
                            Monto (
                            {tramitesFiltradosBoleta.find(
                              (opt) =>
                                String(opt.value) === String(item.id_tramite),
                            )?.simbolo || ''}
                            )
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-profesional text-end fw-bold"
                            value={item.monto}
                            placeholder={
                              tramitesFiltradosBoleta.find(
                                (opt) =>
                                  String(opt.value) === String(item.id_tramite),
                              )?.simbolo
                                ? tramitesFiltradosBoleta.find(
                                    (opt) =>
                                      String(opt.value) ===
                                      String(item.id_tramite),
                                  )?.simbolo + ' 0.00'
                                : '0.00'
                            }
                            onChange={(e) =>
                              actualizarFila(index, 'monto', e.target.value)
                            }
                          />
                        </div>

                        <div className="col-md-3 mt-3">
                          <label className="form-label-profesional">
                            Fecha de Gasto
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-profesional"
                            value={item.fecha}
                            onChange={(e) =>
                              actualizarFila(index, 'fecha', e.target.value)
                            }
                          />
                        </div>

                        <div className="col-md-12">
                          <label className="form-label-profesional">
                            Concepto del Gasto
                          </label>
                          <textarea
                            className="form-control form-control-profesional"
                            placeholder="Escriba el detalle del gasto realizado..."
                            rows="2"
                            value={item.detalle}
                            onChange={(e) =>
                              actualizarFila(index, 'detalle', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Botón de Añadir Gasto Mejorado */}
                  <div className="mt-2 mb-4">
                    <button
                      type="button"
                      className="btn btn-add-gasto"
                      onClick={agregarFila}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} />
                      Añadir otra línea de gasto
                    </button>
                  </div>

                  <div className="row align-items-center mt-5">
                    <div className="col-md-6 text-start">
                      <strong
                        className="text-uppercase"
                        style={{ letterSpacing: '1px' }}
                      >
                        Total Acumulado:{' '}
                      </strong>
                      <span className="text-success fw-bold ms-1 fs-5">
                        {' '}
                        {totalBoleta}
                      </span>
                    </div>

                    <div
                      className="col-md-6 text-end btn-action-container d-flex justify-content-end gap-2"
                      style={{ padding: '5px' }}
                    >
                      <button
                        type="button"
                        className="btn btn-cancelar-boleta"
                        onClick={() => navigate(-1)}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="btn btn-guardar-boleta"
                        disabled={cargando || itemsForm.length === 0}
                      >
                        <i className="fas fa-save me-2"></i>{' '}
                        {/* Icono FontAwesome */}
                        {cargando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            PROCESANDO...
                          </>
                        ) : codigo ? (
                          'ACTUALIZAR'
                        ) : (
                          'GUARDAR BOLETA'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-3">
                  {[1, 2, 3].map((n) => (
                    <SkeletonRow key={n} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export const SkeletonRow = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-content">
        <div className="skeleton-line" style={{ width: '40%' }}></div>{' '}
        {/* Simula Código */}
        <div className="skeleton-line" style={{ width: '100%' }}></div>{' '}
        {/* Simula Detalle */}
        <div className="skeleton-line" style={{ width: '60%' }}></div>{' '}
        {/* Simula Fecha/Monto */}
      </div>
    </div>
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
