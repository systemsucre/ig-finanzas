import ExcelJS from 'exceljs';

export const generarReporteFinanciero = async (tipoReporte, data, tramiteInfo, filtros) => {
    const workbook = new ExcelJS.Workbook();
    const tipo = tipoReporte.trim().toUpperCase(); // Sanitización

    const sheet = workbook.addWorksheet('REPORTE', {
        pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    // DETECCIÓN MEJORADA: 
    // Forzamos true si es reporte de ingresos, o si hay datos en la propiedad cliente
    const mostrarColumnaCliente = tipo === 'INGRESOS' || data.some(item => item.cliente || item.cliente_nombre);

    const totalColumnas = mostrarColumnaCliente ? 6 : 5;

    // 1. TÍTULO
    sheet.mergeCells(1, 1, 1, totalColumnas);
    const titleCell = sheet.getCell('A1');
    titleCell.value = `REPORTE DE ${tipo} - ${localStorage.getItem('entidad') || 'SISTEMA'}`;
    titleCell.style = {
        font: { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } }
    };

    sheet.addRow([]);

    // 2. INFO DE CAJA
    sheet.addRow(['CÓDIGO:', tramiteInfo.codigo || '-', '', 'FECHA REPORTE:', new Date().toLocaleDateString()]);
    sheet.addRow(['TRAMITE:', tramiteInfo.nombre_tipo_tramite || '-', '', 'TIPO:', tipo]);
    sheet.addRow(['COSTO ESTIMADO:', 'BS. ' + parseFloat(tramiteInfo.costo || 0).toFixed(2), '', 'SALDO DISP.:', 'BS. ' + parseFloat(tramiteInfo.saldoDisponible || 0).toFixed(2)]);
    sheet.addRow(['DETALLE:', tramiteInfo.detalle || '-']);

    // Estilo negritas para etiquetas
    ['A3', 'A4', 'A5', 'A6', 'D3', 'D4', 'D5'].forEach(c => sheet.getCell(c).font = { bold: true });
    sheet.mergeCells(6, 2, 6, totalColumnas); // Ajuste dinámico del merge de detalle

    // 3. ENCABEZADOS
    const headerLabels = ['FECHA', 'N° COMP.', 'DESCRIPCIÓN / DETALLE'];
    if (mostrarColumnaCliente) headerLabels.push('CLIENTE');
    headerLabels.push('MONTO (Bs.)', 'RESPONSABLE');

    const headerRow = sheet.addRow(headerLabels);
    headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5D8DC' } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // 4. DATOS
    let totalMonto = 0;
    data.forEach(item => {
        const montoActual = parseFloat(item.monto) || 0;
        const fecha = item.fecha?.split('T')[0] || item.fecha_ingreso?.split('T')[0] || item.fecha_solicitud?.split('T')[0] || '-';

        // Construcción de fila
        const rowValues = [
            fecha,
            item.numero || item.id || '-',
            tipo === 'GENERAL' ? `[${item.tipo_mov}] ${item.detalle}` : item.detalle
        ];

        if (mostrarColumnaCliente) {
            rowValues.push(item.cliente || item.cliente_nombre || '-');
        }

        rowValues.push(montoActual);
        rowValues.push(item.usuario_nombre || 'S/N');

        const row = sheet.addRow(rowValues);

        // Formato de moneda (La columna cambia según si hay cliente o no)
        const colMontoPos = mostrarColumnaCliente ? 5 : 4;
        row.getCell(colMontoPos).numFmt = '#,##0.00';

        // Colores para General
        if (tipo === 'GENERAL') {
            const color = item.tipo_mov === 'INGRESO' ? 'C8E6C9' : 'FFCDD2';
            row.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } });
            totalMonto += (item.tipo_mov === 'INGRESO' ? montoActual : -montoActual);
        } else {
            totalMonto += montoActual;
        }
    });

    // 5. TOTALES
    sheet.addRow([]);
    const footer = new Array(totalColumnas).fill('');
    footer[2] = 'TOTAL:';
    footer[mostrarColumnaCliente ? 4 : 3] = totalMonto;

    const totalRow = sheet.addRow(footer);
    const montoIdx = mostrarColumnaCliente ? 5 : 4;

    totalRow.getCell(3).font = { bold: true };
    totalRow.getCell(3).alignment = { horizontal: 'right' };
    totalRow.getCell(montoIdx).font = { bold: true, color: { argb: 'C0392B' } };
    totalRow.getCell(montoIdx).numFmt = '#,##0.00 "Bs."';

    // 6. ANCHOS DE COLUMNA
    sheet.getColumn(1).width = 12;
    sheet.getColumn(2).width = 12;
    sheet.getColumn(3).width = 45;
    if (mostrarColumnaCliente) {
        sheet.getColumn(4).width = 25; // Cliente
        sheet.getColumn(5).width = 15; // Monto
        sheet.getColumn(6).width = 20; // Responsable
    } else {
        sheet.getColumn(4).width = 15; // Monto
        sheet.getColumn(5).width = 20; // Responsable
    }

    // DESCARGA
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${tipo}_${tramiteInfo.codigo || 'S-C'}.xlsx`;
    a.click();
};