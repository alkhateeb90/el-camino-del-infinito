export interface CertificateData {
  type: 'badge' | 'level';
  recipientName: string;
  achievementTitle: string;
  achievementDescription: string;
  badgeIcon?: string;
  date: string;
  level?: string;
  points?: number;
  streakDays?: number;
}

export function generateCertificateHTML(data: CertificateData): string {
  const isBadgeCertificate = data.type === 'badge';
  const backgroundColor = isBadgeCertificate ? '#0F172A' : '#1E3A8A';
  const accentColor = isBadgeCertificate ? '#FF6B6B' : '#1E90FF';
  const borderColor = isBadgeCertificate ? '#FFD93D' : '#6BCB77';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificado - ${data.achievementTitle}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Georgia', serif;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        
        .certificate {
          width: 100%;
          max-width: 900px;
          aspect-ratio: 16 / 11;
          background: linear-gradient(135deg, ${backgroundColor} 0%, #0F172A 100%);
          border: 8px solid ${borderColor};
          border-radius: 20px;
          padding: 60px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(30, 144, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          position: relative;
          z-index: 1;
        }
        
        .header-title {
          color: ${accentColor};
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          letter-spacing: 2px;
        }
        
        .header-subtitle {
          color: #E0E7FF;
          font-size: 18px;
          font-style: italic;
          letter-spacing: 1px;
        }
        
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
          gap: 30px;
        }
        
        .badge-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .badge-icon {
          font-size: 120px;
          filter: drop-shadow(0 0 20px rgba(30, 144, 255, 0.5));
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .achievement-text {
          color: white;
        }
        
        .achievement-title {
          font-size: 42px;
          font-weight: bold;
          color: ${accentColor};
          margin-bottom: 15px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .achievement-description {
          font-size: 20px;
          color: #E0E7FF;
          max-width: 600px;
          line-height: 1.6;
          font-style: italic;
        }
        
        .stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #A5B4FC;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: ${accentColor};
        }
        
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          z-index: 1;
          border-top: 2px solid rgba(255, 255, 255, 0.2);
          padding-top: 20px;
        }
        
        .date {
          color: #A5B4FC;
          font-size: 14px;
          text-align: left;
        }
        
        .recipient {
          text-align: center;
          flex: 1;
        }
        
        .recipient-name {
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .recipient-label {
          color: #A5B4FC;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .signature {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .signature-icon {
          font-size: 40px;
          filter: drop-shadow(0 0 10px rgba(30, 144, 255, 0.3));
        }
        
        .signature-name {
          color: ${accentColor};
          font-size: 16px;
          font-weight: bold;
          font-style: italic;
        }
        
        .signature-title {
          color: #A5B4FC;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .seal {
          position: absolute;
          bottom: 30px;
          right: 30px;
          width: 100px;
          height: 100px;
          border: 3px solid ${borderColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          opacity: 0.3;
          z-index: 0;
        }
        
        @media print {
          body {
            padding: 0;
            background: white;
          }
          .certificate {
            max-width: 100%;
            border-radius: 0;
            box-shadow: none;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="seal">✓</div>
        
        <div class="header">
          <div class="header-title">CERTIFICADO DE LOGRO</div>
          <div class="header-subtitle">El Camino del Infinito</div>
        </div>
        
        <div class="content">
          <div class="badge-section">
            ${data.badgeIcon ? `<div class="badge-icon">${data.badgeIcon}</div>` : ''}
            <div class="achievement-text">
              <div class="achievement-title">${data.achievementTitle}</div>
              <div class="achievement-description">${data.achievementDescription}</div>
            </div>
          </div>
          
          ${
            data.type === 'badge'
              ? `
                <div class="stats">
                  <div class="stat">
                    <div class="stat-label">Racha</div>
                    <div class="stat-value">${data.streakDays} días</div>
                  </div>
                  <div class="stat">
                    <div class="stat-label">Fecha</div>
                    <div class="stat-value">${data.date}</div>
                  </div>
                </div>
              `
              : `
                <div class="stats">
                  <div class="stat">
                    <div class="stat-label">Nivel</div>
                    <div class="stat-value">${data.level}</div>
                  </div>
                  <div class="stat">
                    <div class="stat-label">Puntos</div>
                    <div class="stat-value">${data.points}</div>
                  </div>
                  <div class="stat">
                    <div class="stat-label">Fecha</div>
                    <div class="stat-value">${data.date}</div>
                  </div>
                </div>
              `
          }
        </div>
        
        <div class="footer">
          <div class="date">Emitido: ${data.date}</div>
          
          <div class="recipient">
            <div class="recipient-name">${data.recipientName}</div>
            <div class="recipient-label">Aprendiz del Camino</div>
          </div>
          
          <div class="signature">
            <div class="signature-icon">👁️</div>
            <div class="signature-name">Gojo</div>
            <div class="signature-title">Guía Espiritual</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function downloadCertificateAsPDF(data: CertificateData): Promise<void> {
  try {
    // Generate HTML
    const html = generateCertificateHTML(data);
    
    // Create blob from HTML
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    
    document.body.appendChild(iframe);
    
    // Wait for iframe to load
    iframe.onload = () => {
      // Trigger print dialog
      iframe.contentWindow?.print();
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);
    };
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
}

export function generateCertificateFileName(data: CertificateData): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const type = data.type === 'badge' ? 'Badge' : 'Level';
  const title = data.achievementTitle.replace(/\s+/g, '_');
  return `Certificado_${type}_${title}_${data.recipientName.replace(/\s+/g, '_')}_${timestamp}.pdf`;
}
