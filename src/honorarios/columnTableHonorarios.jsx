export const ColumnsTableHonorarios = [
    {
        label: 'ITEM',
        field: 'id',
        render: (row) => (
            <div className="text-center">
                <div className="fw-bold text-dark small" style={{ fontSize: '0.7rem' }}>
                    {row.numero}
                </div>

            </div>
        ),
        sortable: true,
    },
    {
        label: 'CLIENTE',
        field: 'cliente',
        render: (row) => (
            <div className="text-center">
                <div className="fw-bold text-dark">{row.cliente}</div>
            </div>
        ),
        sortable: true,
    },
    {
        label: 'Servicio / Concepto',
        field: 'descripcion',
        render: (row) => (
            <div style={{ minWidth: '220px' }}>
                <div className="fw-bold text-dark small" style={{ fontSize: '0.7rem' }}>
                    {row.descripcion?.substring(0, 35)}
                </div>
                <small className="text-muted" style={{ fontSize: '0.9rem' }}>
                    TRAMITE: {row.codigo_tramite}
                </small>
            </div>
        )
    },
    {
        label: 'Fecha de Cobro',
        field: 'fecha_ingreso',
        render: (row) => {
            const fecha = new Date(row.fecha_ingreso);
            return (
                <div className="small text-secondary">
                    <span className="fw-bold text-dark">
                        <i className="bi bi-cash-stack me-1 text-primary"></i>
                        {fecha.toLocaleDateString('es-BO')}
                    </span>
                    <br />
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Registro: {new Date(row.created_at).toLocaleDateString('es-BO')}
                    </span>
                </div>
            );
        }
    },
    {
        label: 'Monto Honorario',
        field: 'monto',
        render: (row) => (
            <div className="text-end pe-3">
                <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                    Bs. {Number(row.monto || 0).toLocaleString('es-BO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </span>
            </div>
        )
    },
    {
        label: 'Metodo de Pago',
        field: 'tipo_pago',
        render: (row) => (
            <div className="">
                <span className="badge rounded-pill bg-light text-dark border px-3">
                    {row.tipo_pago}
                </span>
            </div>
        )
    },
    {
        label: 'Cobrado Por',
        field: 'username',
        render: (row) => (
            <div style={{ minWidth: '200px' }}>
                <div className="fw-bold text-dark">{row.usuario_nombre}</div>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {row.username}
                </small>
            </div>
        )
    },
];