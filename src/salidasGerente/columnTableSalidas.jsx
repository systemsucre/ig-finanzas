export const ColumnsTableSalidas =  [
        {
        label: 'SOLICITUD',
        field: 'numero',
        render: (row) => (
            <div style={{ minWidth: '10px' }}>
                <div className="fw-bold text-dark text-center">{row.numero}</div>
                
            </div>
        ), 
        sortable: true,
    },
    {
        label: 'Detalle del Gasto',
        field: 'detalle',
        render: (row) => (
            <div style={{ minWidth: '200px' }}>
                <div className="fw-bold text-dark">{row.detalle}</div>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Registrado por: {row.usuario_nombre || `ID: ${row.usuario}`}
                </small>
            </div>
        )
    },
    {
        label: 'Fecha Registro',
        field: 'created_at',
        render: (row) => {
            const fecha = new Date(row.fecha_solicitud?.split(" ")[0])
            return (
                <div className="small text-secondary">
                    <i className="bi bi-calendar3 me-1"></i>
                    {fecha.toLocaleDateString('es-BO')}
                    <br />
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {fecha.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            );
        }
    },
    {
        label: 'Monto',
        field: 'monto',
        render: (row) => (
            <div className="text-center">
                <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
                    Bs. {Number(row.monto || 0).toLocaleString('es-BO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </span>
            </div>
        )
    },
    {
        label: 'Estado',
        field: 'estado',
        render: (row) => {
            const estados = {
                1: { badge: 'bg-secondary text-dark', texto: 'SOLICITADO', icon: 'bi-hourglass-split' },
                2: { badge: 'bg-info text-white', texto: 'APROBADO', icon: 'bi-check-circle' },
                3: { badge: 'bg-success text-white', texto: 'DESPACHADO', icon: 'bi-cash-stack' },
                4: { badge: 'bg-danger text-white', texto: 'RECHAZADO', icon: 'bi-x-circle' }
            };

            const est = estados[row.estado] || { badge: 'bg-secondary', texto: 'DESCONOCIDO', icon: 'bi-question' };

            return (
                <span className={`badge ${est.badge} d-flex align-items-center w-fit-content px-2 py-1`}>
                    <i className={`bi ${est.icon} me-1`}></i>
                    {est.texto}
                </span>
            );
        }
    }
];