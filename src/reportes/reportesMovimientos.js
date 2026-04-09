import ExcelJS from 'exceljs';

export const reportesMovimientos = async (tipoReporte, data, filtros) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'System Sucre - Isaac Llanos';

    const sheet = workbook.addWorksheet('REPORTE DETALLADO', {
        pageSetup: { paperSize: 9, orientation: 'landscape' }
    });

    // 1. TÍTULO Y FILTROS
    sheet.mergeCells('A1:H1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `REPORTE DE ${tipoReporte.toUpperCase()} - ${localStorage.getItem('entidad')}`;
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } };

    // Ajuste de fila de filtros
    sheet.addRow(['DESDE :', filtros.desde, '', '', '', 'HASTA : ' + filtros.hasta]);
    sheet.getRow(2).font = { bold: true };
    sheet.addRow([]); // Espacio

    // 2. ENCABEZADOS DINÁMICOS
    // Definimos el encabezado de la columna 5 basado en el tipo de reporte
    const columnaEmpleador = tipoReporte === 'INGRESOS' ? 'EMPLEADOR' : '';

    const headerRow = sheet.addRow([
        'N° ITEM',
        'FECHA',
        'CÓD. CAJA',
        'CAJA (DETALLE)',
        columnaEmpleador, // Dinámico
        tipoReporte === 'salida' ? 'DESCRIPCIÓN SALIDA.' : 'DESCRIPCION INGRESO',
        'MONTO ' + data[0].simbolo,
        'RESPONSABLE'
    ]);

    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5D8DC' } };
        cell.font = { bold: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Ancho de columnas
    sheet.getColumn(1).width = 10;
    sheet.getColumn(2).width = 12;
    sheet.getColumn(3).width = 15;
    sheet.getColumn(4).width = 30;
    sheet.getColumn(5).width = tipoReporte === 'INGRESOS' ? 25 : 2; // Achicamos si no hay empleador
    sheet.getColumn(6).width = 70;
    sheet.getColumn(7).width = 15;
    sheet.getColumn(8).width = 20;

    // 3. CARGA DE DATOS POR FILA
    let totalMonto = 0;

    data.forEach(item => {
        const montoActual =parseFloat(item.monto) || 0;

        // El valor de la celda 5 solo se pone si es salida
        const valorEmpleador = tipoReporte === 'INGRESOS' ? (item.cliente_nombre || '-') : '';

        const row = sheet.addRow([
            item.numero || '-',
            item.fecha_solicitud?.split('T')[0] || item.fecha_ingreso?.split('T')[0] || '-',
            item.codigo_tramite || 'N/A',
            item.tramite_detalle || '-',
            valorEmpleador, // Celda dinámica
            item.detalle || '-',
             montoActual,
            item.usuario_nombre || 'S/N'
        ]);

        row.getCell(7).numFmt = '#,##0.00';

        // Lógica de colores para reporte GENERAL
        if (tipoReporte === 'GENERAL') {
            const isIngreso = item.tipo_mov === 'INGRESOS';
            const color = isIngreso ? 'E8F5E9' : 'FFEBEE';
            row.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
            });
            totalMonto += isIngreso ? montoActual : -montoActual;
        } else {
            totalMonto += montoActual;
        }
    });

    // 4. TOTALES
    sheet.addRow([]);
    const totalRow = sheet.addRow(['', '', '', '', '', 'TOTAL RESULTADO:', totalMonto, '']);
    totalRow.getCell(6).font = { bold: true };
    totalRow.getCell(7).font = { bold: true, color: { argb: 'C0392B' } };
    totalRow.getCell(7).numFmt = '#,##0.00 "' + data[0].simbolo + '"';

    // 5. EXPORTACIÓN
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Reporte_${tipoReporte}_${localStorage.getItem('entidad')}_${new Date().getTime()}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
};