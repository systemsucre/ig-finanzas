






import ExcelJS from 'exceljs';

export const generarReporteFinanciero = async (tipoReporte, data, tramiteInfo, filtros, ) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'System Sucre - 71166513';

    const sheet = workbook.addWorksheet('REPORTE', {
        pageSetup: { paperSize: 9, orientation: 'landscape' },
        properties: { tabColor: { argb: '1bbec0' } }
    });





    // 1. TÍTULO DEL REPORTE
    sheet.mergeCells('A1:E1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `REPORTE DE ${tipoReporte} - ${localStorage.getItem('entidad')}`;
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } };

    sheet.addRow([]);

    // 2. BLOQUE DE INFORMACIÓN (Ajustado para evitar saltos dobles)
    // Siempre escribimos el encabezado de sección para mantener la estructura simétrica
    sheet.mergeCells('A2:B2');
    const infoHeader = sheet.getCell('A2');
    infoHeader.value = `INFORMACIÓN DE CAJA`;
    infoHeader.font = { name: 'Arial', size: 10, bold: true, color: { argb: '1B4F72' } };

    // Usamos addRow de forma secuencial sin saltos manuales innecesarios
    sheet.addRow(['CÓDIGO:', tramiteInfo.codigo, '', 'FECHA REPORTE:', new Date().toLocaleDateString()]);
    sheet.addRow(['CLIENTE:', tramiteInfo.cliente_nombre, '', 'TIPO:', tramiteInfo.nombre_tipo_tramite]);
    sheet.addRow(['COSTO ESTIMADO:', parseInt(localStorage.getItem('numRol')) === 4 ? '0.0' : 'BS. ' + parseFloat(tramiteInfo.costo).toFixed(2), '', 'SALDO DISP.:', 'BS. ' + parseFloat(tramiteInfo.saldoDisponible).toFixed(2)]);
    sheet.addRow(['DETALLE:', tramiteInfo.detalle]);
    sheet.addRow(['FECHA INGRESO:', tramiteInfo.fecha_ingreso?.split('T')[0], '', 'FECHA DE CIERRE ESTIMADO:', tramiteInfo.fecha_finalizacion?.split('T')[0] || '-',]);

    // Estilo para etiquetas (Las filas ahora son 3, 4, 5 y 6 por el título en fila 2)
    ['A3', 'A4', 'A5', 'A6', 'A7', 'D3', 'D4', 'D5', 'D7'].forEach(cell => {
        sheet.getCell(cell).font = { bold: true };
    });
    sheet.mergeCells('B4:C4');
    sheet.mergeCells('B6:E6');

    // UN SOLO ESPACIO ANTES DE LA TABLA
    // sheet.addRow([]); 

    // 3. ENCABEZADOS DE LA TABLA
    const headerRow = sheet.addRow([
        'FECHA',
        'N° COMPROBANTE',
        'DESCRIPCIÓN / DETALLE',
        'MONTO (Bs.)',
        'RESPONSABLE'
    ]);

    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5D8DC' } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
        };
    });

    // Configuración de ancho de columnas
    sheet.getColumn(1).width = 15;
    sheet.getColumn(2).width = 18;
    sheet.getColumn(3).width = 55; // Un poco más ancho para el detalle
    sheet.getColumn(4).width = 15;
    sheet.getColumn(5).width = 25;

    // 4. CARGA DE DATOS
    let totalMonto = 0;

    data.forEach(item => {
        const montoActual = parseFloat(item.monto) || 0;
        const row = sheet.addRow([
            item.fecha_solicitud?.split('T')[0] || item.fecha_ingreso?.split('T')[0] || item.fecha?.split('T')[0] || '-',
            item.numero || item.id || '-',
            tipoReporte === 'GENERAL' ? `[${item.tipo_mov}] ${item.detalle}` : item.detalle,
            montoActual,
            item.usuario_nombre || 'S/N'
        ]);

        row.getCell(4).numFmt = '#,##0.00';

        if (tipoReporte === 'GENERAL') {
            const color = item.tipo_mov === 'INGRESO' ? 'C8E6C9' : 'FFCDD2';
            row.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
            });
            totalMonto += (item.tipo_mov === 'INGRESO' ? montoActual : -montoActual);
        } else {
            totalMonto += montoActual;
        }
    });

    // 5. PIE DE PÁGINA (TOTALES)
    sheet.addRow([]);
    const totalRow = sheet.addRow(['', '', 'RESULTADO TOTAL DE ESTA LISTA', totalMonto, '']);
    totalRow.getCell(3).font = { bold: true };
    totalRow.getCell(3).alignment = { horizontal: 'right' };
    totalRow.getCell(4).font = { bold: true, color: { argb: 'C0392B' } };
    totalRow.getCell(4).numFmt = '#,##0.00 "Bs."';

    // 6. DESCARGA
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Reporte_${tipoReporte}_${tramiteInfo.codigo}_${new Date().getTime()}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
};