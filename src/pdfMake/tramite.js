import createPdf from './base.js';

const cleanNum = (val) => {
    if (!val) return 0;
    // Extrae solo el primer número válido que encuentre
    const match = String(val).match(/-?\d+\.?\d*/);
    return match ? parseFloat(match[0]) : 0;
};

const reporteConsolidoTramite = async (output, { tramite, ingresos = [], salidas = [] }) => {

    // Cálculos de totales
    const totalIngresos = ingresos.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const totalSalidas = salidas.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const saldo = totalIngresos - totalSalidas;

    // console.log(salidas, ' lista de salidas del tramite')

    const content = [
        // 1. ENCABEZADO PRINCIPAL
        {
            table: {
                widths: ['100%'],
                body: [[{
                    text: 'ESTADO DE CUENTA - RESUMEN DE CAJA',
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
                        { text: 'CÓDIGO CAJA:', bold: true, fillColor: '#f2f2f2' }, { text: tramite.codigo },
                        { text: ' NUMERO CAJA:', bold: true, fillColor: '#f2f2f2' }, { text: tramite.numero }
                    ],
                    // [
                    //     { text: 'CLIENTE:', bold: true, fillColor: '#f2f2f2' }, { text: tramite.cliente_nombre || 'S/D', colSpan: 3 }, {}, {}
                    // ],
                    [
                        { text: 'DETALLE:', bold: true, fillColor: '#f2f2f2' }, { text: tramite.detalle, colSpan: 3 }, {}, {}
                    ],
                    [
                        { text: 'FECHA INGRESO: ', bold: true, fillColor: '#f2f2f2' }, { text: new Date(tramite.fecha_ingreso).toLocaleDateString(), colSpan: 3 }, {}, {}
                    ]
                ]
            },
            layout: 'lightHorizontalLines'
        },
        { text: 'DETALLE DE INGRESOS', style: 'nhcheader', margin: [0, 15, 0, 5], color: '#28a745' },

        // 3. TABLA DE INGRESOS


        {
            table: {
                headerRows: 1,
                widths: ['auto', '25%', 'auto', '*', 'auto'],
                body: [
                    [
                        { text: 'N°', style: 'tProductsHeader', fillColor: '#e8f5e9' },
                        { text: 'EMPLEADOR', style: 'tProductsHeader', fillColor: '#e8f5e9' },
                        { text: 'FECHA', style: 'tProductsHeader', fillColor: '#e8f5e9' },
                        { text: 'CONCEPTO', style: 'tProductsHeader', fillColor: '#e8f5e9' },
                        { text: 'MONTO', style: 'tProductsHeader', fillColor: '#e8f5e9', alignment: 'right' }
                    ],
                    // FILAS DE DATOS CON FUENTE PEQUEÑA
                    ...ingresos.map(i => [
                        { text: i.numero || '-', fontSize: 8 },
                        { text: i?.cliente_nombre || 's/e', fontSize: 8 },
                        { text: new Date(i.fecha_ingreso).toLocaleDateString(), fontSize: 8 },
                        { text: i.detalle || '', fontSize: 8 },
                        { text: `${localStorage.getItem('moneda')} ${cleanNum(i.monto).toFixed(2)}`, alignment: 'right', fontSize: 8 }
                    ]),
                    // FILA DE TOTALES
                    [
                        {
                            text: 'TOTAL INGRESOS',
                            colSpan: 4,
                            bold: true,
                            alignment: 'right',
                            fontSize: 9
                        }, {}, {}, {},
                        {
                            text: `${localStorage.getItem('moneda')} ${totalIngresos.toFixed(2)}`,
                            bold: true,
                            alignment: 'right',
                            fillColor: '#f1f1f1',
                            fontSize: 9
                        }
                    ]
                ]
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 10]
        },
        { text: 'DETALLE DE EGRESOS / GASTOS', style: 'nhcheader', margin: [0, 10, 0, 5], color: '#dc3545' },

        // 4. TABLA DE SALIDAS
        {
            table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', '*', 'auto'],
                body: [
                    [
                        { text: 'N°', style: 'tProductsHeader', fillColor: '#ffebee' },
                        { text: 'BOLETA', style: 'tProductsHeader', fillColor: '#ffebee' },
                        { text: 'FECHA', style: 'tProductsHeader', fillColor: '#ffebee' },
                        { text: 'CONCEPTO', style: 'tProductsHeader', fillColor: '#ffebee' },
                        { text: 'MONTO', style: 'tProductsHeader', fillColor: '#ffebee', alignment: 'right' }
                    ],
                    ...salidas.map(s => [
                        // APLICAMOS EL FONTSIZE PEQUEÑO AQUÍ:
                        { text: s.numero || '-', fontSize: 8 },
                        { text: s.codigo_boleta || '-', fontSize: 8 },

                        { text: s.fecha_solicitud ? new Date(s.fecha_solicitud).toLocaleDateString() : '-', fontSize: 9 },
                        { text: s.detalle || '', fontSize: 9 },
                        { text: `${localStorage.getItem('moneda')} ${cleanNum(s.monto).toFixed(2)}`, alignment: 'right', fontSize: 9 }
                    ]),
                    [
                        { text: 'TOTAL EGRESOS', colSpan: 4, bold: true, alignment: 'right', fontSize: 10 }, {}, {}, {},
                        { text: `${localStorage.getItem('moneda')} ${totalSalidas.toFixed(2)}`, bold: true, alignment: 'right', fillColor: '#f1f1f1', fontSize: 10 }
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
                            text: `${localStorage.getItem('moneda')} ${saldo.toFixed(2)}`,
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

export default reporteConsolidoTramite;