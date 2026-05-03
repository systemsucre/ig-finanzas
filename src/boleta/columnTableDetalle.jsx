// export const ColumnsTableDetalle = [

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatearFechaYHora } from "../components/FormtaarFecha";
import { faCalendar, faListNumeric, faTimeline } from "@fortawesome/free-solid-svg-icons";




//     {
//         label: 'Código Caja',
//         field: 'codigo',
//         render: (row) =>
//             <div> <span className="fw-bold text-primary">{row.codigo_tramite}</span></div>
//     },
//     {
//         label: 'NUMERO',
//         field: 'numero',
//         render: (row) => {
//             return (
//                 <div className={`fw-bold  text-dark `} style={{}}>
//                     {row.numero}
//                 </div>
//             );
//         },
//     },
//     {
//         label: 'Detalle del Gasto',
//         field: 'detalle',
//         render: (row) => {
//             return (
//                 <div className="small text-secondary">
//                     {row.detalle?.length < 20 ?
//                         <div className="text-dark">{row.detalle}</div> :
//                         <small className="text-muted" style={{ fontSize: '0.7rem' }}>
//                             {row.detalle?.substring(0, 40)}...
//                         </small>
//                     }
//                 </div>
//             );
//         }
//     },
//     {
//         label: 'Fecha',
//         field: 'fecha_solicitud',
//         render: (row) => (
//             <div >
//                 <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
//                     {row.fecha_solicitud?.split('T')[0]}
//                 </span>
//             </div>
//         )
//     },
//     {
//         label: 'Monto',
//         field: 'monto',
//         render: (row) => (
//             <div >
//                 <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
//                     {row.simbolo} {row.monto}
//                 </span>
//             </div>
//         )
//     },

//     {
//         label: 'Estado Item',
//         field: 'estado',
//         render: (row) => {
//             const estados = {
//                 1: { badge: 'bgss-secondary text-dark', texto: 'SOLICITADO', icon: 'bi-hourglass-split' },
//                 2: { badge: 'bg-info text-white', texto: 'APROBADO', icon: 'bi-check-circle' },
//                 3: { badge: ' text-success', texto: 'REGISTRADO', icon: 'bi-cash-stack' },
//                 4: { badge: 'bg-danger text-white', texto: 'RECHAZADO', icon: 'bi-x-circle' }
//             };

//             const est = estados[row.estado] || { badge: 'bg-secondary', texto: 'DESCONOCIDO', icon: 'bi-question' };

//             return (

//                 <div >
//                     {est.texto}
//                 </div>

//             );
//         },

//     },
//     {
//         label: '',
//         field: 'estado',
//         render:

//             (row) => {
//                 <div >
//                     00000
//                 </div>
//             }
//     },

// ];


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