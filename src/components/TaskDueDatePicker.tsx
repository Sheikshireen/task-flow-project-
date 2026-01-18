import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDueDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

const TaskDueDatePicker = ({ value, onChange, className }: TaskDueDatePickerProps) => {
  const [open, setOpen] = useState(false);

  const getDateLabel = (date: Date | null) => {
    if (!date) return 'No due date';

    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';

    return format(date, 'MMM d, yyyy');
  };

  const getDateColor = (date: Date | null) => {
    if (!date) return 'text-muted-foreground';

    if (isPast(date) && !isToday(date)) return 'text-red-600';
    if (isToday(date)) return 'text-orange-600';
    if (isTomorrow(date)) return 'text-yellow-600';

    return 'text-foreground';
  };

  const quickDates = [
    { label: 'Today', date: new Date() },
    { label: 'Tomorrow', date: addDays(new Date(), 1) },
    { label: 'This week', date: addDays(new Date(), 7) },
    { label: 'Next week', date: addDays(new Date(), 14) },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
            size="sm"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDateLabel(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex flex-wrap gap-1">
              {quickDates.map(({ label, date }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange(date);
                    setOpen(false);
                  }}
                  className="h-7 px-2 text-xs"
                >
                  {label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="h-7 px-2 text-xs text-muted-foreground"
              >
                No date
              </Button>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={(date) => {
              onChange(date || null);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(null)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const TaskDueDateBadge = ({ dueDate }: { dueDate: string | null }) => {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const label = (() => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  })();

  const colorClass = (() => {
    if (isPast(date) && !isToday(date)) return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (isToday(date)) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    if (isTomorrow(date)) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    return 'bg-muted text-muted-foreground border-border';
  })();

  return (
    <Badge variant="outline" className={`${colorClass} text-xs font-medium`}>
      <CalendarIcon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};

export default TaskDueDatePicker;