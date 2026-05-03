import { faCalendar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatearFechaYHora } from "../components/FormtaarFecha";

export const ColumnsTable = [

  {
    label: 'Fecha y Hora',
    field: 'fecha',
    render: (row) => {
      const info = formatearFechaYHora(row.fecha);
      return (
        <div className="movimiento-banco-wrapper">
          {/* Cabecera con icono de calendario */}
          <div className="fecha-header">
            {/* <i className="bi bi-calendar3 me-2"></i> */}
            <FontAwesomeIcon className="me-2" icon={faCalendarAlt } />
            {info.fechaLarga}
            {/* Hora (solo se muestra si existe) */}
            {info.hora && (
              <div className="hora-detalle">

                {info.hora}
              </div>
            )}
          </div>


        </div>
      );
    }
  },

  window.innerWidth > 877 ? 
  {
    label: 'Numero Boleta',
    field: 'numero_boleta',
    render: (row) => (
      <div className="td-numero">
        <span className="ms-2"> {row.numero_boleta}</span>
      </div>
    )
  }:{},

  {
    label: 'Caja',
    field: 'codigo',
    render: (row) => (
      <div className="td-descripcion">
        <span className="ms-2">{row.codigo_boleta}</span>
      </div>
    )
  },
window.innerWidth > 877 ?
  {
    label: 'Items',
    field: '_items',
    render: (row) => (
      <div className="text-center">
        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
          {row.total_items}
        </span>
      </div>
    ),
  }:{},

  window.innerWidth > 877 ?
    {
      label: 'Monto',
      field: 'monto',
      render: (row) => (
        <div className="text-center">
          <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
            {row.simbolo} {row.monto_total}
          </span>
        </div>
      ),
    } : {},

  {
    label: 'Usuario Registrador',
    field: 'solicitante',
    render: (row) => (
       <div className="td-numero">
        <span className="ms-2"> {row.solicitado_por}</span>
      </div>
    ),
    sortable: true,
  },
  {
    label: 'Estado',
    field: 'estado',
    render: (row) => {
      const estados = {
        1: {
          badge: 'bgss-secsondary text-secondary',
          texto: 'SOLICITADO',
          icon: 'bi-hourglass-split',
        },
        2: {
          badge: 'bg-infos text-info',
          texto: 'APROBADO',
          icon: 'bi-check-circle',
        },
        3: {
          badge: 'tex-success text-success',
          texto: 'REGISTRADO',
          icon: 'bi-cash-stack',
        },
        4: {
          badge: 'bg-danger text-danger',
          texto: 'RECHAZADO',
          icon: 'bi-x-circle',
        },
      };

      const est = estados[row.estado] || {
        badge: 'bg-secondary',
        texto: 'DESCONOCIDO',
        icon: 'bi-question',
      };

      return (
        <span
          className={`badge ${est.badge} d-flex align-items-center w-fit-content px-2 py-1 `}
          style={{ fontSize: '0.85rem', fontWeight: '600' }}
        >
          <i className={`bi ${est.icon} me-1`}></i>
          {est.texto}
        </span>
      );
    },
  },
];
