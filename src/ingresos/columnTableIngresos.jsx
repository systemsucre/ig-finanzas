export const ColumnsTableIngresos = [
    {
        label: 'ID / REF',
        field: 'id',
        render: (row) => (
            <div className="text-center">
                <div className="fw-bold text-dark small" style={{ fontSize: '0.7rem' }}>
                    {row.id ? row.numero : '---'}
                </div>
                <small className="badge bg-light text-secondary border">INGRESO</small>
            </div>
        ),
        sortable: true,
    },
    {
        label: 'empleador',
        field: 'cliente_nombre', // Viene del CONCAT en el backend
        render: (row) => (
            <div>
                <div className="fw-bold">{row.cliente_nombre}</div>
                <small className="text-muted">ID EMPLEADOR: {row.id_cliente}</small>
            </div>
        )
    },
    {
        label: 'Detalle',
        field: 'detalle',
        render: (row) => (
            <div style={{ minWidth: '220px' }}>
                {row.detalle?.length < 20 ?
                    <div className="fw-bold text-dark">{row.detalle}</div> :
                    <div className="d-flex align-items-center mt-1">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {row.detalle?.substring(0, 40)}...

                        </small>
                    </div>
                }
            </div>
        )
    },
    {
        label: 'Fecha de Cobro',
        field: 'fecha_ingreso',
        render: (row) => {
            // Manejamos la fecha de ingreso definida en el formulario
            return (
                <div className="small text-secondary">
                    <span className="fw-bold text-dark">
                        <i className="bi bi-calendar-check me-1 text-success"></i>
                        {row?.fecha_ingreso?.split('T')[0]}
                    </span>
                    <br />
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Registro: {row.created_at?.split('T')[0]}
                    </span>
                </div>
            );
        }
    },
    {
        label: 'Monto Recibido',
        field: 'monto',
        render: (row) => (
            <div className="text-end pe-3">
                <span className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>
                    {row.simbolo} {row.monto}
                </span>
                <div style={{ fontSize: '0.65rem' }} className="text-muted text-uppercase fw-bold">
                    {row.tipo}
                </div>
            </div>
        )
    },

    {
        label: 'TIPO PAGO',
        field: 'TIPO',
        render: (row) => (
            <div className="text-end pe-3">
                <div className="fw-bold text-dark">
                    {row.tipo}
                </div>
            </div>
        )
    },
    {
        label: 'RECIBIDO POR',
        field: 'username',
        render: (row) => (
            <div style={{ minWidth: '200px' }}>
                <div className="fw-bold text-dark">{row.usuario_nombre}</div>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Usuario : {row.username + ` ID: ${row.id_usuario}`}
                </small>
            </div>
        )
    },
];