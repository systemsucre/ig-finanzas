export const ColumnsTableIngresosPendientes = [
  {
    label: 'empleador',
    field: 'cliente_nombre', // Viene del CONCAT en el backend
    render: (row) => (
      <div>
        <div className="fw-bold" style={{ fontSize: '0.75rem' }}>
          {row.cliente_nombre}
        </div>
        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
          ID EMPLEADOR: {row.id_cliente}
        </small>
      </div>
    ),
  },

  {
    label: 'Código de Caja',
    field: 'codigo',
    render: (row) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <strong style={{ fontSize: '0.8em' }}>{row.codigo_tramite}</strong>
          <div
            style={{ fontSize: '0.55em', color: '#444444', fontWeight: '100' }}
          >
            {row.detalle_tramite.substring(0, 40)}
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'Fecha',
    field: 'fecha_ingreso',
    render: (row) => {
      // Manejamos la fecha de ingreso definida en el formulario
      return (
        <div className="small text-secondary">
          <span className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>
            <i className="bi bi-calendar-check me-1 text-success"></i>
            fecha venc.: {row?.fecha_vencimiento?.split('T')[0]}
          </span>
          <br />
          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
            fecha Pago: {row.fecha_ingreso?.split('T')[0]}
          </span>
        </div>
      );
    },
  },
  {
    label: 'Estado',
    field: 'estado',
    render: (row) => (
      <div className="text-end pe-3">
        {row.estado === 1 ? (
          <span className="fw-bold text-warning" style={{ fontSize: '0.8rem' }}>
            {'PENDIENTE'}
          </span>
        ) : row.estado === 3 ? (
          <span className="fw-bold text-info" style={{ fontSize: '0.8rem' }}>
            {'parcial'}
          </span>
        ) : row.estado === 4 ? (
          <span className="fw-bold text-danger" style={{ fontSize: '0.8rem' }}>
            {'Anulado'}
          </span>
        ) : row.estado === 2 ? (
          <span className="fw-bold text-success" style={{ fontSize: '0.8rem' }}>
            {'LIQUIDADO'}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    label: 'Tipo ingreso',
    field: 'tipo_ingreso',
    render: (row) => (
      <div>
        {row.tipo_ingreso === 1 ? (
          <div className="fw-bold text-success" style={{ fontSize: '0.75rem' }}>
            {'INGRESO DIRECTO'}
          </div>
        ) : row.tipo_ingreso === 2 ? (
          <div className="fw-bold text-warning" style={{ fontSize: '0.75rem' }}>
            {'INGRESO INDIRECTO'}
          </div>
        ) : null}
      </div>
    ),
  },
  {
    label: 'Montos',
    field: 'monto',
    render: (row) => (
      <div className="text-end pe-3">
        <span className="fw-bold text-success" style={{ fontSize: '0.8rem' }}>
          Por Cobrar. : {row.simbolo} {row.monto_original}
        </span>
        <div
          style={{ fontSize: '0.65rem' }}
          className="text-muted text-uppercase fw-bold"
        >
          En caja: {row.monto}
        </div>
      </div>
    ),
  },

  {
    label: 'Registrado por',
    field: 'username',
    render: (row) => (
      <div style={{ minWidth: '200px' }}>
        <div className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>
          {row.usuario_nombre}
        </div>
        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
          Usuario : {row.username + ` ID: ${row.id_usuario}`}
        </small>
      </div>
    ),
  },
];
