
import { FC, useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaPreviewProps {
  file: File | null;
  isProcessing: boolean;
  isAnalyzed: boolean;
  className?: string;
}

const MediaPreview: FC<MediaPreviewProps> = ({ 
  file, 
  isProcessing,
  isAnalyzed,
  className 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setMediaType(null);
      return;
    }

    // Clean up previous URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    if (file.type.startsWith('image/')) {
      setMediaType('image');
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
    }
    
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl || !mediaType) {
    return (
      <div className={cn(
        "w-full h-full rounded-lg bg-gray-100 flex items-center justify-center", 
        className
      )}>
        <div className="text-center p-6">
          <Layers className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No media selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full relative rounded-lg overflow-hidden", className)}>
      {mediaType === 'image' ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-contain bg-black"
        />
      ) : (
        <video
          src={previewUrl}
          controls={!isProcessing}
          className="w-full h-full object-contain bg-black"
        />
      )}
      
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-12 h-12 rounded-lg scan-animation mb-3 mx-auto"></div>
            <p className="text-sm animate-pulse-subtle">Analyzing media...</p>
          </div>
        </div>
      )}
      
      {isAnalyzed && !isProcessing && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Analyzed
        </div>
      )}
    </div>
  );
};

export default MediaPreview;
