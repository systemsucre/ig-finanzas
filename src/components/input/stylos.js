import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Input as InputR,  } from "reactstrap";

const colores = {
  color: "#555555",
  error: "#FF3D85",
  exito: "#17a2b8",

  bordeXL:"#2980b9", 
  // "#28a745",
  colorFocus: "#0d6efd",
  encabezado: "#006572",
  borde: "rgb(218,220,224)",

};


const Input = styled(InputR)`
  border:1px solid ${colores.bordeXL} !important;
  color:${colores.color};
  transition: all .3s;
  padding-right:35px;
  &:focus {
    border: 1px solid ${colores.colorFocus} !important;
    transition: 0.3s ease-in-out all;
  }
  ${(props) =>
    props.valido === "true" &&
    css`
    border:1px solid ${colores.borde};
    `}

  ${(props) =>
    props.valido === "false" &&
    css`
      border: 1px solid ${colores.error} !important;
    `}
`;

const IconoValidacion = styled(FontAwesomeIcon)`

   position: relative; /* Cambiado de relative a absolute */
    right: 8px;    /* Distancia desde el borde derecho */
    top: 24px;          /* Lo bajamos al centro */
    transform: translateY(-50%); /* Centrado vertical exacto */
    z-index: 100;
    font-size: 16px;
    opacity: 0;
    pointer-events: none; /* Para que no interfiera si el usuario hace click sobre él */
    ${(props) =>
    props.valido === "true" &&
    css`
        color : ${colores.exito};
        opacity:1;
      `}
      ${(props) =>
    props.valido === "false" &&
    css`
          color : ${colores.error};
          opacity:1;
        `}

`

const IconoValidacionSelect = styled(FontAwesomeIcon)`

    position:absolute;
    right:20px;
    bottom:10px;
    z-index:100;
    font-size:16px;
    opacity:0;
    ${(props) =>
    props.valido === "true" &&
    css`
        color : ${colores.exito};
        opacity:1;
      `}
      ${(props) =>
    props.valido === "false" &&
    css`
          color : ${colores.error};
          opacity:1;
        `}

`


export {
  Input,
  IconoValidacion,
  IconoValidacionSelect, 
};
