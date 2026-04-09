export const ColumnsTableDetalle = [
    // {
    //     label: 'ITEM',
    //     field: 'numero',
    //     render: (row) => (
    //         <div style={{ minWidth: '10px' }}>
    //             <div className="fw-bold text-dark ">{row.numero}</div>

    //         </div>
    //     ),
    //     sortable: true,
    // },



    {
        label: 'Código Caja',
        field: 'codigo',
        render: (row) =>
            <div> <span className="fw-bold text-primary">{row.codigo_tramite}</span></div>
    },
    {
        label: 'NUMERO',
        field: 'numero',
        render: (row) => {
            return (
                <div className={`fw-bold  text-dark `} style={{}}>
                    {row.numero}
                </div>
            );
        }
    },
    {
        label: 'Detalle del Gasto',
        field: 'detalle',
        render: (row) => {
            return (
                <div className="small text-secondary">
                    {row.detalle?.length < 20 ?
                        <div className="text-dark">{row.detalle}</div> :
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {row.detalle?.substring(0, 40)}...
                        </small>
                    }
                </div>
            );
        }
    },
    {
        label: 'Fecha',
        field: 'fecha_solicitud',
        render: (row) => (
            <div >
                <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                    {row.fecha_solicitud?.split('T')[0]}
                </span>
            </div>
        )
    },
    {
        label: 'Monto',
        field: 'monto',
        render: (row) => (
            <div >
                <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
                    {row.simbolo} {row.monto}
                </span>
            </div>
        )
    },

    {
        label: 'Estado Item',
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