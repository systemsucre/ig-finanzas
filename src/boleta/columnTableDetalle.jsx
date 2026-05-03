
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatearFechaYHora } from "../components/FormtaarFecha";
import { faCalendar, faListNumeric, faTimeline } from "@fortawesome/free-solid-svg-icons";



export const ColumnsTableDetalle = [
    {
        label: 'Fecha y Hora',
        field: 'fecha_solicitud',
        render: (row) => {
            const info = formatearFechaYHora(row.fecha_solicitud);
            return (
                <div className="movimiento-banco-wrapper">
                    {/* Cabecera con icono de calendario */}
                    <div className="fecha-header">
                        {/* <i className="bi bi-calendar3 me-2"></i> */}
                        <FontAwesomeIcon  className="me-2" icon={faCalendar} />
                        {info.fechaLarga}
                        {/* Hora (solo se muestra si existe) */}
                        {info.hora && (
                            <div className="hora-detalle">

                                {info.hora}
                            </div>
                        )}
                    </div>


                </div>
            );
        }
    },
    {
        label: 'Detalle',
        field: 'detalle',
        render: (row) => (
            <div className="td-descripcion">
                {row.detalle || "Giro Cajero Automático"}
            </div>
        )
    },
    {
        label: 'Caja',
        field: 'codigo',
        render: (row) => (
            <div className="td-detalle">
                {row.codigo_tramite && <span className="ms-2">{row.codigo_tramite}</span>}  
            </div>
        )
    },
        {
        label: 'Numero Boleta',
        field: 'numero_boleta',
        render: (row) => (
            <div className="td-numero">
                <span className="ms-2">{row.numero}</span>
            </div>
        )
    },

    {
        label: 'Monto',
        field: 'monto',
        render: (row) => {
            // Lógica de color: si es egreso rojo, si es ingreso verde
            const esEgreso = row.estado === 4 || row.monto < 0;
            const colorMonto = esEgreso ? '#e53e3e' : '#38a169';
            const prefijo = esEgreso ? '-' : '';

            return (
                <div className="td-monto" style={{ color: colorMonto }}>
                    {prefijo}{row.simbolo} {Math.abs(row.monto).toLocaleString('es-CL')}
                </div>
            );
        }
    }
];