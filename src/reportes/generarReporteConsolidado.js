import ExcelJS from 'exceljs';

export const generarReporteResumen = async (data, filtros, ) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('CONSOLIDADO GLOBAL');




    // 1. TÍTULO Y FECHAS DEL FILTRO
    sheet.mergeCells('A1:I1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'REPORTE CONSOLIDADO DE CAJAS - IG FINANZAS';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } };

    sheet.addRow([
        `RANGO DE CONSULTA: ${filtros.desde || 'Inicio'} hasta ${filtros.hasta || 'Hoy'}`,
        '', '', '', '', '', '',
        `FECHA GEN: ${new Date().toLocaleDateString()}`
    ]);
    sheet.addRow([]); // Espacio

    // 2. ENCABEZADOS DE LA TABLA MAESTRA
    const headers = [
        'CÓDIGO',
        'NUMERO',
        'TIPO CAJA',
        'DETALLE',
        'FECHA ING.',
        // 'COSTO PACTADO',
        'INGRESOS (PERIODO)',
        'GASTOS (PERIODO)',
        'SALDO (PERIODO)',
        'ESTADO CAJA'
    ];
    const headerRow = sheet.addRow(headers);
    sheet.mergeCells('A2:C2');
    sheet.mergeCells('I2:J2');

    // Estilo de encabezados
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C3E50' } };
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // 3. CARGA DE DATOS (MILES DE TRÁMITES)
    let totalCosto = 0;
    let totalIngresos = 0;
    let totalGastos = 0;

    data.forEach(item => {
        const ingresos = parseFloat(item.total_ingresos) || 0;
        const gastos = parseFloat(item.total_gastos) || 0;
        const saldo = parseFloat(item.saldoDisponible) || 0;
        const costo = parseFloat(item.costo) || 0;

        const row = sheet.addRow([
            item.codigo,
            item.numero,
            item.nombre_tipo_tramite,
            item.detalle,
            item.fecha_ingreso?.split('T')[0] || '-',
            // parseInt(localStorage.getItem('numRol')) === 4 ? 0.0 : costo,
            ingresos ,
            gastos,
            saldo,
            item.estado === 1 ? 'EN CURSO' : item.estado === 2 ? 'PARALIZADO' : 'FINALIZADO'
        ]);

        // Formato numérico para las columnas de dinero (F, G, H, I)
        // [6, 7, 8, 9].forEach(col => {
        //     row.getCell(col).numFmt = `#,##0.00 "${data[0].simbolo}"`;
        // });

        // Color condicional para el saldo
        row.getCell(9).font = { color: { argb: saldo < 0 ? '943126' : '145A32' }, bold: true };

        // Acumuladores para el gran total
        totalCosto += costo;
        totalIngresos += ingresos;
        totalGastos += gastos;
    });

    // 4. FILA DE TOTALES GENERALES
    sheet.addRow([]);
    const totalRow = sheet.addRow([
        '', '', '', 'TOTALES GENERALES', '',
        // totalCosto,
        totalIngresos,
        totalGastos,
        (totalIngresos - totalGastos),
        ''
    ]);

    totalRow.eachCell((cell, colNumber) => {
        if (colNumber >= 4) {
            cell.font = { bold: true, size: 12 };
            if (colNumber >= 6 && colNumber <= 9) cell.numFmt = `#,##0.00 "${data[0].simbolo}"`;
        }
    });

    // Configuración de anchos
    sheet.columns = [
        { width: 15 }, { width: 10 }, { width: 20 }, { width: 40 },
        { width: 15 }, { width: 18 }, { width: 18 }, { width: 18 },
        { width: 18 }, { width: 15 }
    ];

    // 5. DESCARGA
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Consolidado_General_${new Date().getTime()}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
};