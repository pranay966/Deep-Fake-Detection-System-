
import { FC } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  isReal: boolean;
  confidenceScore: number;
  className?: string;
}

const ResultCard: FC<ResultCardProps> = ({ 
  isReal, 
  confidenceScore,
  className 
}) => {
  const scorePercentage = confidenceScore * 100;
  
  const getScoreColor = () => {
    if (isReal) {
      return scorePercentage > 80 ? "bg-green-500" : "bg-yellow-500";
    } else {
      return scorePercentage > 80 ? "bg-red-500" : "bg-yellow-500";
    }
  };
  
  const getMessageText = () => {
    if (isReal) {
      return scorePercentage > 80 
        ? "This media appears to be authentic with high confidence." 
        : "This media appears to be authentic, but with moderate confidence.";
    } else {
      return scorePercentage > 80
        ? "This media is likely a deepfake with high confidence."
        : "This media may be manipulated, but with moderate confidence.";
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Detection Result</span>
          <span 
            className={cn(
              "text-sm px-3 py-1 rounded-full",
              isReal ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {isReal ? "Authentic" : "Deepfake"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Confidence</span>
              <span className="text-sm font-medium">{scorePercentage.toFixed(1)}%</span>
            </div>
            <div className="relative w-full h-2 overflow-hidden rounded-full bg-secondary">
              <div 
                className={cn("h-full transition-all", getScoreColor())}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Analysis</h4>
            <p className="text-sm text-gray-600">{getMessageText()}</p>
            
            {!isReal && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h5 className="text-sm font-medium mb-2">Detected Anomalies:</h5>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Inconsistent facial features</li>
                  <li>Unnatural blending around edges</li>
                  <li>{scorePercentage > 70 ? "Temporal inconsistencies in video frames" : "Potential lighting inconsistencies"}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Analysis completed using ResNext + LSTM algorithms
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
