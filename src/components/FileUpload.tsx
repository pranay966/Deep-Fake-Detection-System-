
import { FC, useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, File, FileImage, FileVideo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  className?: string;
}

const FileUpload: FC<FileUploadProps> = ({ onFileSelected, isProcessing, className }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check if file is an image or video
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file",
        description: "Please upload an image or video file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 20MB.",
        variant: "destructive",
      });
      return;
    }
    
    onFileSelected(file);
  };

  const renderIcon = () => {
    return (
      <div className="text-deepfake-primary mb-4">
        <Upload className="h-10 w-10 mx-auto" />
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/*,video/*"
        disabled={isProcessing}
      />
      
      <div
        className={cn(
          "dropzone",
          dragActive && "border-deepfake-primary bg-deepfake-secondary/20",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={isProcessing ? undefined : handleClick}
      >
        {renderIcon()}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg mb-1">Upload Media</h3>
          <p className="text-sm text-muted-foreground">
            Drag & drop an image or video, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports JPG, PNG, GIF, MP4, MOV (Max 20MB)
          </p>
        </div>
        
        <Button 
          variant="outline"
          className="mt-2 bg-white hover:bg-deepfake-secondary/50"
          disabled={isProcessing}
        >
          Select File
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
