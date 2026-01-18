import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Flag } from 'lucide-react';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface TaskPrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  className?: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: '🏖️',
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    icon: '📅',
  },
  high: {
    label: 'High',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    icon: '⚡',
  },
  urgent: {
    label: 'Urgent',
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    icon: '🚨',
  },
};

const TaskPrioritySelector = ({ value, onChange, className }: TaskPrioritySelectorProps) => {
  const currentPriority = priorityConfig[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between ${className}`}
          size="sm"
        >
          <div className="flex items-center gap-2">
            <span>{currentPriority.icon}</span>
            <span>{currentPriority.label}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {Object.entries(priorityConfig).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key as TaskPriority)}
            className="flex items-center gap-2"
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
            {value === key && <Flag className="h-3 w-3 ml-auto text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const config = priorityConfig[priority];
  return (
    <Badge
      variant="outline"
      className={`${config.color} border text-xs font-medium`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

export default TaskPrioritySelector;