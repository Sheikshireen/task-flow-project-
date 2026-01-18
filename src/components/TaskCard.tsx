import { useState } from 'react';
import { Task } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, X, Check, Calendar, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import { TaskPriorityBadge } from './TaskPrioritySelector';
import { TaskDueDateBadge } from './TaskDueDatePicker';
import { TaskCategoryBadge } from './TaskCategorySelector';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => Promise<{ error: any } | undefined>;
  onUpdate: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'due_date' | 'category' | 'progress'>>) => Promise<{ error: any }>;
  onDelete: (id: string) => Promise<{ error: any }>;
}

const TaskCard = ({ task, onToggleStatus, onUpdate, onDelete }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsLoading(true);
    const { error } = await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    if (!error) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleToggle = async () => {
    setIsLoading(true);
    await onToggleStatus(task.id);
    setIsLoading(false);
  };

  const isCompleted = task.status === 'completed';

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in ${
        isCompleted ? 'bg-muted/50 border-success/30' : 'glass border-border/50 hover:border-primary/30'
      }`}
    >
      {/* Status indicator bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
          isCompleted ? 'bg-success' : 'bg-primary'
        }`}
      />

      <CardHeader className="pb-2 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggle}
              disabled={isLoading}
              className={`mt-1 h-5 w-5 transition-colors ${
                isCompleted ? 'border-success data-[state=checked]:bg-success' : 'border-primary'
              }`}
            />
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="font-semibold"
                placeholder="Task title"
                autoFocus
              />
            ) : (
              <h3
                className={`font-semibold text-base leading-tight break-words ${
                  isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
              >
                {task.title}
              </h3>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isEditing ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={isLoading || !editTitle.trim()}
                  className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{task.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(task.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-5">
        {isEditing ? (
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add a description..."
            className="min-h-[80px] resize-none"
          />
        ) : (
          task.description && (
            <p
              className={`text-sm leading-relaxed mb-3 ${
                isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {task.description}
            </p>
          )
        )}

        {/* Task Details */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <TaskPriorityBadge priority={task.priority} />
          {task.category && <TaskCategoryBadge category={task.category} />}
          {task.due_date && <TaskDueDateBadge dueDate={task.due_date} />}
        </div>

        {/* Progress */}
        {task.status !== 'completed' && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-3 w-3" />
                Progress
              </span>
              <span className="font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.created_at), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(task.updated_at), 'h:mm a')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
