import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export const columns = [
    {
        label: 'Nombre Completo',
        field: 'Nombre Completo',
        render: row =>
            <div >
                <span className="td-descripcion" >
                    {row.nombre_completo}
                </span>
            </div>,
        sortable: true,
        wrap: true
    },
    {
        label: 'CI',
        field: 'CI',
        render: row => <div >
            <span className="td-descripcion" >
                {row.ci || 'S/N'}
            </span>
        </div>,
        sortable: true
    },
    {
        label: 'Rol / Cargo',
        field: 'Rol / Cargo',
        render: row =>
            <div >
                <span className="td-numero" >
                    {row.nombre_rol || 'S/N'}
                </span>
            </div>,// Traído desde la tabla 'roles'
        sortable: true
    },
    {
        label: 'Usuario',
        field: 'Usuario',
        render: row =>
            <div >
                <span className="td-numero" >
                    {row.username || 'S/N'}
                </span>
            </div>,
        sortable: true
    },
    {
        label: 'Celular',
        field: 'Celular',
        render: row => <div >
            <span className="td-numero" >
                {row.celular || 'S/N'}
            </span>
        </div>,
    },
    {
        label: 'Estado',
        field: 'Estado',
        sortable: true,
        render: (row) => {
            const estados = {
                1: {
                    badge: 'text-success',
                    texto: 'Activo',
                    icon: faCheckCircle,
                },
                0: {
                    badge: 'text-secondary',
                    texto: 'Inactivo',
                    icon: faXmarkCircle,
                },

            };

            const est = estados[row.estado] || {
                badge: 'bg-secondary',
                texto: 'DESCONOCIDO',
                icon: 'bi-question',
            };

            return (
                <span
                    className={`text-descripcion ${est.badge} `}
                >
                    <FontAwesomeIcon className={`bi me-1`} icon={est.icon} ></FontAwesomeIcon>
                    {est.texto}
                </span>
            );
        },
    },
    {
        label: 'Último Acceso',
        field: 'Último Acceso',

        render: row => {
            if (!row.ultimo_acceso)

                return(
            <div >
                <span className="td-numero" >
                    Sin ingresos
                </span>
            </div>)
            const fecha = new Date(row.ultimo_acceso);
            return (
                <div >
                    <span className="td-numero" >
                        {
                            fecha.toLocaleString('es-BO', { // 'es-BO' para Bolivia o 'es-ES' para general
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })
                        }
                    </span>
                </div>);
        },
        sortable: true
    }
];