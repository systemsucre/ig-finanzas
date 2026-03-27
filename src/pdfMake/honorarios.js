import createPdf from './base.js';

export const ticketHonorarioIndividual = async (output, honorario) => {
    // honorario: es el objeto que viene de tu consulta SQL 'listarPorTramite' en la tabla honorarios

    // console.log(honorario, ' honorarios')

    const montoFormateado = honorario?.monto ? parseFloat(honorario.monto).toFixed(2) : "0.00";
    const numeroRecibo = honorario?.numero || "S/N";

    const fechaCobro = honorario?.fecha_ingreso
        ? new Date(honorario.fecha_ingreso).toLocaleDateString('es-BO')
        : "---";

    const content = [
        // Encabezado
        {
            table: {
                widths: ['100%'],
                body: [
                    [{
                        text: 'RECIBO DE HONORARIOS PROFESIONALES',
                        style: 'hc',
                        fillColor: '#0056b3', // Azul para Honorarios (Diferencia visual de Ingresos)
                        color: 'white',
                        margin: [0, 5, 0, 5]
                    }]
                ]
            },
            layout: 'noBorders'
        },

        { text: ' ', margin: [0, 10] },

        // Datos del Recibo y Fecha
        { text: `Recibo N°: ${numeroRecibo}`, style: 'nhcheader' },
        { text: `Trámite Referencia: ${honorario.codigo_tramite}`, style: 'text', alignment: 'left', bold: true },
        { text: `Cliente: ${honorario.cliente}`, style: 'text', alignment: 'left', bold: true },

        { text: '_______________________________________________________________________________________________', color: '#dddddd', margin: [0, 5, 0, 10] },

        // Cuerpo del Recibo
         {
            text: [
                { text: 'Fecha de pago: ', style: 'tProductsHeader' },
                { text: fechaCobro, style: 'text' }
            ],
            margin: [0, 5, 0, 5]
        },
        {
            text: [
                { text: 'Por concepto de: ', style: 'tProductsHeader' },
                { text: honorario.descripcion, style: 'text' }
            ],
            margin: [0, 5, 0, 5]
        },
        {
            text: [
                { text: 'Método de Pago: ', style: 'tProductsHeader' },
                { text: honorario.tipo_pago || 'Efectivo', style: 'text' }
            ],
            margin: [0, 5, 0, 5]
        },
        {
            text: [
                { text: 'Profesional Responsable: ', style: 'tProductsHeader' },
                { text: honorario.usuario_nombre, style: 'text' }
            ],
            margin: [0, 5, 0, 15]
        },

        // Cuadro de Monto (Total de Honorarios)
        {
            table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        {
                            text: 'MONTO CANCELADO ',
                            alignment: 'right',
                            margin: [0, 8, 0, 8],
                            bold: true,
                            fontSize: 10
                        },
                        {
                            text: `Bs. ${montoFormateado}`,
                            style: 'hc',
                            fontSize: 12,
                            margin: [15, 8, 15, 8],
                            fillColor: '#f0f4f8'
                        }
                    ]
                ]
            },
            layout: 'lightHorizontalLines'
        },

        { text: ' ', margin: [0, 50] },

        // Firmas
        {
            columns: [
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'CONFORME PAGO', style: 'piePagina' },
                        { text: 'CLIENTE', style: 'piePagina' }
                    ]
                },
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'RECIBÍ CONFORME', style: 'piePagina' },
                        { text: 'ABOGADO / CONSULTOR', style: 'piePagina' }
                    ]
                }
            ]
        },
        {
            text: `Registro Digital: ${honorario.id}\nGenerado por el Sistema de Gestión Jurídica KR-Estudios`,
            style: 'piePagina',
            margin: [0, 30, 0, 0],
            color: '#bcbcbc',
            alignment: 'center'
        }
    ];

    const response = await createPdf({ content }, output);
    return response;
};

// export default ticketHonorarioIndividual;