// import {Button} from '@/components/ui/button';
// import { Download } from 'lucide-react';

// interface PreviewProps {
//   onClose: () => void;
//   urls: string[] | undefined;
// }

const triggerDownload = async (url: string, index: number) => {
  try {
    // 1. Fetch the file data
    const response = await fetch(url);

    // 2. Get the blob (binary data)
    const blob = await response.blob();
    const mimeType = blob.type;
    let extension = '.png'; // default fallback
    if (mimeType.includes('pdf')) extension = '.pdf';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg'))
      extension = '.jpg';

    // 4. Create a local temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // 5. Create a hidden link and click it
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `receipt-${index + 1}${extension}`;
    document.body.appendChild(link);
    link.click();

    // 6. Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('S3 Download Error:', error);
    // If CORS prevents fetch, fallback to opening in new tab
    window.open(url, '_blank');
  }
};

// export function DocumentPreviewModal({
//   onClose,
//   urls,
// }: PreviewProps) {
//   // Use the triggerDownload helper we discussed earlier
//   //   const handleDownload = async () => {
//   //     try {
//   //       const response = await fetch(url);
//   //       const blob = await response.blob();
//   //       const blobUrl = window.URL.createObjectURL(blob);
//   //       const link = document.createElement('a');
//   //       link.href = blobUrl;
//   //       link.download = fileName;
//   //       document.body.appendChild(link);
//   //       link.click();
//   //       document.body.removeChild(link);
//   //       window.URL.revokeObjectURL(blobUrl);
//   //     } catch (err) {
//   //       console.error(err);
//   //       window.open(url, '_blank');
//   //     }
//   //   };

//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex flex-col z-500 gap-4 p-4 bg-[#142624] dark:bg-[#142624]">
//       <header className="flex justify-between items-center">
//         <h2>Title</h2>
//         <button onClick={onClose}>Close</button>
//       </header>
//       <main>

//       </main>
//       <footer>
//         <Button onClick={() => triggerDownload(url, 0)}>
//           <Download className="mr-2 h-4 w-4" />
//           Open in new tab
//         </Button>
//         <Button onClick={() => triggerDownload(url, 0)}>
//           <Download className="mr-2 h-4 w-4" />
//           Download
//         </Button>
//       </footer>
//     </div>
//   );
// }

import {Button} from '@/components/ui/button';
import {Download, ExternalLink, X, FileText} from 'lucide-react';

interface PreviewProps {
  onClose: () => void;
  urls: string[] | undefined;
}
 
export function DocumentPreviewModal({onClose, urls}: PreviewProps) {
  // Grab the first URL if available
  const currentUrl = urls && urls.length > 0 ? urls[0] : null;

  if (!currentUrl) return null;

  return (
    // Added z-[500] and fixed positioning
    <div onClick={e => e.stopPropagation()} className="fixed w-full h-full flex justify-center items-center top-0 left-0 z-50 ">
      <div className="bg-[#142624] text-white rounded-xl flex flex-col w-full p-6 max-w-[900px] h-[90vh]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-xl font-bold">Документ</h2>
            <p className="text-sm text-gray-400">receipt_file.pdf</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-24 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center mb-6">
            <FileText size={40} className="text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Попередній перегляд недоступний
          </h3>
          <p className="text-gray-400 max-w-sm">
            Ви можете відкрити файл у новій вкладці або завантажити його.
          </p>
        </main>

        <footer className="flex justify-center gap-4 pb-10">
          <Button
            variant="primary"
            className="bg-[#2d4d44] border-none hover:bg-[#3a5f54] text-white px-2 py-2 text-base max-w-[240px]"
            onClick={() => window.open(currentUrl, '_blank')}
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Відкрити у новій вкладці
          </Button>

          <Button
            variant="secondary"
            className="bg-transparent border-gray-600 hover:bg-white/5 text-white px-2 py-6 text-base max-w-[240px]"
            onClick={() => triggerDownload(currentUrl, 0)}
          >
            <Download className="mr-2 h-5 w-5" />
            Завантажити
          </Button>
        </footer>
      </div>
    </div>
  );
}
