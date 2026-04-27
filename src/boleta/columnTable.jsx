export const ColumnsTable = [
  {
    label: 'NUM. BOLETA',
    field: 'numero',
    render: (row) => (
      <div style={{ minWidth: '10px', fontSize: '0.85rem' }}>
        <div className="fw-bold text-dark ">{row.numero_boleta}</div>
      </div>
    ),
    sortable: true,
  },

  {
    label: 'CODIGO BOLETA',
    field: 'codigo',
    render: (row) => (
      <div style={{ minWidth: '10px' }}>
        <div className="fw-bold text-dark " style={{ fontSize: '0.85rem' }}>
          {row.codigo_boleta}
        </div>
      </div>
    ),
    sortable: true,
  },

  // {
  //     label: 'NUMERO BOLETA',
  //     field: 'numero',
  //     render: (row) => (
  //         <div style={{ minWidth: '10px' }}>
  //             <div className="fw-bold text-dark text-center ">{row.numero_boleta}</div>

  //         </div>
  //     ),
  //     sortable: true,
  // },

  {
    label: 'Fecha Registro',
    field: 'created_at',
    render: (row) => {
      const fecha = new Date(row.fecha?.split(' ')[0]);
      return (
        <div className="small text-secondary" style={{ fontSize: '0.85rem' }}>
          <i
            className="bi bi-calendar3 me-1"
            style={{ fontSize: '0.75rem' }}
          ></i>
          {row.fecha?.split('T')[0]}
          <br />
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {fecha.toLocaleTimeString('es-BO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      );
    },
  },
  {
    label: 'Items',
    field: 'items',
    render: (row) => (
      <div className="text-center">
        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
          {row.total_items}
        </span>
      </div>
    ),
  },
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
  },
  {
    label: 'Usuario Registrador',
    field: 'solicitante',
    render: (row) => (
      <div style={{ minWidth: '10px' }}>
        <small className="text-muted" style={{ fontSize: '0.85rem' }}>
          {row.solicitado_por}
        </small>
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
