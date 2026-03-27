export const columns = [
    {
        label: 'Nombre Completo',
        field: 'Nombre Completo',
        render: row => row.nombre_completo, // Generado por el CONCAT en el SQL
        sortable: true,
        wrap: true
    },
    {
        label: 'CI',
        field: 'CI',
        render: row => row.ci,
        sortable: true
    },
    {   
        label: 'Celular',
        field: 'Celular',
        render: row => row.celular || 'S/N'
    },
    {
        label: 'Dirección',
        field: 'Dirección',
        render: row => row.direccion,
        wrap: true
    },
    {
        label: 'Estado',
        field: 'Estado',
        sortable: true,
        render: (row) => (
            <span className={`badge ${row.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
            </span>
        )
    },
    {
        label: 'Fecha Registro',
        field: 'Fecha Registro',
        sortable: true,
        render: row => {
            if (!row.created_at) return '---';
            const fecha = new Date(row.created_at);
            return fecha.toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }
];