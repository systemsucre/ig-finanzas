export const ColumnsTableSalidas = [
    {
        label: 'ÍTEM',
        field: 'numero',
        render: (row) => (
            <div style={{ minWidth: '10px' }}>
                <div className="fw-bold text-dark text-center">{row.numero}</div>
                {/* <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Registrado por: {row.usuario_nombre}
                </small> */}
            </div>
        ),
        sortable: true,
    },
    {
        label: 'BOLETA',
        field: 'codigo_boleta',
        render: (row) => (
            <div style={{ minWidth: '10px' }}>
                <div className="fw-bold text-dark ">{row.codigo_boleta}</div>
                {/* <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Registrado por: {row.usuario_nombre}
                </small> */}
            </div>
        ),
        sortable: true,
    },
    {
        label: 'Detalle ítem',
        field: 'detalle',
        render: (row) => (
            <div style={{ minWidth: '200px' }}>
                {row.detalle?.length < 20 ?
                    <div className="fw-bold text-dark">{row.detalle}</div> :
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {row.detalle?.substring(0, 40)}...
                    </small>
                }
            </div>
        )
    },
    {
        label: 'Fecha Registro',
        field: 'fecha_solicitud',
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
                     {localStorage.getItem('moneda')} {row.monto}
                </span>
            </div>
        )
    },
    {
        label: 'Estado',
        field: 'estado',
        render: (row) => {
            const estados = {
                1: { badge: 'bgss-secondary text-dark', texto: 'SOLICITADO', icon: 'bi-hourglass-split' },
                2: { badge: 'bg-info text-white', texto: 'APROBADO', icon: 'bi-check-circle' },
                3: { badge: ' text-success', texto: 'REGISTRADO', icon: 'bi-cash-stack' },
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