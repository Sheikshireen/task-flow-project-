import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import TaskPrioritySelector, { TaskPriority } from './TaskPrioritySelector';
import TaskDueDatePicker from './TaskDueDatePicker';
import TaskCategorySelector from './TaskCategorySelector';

interface CreateTaskFormProps {
  onSubmit: (
    title: string,
    description?: string,
    priority?: TaskPriority,
    dueDate?: Date,
    category?: string
  ) => Promise<{ error: any }>;
}

const CreateTaskForm = ({ onSubmit }: CreateTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    const { error } = await onSubmit(
      title.trim(),
      description.trim() || undefined,
      priority,
      dueDate || undefined,
      category || undefined
    );

    if (!error) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(null);
      setCategory(null);
      setIsOpen(false);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(null);
    setCategory(null);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full gradient-bg shadow-glow hover:shadow-lg transition-all duration-300 h-12"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create New Task
      </Button>
    );
  }

  return (
    <Card className="glass border-primary/30 shadow-lg animate-scale-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="text-base"
          />
          <Textarea
            placeholder="Add more details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          {/* Advanced Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Priority</label>
              <TaskPrioritySelector
                value={priority}
                onChange={setPriority}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <TaskCategorySelector
                value={category}
                onChange={setCategory}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Due Date (optional)</label>
            <TaskDueDatePicker
              value={dueDate}
              onChange={setDueDate}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="gradient-bg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
