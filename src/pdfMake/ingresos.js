import createPdf from './base.js';

const ticketIngresoIndividual = async (output, { ingreso }) => {
    // ingreso: es el objeto que viene de tu consulta SQL 'listarPorTramite'
    
    const montoFormateado = ingreso?.monto ? parseFloat(ingreso.monto).toFixed(2) : "0.00";
    const numeroIngreso = ingreso?.numero || "S/N";
    
    // Usamos fecha_ingreso de la tabla ingresos
    const fechaIngreso = ingreso?.fecha_ingreso
        ? new Date(ingreso.fecha_ingreso).toLocaleDateString()
        : "---";

    const content = [
        // Encabezado
        {
            table: {
                widths: ['100%'],
                body: [
                    [{
                        text: 'COMPROBANTE DE INGRESO',
                        style: 'hc',
                        fillColor: '#28a745', // Verde para ingresos
                        color: 'white',
                        margin: [0, 5, 0, 5]
                    }]
                ]
            },
            layout: 'noBorders'
        },

        { text: ' ', margin: [0, 10] },

        // Datos del Trámite y Fecha
        {
            columns: [
                { text: `N° Control: ${numeroIngreso}`, style: 'nhcheader' },
                { text: `Fecha Ingreso: ${fechaIngreso}`, style: 'tHeaderLabel' }
            ]
        },
        { text: `Trámite Ref: ${ingreso.codigo_tramite}`, style: 'text', alignment: 'left' },

        { text: '_______________________________________________________________________________________________', color: '#eeeeee', margin: [0, 5, 0, 10] },

        // Cuerpo del Recibo
        {
            text: [
                { text: 'Concepto / Detalle: ', style: 'tProductsHeader' },
                { text: ingreso.detalle, style: 'text' }
            ],
            margin: [0, 5, 0, 5]
        },
        {
            text: [
                { text: 'Tipo de Ingreso: ', style: 'tProductsHeader' },
                { text: ingreso.tipo || 'General', style: 'text' }
            ],
            margin: [0, 5, 0, 5]
        },
        {
            text: [
                { text: 'Registrado por: ', style: 'tProductsHeader' },
                { text: ingreso.usuario_nombre, style: 'text' }
            ],
            margin: [0, 5, 0, 15]
        },

        // Cuadro de Monto
        {
            table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        { 
                            text: 'TOTAL RECIBIDO', 
                            alignment: 'right', 
                            margin: [0, 5, 0, 5], 
                            bold: true 
                        },
                        { 
                            text: `Bs. ${montoFormateado}`, 
                            style: 'hc', 
                            margin: [10, 5, 10, 5], 
                            fillColor: '#f8f9fa' 
                        }
                    ]
                ]
            },
            layout: 'lightHorizontalLines'
        },

        { text: ' ', margin: [0, 40] },

        // Firmas
        {
            columns: [
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'ENTREGUÉ CONFORME', style: 'piePagina' },
                        { text: 'CLIENTE / INTERESADO', style: 'piePagina' }
                    ]
                },
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'RECIBÍ CONFORME', style: 'piePagina' },
                        { text: 'CAJA - RECIPCIÓNERA', style: 'piePagina' }
                    ]
                }
            ]
        },
        {
            text: `ID Transacción: ${ingreso.id}`,
            style: 'piePagina',
            margin: [0, 20, 0, 0],
            color: '#bcbcbc',
            alignment: 'left'
        }
    ];

    const response = await createPdf({ content }, output);
    return response;
};

export default ticketIngresoIndividual;