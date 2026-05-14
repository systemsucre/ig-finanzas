import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const columns = [
    {
        label: 'ID',
        field: 'id',
        render: row => <div >
            <span className="td-descripcion" >
                {row.id}
            </span>
        </div>,
        sortable: true,
        width: '80px'
    },
    {
        label: 'CODIGO',
        field: 'codigo',
        render: row =>
            <div >
                <span className="td-descripcion" >
                    {row.codigo || 'S/N'}
                </span>
            </div>,
        sortable: true,
        width: '80px'
    },
    {
        label: 'Descripción del Trámite',
        field: 'tipo_tramite',
        render: row =>
            <div >
                <span className="td-numero" >
                    {row.tipo_tramite || 'S/N'}
                </span>
            </div>,
        sortable: true,
        wrap: true
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
        label: 'Fecha Registro',
        field: 'created_at',
        sortable: true,
        render: row => {
            if (!row.created_at) return '---';
            const fecha = new Date(row.created_at);
            return (
                  <div className="td-numero" >
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