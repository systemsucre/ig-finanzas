import { faCheckCircle, faX, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const columns = [
    {
        label: 'Nombre Completo',
        field: 'Nombre Completo',
        render: (row) => ( 
            <div >
                <span className="td-descripcion" >
                    {row.nombre_completo}
                </span>
            </div>
        ),
        sortable: true,
        wrap: true
    },
    {
        label: 'CI',
        field: 'CI',
        render: row =>
            <div >
                <span className="td-descripcion" >
                    {row.ci || 'S/N'}
                </span>
            </div>,
        sortable: true
    },
    {
        label: 'Celular',
        field: 'Celular',
        render: row => 
        <div >
            <span className="td-numero" >
                {row.celular || 'S/N'}
            </span>
        </div>,
        sortable: true
    },
    {
        label: 'Dirección',
        field: 'Dirección',
        render: row => <div >
            <span className="td-numero" >
                {row.direccion || 'S/N'}
            </span>
        </div>,
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
    window.innerWidth > 877 ?
        {
            label: 'Fecha Registro',
            field: 'Fecha Registro',
            sortable: true,
            render: row =>

                <div className="td-numero" >
                    {
                        new Date(row.created_at).toLocaleDateString('es-BO', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                </div>

        } : {},
    window.innerWidth > 877 ?
        {
            label: 'Monto Total Ingresos',
            field: 'total_ingresos',
            render: (row) => {
                // Lógica de color: si es egreso rojo, si es ingreso verde
                const esEgreso = row.total_ingresos < 1000;
                const colorMonto = esEgreso ? '#e53e3e' : '#38a169';
                const prefijo = esEgreso ? '-' : '';

                return (<>
                    <div className="td-descripcion" style={{ color: colorMonto }}>
                        Bs. {Number(row.total_ingresos || 0).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}

                    </div>
                    <div className="td-numero" >
                        <span >{row.total_tramites}</span>{row.total_tramites > 1 ? " Tramites" : " Trámite"}
                    </div>
                </>
                );
            }
        } :

        {
            label: '',
            field: 'total_ingresos',
            render: (row) => {
                // Lógica de color: si es egreso rojo, si es ingreso verde
                const esEgreso = row.total_ingresos < 1000;
                const colorMonto = esEgreso ? '#e53e3e' : '#38a169';
                const prefijo = esEgreso ? '-' : '';

                return (<>
                    <div className="td-monto" style={{ color: colorMonto }}>
                        Bs. {Number(row.total_ingresos || 0).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                    <div className="td-monto td-numero" style={{ marginTop: '2.5rem' }}>
                        <span >ingreso Cliente</span>
                    </div>
                </>

                );
            }
        }
];