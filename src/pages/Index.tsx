
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import MediaPreview from '@/components/MediaPreview';
import ResultCard from '@/components/ResultCard';
import { detectDeepfake, DetectionResult } from '@/lib/detection-service';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const { toast } = useToast();
  
  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setResult(null);
    
    try {
      toast({
        title: "Processing media",
        description: "Analyzing for potential deepfake indicators...",
      });
      
      const detectionResult = await detectDeepfake(file);
      
      setResult(detectionResult);
      
      toast({
        title: "Analysis Complete",
        description: detectionResult.isReal 
          ? "No deepfake indicators detected." 
          : "Potential deepfake detected.",
        variant: detectionResult.isReal ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred while analyzing the media.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-deepfake-dark">Deepfake Detection System</h1>
          <p className="mt-2 text-muted-foreground">
            Upload an image or video to analyze for potential deepfake manipulation
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-medium mb-4">Upload Media</h2>
              <FileUpload 
                onFileSelected={handleFileSelected} 
                isProcessing={isProcessing} 
              />
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p>This system uses ResNext for spatial feature extraction and LSTM for temporal analysis in videos.</p>
              </div>
            </div>
            
            {(selectedFile || isProcessing || result) && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-medium mb-4">Results</h2>
                {result ? (
                  <ResultCard 
                    isReal={result.isReal} 
                    confidenceScore={result.confidence} 
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                    {isProcessing ? 
                      <p className="animate-pulse">Processing... This may take a moment</p> :
                      <p>Upload media to see detection results</p>
                    }
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm h-[500px] flex flex-col">
            <h2 className="text-xl font-medium mb-4">Media Preview</h2>
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
              <MediaPreview 
                file={selectedFile} 
                isProcessing={isProcessing} 
                isAnalyzed={!!result}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-medium mb-4">About Deepfake Detection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-deepfake-primary mb-2">How It Works</h3>
              <p className="text-sm text-gray-600">
                Our system combines ResNeXt for spatial feature extraction and LSTM for temporal analysis in videos, 
                detecting inconsistencies that are hallmarks of synthesized media.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-deepfake-primary mb-2">Limitations</h3>
              <p className="text-sm text-gray-600">
                As deepfake technology evolves, detection becomes more challenging. While our system is advanced, 
                it may not catch every manipulation, especially from state-of-the-art generators.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-deepfake-primary mb-2">Best Practices</h3>
              <p className="text-sm text-gray-600">
                Always verify media from multiple sources. Low confidence results should prompt further investigation 
                rather than immediate conclusions about authenticity.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Deepfake Detection System | Powered by ResNext + LSTM Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
