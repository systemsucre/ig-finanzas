export const columns = [
    {
        label: 'ID',
        field: 'id',
        render: row => row.id,
        sortable: true,
        width: '80px'
    },
    {
        label: 'CODIGO',
        field: 'codigo',
        render: row => row.codigo,
        sortable: true,
        width: '80px'
    },
    {
        label: 'Descripción de Categoria Caja',
        field: 'tipo_tramite',
        render: row => <span className="fw-bold text-dark">{row.tipo_tramite}</span>,
        sortable: true,
        wrap: true
    },
    {
        label: 'Estado',
        field: 'estado',
        sortable: true,
        render: (row) => (
            <span className={`badge ${row.estado === 1 ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.75rem' }}>
                {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
            </span>
        )
    },
    {
        label: 'Fecha Registro',
        field: 'created_at',
        sortable: true,
        render: row => {
            if (!row.created_at) return '---';
            const fecha = new Date(row.created_at);
            return (
                <div className="small text-muted">
                    {fecha.toLocaleDateString('es-BO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            );
        }
    }
];