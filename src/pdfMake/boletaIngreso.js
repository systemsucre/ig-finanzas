import { name } from '../Auth/config.js';
import createPdf from './base.js';

const ticketBoletaIngreso = async (output, { itemsBoleta }) => {
    // Tomamos la cabecera del primer item (como en el JSX)
    const infoCabecera = itemsBoleta && itemsBoleta.length > 0 ? itemsBoleta[0] : {};
    // console.log(infoCabecera)

    const numeroBoleta = infoCabecera?.numero_boleta || "S/C";
    const codigoBoleta = infoCabecera?.codigo_boleta || "S/N";
    const cliente = infoCabecera?.cliente_nombre || "S/N";
    const caja = itemsBoleta[0]?.codigo_tramite || "S/N";
    const fecha = itemsBoleta[0]?.fecha_solicitud?.split('T')[0] || "S/N";

    // Configuración de Colores según estado (Igual al JSX)
    const colorEstado = infoCabecera.estado === 2 ? '#28a745' : '#ffc107';
    const bgEstado = infoCabecera.estado === 2 ? '#dcfce7' : '#fef9c3';
    const textEstadoColor = infoCabecera.estado === 2 ? '#166534' : '#854d0e';
    const textoEstado = infoCabecera.estado === 2 ? 'TRANSACCIÓN FINALIZADA' : 'PENDIENTE DE DESPACHO';

    const content = [
        // 1. ENCABEZADO PRINCIPAL (TIPO BANNER)
        {
            table: {
                widths: ['100%'],
                body: [[{
                    text: 'REPORTE ' + name,
                    style: 'header',
                    // fillColor: '#343a40',
                    color: '#1e5f3b',
                    margin: [0, 5, 0, 5]
                }]]
            },
            layout: 'noBorders'
        },
        {
            table: {
                widths: ['*'],
                body: [
                    [{
                        stack: [
                            { text: 'COMPROBANTE DE BOLETA DE INGRESO', style: 'hc', color: 'white' },
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
            canvas: [{ type: 'rect', x: 180, y: 30, w: 200, h: 20, r: 5, fillColor: bgEstado, lineColor: colorEstado }],
            absolutePosition: { x: 15, y: 71 }
        },
        { text: textoEstado, color: textEstadoColor, bold: true, fontSize: 8, alignment: 'center', margin: [0, 10, 0, 10] },

        // 3. SECCIÓN DE INFORMACIÓN DE FIRMAS (3 COLUMNAS)
        { text: 'NUMERO BOLETA: ' + numeroBoleta || '---', bold: true },
        { text: 'BOLETA: ' + codigoBoleta || '---', bold: true },
        { text: 'Fecha: ' + fecha || '---', bold: true },
        { text: 'CAJA: ' + caja || '---', margin: [0, 10, 0, 0] },
        { text: 'CLIENTE: ' + cliente || '---',margin: [0, 0, 0, 10] },


        // 4. TABLA DE ITEMS (DETALLE FINANCIERO)
        {
            table: {
                headerRows: 1,
                widths: [ '*', 70],
                body: [
                    // Header de la Tabla
                    [
                        { text: 'DETALLE ITEM', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white' },
                        { text: 'MONTO SOLICITADO', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white', alignment: 'right' }
                    ],
                    // Filas de Items
                    ...itemsBoleta.map(item => [
                        { text: item.detalle, bold: true, fontSize: 10 },
                        { text: `${parseFloat(item.monto).toFixed(2)} ${item.simbolo}`, alignment: 'right', bold: true, fontSize: 10 }
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
                        { text: 'TOTAL ITEMS:', alignment: 'right', bold: true, margin: [0, 10, 0, 0] },
                        {
                            text: ` ${itemsBoleta.reduce((acc, item) => acc + 1, 0)}`,
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

        {
            table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        { text: 'TOTAL BOLETA:', alignment: 'right', bold: true, margin: [0, 10, 0, 0] },
                        {
                            text: `${itemsBoleta.reduce((acc, item) => acc + parseFloat(item.monto), 0).toFixed(2)} ${itemsBoleta[0].simbolo}`,
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

export default ticketBoletaIngreso;