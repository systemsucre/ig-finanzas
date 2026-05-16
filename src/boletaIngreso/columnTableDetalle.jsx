
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatearFechaYHora } from "../components/FormtaarFecha";
import { faCalendar, faListNumeric, faTimeline } from "@fortawesome/free-solid-svg-icons";



export const ColumnsTableDetalle = [
    {
        label: 'Fecha',
        field: 'fecha_solicitud',
        render: (row) => {
            const info = formatearFechaYHora(row.fecha_solicitud);
            return (
                <div className="movimiento-banco-wrapper">
                    {/* Cabecera con icono de calendario */}
                    <div className="fecha-header">
                        {/* <i className="bi bi-calendar3 me-2"></i> */}
                        <FontAwesomeIcon className="me-2" icon={faCalendar} />
                        {info.fechaLarga}
                    </div>
                </div>
            );
        }
    },

    {
        label: 'CLIENTE/EMPLEADOR',
        field: 'cliente_nombre',
        render: (row) => (
            <div >
                <div className="td-numero">
                    {row.cliente_nombre}
                </div>
                
            </div>
        )
    },
    {
        label: 'CAJA',
        field: 'codigo',
        render: (row) => (
            <div >
                <div className="td-descripcion">
                    {row.codigo_tramite}
                </div>
                <div
                    className="td-numero"
                >
                    {row.detalle_tramite}
                </div>
            </div>
        )
    },
    {
        label: 'Detalle',
        field: 'detalle',
        render: (row) => (
            <div className="td-numero">
                {row.detalle || "Giro Cajero Automático"}
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
                <div className="td-descripcion" style={{ color: colorMonto }}>
                    {prefijo}{row.simbolo} {Math.abs(row.monto)}
                </div>
            );
        }
    }
];