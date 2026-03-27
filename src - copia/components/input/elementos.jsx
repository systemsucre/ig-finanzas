import toast from "react-hot-toast";
import { faCheckCircle, faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import {
  Input,
  IconoValidacion,
  IconoValidacionSelect,
} from "./stylos"
import { useEffect, useState } from "react";
import { FormGroup, } from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




// Asumiendo que usas styled-components o alguna librería similar para FormGroup, Input, etc.

const InputUsuarioStandard = ({
  estado,
  cambiarEstado,
  name = "input-default",
  tipo = "text",
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
    return () => clearTimeout(timer); // Limpieza de memoria
  }, [mostrarMsg]);

  const onChange = (e) => {
    const valor = mayusculas ? e.target.value.toUpperCase() : e.target.value;
    cambiarEstado({ ...estado, campo: valor });
  };

  const validacion = () => {
    if (ExpresionRegular) {
      if (ExpresionRegular.test(estado.campo) && estado.campo !== "") {
        cambiarEstado({ ...estado, valido: "true" });
        setMostrarMsg(false);
      } else {
        cambiarEstado({ ...estado, valido: "false" });
        setMostrarMsg(true);
      }
    }
  };

  return (
    <>
      <label className="hospital-label w-100 mb-2">
        {etiqueta}  {importante && logo && <span style={{ color: 'red' }}>*</span>}
      </label>
      <div className="input-group-custom">
        <Input
          type={tipo}
          className="form-control-clinical"
          id={name}
          name={name}
          placeholder={placeholder}
          value={disabled ? "" : (estado.campo || "")}
          onChange={onChange}
          onKeyUp={validacion}
          onBlur={validacion}
          valido={estado.valido}
          disabled={disabled}
          required={importante}
        />

        {/* Validación de Icono mejorada con paréntesis */}
        {(tipo === 'text' || tipo === 'number') && estado.valido && (
          <IconoValidacion
            valido={estado.valido}
            icon={estado.valido === 'true' ? faCheckCircle : faTimesCircle}
          // style={{ right: tipo === 'text' ? '10px' : "30px" }}
          />
        )}
      </div>
      {/* Renderizado condicional en lugar de manipular el style directamente */}
      {mostrarMsg && (
        <label style={{ color: '#FF3D85', fontSize: '11px', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>
          {msg}
        </label>
      )}
    </>
  );
};

const InputUsuarioSearch = ({
  name = "input-default",
  placeholder,
  onChange
}) => {


  return (
    <div className="buscador-contenedor">
      <FontAwesomeIcon icon={faSearch} className="icono-busqueda" />
      <Input
        type='text'
        className="input-buscador"
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
      }, 5000); // Reducido a 5s para mejor UX
    }
    return () => clearTimeout(timer);
  }, [mostrarMsg]);

  const handleChange = (selectedOption) => {
    // 1. Extraer el valor (si es null por borrar la selección, ponemos null)
    const valor = selectedOption ? parseInt(selectedOption.value) : null;

    // 2. Validar inmediatamente con la ExpresionRegular
    let esValido = "null";
    if (ExpresionRegular) {
      esValido = ExpresionRegular.test(valor) ? "true" : "false";
    }

    // 3. Actualizar el estado global
    cambiarEstado({ 
      ...estado, 
      campo: valor, 
      valido: esValido 
    });

    // 4. Manejar mensajes de error
    setMostrarMsg(esValido === "false");

    // 5. Ejecutar función extra (como la del prefijo LOT-)
    if (funcion && selectedOption) {
      funcion(valor);
    }
  };

  return (
    <div className="mb-3">
      {etiqueta && (
        <label className="hospital-label w-100 mb-2 fw-bold" style={{ fontSize: '14px' }}>
          {etiqueta} {importante && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}

      <Select
        name={Name}
        id={name}
        placeholder={'Seleccione...'}
        onChange={handleChange}
        options={lista}
        // react-select necesita el objeto completo, lo buscamos en la lista por su ID
        value={lista.find(opt => opt.value === estado.campo) || null}
        isSearchable={true}
        isClearable={true}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: '8px',
            minHeight: '45px',
            borderColor: estado.valido === 'true' ? '#1ed12d' : estado.valido === 'false' ? '#dc3545' : '#dee2e6',
            boxShadow: 'none',
            '&:hover': {
              borderColor: estado.valido === 'true' ? '#1ed12d' : estado.valido === 'false' ? '#dc3545' : '#86b7fe'
            }
          })
        }}
      />

      {mostrarMsg && (
        <small className="text-danger fw-bold d-block mt-1 animate__animated animate__fadeIn" style={{ fontSize: '11px' }}>
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
        cambiarEstado({ ...estado, valido: "true" }); //el valor del campo valido, debe ser una cadena
        if (funcion) funcion(parseInt(e.value))
        if (nivel) nivel({ campo: parseInt(e.nivel), valido: "true" })
        cambiarEstado({ campo: parseInt(e.value), valido: "true" });
      } else {
        cambiarEstado({ ...estado, valido: "false" });
      }
    }

  };
  const validacion = (e) => {
    if (ExpresionRegular) {
      if (ExpresionRegular.test(estado.campo)) {
        cambiarEstado({ ...estado, valido: "true" }); //el valor del campo valido, debe ser una cadena
        if (funcion) funcion(parseInt(e.value))
        if (nivel) nivel({ campo: parseInt(e.nivel), valido: "true" })

      } else {
        cambiarEstado({ ...estado, valido: "false" });
      }
    }
  };

  let valor = ''
  for (let e of lista) {
    if (e.value == estado.campo) {
      valor = e.label
    }
  }
  // console.log(lista)




  return (
    <FormGroup>
      <label htmlFor={name}>
        {etiqueta}
      </label>
      <Select
        name={Name}
        onClick={validacion}
        value={lista.find(opt => opt.value === estado.campo) || null}
        className={estado.valido === 'true' ? 'select-valid' : estado.valido === 'false' ? 'select-invalid' : ''}
        styles={{
          control: (base, state) => ({
            ...base,

            borderColor: estado.valido === 'true' ? '#1ed12d' : estado.valido === 'false' ? '#dc3545' : base.borderColor,
            '&:hover': {
              borderColor: estado.valido === 'true' ? '#1ed12d' : estado.valido === 'false' ? '#dc3545' : base.borderColor
            }
          }),

        }}
        placeholder={'Seleccione'}
        onChange={onChange}
        options={lista}
      />
    </FormGroup >
  );
};

const ComponenteInputUserDisabled = ({ estado, etiqueta, placeholder, tabla = false, importante = true }) => {
  return (
    <FormGroup>
      {!tabla && <label>{etiqueta}{importante ? <span style={{ color: 'red' }}>*</span> : null}</label>}
      <Input
        type="text"
        value={estado.campo || ""}
        valido={estado.valido}
        placeholder={placeholder}
        toUpperCase
        disabled
      />
    </FormGroup>
  );
};

const ComponenteCheck = ({
  etiqueta,
  estado,
  onChange,
  name
}) => {


  return (
    <label className="text-muted cursor-pointer" htmlFor={name}>
      <input
        type="checkbox"
        className="me-2"
        name={name}
        id={name}
        checked={estado} // Valor vinculado al estado
        onChange={onChange}
      />{etiqueta}
    </label>
  );
};



export {
  InputUsuarioStandard,
  Select1,
  Select1EasyColors,
  ComponenteCheck,
  ComponenteInputUserDisabled,
  InputUsuarioSearch

};
