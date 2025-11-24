import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generate PDF as base64 string (for email attachments)
 * @param {string} elementId - ID of the element to export
 * @returns {Promise<object>} - Object with success status and base64 data
 */
export const generatePDFAsBase64 = async (elementId = 'resume-preview') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Get PDF as base64 string
    const pdfBase64 = pdf.output('datauristring');
    
    return { 
      success: true, 
      data: pdfBase64,
      message: 'PDF generated successfully' 
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { 
      success: false, 
      message: 'Failed to generate PDF', 
      error 
    };
  }
};

/**
 * Export resume as PDF
 * @param {string} elementId - ID of the element to export
 * @param {string} filename - Name of the file to save
 */
export const exportToPDF = async (elementId = 'resume-preview', filename = 'resume.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return { success: true, message: 'PDF downloaded successfully' };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, message: 'Failed to export PDF', error };
  }
};

/**
 * Helper to strip HTML tags
 */
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Export resume as DOCX
 * @param {object} resumeData - Resume data object
 * @param {string} filename - Name of the file to save
 */
export const exportToDOCX = async (resumeData, filename = 'resume.docx') => {
  try {
    const themeColor = resumeData?.themeColor || '#000000';
    
    // Convert hex color to RGB for docx
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const themeRgb = hexToRgb(themeColor);

    const sections = [];

    // Header Section
    if (resumeData?.personal) {
      const { firstName, lastName, jobTitle, email, phone, address } = resumeData.personal;
      
      sections.push(
        new Paragraph({
          text: `${firstName || ''} ${lastName || ''}`.trim(),
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          color: `${themeColor.replace('#', '')}`,
        })
      );

      if (jobTitle) {
        sections.push(
          new Paragraph({
            text: jobTitle,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            bold: true,
          })
        );
      }

      const contactInfo = [email, phone, address].filter(Boolean).join(' | ');
      if (contactInfo) {
        sections.push(
          new Paragraph({
            text: contactInfo,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }
    }

    // Summary Section
    if (resumeData?.summary) {
      sections.push(
        new Paragraph({
          text: 'SUMMARY',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          color: `${themeColor.replace('#', '')}`,
        }),
        new Paragraph({
          text: resumeData.summary,
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }

    // Experience Section
    if (resumeData?.experience && resumeData.experience.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL EXPERIENCE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          color: `${themeColor.replace('#', '')}`,
        })
      );

      resumeData.experience.forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title || '',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 100, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.companyName || ''}${exp.city ? ', ' + exp.city : ''}${exp.state ? ', ' + exp.state : ''}`,
              }),
              new TextRun({
                text: ` | ${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''}`,
                italics: true,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        if (exp.workSummary) {
          const cleanText = stripHtml(exp.workSummary);
          sections.push(
            new Paragraph({
              text: cleanText,
              spacing: { after: 150 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }
      });
    }

    // Projects Section
    if (resumeData?.projects && resumeData.projects.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROJECTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          color: `${themeColor.replace('#', '')}`,
        })
      );

      resumeData.projects.forEach((project) => {
        sections.push(
          new Paragraph({
            text: project.title || '',
            bold: true,
            spacing: { before: 100, after: 50 },
          })
        );

        if (project.description) {
          const cleanText = stripHtml(project.description);
          sections.push(
            new Paragraph({
              text: cleanText,
              spacing: { after: 150 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }
      });
    }

    // Education Section
    if (resumeData?.education && resumeData.education.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          color: `${themeColor.replace('#', '')}`,
        })
      );

      resumeData.education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree || '',
                bold: true,
              }),
            ],
            spacing: { before: 100, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.universityName || ''}`,
              }),
              new TextRun({
                text: ` | ${edu.startDate || ''} - ${edu.endDate || ''}`,
                italics: true,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        if (edu.description) {
          sections.push(
            new Paragraph({
              text: edu.description,
              spacing: { after: 150 },
            })
          );
        }
      });
    }

    // Skills Section
    if (resumeData?.skills && resumeData.skills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          color: `${themeColor.replace('#', '')}`,
        })
      );

      const skillsText = resumeData.skills
        .map((skill) => `${skill.name}${skill.rating ? ` (${skill.rating}/5)` : ''}`)
        .join(' • ');

      sections.push(
        new Paragraph({
          text: skillsText,
          spacing: { after: 200 },
        })
      );
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.75),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children: sections,
        },
      ],
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    
    return { success: true, message: 'DOCX downloaded successfully' };
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    return { success: false, message: 'Failed to export DOCX', error };
  }
};

/**
 * Print resume (browser native print)
 */
export const printResume = () => {
  window.print();
};
