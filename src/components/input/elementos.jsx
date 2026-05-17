import toast from 'react-hot-toast';
import {
  faCheckCircle,
  faSearch,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { Input, IconoValidacion } from './stylos';
import { useEffect, useState } from 'react';
import { FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Estilo base compartido para mantener consistencia tipográfica y estructural
const baseLabelStyle = {
  display: 'block',
  color: '#475569',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '8px',
  textTransform: 'none',
  letterSpacing: 'normal'
};

const baseInputStyle = (valido, disabled) => ({
  width: '100%',
  height: '45px',
  borderRadius: '12px',
  padding: '0 40px 0 14px', // Espacio para el icono a la derecha
  backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
  border: '1px solid',
  borderColor: valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : '#cbd5e1',
  fontSize: '14px',
  fontWeight: '500',
  color: disabled ? '#64748b' : '#0f172a',
  outline: 'none',
  transition: 'all 0.2s ease',
});

// Estilos de React-Select estandarizados (Banca Premium)
const getSelectStyles = (valido) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : state.isFocused ? '#0f172a' : '#cbd5e1',
    boxShadow: state.isFocused ? `0 0 0 1px ${valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : '#0f172a'}` : 'none',
    borderRadius: '12px',
    padding: '4px 8px',
    fontSize: '14px',
    fontWeight: '500',
    minHeight: '45px',
    transition: 'all 0.2s ease',
    '&:hover': { borderColor: valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : '#0f172a' },
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
    backgroundColor: state.isSelected ? '#e2e8f0' : state.isFocused ? '#f1f5f9' : 'transparent',
    color: '#0f172a',
    cursor: 'pointer',
  }),
});


const InputUsuarioStandard = ({
  estado,
  cambiarEstado,
  name = 'input-default',
  tipo = 'text',
  ExpresionRegular,
  msg,
  placeholder,
  etiqueta,
  importante = true,
  logo = true,
  mayusculas = true,
  disabled = false,
}) => {
  const [mostrarMsg, setMostrarMsg] = useState(false);

  useEffect(() => {
    let timer;
    if (mostrarMsg) {
      timer = setTimeout(() => {
        setMostrarMsg(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [mostrarMsg]);

  const onChange = (e) => {
    const valor = mayusculas ? e.target.value.toUpperCase() : e.target.value;
    cambiarEstado({ ...estado, campo: valor });
  };

  const validacion = () => {
    if (ExpresionRegular) {
      if (ExpresionRegular.test(estado.campo) && estado.campo !== '') {
        cambiarEstado({ ...estado, valido: 'true' });
        setMostrarMsg(false);
      } else {
        cambiarEstado({ ...estado, valido: 'false' });
        setMostrarMsg(true);
      }
    }
  };

  return (
    <div style={{ marginBottom: '4px', position: 'relative', width: '100%' }}>
      <label style={baseLabelStyle}>
        {etiqueta}{' '}
        {importante && logo && <span style={{ color: '#dc2626', marginLeft: '2px' }}>*</span>}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Input
          type={tipo}
          style={baseInputStyle(estado.valido, disabled)}
          id={name}
          name={name}
          placeholder={placeholder}
          value={disabled ? '' : estado.campo || ''}
          onChange={onChange}
          onKeyUp={validacion}
          onBlur={validacion}
          valido={estado.valido}
          disabled={disabled}
          required={importante}
        />

        {/* Posicionamiento absoluto refinado para el icono de validación */}
        {(tipo === 'text' || tipo === 'number') && estado.valido && (
          <div style={{ position: 'absolute', right: '14px', color: estado.valido === 'true' ? '#2e7559' : '#dc2626', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <FontAwesomeIcon icon={estado.valido === 'true' ? faCheckCircle : faTimesCircle} style={{ fontSize: '16px' }} />
          </div>
        )}
      </div>
      
      {mostrarMsg && (
        <label style={{ color: '#dc2626', fontSize: '11px', fontWeight: '700', display: 'block', marginTop: '6px', paddingLeft: '4px' }}>
          {msg}
        </label>
      )}
    </div>
  );
};


const InputUsuarioStandarDisabled = ({ estado, etiqueta }) => {
  return (
    <div style={{ marginBottom: '4px', width: '100%' }}>
      <label style={baseLabelStyle}>{etiqueta}</label>
      <div style={{ position: 'relative' }}>
        <Input
          style={baseInputStyle(estado.valido, true)}
          value={estado.campo || ''}
          valido={estado.valido}
          disabled
        />
      </div>
    </div>
  );
};


const InputUsuarioSearch = ({
  name = 'input-default',
  placeholder,
  onChange,
}) => {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
      <FontAwesomeIcon 
        icon={faSearch} 
        style={{ position: 'absolute', left: '16px', color: '#94a3b8', fontSize: '14px', pointerEvents: 'none' }} 
      />
      <Input
        type="text"
        style={{
          width: '100%',
          height: '45px',
          borderRadius: '12px',
          padding: '0 14px 0 44px', // Espacio extra a la izquierda para el icono lupa
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          fontSize: '14px',
          fontWeight: '500',
          color: '#0f172a',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        valido={null}
      />
    </div>
  );
};


const Select1 = ({
  estado,
  cambiarEstado,
  Name,
  ExpresionRegular,
  lista,
  name,
  funcion = null,
  msg,
  etiqueta = null,
  importante = true,
}) => {
  const [mostrarMsg, setMostrarMsg] = useState(false);

  useEffect(() => {
    let timer;
    if (mostrarMsg) {
      timer = setTimeout(() => {
        setMostrarMsg(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [mostrarMsg]);

  const handleChange = (selectedOption) => {
    const valor = selectedOption ? parseInt(selectedOption.value) : null;
    let esValido = 'null';
    if (ExpresionRegular) {
      esValido = ExpresionRegular.test(valor) ? 'true' : 'false';
    }

    cambiarEstado({
      ...estado,
      campo: valor,
      valido: esValido,
    });

    setMostrarMsg(esValido === 'false');

    if (funcion && selectedOption) {
      funcion(valor);
    }
  };

  return (
    <div style={{ marginBottom: '4px', width: '100%' }}>
      {etiqueta && (
        <label style={baseLabelStyle}>
          {etiqueta} {importante && <span style={{ color: '#dc2626', marginLeft: '2px' }}>*</span>}
        </label>
      )}

      <Select
        name={Name}
        id={name}
        placeholder={'Seleccione...'}
        onChange={handleChange}
        options={lista}
        value={lista.find((opt) => opt.value === estado.campo) || null}
        isSearchable={true}
        isClearable={true}
        styles={getSelectStyles(estado.valido)}
      />

      {mostrarMsg && (
        <small style={{ color: '#dc2626', fontSize: '11px', fontWeight: '700', display: 'block', marginTop: '6px', paddingLeft: '4px' }}>
          {msg}
        </small>
      )}
    </div>
  );
};


const Select1EasyColors = ({
  estado,
  cambiarEstado,
  Name,
  ExpresionRegular,
  lista,
  name,
  funcion = null,
  msg,
  etiqueta = null,
  nivel = null,
}) => {
  const onChange = (e) => {
    if (ExpresionRegular) {
      if (ExpresionRegular.test(e.value)) {
        cambiarEstado({ ...estado, valido: 'true' });
        if (funcion) funcion(parseInt(e.value));
        if (nivel) nivel({ campo: parseInt(e.nivel), valido: 'true' });
        cambiarEstado({ campo: parseInt(e.value), valido: 'true' });
      } else {
        cambiarEstado({ ...estado, valido: 'false' });
      }
    }
  };

  const validacion = (e) => {
    if (ExpresionRegular) {
      if (ExpresionRegular.test(estado.campo)) {
        cambiarEstado({ ...estado, valido: 'true' });
        if (funcion) funcion(parseInt(e.value));
        if (nivel) nivel({ campo: parseInt(e.nivel), valido: 'true' });
      } else {
        cambiarEstado({ ...estado, valido: 'false' });
      }
    }
  };

  return (
    <div style={{ marginBottom: '4px', width: '100%' }}>
      {etiqueta && <label style={baseLabelStyle}>{etiqueta}</label>}
      <Select
        name={Name}
        id={name}
        onMenuOpen={validacion} // Se cambia onClick por onMenuOpen para mejor compatibilidad con react-select
        value={lista.find((opt) => opt.value === estado.campo) || null}
        styles={getSelectStyles(estado.valido)}
        placeholder={'Seleccione...'}
        onChange={onChange}
        options={lista}
      />
    </div>
  );
};


const ComponenteInputUserDisabled = ({
  estado,
  etiqueta,
  placeholder,
  tabla = false,
  importante = true,
}) => {
  return (
    <div style={{ marginBottom: '4px', width: '100%' }}>
      {!tabla && (
        <label style={baseLabelStyle}>
          {etiqueta}
          {importante ? <span style={{ color: '#dc2626', marginLeft: '2px' }}>*</span> : null}
        </label>
      )}
      <Input
        type="text"
        style={baseInputStyle('null', true)}
        value={estado.campo || ''}
        valido={estado.valido}
        placeholder={placeholder}
        disabled
      />
    </div>
  );
};


const ComponenteCheck = ({ etiqueta, estado, onChange, name }) => {
  return (
    <label 
      htmlFor={name} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        color: '#475569', 
        fontSize: '14px', 
        fontWeight: '500', 
        cursor: 'pointer',
        userSelect: 'none',
        marginTop: '8px'
      }}
    >
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={estado}
        onChange={onChange}
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
          marginRight: '8px',
          cursor: 'pointer',
          accentColor: '#0f172a' // Hace que el check activo use el azul oscuro bancario
        }}
      />
      {etiqueta}
    </label>
  );
};

export {
  InputUsuarioStandard,
  InputUsuarioStandarDisabled,
  Select1,
  Select1EasyColors,
  ComponenteCheck,
  ComponenteInputUserDisabled,
  InputUsuarioSearch,
};