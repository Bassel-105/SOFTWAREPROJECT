const Excel = require('exceljs');

export const generateExcelReport = async (data: any, res: any) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('Analytics');

    sheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));
    sheet.addRows(data);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.xlsx');

    await workbook.xlsx.write(res);
};