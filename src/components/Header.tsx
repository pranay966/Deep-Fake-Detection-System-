
import { FC } from 'react';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-4 px-6 flex items-center", className)}>
      <div className="flex items-center gap-2">
        <Layers className="h-6 w-6 text-deepfake-primary" />
        <h1 className="text-xl font-bold text-deepfake-dark">DeepFake Detector</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Powered by ResNext + LSTM
        </span>
      </div>
    </header>
  );
};

export default Header;
