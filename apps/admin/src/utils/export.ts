/**
 * 导出工具类
 * 支持 Excel、Word、PDF 导出
 */

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 导出 Excel
 * @param data 数据数组
 * @param fileName 文件名（不含扩展名）
 * @param sheetName 工作表名称
 */
export function exportToExcel(
  data: any[],
  fileName: string = 'export',
  sheetName: string = 'Sheet1',
) {
  try {
    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 导出 Excel 文件
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    return true;
  } catch (error) {
    console.error('导出 Excel 失败:', error);
    throw new Error('导出 Excel 失败');
  }
}

/**
 * 导出 Excel（带表头）
 * @param data 数据数组
 * @param headers 表头配置 { key: 列名 }
 * @param fileName 文件名（不含扩展名）
 * @param sheetName 工作表名称
 */
export function exportToExcelWithHeaders(
  data: any[],
  headers: Record<string, string>,
  fileName: string = 'export',
  sheetName: string = 'Sheet1',
) {
  try {
    // 转换数据，使用指定的表头
    const formattedData = data.map((item) => {
      const row: any = {};
      Object.keys(headers).forEach((key) => {
        row[headers[key]] = item[key];
      });
      return row;
    });

    return exportToExcel(formattedData, fileName, sheetName);
  } catch (error) {
    console.error('导出 Excel 失败:', error);
    throw new Error('导出 Excel 失败');
  }
}

/**
 * 导出 Word（简单文本格式）
 * @param content 文本内容
 * @param fileName 文件名（不含扩展名）
 */
export function exportToWord(content: string, fileName: string = 'export') {
  try {
    // 创建 HTML 内容
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${fileName}</title>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    // 创建 Blob
    const blob = new Blob([htmlContent], { type: 'application/msword' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('导出 Word 失败:', error);
    throw new Error('导出 Word 失败');
  }
}

/**
 * 导出 PDF（从 HTML 元素）
 * @param element HTML 元素
 * @param fileName 文件名（不含扩展名）
 * @param options 配置选项
 */
export async function exportToPDF(
  element: HTMLElement,
  fileName: string = 'export',
  options?: {
    scale?: number;
    margin?: number;
    orientation?: 'portrait' | 'landscape';
  },
) {
  try {
    const { scale = 2, margin = 10, orientation = 'portrait' } = options || {};

    // 使用 html2canvas 将 HTML 转换为图片
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
    });

    // 获取图片数据
    const imgData = canvas.toDataURL('image/png');

    // 创建 PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    // 计算图片尺寸，适配 A4 纸
    const imgWidth = 210 - margin * 2;
    const pageHeight = 297 - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    // 添加第一页
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，添加分页
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 保存 PDF
    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error('导出 PDF 失败:', error);
    throw new Error('导出 PDF 失败');
  }
}

/**
 * 导出 PDF（从文本内容）
 * @param content 文本内容
 * @param fileName 文件名（不含扩展名）
 */
export function exportToPDFFromText(content: string, fileName: string = 'export') {
  try {
    const pdf = new jsPDF();

    // 设置字体和字体大小
    pdf.setFont('helvetica');
    pdf.setFontSize(12);

    // 分割文本为多行
    const lines = pdf.splitTextToSize(content, 180);

    // 添加文本到 PDF
    let y = 20;
    lines.forEach((line: string) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 15, y);
      y += 7;
    });

    // 保存 PDF
    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error('导出 PDF 失败:', error);
    throw new Error('导出 PDF 失败');
  }
}

/**
 * 导出报表数据
 * @param data 报表数据
 * @param type 导出类型 'excel' | 'word' | 'pdf'
 * @param fileName 文件名
 */
export function exportReport(
  data: any,
  type: 'excel' | 'word' | 'pdf',
  fileName: string = 'report',
) {
  switch (type) {
    case 'excel':
      if (Array.isArray(data)) {
        return exportToExcel(data, fileName);
      } else if (data.data && Array.isArray(data.data)) {
        return exportToExcel(data.data, fileName);
      }
      throw new Error('数据格式不支持 Excel 导出');

    case 'word':
      if (typeof data === 'string') {
        return exportToWord(data, fileName);
      }
      throw new Error('数据格式不支持 Word 导出');

    case 'pdf':
      if (typeof data === 'string') {
        return exportToPDFFromText(data, fileName);
      }
      throw new Error('数据格式不支持 PDF 导出');

    default:
      throw new Error('不支持的导出类型');
  }
}
