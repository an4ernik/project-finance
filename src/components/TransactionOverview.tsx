import {cn} from '@/lib/utils';
import {Card, CardContent} from './ui/card';
import {
  Calendar,
  FileText,
  Hash,
  Paperclip,
  ExternalLink,
  Download,
} from 'lucide-react';
import type {TransactionResponseDTO} from '@/shared/api/models';
import pdfImage from '@/assets/pdfIcon.svg';
import {ICONS_BY_ID} from '@/pages/income/IconPicker';
import {Button} from './ui/button';

interface FilePreviewProps {
  urls: string[];
}

const triggerDownload = async (url: string, index: string) => {
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

export function FileGallery({urls}: FilePreviewProps) {
  if (!urls || urls.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Paperclip size={16} />
        <span>Attachments ({urls.length})</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {urls.map((url, index) => {
          const isPdf = url.toLowerCase().endsWith('.pdf');

          return (
            <div key={url}>
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-24 h-24 border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all overflow-hidden"
              >
                {isPdf ? (
                  // PDF Placeholder
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="text-red-500" size={32} />
                    <span className="text-[10px] font-bold uppercase">PDF</span>
                  </div>
                ) : (
                  // Image Preview
                  <img
                    src={url || pdfImage}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={e => {
                      const target = e.currentTarget;
                      target.src = pdfImage;
                    }}
                  />
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ExternalLink className="text-white" size={20} />
                </div>

                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full shadow-lg"
                    title="Download"
                    onClick={e => {
                      e.preventDefault(); // Prevent opening the link
                      e.stopPropagation(); // Prevent triggering the parent <a>
                      triggerDownload(
                        url,
                        `receipt-${index + 1}${isPdf ? '.pdf' : '.png'}`,
                      );
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TransactionOverview = ({item}: {item: TransactionResponseDTO}) => {
  const isIncome = item.type === 'INCOME';
  const amount = item.amount ?? 0;
  const receiptsCount = item.receiptsUrls?.length ?? 0;
  const Icon = ICONS_BY_ID[item.category?.icon ?? 'trend_up'];

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="mb-3  *:">
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center gap-4 min-w-[300px]">
            {/* Left Side: Category and Icon */}
            <div className="flex items-center flex-col gap-4">
              <div
                className={cn(
                  'p-3 rounded-xl',
                  isIncome
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600',
                )}
              >
                <Icon size={24} />
              </div>
              <div>
                <div className="flex flex-col items-center gap-2">
                  <span>Type: {item.category?.type}</span>
                  <h3 className="font-bold text-lg leading-tight">
                    {item.category?.name}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash size={14} /> ID: {item.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Description (if exists) */}
            <div className="flex-1 px-2 ">
              {item.description ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2 italic">
                  <FileText size={14} /> {item.description}
                </p>
              ) : (
                <span className="text-xs text-muted-foreground/50">
                  No description provided
                </span>
              )}
            </div>

            {/* Right Side: Amount and Status */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
              <div
                className={cn(
                  'text-2xl font-black',
                  isIncome ? 'text-green-500' : 'text-foreground',
                )}
              >
                {isIncome ? '+' : '-'}
                {amount.toLocaleString()}
              </div>

              {receiptsCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  <FileGallery urls={item.receiptsUrls ?? []} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default TransactionOverview;
