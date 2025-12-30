import { useState } from 'react';
import { CertificateData, downloadCertificateAsPDF, generateCertificateHTML } from '@/lib/certificateGenerator';
import { X, Download, Eye } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  certificate: CertificateData | null;
  onClose: () => void;
  recipientName: string;
}

export function CertificateModal({
  isOpen,
  certificate,
  onClose,
  recipientName,
}: CertificateModalProps) {
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen || !certificate) return null;

  const handleDownload = async () => {
    try {
      const updatedCertificate = { ...certificate, recipientName };
      await downloadCertificateAsPDF(updatedCertificate);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 flex justify-between items-center border-b-2 border-blue-500">
          <div>
            <h2 className="text-2xl font-bold text-white font-[Outfit]">
              🎓 Certificado Desbloqueado
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              {certificate.type === 'badge' ? '¡Insignia Ganada!' : '¡Nivel Completado!'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Achievement Details */}
          <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-start gap-4">
              {certificate.badgeIcon && (
                <div className="text-6xl">{certificate.badgeIcon}</div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {certificate.achievementTitle}
                </h3>
                <p className="text-gray-300 mb-4">{certificate.achievementDescription}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {certificate.type === 'badge' && certificate.streakDays && (
                    <div className="bg-slate-700 rounded p-3">
                      <p className="text-xs text-gray-400 uppercase">Racha</p>
                      <p className="text-xl font-bold text-orange-400">
                        {certificate.streakDays} días
                      </p>
                    </div>
                  )}
                  {certificate.type === 'level' && certificate.level && (
                    <div className="bg-slate-700 rounded p-3">
                      <p className="text-xs text-gray-400 uppercase">Nivel</p>
                      <p className="text-xl font-bold text-blue-400">
                        {certificate.level}
                      </p>
                    </div>
                  )}
                  {certificate.type === 'level' && certificate.points && (
                    <div className="bg-slate-700 rounded p-3">
                      <p className="text-xs text-gray-400 uppercase">Puntos</p>
                      <p className="text-xl font-bold text-green-400">
                        {certificate.points}
                      </p>
                    </div>
                  )}
                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-xs text-gray-400 uppercase">Fecha</p>
                    <p className="text-xl font-bold text-purple-400">
                      {certificate.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-green-500">
            <h4 className="text-lg font-bold text-white mb-3">Información del Certificado</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 uppercase">Nombre del Aprendiz</p>
                <p className="text-xl font-bold text-white">{recipientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Tipo de Logro</p>
                <p className="text-lg font-semibold text-blue-300">
                  {certificate.type === 'badge' ? 'Insignia de Racha' : 'Completación de Nivel'}
                </p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="bg-slate-800 rounded-lg p-4 border-2 border-blue-500">
              <h4 className="text-lg font-bold text-white mb-4">Vista Previa del Certificado</h4>
              <div className="bg-white rounded overflow-hidden max-h-96">
                <iframe
                  srcDoc={generateCertificateHTML({
                    ...certificate,
                    recipientName,
                  })}
                  className="w-full h-96 border-0"
                  title="Certificate Preview"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-700">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={20} />
              {showPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              Descargar PDF
            </button>
          </div>

          {/* Info Message */}
          <div className="bg-blue-900 bg-opacity-30 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-200">
              💡 <strong>Consejo:</strong> Puedes descargar este certificado e imprimirlo para 
              mostrarlo a tu familia. ¡Es un logro real que merece ser celebrado!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
