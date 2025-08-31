import { Triangle } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Triangle className="w-8 h-8 text-primary animate-spin" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
};
