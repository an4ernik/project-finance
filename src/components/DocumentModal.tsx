import {X, ExternalLink, Download} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {Button} from './ui/button';
import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import pdfIcon from '../assets/pdfIcon.svg';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: string[] | undefined;
  onDownload?: () => void;
}

const DocumentModal = ({isOpen, onClose, files}: DocumentModalProps) => {
  const {t} = useTranslation();
  const [activeFile, setActiveFile] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen && files?.length) {
      setActiveFile(files[0]);
    }
    console.log('hello');
  }, [isOpen, files]);
  const handleDownload = async () => {
    if (!activeFile) return;

    try {
      const response = await fetch(activeFile);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      // Extract filename from URL or provide a default
      const filename = activeFile.split('/').pop() || 'download';
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: just open in new tab if fetch fails
      window.open(activeFile, '_blank');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 overflow-y-auto inset-0 z-500 w-full h-full flex items-center justify-center bg-black/10 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[800px] h-full max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#e8e9e9] dark:bg-[#142624] shadow-2xl p-3 sm:p-6 z-1000"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex justify-between shrink-0 pb-4">
          <div className="flex gap-3 flex-wrap">
            <h3 className="text-lg font-semibold dark:text-[#EAF6F3]">
              {files && files?.length > 1
                ? t('documentsModal.documents')
                : t('documentsModal.document')}
            </h3>
            <p className="dark:text-[#BFD9D2] opacity-60 italic text-sm self-center">
              {/* {activeFile?.split('/').pop()} */}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 dark:text-[#BFD9D2] cursor-pointer"
          >
            <X className="size-6" />
          </button>
        </div> 

        <div className="flex-1 min-h-0 my-2 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {files?.map(file => (
              <div
                key={file}
                onClick={() => setActiveFile(file)}
                className={`relative h-[140px] sm:h-[220px] overflow-hidden cursor-pointer rounded-xl border  hover:border-gray-300 ${
                  activeFile === file ? 'border-primary' : 'border-white/10'
                }`}
              >
                <img
                  src={file}
                  alt="Preview"
                  className="block w-full h-full object-contain"
                  onError={e => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = pdfIcon;
                  }}
                />

                <span className="absolute bottom-0 w-full p-1 bg-[#02624db2] truncate text-white">
                  {file}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 shrink-0 pt-4">
          <Button
            variant="primary"
            className="max-w-[244px] h-[40px]"
            onClick={() => window.open(activeFile || '', '_blank')}
          >
            <ExternalLink className="size-5" />
            {t('documentsModal.actions.newTab')}
          </Button>

          <Button
            onClick={handleDownload}
            variant="secondary"
            className="max-w-[244px] h-[40px]"
          >
            <Download className="size-5" />
            {t('documentsModal.actions.save')}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DocumentModal;
