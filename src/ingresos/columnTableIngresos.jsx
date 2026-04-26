export const ColumnsTableIngresos = [
  //   {
  //     label: 'ID / REF',
  //     field: 'id',
  //     render: (row) => (
  //       <div className="text-center">
  //         <div className="fw-bold text-dark small" style={{ fontSize: '0.7rem' }}>
  //           {row.id ? row.numero : '---'}
  //         </div>
  //         <small className="badge bg-light text-secondary border">INGRESO</small>
  //       </div>
  //     ),
  //     sortable: true,
  //   },
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
    sortable: true,
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
    label: 'Fecha de Cobro',
    field: 'fecha_ingreso',
    render: (row) => {
      return (
        <div className="small text-secondary">
          <span className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>
            <i className="bi bi-calendar-check me-1 text-success"></i>
            {row?.fecha_ingreso?.split('T')[0]}
          </span>
          <br />
          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
            Registro: {row.created_at?.split('T')[0]}
          </span>
        </div>
      );
    },
  },
  {
    label: 'Monto',
    field: 'monto',
    render: (row) => (
      <div className="text-end pe-3">
        {row.tipo_ingreso === 1 ? (
          <span
            className="fw-bold text-success"
            style={{ fontSize: '0.75rem' }}
          >
            {row.simbolo} {row.monto}
          </span>
        ) : (
          <>
            <span
              className="fw-bold text-success text-uppercase"
              style={{ fontSize: '0.75rem' }}
            >
              Monto Pagado: {row.simbolo} {row.monto}
            </span>
            <div
              style={{ fontSize: '0.65rem' }}
              className="text-muted text-uppercase fw-bold"
            >
              Monto Original: {row.simbolo} {row.monto}
            </div>
          </>
        )}
      </div>
    ),
  },

  {
    label: 'TIPO PAGO',
    field: 'TIPO',
    render: (row) => (
      <div className="text-end pe-3">
        <div className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>
          {row.tipo}
        </div>
      </div>
    ),
  },
  {
    label: 'RECIBIDO POR',
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
