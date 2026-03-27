export const ColumnsTableTramites = [
    {
        label: 'Numero',
        field: 'numero,',
        render: (row) =>
            <div> <span className="fw-bold text-primary">{row.numero}</span></div>
    },
    {
        label: 'Código',
        field: 'codigo',
        render: (row) =>
            <div> <span className="fw-bold text-primary">{row.codigo}</span></div>
    },
    {
        label: 'Detalle',
        field: 'detalle',
        render: (row) =>
            <small className="text-muted italic" style={{ fontSize: '0.7rem' }}>
                {row.detalle?.substring(0, 30)}...
            </small>
    },
    {
        label: 'Cliente',
        field: 'cliente_nombre', // Viene del CONCAT en el backend
        render: (row) => (
            <div>
                <div className="fw-bold">{row.cliente_nombre}</div>
                <small className="text-muted">ID CLIENTE: {row.id_cliente}</small>
            </div>
        )
    },
    {
        label: 'Tipo de Trámite',
        field: 'nombre_tipo_tramite',
        render: (row) => (
            <span className="badge bg-light text-dark border">
                {row.nombre_tipo_tramite?.toUpperCase()}
            </span>
        )
    },
    {
        label: 'Estado',
        field: 'estado',
        render: (row) => (<>
            <span className={`badge ${row.estado === 1 ? 'bg-success' : 'bg-warning text-dark'}`}>
                {row.estado === 1 ? 'EN CURSO' : row.estado === 2 ? 'PARALIZADO' : 'FINALIZADO'}
            </span> <br />
            <span className={`badge ${row.eliminado === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                {row.eliminado === 0 ? 'Eliminado' : ''}
            </span>
        </>
        )
    },
    {
        label: 'Plazo y Fechas',
        field: 'fecha_finalizacion',
        render: (row) => {
            const hoy = new Date();
            const vencimiento = new Date(row.fecha_finalizacion);
            const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

            let color = 'text-success';
            if (diasRestantes <= 7) color = 'text-warning fw-bold';
            if (diasRestantes <= 3) color = 'text-danger fw-bold animate-pulse';

            return (
                <div>
                    <div className="small text-muted">
                        <i className="bi bi-calendar-check me-1"></i>
                        Ingreso: {new Date(row.fecha_ingreso).toLocaleDateString()}
                    </div>
                    <div className="small text-info">
                        <i className="bi bi-calendar-x me-1"></i>
                        Entrega: {vencimiento.toLocaleDateString()}
                    </div>
                    <div className={`${color} mt-1`} style={{ fontSize: '0.85rem' }}>
                        <i className="bi bi-clock-history me-1"></i>
                        {diasRestantes > 0 ? `${diasRestantes} días restantes` : 'Plazo vencido'}
                    </div>
                </div>
            );
        }
    },
    {
        label: 'Costo de Gestión',
        field: 'costo',
        render: (row) => {
            const costo = row.costo || 0;
            return (
                <div className="text-end">
                    <div className="fw-bold text-dark">
                        GASTOS : Bs. {row.total_gastos}
                    </div>
                    {/* {localStorage.getItem('numRol') != 4 ?
                        <div className=" fw-bold text-muted text-success italic" style={{ fontSize: '0.7rem' }}>
                            COSTO TRAMITE  Bs. {costo}
                        </div>
                        : null} */}
                    <div className=" fw-bold text-muted text-success italic" style={{ fontSize: '0.7rem' }}>
                        MONTO ABONADO  Bs. {row.total_ingresos}
                    </div>
                    <div className={`fw-bold ${row.saldoDisponible > 2000 ? `text-dark` : row.saldoDisponible > 1000 ? `text-warning` : `text-danger`}`} style={{ fontSize: '0.7rem' }}>
                        SALDO DISP.  BS. {row.saldoDisponible}
                    </div>
                </div>
            );
        }
    }
];