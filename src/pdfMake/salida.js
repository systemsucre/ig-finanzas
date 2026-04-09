import createPdf from './base.js';

const ticketSalidaIndividual = async (output, { salida }) => {
    // console.log(salida, ' fecha solicitud')

    const montoFormateado = salida?.monto ? parseFloat(salida.monto).toFixed(2) : "0.00";
    const numeroSalida = salida?.numero || "S/N";

    const estados = { 1: 'SOLICITADO', 2: 'APROBADO', 3: 'REGISTRADO', 4: 'RECHAZADO' };
    const estado = salida.estado
    const content = [
        // Encabezado con Estilo
        {
            table: {
                widths: ['100%'],
                body: [
                    [{
                        text: 'COMPROBANTE DE EGRESO',
                        style: 'hc',
                        fillColor: estado === 1 ? '#6c757d' : estado === 2 ? '#17a2b8' : estado === 3 ? '#28a745' : estado === 4 ? '#dc3545' : '', // Color secondary
                        color: 'white',
                        margin: [0, 5, 0, 5]
                    }]
                ]
            },
            layout: 'noBorders'
        },

        { text: ' ', margin: [0, 10] },

        // Datos del Trámite y Fecha

        { text: `N° BOLETA: ${salida?.numero_boleta}`, style: 'tHeaderLabel' },
        { text: `CODIGO BOLETA: ${salida?.codigo_boleta}`, style: 'tHeaderLabel' },
      
        { text: '_______________________________________________________________________________________________', color: '#eeeeee', margin: [0, 5, 0, 10] },

        {
            columns: [
                { text: `N° Salida: ${numeroSalida}`, style: 'nhcheader' },
                // { text: `Fecha: ${fechaSalida}`, style: 'tHeaderLabel' }
            ]
        },
        { text: `Caja Ref: ${salida.codigo_tramite}`, style: 'text', alignment: 'left' },

        { text: '_______________________________________________________________________________________________', color: '#eeeeee', margin: [0, 5, 0, 10] },

        // Cuerpo del Recibo
        {
            text: [
                { text: 'Concepto: ', style: 'tProductsHeader' },
                { text: salida.detalle, style: 'text' }
            ],
            margin: [0, 5, 0, 5]
        },
        {
            text: [
                { text: 'Regiistrado por: ', style: 'tProductsHeader' },
                { text: salida.usuario_nombre, style: 'text' }
            ],
            margin: [0, 5, 0, 5]
        },

        {
            columns: [
                { text: 'Estado: ', style: 'tProductsHeader', width: 'auto', margin: [0, 5, 5, 0] },
                {
                    table: {
                        body: [[
                            {
                                text: estados[salida.estado] || 'UNDEFINED',
                                style: 'text',
                                bold: true,
                                color: 'white', // Texto en blanco para que resalte
                                margin: [5, 2, 5, 2] // Padding interno
                            }
                        ]]
                    },
                    layout: 'noBorders',
                    // Aplicamos el color de fondo dinámico aquí
                    fillColor: salida.estado === 1 ? '#6c757d' :
                        salida.estado === 2 ? '#17a2b8' :
                            salida.estado === 3 ? '#28a745' :
                                salida.estado === 4 ? '#dc3545' : '#eeeeee',
                    width: 'auto'
                },
                { text: '', width: '*' } // Espaciador para que no ocupe todo el ancho
            ],
            margin: [0, 5, 0, 5]
        },

        {
            text: [
                { text: 'Fecha registro: ', style: 'tProductsHeader' },
                { text: salida.fecha_solicitud?.split('T')[0] || '---', style: 'text', bold: true }
            ],
            margin: [0, 5, 0, 5]
        },
       

        // Cuadro de Monto
        {
            table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        { text: estado === 1 ? 'TOTAL REGISTRADO' : estado === 2 ? ' TOTAL APROBADO' : estado === 3 ? 'TOTAL DESPACHADO' : estado === 4 ? 'TOTAL RECHAZADO' : 'MONTO SIN IDENTIFICACION', alignment: 'right', margin: [0, 5, 0, 5], bold: true },
                        { text: `${salida.simbolo} ${montoFormateado}`, style: 'hc', margin: [10, 5, 10, 5], fillColor: '#f8f9fa' }
                    ]
                ]
            },
            layout: 'lightHorizontalLines'
        },

        { text: ' ', margin: [0, 30] },

        // Firmas
        {
            columns: [
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'ENTREGUÉ CONFORME', style: 'piePagina' },
                        { text: 'CAJERO', style: 'piePagina' }
                    ]
                },
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'RECIBÍ CONFORME', style: 'piePagina' },
                        { text: 'CI / FIRMA', style: 'piePagina' }
                    ]
                }
            ]
        }
    ];

    const response = await createPdf({ content }, output);
    return response
};

export default ticketSalidaIndividual;