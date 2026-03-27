

export const columns = [
    {
        label: 'Nombre Completo',
        field: 'Nombre Completo',
        render: row => row.nombre_completo, // Usamos el alias del SQL
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
        label: 'Rol / Cargo',
        field: 'Rol / Cargo',
        render: row => row.nombre_rol, // Traído desde la tabla 'roles'
        sortable: true
    },
    {
        label: 'Usuario',
        field: 'Usuario',
        render: row => row.username,
        sortable: true
    },
    {
        label: 'Celular',
        field: 'Celular',
        render: row => row.celular
    },
    {
        label: 'Estado',
        field: 'Estado',
        render: (row) => (
            <span className={`badge ${row.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
            </span>
        ),
        sortable: true,

        // opcional
        cell: row => (
            <span className={`badge ${row.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                {row.estado === 1 ? 'Activo' : 'Inactivo'}
            </span>
        )
    },
    {
        label: 'Último Acceso',
        field: 'Último Acceso',

        render: row => {
        if (!row.ultimo_acceso) return 'Sin ingresos';
        const fecha = new Date(row.ultimo_acceso);
        return fecha.toLocaleString('es-BO', { // 'es-BO' para Bolivia o 'es-ES' para general
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },
        sortable: true
    }
];