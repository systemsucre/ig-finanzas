import createPdf from './base.js';

const ticketBoleta = async (output, { itemsBoleta }) => {
    // Tomamos la cabecera del primer item (como en el JSX)
    const infoCabecera = itemsBoleta && itemsBoleta.length > 0 ? itemsBoleta[0] : {};
    // console.log(infoCabecera)

    const numeroBoleta = infoCabecera?.numero_boleta || "S/C";
    const codigoBoleta = infoCabecera?.codigo_boleta || "S/N";

    // Configuración de Colores según estado (Igual al JSX)
    const colorEstado = infoCabecera.estado === 3 ? '#28a745' : '#ffc107';
    const bgEstado = infoCabecera.estado === 3 ? '#dcfce7' : '#fef9c3';
    const textEstadoColor = infoCabecera.estado === 3 ? '#166534' : '#854d0e';
    const textoEstado = infoCabecera.estado === 3 ? 'TRANSACCIÓN FINALIZADA' : 'PENDIENTE DE DESPACHO';

    const content = [
        // 1. ENCABEZADO PRINCIPAL (TIPO BANNER)
        {
            table: {
                widths: ['*'],
                body: [
                    [{
                        stack: [
                            { text: 'COMPROBANTE DE BOLETA', style: 'hc', color: 'white' },
                            // { text: `BOLETA: ${numeroBoleta}`, fontSize: 14, bold: true, color: 'white', margin: [0, 5, 0, 0] }
                        ],
                        fillColor: '#2c3e50',
                        margin: [20, 10, 20, 10],
                        alignment: 'center'
                    }]
                ]
            },
            layout: 'noBorders'
        },

        // 2. ETIQUETA DE ESTADO (BADGE)
        {
            canvas: [{ type: 'rect', x: 180, y: 5, w: 200, h: 20, r: 5, fillColor: bgEstado, lineColor: colorEstado }],
            absolutePosition: { x: 15, y: 71 }
        },
        { text: textoEstado, color: textEstadoColor, bold: true, fontSize: 8, alignment: 'center', margin: [0, 10, 0, 10] },

        // 3. SECCIÓN DE INFORMACIÓN DE FIRMAS (3 COLUMNAS)
        { text: 'NUMERO BOLETA: ' + numeroBoleta || '---', bold: true },
        { text: 'CODIGO BOLETA: ' + codigoBoleta || '---', bold: true },

        // {
        //     columns: [
        //         {
        //             stack: [
        //                 { text: 'SOLICITANTE', style: 'tProductsHeader', color: '#4e73df' },
        //                 { text: infoCabecera?.solicitado_por || '---', bold: true },
        //                 { text: infoCabecera?.fecha_solicitud?.split('T')[0] || '---', fontSize: 8, color: 'gray' }
        //             ]
        //         },
        //         {
        //             stack: [
        //                 { text: 'AUTORIZACIÓN', style: 'tProductsHeader', color: '#4e73df' },
        //                 { text: infoCabecera?.autorizado_por || '---', bold: true },
        //                 { text: infoCabecera?.fecha_aprobacion?.split('T')[0] || '---', fontSize: 8, color: 'gray' }
        //             ]
        //         },
        //         {
        //             stack: [
        //                 { text: 'DESPACHO', style: 'tProductsHeader', color: '#4e73df' },
        //                 { text: infoCabecera?.despachado_por || '---', bold: true },
        //                 { text: infoCabecera?.fecha_despacho?.split('T')[0] || '---', fontSize: 8, color: 'gray' }
        //             ]
        //         }
        //     ],
        //     margin: [0, 10, 0, 20]
        // },

        // 4. TABLA DE ITEMS (DETALLE FINANCIERO)
        {
            table: {
                headerRows: 1,
                widths: [55,100, '*',  50],
                body: [
                    // Header de la Tabla
                    [
                        { text: 'CAJA', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white' },
                        { text: 'NUMERO', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white' },
                        { text: 'DETALLE ITEM', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white' },
                        { text: 'MONTO SOLICITADO', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white', alignment: 'right' }
                    ],
                    // Filas de Items
                    ...itemsBoleta.map(item => [
                        { text: item.codigo_tramite, fontSize: 8, color: '#4e73df' },
                        { text: item.numero, alignment: 'center', fontSize: 9 },
                        { text: item.detalle, bold: true, fontSize: 10 },
                        { text: `${parseFloat(item.monto).toFixed(2)} Bs.`, alignment: 'right', bold: true, fontSize: 10 }
                    ])
                ]
            },
            layout: {
                hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5,
                vLineWidth: () => 0,
                hLineColor: (i) => (i === 0 || i === 1) ? '#2c3e50' : '#eeeeee',
                paddingLeft: () => 5,
                paddingRight: () => 5,
                paddingTop: () => 8,
                paddingBottom: () => 8,
            }
        },

        // 5. TOTAL FINAL
        {
            table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        { text: 'TOTAL BOLETA:', alignment: 'right', bold: true, margin: [0, 10, 0, 0] },
                        {
                            text: `${itemsBoleta.reduce((acc, item) => acc + parseFloat(item.monto), 0).toFixed(2)} Bs.`,
                            style: 'hc',
                            fillColor: '#f8f9fa',
                            margin: [10, 10, 10, 10],
                            fontSize: 14
                        }
                    ]
                ]
            },
            layout: 'noBorders'
        },

        { text: ' ', margin: [0, 40] },

        // 6. SECCIÓN DE FIRMAS (ESTILO FORMAL)
        {
            columns: [
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'ENTREGUÉ CONFORME', style: 'piePagina' },
                        { text: 'CAJERO / ADMINISTRACIÓN', style: 'piePagina' }
                    ]
                },
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'RECIBÍ CONFORME', style: 'piePagina' },
                        { text: 'CI / FIRMA BENEFICIARIO', style: 'piePagina' }
                    ]
                }
            ]
        }
    ];

    const response = await createPdf({ content }, output);
    return response;
};

export default ticketBoleta;