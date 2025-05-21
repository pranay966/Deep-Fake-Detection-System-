
/**
 * This is a mock service that simulates deepfake detection.
 * In a real implementation, this would call an API that uses actual ML models.
 */

export interface DetectionResult {
  isReal: boolean;
  confidence: number;
  processingTime: number;
}

// Simulate processing delay
const simulateProcessing = (file: File): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    // Generate a random result that's weighted by file properties
    // In reality, this would use ML algorithms like ResNext and LSTM
    const fileSize = file.size;
    const fileName = file.name.toLowerCase();
    const isImage = file.type.startsWith('image/');
    
    // Add some randomness but make certain files more likely to be detected as fake
    let fakeIndicator = Math.random();
    
    // If filename contains suspicious words, increase fake probability
    if (fileName.includes('fake') || fileName.includes('edit') || fileName.includes('deep')) {
      fakeIndicator += 0.3;
    }
    
    // Videos are slightly more likely to be detected as fake (more complex to fake perfectly)
    if (!isImage) {
      fakeIndicator += 0.1;
    }
    
    // Normalize between 0 and 1
    fakeIndicator = Math.min(fakeIndicator, 0.95);
    
    // Determine fake or real based on our indicator
    const isReal = fakeIndicator < 0.5;
    
    // Calculate confidence (higher for extreme values, lower for borderline cases)
    let confidence = isReal ? 
      0.5 + (0.5 - fakeIndicator) : // If real, confidence is higher when fakeIndicator is lower
      fakeIndicator;                // If fake, confidence is directly proportional to fakeIndicator
    
    // Add some randomness to confidence
    confidence = Math.min(0.98, Math.max(0.6, confidence + (Math.random() * 0.2 - 0.1)));
    
    // Simulate processing time (larger files take longer)
    const processingTime = 2000 + (fileSize / 1000000) * 500 + Math.random() * 1000;
    
    // Resolve after simulated processing time
    setTimeout(() => {
      resolve({
        isReal,
        confidence,
        processingTime
      });
    }, processingTime);
  });
};

export const detectDeepfake = async (file: File): Promise<DetectionResult> => {
  return simulateProcessing(file);
};
