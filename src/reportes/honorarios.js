import ExcelJS from 'exceljs';

export const generarReporteHonorariosExcel = async (desde, hasta, data, tramiteInfo) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'KR Estudios - Gestión Legal';

    const sheet = workbook.addWorksheet('LISTA DE HONORARIOS', {
        pageSetup: { paperSize: 9, orientation: 'landscape' },
        properties: { tabColor: { argb: '1B4F72' } }
    });

    // 1. TÍTULO PRINCIPAL
    sheet.mergeCells('A1:G1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `REPORTE DETALLADO DE HONORARIOS - KR ESTUDIOS`;
    titleCell.font = { name: 'Arial Black', size: 14, color: { argb: 'FFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } };

    // 2. BLOQUE DE FILTROS Y PARÁMETROS (Desde - Hasta)
    sheet.addRow([]); // Fila 2 vacía para aire
    
    // Configuramos los valores de la fila 3
    const infoRow = sheet.getRow(3);
    infoRow.values = [
        'DESDE:', 
        `${desde || 'Inicio'} `, 
        `al `, 
        `${hasta || 'Hoy'}`, 
        '',
        'FECHA REPORTE:',
        new Date().toLocaleDateString('es-BO')
    ];

    // Estilo para la fila de información (Fila 3)
    infoRow.font = { bold: true, size: 10 };

    sheet.getCell('F3').font = { bold: true, color: { argb: '1B4F72' } };
    
    sheet.addRow([]); // Fila 4 vacía

    // 3. ENCABEZADOS DE LA LISTA (Fila 5)
    const headerRow = sheet.addRow([
        'ID',
        'FECHA PAGO',
        'CÓDIGO TRÁMITE',
        'CLIENTE',
        'CONCEPTO / SERVICIO',
        'MÉTODO',
        'MONTO (Bs.)'
    ]);

    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E86C1' } }; 
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'medium' }, right: { style: 'thin' }
        };
    });

    // 4. CONFIGURACIÓN DE COLUMNAS (Anchos)
    sheet.getColumn(1).width = 8;  // ID
    sheet.getColumn(2).width = 15; // Fecha
    sheet.getColumn(3).width = 18; // Código Trámite
    sheet.getColumn(4).width = 30; // Cliente
    sheet.getColumn(5).width = 40; // Concepto
    sheet.getColumn(6).width = 15; // Método
    sheet.getColumn(7).width = 18; // Monto

    // 5. CARGA DE LA DATA
    let totalAcumulado = 0;

    data.forEach((item, index) => {
        const monto = parseFloat(item.monto) || 0;
        const row = sheet.addRow([
            item.numero || index + 1,
            item.fecha_ingreso?.split('T')[0] || '-',
            item.codigo_tramite || tramiteInfo?.codigo || 'N/A',
            item.cliente || tramiteInfo?.cliente || 'N/A',
            item.descripcion || item.detalle || 'Cobro de honorarios',
            item.tipo_pago || 'Efectivo',
            monto
        ]);

        // Formatos y Estilos de celda
        row.getCell(7).numFmt = '#,##0.00 "Bs."';
        row.getCell(7).font = { bold: true };
        
        row.eachCell(c => {
            c.border = {
                bottom: { style: 'hair' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            };
            c.alignment = { vertical: 'middle' };
        });

        totalAcumulado += monto;
    });

    // 6. FILA DE TOTALES
    sheet.addRow([]);
    const footerRow = sheet.addRow(['', '', '', '', '', 'TOTAL COBRADO:', totalAcumulado]);
    
    footerRow.getCell(6).font = { bold: true, size: 11 };
    footerRow.getCell(6).alignment = { horizontal: 'right' };
    
    footerRow.getCell(7).font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
    footerRow.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } };
    footerRow.getCell(7).numFmt = '#,##0.00 "Bs."';
    footerRow.getCell(7).alignment = { horizontal: 'center' };

    // 7. EXPORTACIÓN
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Reporte_Honorarios_${new Date().getTime()}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
};