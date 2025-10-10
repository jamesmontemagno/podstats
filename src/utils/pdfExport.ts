import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFReport = async (sourceLabel: string): Promise<void> => {
  try {
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    
    let currentPage = 1;

    // Helper to add page header
    const addPageHeader = (pageNumber: number) => {
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Podstats Report • ${sourceLabel}`, margin, 8);
      pdf.text(`Page ${pageNumber}`, pageWidth - margin - 15, 8);
      pdf.setDrawColor(220, 220, 220);
      pdf.line(margin, 10, pageWidth - margin, 10);
    };

    // Add cover page
    pdf.setFillColor(37, 99, 235); // primary-600
    pdf.rect(0, 0, pageWidth, 60, 'F');
    
    pdf.setFontSize(28);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Podstats', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.text('Analytics Report', pageWidth / 2, 42, { align: 'center' });
    
    // Report details box
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, 80, contentWidth, 40, 'F');
    pdf.setDrawColor(229, 231, 235);
    pdf.rect(margin, 80, contentWidth, 40);
    
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Data Source:', margin + 5, 90);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text(sourceLabel, margin + 5, 97);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.text('Generated:', margin + 5, 107);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text(new Date().toLocaleString(), margin + 5, 114);
    
    pdf.setFont('helvetica', 'normal');
    
    let yPosition = 140;

    // Table of contents
    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Contents', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    const contents = [
      '1. Executive Summary',
      '2. Key Performance Metrics',
      '3. Performance Timeline',
      '4. Top Episodes',
      '5. Advanced Analytics',
      '6. Monthly Trends',
      '7. Retention Analysis',
      '8. Performance Distribution'
    ];
    
    contents.forEach(item => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += 7;
    });

    // Function to add a section with canvas capture
    const addSection = async (selector: string, title: string, sectionNumber?: string) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (!element) {
        console.warn(`Element not found: ${selector}`);
        return;
      }

      // Add new page for each major section
      pdf.addPage();
      currentPage++;
      addPageHeader(currentPage);
      yPosition = 20;

      // Add section title
      if (sectionNumber) {
        pdf.setFontSize(18);
        pdf.setTextColor(37, 99, 235);
        pdf.text(`${sectionNumber}. ${title}`, margin, yPosition);
        yPosition += 8;
        
        // Underline
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, margin + 60, yPosition);
        yPosition += 8;
      } else {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, margin, yPosition);
        yPosition += 6;
      }

      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale: 2.5,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if image fits on current page
      const maxHeight = pageHeight - yPosition - margin;
      if (imgHeight > maxHeight) {
        // Split into multiple pages if needed
        const numPages = Math.ceil(imgHeight / maxHeight);
        for (let i = 0; i < numPages; i++) {
          if (i > 0) {
            pdf.addPage();
            currentPage++;
            addPageHeader(currentPage);
            yPosition = 20;
          }
          
          const sourceY = i * maxHeight * (canvas.height / imgHeight);
          const sourceHeight = Math.min(maxHeight * (canvas.height / imgHeight), canvas.height - sourceY);
          
          // Create a temporary canvas for the slice
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
            const sliceData = tempCanvas.toDataURL('image/png');
            const sliceHeight = (sourceHeight * imgWidth) / canvas.width;
            pdf.addImage(sliceData, 'PNG', margin, yPosition, imgWidth, sliceHeight);
          }
        }
      } else {
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      }
    };

    // Capture Dashboard sections
    await addSection('.dashboard-metrics', 'Key Performance Metrics', '1');
    await addSection('.dashboard-performance', 'Performance Breakdown');
    await addSection('.dashboard-timeline', 'Performance Timeline', '2');
    await addSection('.dashboard-top-episodes', 'Top Episodes', '3');
    await addSection('.dashboard-best-episode', 'Best Performing Episode');

    // Add Analytics sections
    await addSection('.analytics-monthly-trends', 'Monthly Trends', '4');
    await addSection('.analytics-retention', 'Retention Analysis', '5');
    await addSection('.analytics-day7-scatter', 'Day 7 Performance Distribution', '6');
    await addSection('.analytics-growth-patterns', 'Growth Patterns');
    await addSection('.analytics-performance-distribution', 'Performance Distribution', '7');

    // Add footer to last page
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by Podstats • Built with VS Code & GitHub Copilot', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save the PDF
    const fileName = `podstats-report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};
