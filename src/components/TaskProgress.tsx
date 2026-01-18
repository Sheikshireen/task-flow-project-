import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Edit3 } from 'lucide-react';

interface TaskProgressProps {
  progress: number;
  onChange: (progress: number) => void;
  status: 'pending' | 'completed';
  className?: string;
}

const TaskProgress = ({ progress, onChange, status, className }: TaskProgressProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProgress, setTempProgress] = useState(progress);

  const handleSave = () => {
    onChange(tempProgress);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProgress(progress);
    setIsEditing(false);
  };

  const getProgressColor = (progress: number) => {
    if (status === 'completed') return 'bg-success';
    if (progress === 0) return 'bg-muted-foreground';
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressLabel = (progress: number) => {
    if (status === 'completed') return 'Completed';
    if (progress === 0) return 'Not started';
    if (progress < 25) return 'Just started';
    if (progress < 50) return 'In progress';
    if (progress < 75) return 'Almost done';
    return 'Nearly complete';
  };

  if (isEditing) {
    return (
      <div className={`space-y-3 p-4 border rounded-lg bg-card ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Progress</span>
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSave} variant="default">
              Save
            </Button>
            <Button size="sm" onClick={handleCancel} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[tempProgress]}
            onValueChange={(value) => setTempProgress(value[0])}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-medium">{tempProgress}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Progress</span>
          <Badge variant="secondary" className="text-xs">
            {progress}%
          </Badge>
        </div>
        <Progress
          value={progress}
          className="h-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{getProgressLabel(progress)}</span>
          {status !== 'completed' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-6 px-2 text-xs"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;