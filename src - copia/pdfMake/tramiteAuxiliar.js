import createPdf from './base.js';

const reporteConsolidoTramiteAuxiliar = async (output, { tramite, ingresos = [], salidas = [] }) => {

    // Cálculos de totales
    const totalIngresos = ingresos.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const totalSalidas = salidas.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const saldo = totalIngresos - totalSalidas;

    const content = [
        // 1. ENCABEZADO PRINCIPAL
        {
            table: {
                widths: ['100%'],
                body: [[{
                    text: 'ESTADO DE CUENTA - RESUMEN DE TRÁMITE',
                    style: 'hc',
                    fillColor: '#343a40',
                    color: 'white',
                    margin: [0, 5, 0, 5]
                }]]
            },
            layout: 'noBorders'
        },

        { text: ' ', margin: [0, 5] },

        // 2. INFORMACIÓN DEL TRÁMITE
        {
            style: 'tableExample',
            table: {
                widths: ['auto', '*', 'auto', '*'],
                body: [
                    [
                        { text: 'CÓDIGO:', bold: true, fillColor: '#f2f2f2' }, { text: tramite.codigo },
                        { text: 'FECHA INGRESO:', bold: true, fillColor: '#f2f2f2' }, { text: new Date(tramite.fecha_ingreso).toLocaleDateString() }
                    ],
                    [
                        { text: 'CLIENTE:', bold: true, fillColor: '#f2f2f2' }, { text: tramite.cliente_nombre || 'S/D', colSpan: 3 }, {}, {}
                    ],
                    [
                        { text: 'DETALLE:', bold: true, fillColor: '#f2f2f2' }, { text: tramite.detalle, colSpan: 3 }, {}, {}
                    ],
                  
                ]
            },
            layout: 'lightHorizontalLines'
        },

        { text: 'DETALLE DE EGRESOS / GASTOS', style: 'nhcheader', margin: [0, 10, 0, 5], color: '#dc3545' },

        // 4. TABLA DE SALIDAS
        {
            table: {
                headerRows: 1,
                widths: ['auto', 'auto', '*', 'auto'],
                body: [
                    [
                        { text: 'N°', style: 'tProductsHeader', fillColor: '#ffebee' },
                        { text: 'FECHA', style: 'tProductsHeader', fillColor: '#ffebee' },
                        { text: 'CONCEPTO', style: 'tProductsHeader', fillColor: '#ffebee' },
                        { text: 'MONTO', style: 'tProductsHeader', fillColor: '#ffebee', alignment: 'right' }
                    ],
                    ...salidas.map(s => [
                        s.numero,
                        new Date(s.fecha_solicitud).toLocaleDateString(),
                        s.detalle,
                        { text: `CLP. ${parseFloat(s.monto).toFixed(2)}`, alignment: 'right' }
                    ]),
                    [
                        { text: 'TOTAL EGRESOS', colSpan: 3, bold: true, alignment: 'right' }, {}, {},
                        { text: `CLP. ${totalSalidas.toFixed(2)}`, bold: true, alignment: 'right', fillColor: '#f1f1f1' }
                    ]
                ]
            },
            layout: 'noBorders'
        },

        { text: ' ', margin: [0, 15] },

        // 5. RESUMEN FINAL (SALDO)
        {
            table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        { text: 'SALDO NETO (DISPONIBLE)', alignment: 'right', bold: true, fontSize: 12 },
                        {
                            text: `CLP. ${saldo.toFixed(2)}`,
                            style: 'hc',
                            fillColor: saldo >= 0 ? '#d4edda' : '#f8d7da',
                            color: saldo >= 0 ? '#155724' : '#721c24'
                        }
                    ]
                ]
            },
            layout: 'headerLineOnly'
        },

        { text: ' ', margin: [0, 20] },
        { text: '--- Fin del Reporte ---', style: 'piePagina', alignment: 'center' }
    ];

    return await createPdf({ content }, output);
};

export default reporteConsolidoTramiteAuxiliar;