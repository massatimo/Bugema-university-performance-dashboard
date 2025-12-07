import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPdf(element, filename = 'export.pdf', options = {}) {
  if (!element) throw new Error('No element provided for PDF export');
  const canvas = await html2canvas(element, {
    scale: options.scale || 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    ...options.html2canvas
  });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: options.orientation || 'portrait'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
  const imgW = imgWidth * ratio;
  const imgH = imgHeight * ratio;
  const marginX = (pageWidth - imgW) / 2;
  const marginY = 20;

  pdf.addImage(imgData, 'PNG', marginX, marginY, imgW, imgH);
  pdf.save(filename);
}