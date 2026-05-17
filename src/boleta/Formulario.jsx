import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCustomBoletas } from '../hooks/HookCustomBoleta';
import { useTramites } from '../hooks/HookCustomTramites';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
      agregarFila();
    }
  }, [codigo]);

  // 2. Sincronización de datos del backend (Modo Edición)
  useEffect(() => {
    if (codigo && itemsBoleta.length > 0) {
      const itemsMapeados = itemsBoleta.map((item) => ({
        id_tramite: item.value || item.id,
        monto: item.monto,
        detalle: item.detalle,
        fecha: item.fecha_solicitud?.split('T')[0] || new Date().toISOString().split('T')[0],
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

    const incompleto = itemsForm.some((i) => !i.id_tramite || !i.monto || !i.detalle);
    if (incompleto) return toast.error('Por favor, completa todos los campos obligatorios');

    try {
      if (codigo) {
        await actualizarBoletaMasiva(codigo, itemsForm);
      } else {
        await guardarBoletaMasiva(e, itemsForm);
      }
    } catch (error) {
      toast.error('Error al procesar la operación');
    }
  };

  const totalBoleta = itemsForm.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

  // Estilos UI Premium para React-Select (Rojo Santander / UI Limpia)
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f8fafc',
      borderColor: state.isFocused ? '#b91c1c' : '#cbd5e1', // Rojo al enfocar
      boxShadow: state.isFocused ? '0 0 0 1px #b91c1c' : 'none',
      borderRadius: '12px',
      padding: '4px 8px',
      fontSize: '14px',
      fontWeight: '500',
      minHeight: '45px',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: '#b91c1c' },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
      padding: '4px',
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '12px 16px',
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: state.isSelected ? '#fee2e2' : state.isFocused ? '#fef2f2' : 'transparent', // Fondos rojos suaves
      color: '#0f172a',
      cursor: 'pointer',
    }),
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif',  marginTop:'3rem' }}>
      <section style={{ maxWidth: '780px', margin: '0 auto' }}>
        
        {/* CABECERA MINIMALISTA */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
              Módulo de Caja
            </span>
            <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0, letterSpacing: '-0.5px' }}>
              {codigo ? 'Modificar Gastos' : 'Nuevo Registro de Gasto'}
            </h1>
          </div>
          {codigo && (
            <span style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '99px', border: '1px solid #fee2e2' }}>
              Caja: {codigo}
            </span>
          )}
        </div>

        {tramitesFiltradosBoleta.length > 0 ? (
          <form onSubmit={handleGuardar} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
            
            {/* BLOQUE DE DESGLOSE DE GASTOS */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingLeft: '4px' }}>
                Detalle de Egreso masivo
              </h2>

              {itemsForm.map((item, index) => (
                <div key={index} style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #b91c1c', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative' }}>
                  
                  {/* Fila control cabecera del item */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ background: '#fef2f2', color: '#b91c1c', fontWeight: '700', fontSize: '11px', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                      ITEM #{index + 1}
                    </span>
                    {itemsForm.length > 1 && (
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
                        onClick={() => eliminarFila(index)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} /> Eliminar línea
                      </button>
                    )}
                  </div>

                  {/* Fila superior: Selección de caja, Monto y Fecha */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>CAJA ORIGEN</label>
                      <Select
                        styles={customStyles}
                        placeholder="Seleccionar caja..."
                        options={tramitesFiltradosBoleta}
                        components={{ Option: CustomOption }}
                        getOptionLabel={(e) => `${e.label} (${e.simbolo})`}
                        getOptionValue={(e) => e.value}
                        onChange={(e) => actualizarFila(index, 'id_tramite', e ? e.value : '')}
                        value={tramitesFiltradosBoleta.find((opt) => String(opt.value) === String(item.id_tramite)) || null}
                        isSearchable={true}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                        MONTO ({tramitesFiltradosBoleta.find(opt => String(opt.value) === String(item.id_tramite))?.simbolo || 'Bs.'})
                      </label>
                      <input
                        type="number"
                        style={{ width: '100%', height: '45px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '15px', fontWeight: '700', color: '#0f172a', textAlign: 'right', outline: 'none' }}
                        placeholder="0.00"
                        value={item.monto}
                        onChange={(e) => actualizarFila(index, 'monto', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>FECHA DE GASTO</label>
                      <input
                        type="date"
                        style={{ width: '100%', height: '45px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '14px', fontWeight: '500', color: '#334155', outline: 'none' }}
                        value={item.fecha}
                        onChange={(e) => actualizarFila(index, 'fecha', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Fila inferior: Concepto */}
                  <div style={{ width: '100%' }}>
                    <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>CONCEPTO DEL GASTO</label>
                    <input
                      type="text"
                      style={{ width: '100%', height: '45px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '14px', color: '#0f172a', outline: 'none' }}
                      placeholder="Escriba el motivo o glosa del gasto realizado..."
                      value={item.detalle}
                      onChange={(e) => actualizarFila(index, 'detalle', e.target.value)}
                    />
                  </div>

                </div>
              ))}
            </div>

            {/* BOTÓN AGREGAR ITEM */}
            <div style={{ marginBottom: '32px' }}>
              <button
                type="button"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px dashed #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifycontent: 'center', gap: '8px' }}
                onClick={agregarFila}
              >
                <FontAwesomeIcon icon={faPlus} style={{ color: '#94a3b8' }} /> Añadir otra línea de gasto
              </button>
            </div>

            {/* BARRA DE LIQUIDACIÓN FIJA / TOTAL (ROJO FINANCIERO) */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifycontent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '2px', letterSpacing: '0.5px' }}>
                  Total Gasto Acumulado
                </span>
                <div style={{ color: '#b91c1c', fontWeight: '800', fontSize: '32px', display: 'flex', alignItems: 'baseline', gap: '6px', lineHeight: 1 }}>
                  <span style={{ fontSize: '18px', fontWeight: '700' }}>Bs.</span>
                  {totalBoleta.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  type="button"
                  style={{ background: '#f1f5f9', border: 'none', color: '#475569', fontWeight: '600', fontSize: '14px', padding: '14px 24px', borderRadius: '12px', cursor: 'pointer' }}
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={{ background: '#0f172a', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '14px', padding: '14px 32px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)' }}
                  disabled={cargando || itemsForm.length === 0}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px', borderColor: '#ffffff', borderRightColor: 'transparent' }}></span>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>{codigo ? 'CONFIRMAR CAMBIOS' : 'REGISTRAR GASTO'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        ) : (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px' }}>
            {[1, 2, 3].map((n) => <SkeletonRow key={n} />)}
          </div>
        )}
      </section>
    </main>
  );
};

export const SkeletonRow = () => {
  return (
    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '12px' }}>
      <div style={{ height: '12px', width: '30%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '10px' }}></div>
      <div style={{ height: '35px', width: '100%', background: '#e2e8f0', borderRadius: '8px' }}></div>
    </div>
  );
};

import { components } from 'react-select';

const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>{props.data.label}</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          Moneda: <span style={{ fontWeight: '600', color: '#334155' }}>{props.data.simbolo}</span> | Saldo Disp: <span style={{ fontWeight: '600', color: '#b91c1c' }}>{props.data.saldoDisponible}</span>
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {props.data.detalle}
        </div>
      </div>
    </components.Option>
  );
};