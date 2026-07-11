import {X, ExternalLink, Download} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {Button} from './ui/button';
import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import pdfIcon from '../assets/pdfIcon.svg';
import { api } from '@/shared/api/axios';

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
  }, [isOpen, files]);
const handleDownload = async () => {
  if (!activeFile) return;

  try {
    const response = await api.get(activeFile, {
      responseType: 'blob',
      withCredentials: true,
    });
    
    const blob = response.data; 
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    const filename = activeFile.split('/').pop() || 'download';
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed via API instance:', error);
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
            <p className="dark:text-[#BFD9D2] opacity-60 italic text-sm self-center"></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 dark:text-[#BFD9D2] cursor-pointer"
          >
            <X className="size-6" />
          </button>
        </div> 
         
        <div className="flex-1 min-h-0 my-2 overflow-y-auto custom-scrollbar flex items-stretch">
          <div className="flex flex-wrap gap-4 w-full h-full content-start justify-center ${files?.length === 1 ? 'h-full' : 'h-full'}">
            {files?.map(file => (
              <div
                key={file}
                onClick={() => setActiveFile(file)}
                className={`relative flex-1 min-w-[140px] sm:min-w-[180px] max-w-full h-[160px] sm:h-[calc(50%-8px)] sm:min-h-[180px] bg-transparent overflow-hidden cursor-pointer border rounded-xl transition-all hover:border-gray-400 ${
                  activeFile === file
                    ? 'border-primary shadow-[0_0_0_2px_rgba(2,98,77,0.3)]'
                    : 'border-white/10 bg-black/5 dark:bg-white/5'
                }`}
              >
                <img
                  src={file}
                  alt="Preview"
                  className="block w-full h-full object-contain p-2"
                  onError={e => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = pdfIcon;
                  }}
                />

                <span className="absolute bottom-0 left-0 w-full p-2 bg-[#02624db2] backdrop-blur-xs truncate text-xs text-white text-center font-medium rounded-b-xl">
                  {file.split('/').pop() || file}
                </span>
              </div>
            ))}
          </div>
        </div>

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
