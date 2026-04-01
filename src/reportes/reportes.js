import ExcelJS from 'exceljs';

export const generarReporteFinanciero = async (tipoReporte, data, tramiteInfo, filtros) => {
    const TIPO = tipoReporte?.toString().toUpperCase().trim();
    const workbook = new ExcelJS.Workbook();
    
    const sheet = workbook.addWorksheet('REPORTE', {
        pageSetup: { paperSize: 9, orientation: 'landscape' },
        properties: { tabColor: { argb: '1bbec0' } }
    });

    // 1. TÍTULO
    sheet.mergeCells('A1:E1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `REPORTE DE ${TIPO} - IG FINANZAS`;
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } };

    sheet.addRow([]);

    // 2. INFO DE CAJA
    sheet.mergeCells('A2:B2');
    sheet.getCell('A2').value = `INFORMACIÓN DE CAJA`;
    sheet.getCell('A2').font = { bold: true, color: { argb: '1B4F72' } };

    sheet.addRow(['CÓDIGO:', tramiteInfo.codigo, '', 'FECHA REPORTE:', new Date().toLocaleDateString()]);
    sheet.addRow(['NUMERO:', tramiteInfo.numero, '', 'TIPO:', tramiteInfo.nombre_tipo_tramite]);
    sheet.addRow(['DETALLE:', tramiteInfo.detalle]);
    sheet.addRow(['FECHA INGRESO:', tramiteInfo.fecha_ingreso?.split('T')[0], '', 'FECHA FINALIZACION:', tramiteInfo.fecha_finalizacion?.split('T')[0] || '-',]);

    ['A3', 'A4', 'A5', 'A6', 'A7', 'D3', 'D4', 'D5', 'D7'].forEach(c => sheet.getCell(c).font = { bold: true });
    sheet.mergeCells('B5:C5');
    sheet.mergeCells('B6:E6');
    sheet.addRow([]); 

    // 3. LÓGICA DE COLUMNA CLIENTE (Habilitada para INGRESOS y GENERAL)
    const mostrarColumnaCliente = TIPO.includes('INGRESO') || TIPO === 'GENERAL';

    let headers = ['N° ITEM', 'FECHA', 'DESCRIPCIÓN / DETALLE', 'MONTO ('+localStorage.getItem('moneda')+')'];
    if (mostrarColumnaCliente) headers.push('EMPLEADOR');
    headers.push('RESPONSABLE');

    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5D8DC' } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Anchos
    sheet.getColumn(1).width = 12;
    sheet.getColumn(2).width = 15;
    sheet.getColumn(3).width = 40;
    sheet.getColumn(4).width = 15;
    if (mostrarColumnaCliente) {
        sheet.getColumn(5).width = 25; // Cliente
        sheet.getColumn(6).width = 20; // Responsable
    } else {
        sheet.getColumn(5).width = 25; // Responsable
    }

    // 4. CARGA DE DATOS
    let totalMonto = 0;
    data.forEach(item => {
        const montoActual = parseFloat(item.monto) || 0;
        let filaActual = [
            item.numero || item.id || '-',
            item.fecha?.split('T')[0] || '-',
            TIPO === 'GENERAL' ? `[${item.tipo_mov}] ${item.detalle}` : item.detalle,
            montoActual
        ];

        if (mostrarColumnaCliente) {
            // Si es salida en un reporte general, ponemos un guion
            const nombreCliente = item.tipo_mov === 'SALIDA' ? '-' : (item.cliente_nombre || item.cliente || 'S/C');
            filaActual.push(nombreCliente);
        }

        filaActual.push(item.usuario_nombre || 'S/N');

        const row = sheet.addRow(filaActual);
        row.getCell(4).numFmt = '#,##0.00';

        if (TIPO === 'GENERAL') {
            const color = item.tipo_mov === 'INGRESO' ? 'C8E6C9' : 'FFCDD2';
            row.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } });
            totalMonto += (item.tipo_mov === 'INGRESO' ? montoActual : -montoActual);
        } else {
            totalMonto += montoActual;
        }
    });

    // 5. TOTAL
    sheet.addRow([]);
    const totalRow = sheet.addRow(['', '', 'RESULTADO TOTAL DE ESTA LISTA', totalMonto]);
    totalRow.getCell(3).font = { bold: true };
    totalRow.getCell(3).alignment = { horizontal: 'right' };
    totalRow.getCell(4).font = { bold: true, color: { argb: 'C0392B' } };
    totalRow.getCell(4).numFmt =  `#,##0.00 "${localStorage.getItem('moneda')}"`;

    // 6. DESCARGA
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Reporte_${TIPO}_${tramiteInfo.codigo}_${new Date().getTime()}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
};