import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tag, Plus, X } from 'lucide-react';

interface TaskCategorySelectorProps {
  value: string | null;
  onChange: (category: string | null) => void;
  className?: string;
  availableCategories?: string[];
}

const defaultCategories = [
  'Work',
  'Personal',
  'Health',
  'Education',
  'Finance',
  'Travel',
  'Shopping',
  'Home',
  'Projects',
  'Meetings',
];

const categoryColors = [
  'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'bg-green-500/10 text-green-600 border-green-500/20',
  'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'bg-pink-500/10 text-pink-600 border-pink-500/20',
  'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'bg-red-500/10 text-red-600 border-red-500/20',
  'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'bg-teal-500/10 text-teal-600 border-teal-500/20',
  'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'bg-gray-500/10 text-gray-600 border-gray-500/20',
];

const getCategoryColor = (category: string) => {
  const index = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % categoryColors.length;
  return categoryColors[index];
};

const TaskCategorySelector = ({
  value,
  onChange,
  className,
  availableCategories = defaultCategories
}: TaskCategorySelectorProps) => {
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim()) {
      onChange(customCategory.trim());
      setCustomCategory('');
      setShowCustomInput(false);
    }
  };

  const allCategories = Array.from(new Set([...availableCategories, ...(value ? [value] : [])]));

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="justify-between"
            size="sm"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{value || 'No category'}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="p-2">
            {allCategories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onChange(category)}
                className="flex items-center justify-between"
              >
                <span>{category}</span>
                {value === category && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
          </div>

          <div className="border-t p-2">
            {showCustomInput ? (
              <form onSubmit={handleCustomCategorySubmit} className="space-y-2">
                <Input
                  placeholder="New category..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  autoFocus
                  className="h-8"
                />
                <div className="flex gap-1">
                  <Button type="submit" size="sm" className="h-7 flex-1">
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomCategory('');
                    }}
                    className="h-7 px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomInput(true)}
                className="w-full justify-start h-8"
              >
                <Plus className="h-3 w-3 mr-2" />
                Add custom category
              </Button>
            )}
          </div>

          {value && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
                className="w-full justify-start h-8 text-muted-foreground"
              >
                <X className="h-3 w-3 mr-2" />
                Remove category
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const TaskCategoryBadge = ({ category }: { category: string | null }) => {
  if (!category) return null;

  return (
    <Badge
      variant="outline"
      className={`${getCategoryColor(category)} text-xs font-medium`}
    >
      <Tag className="h-3 w-3 mr-1" />
      {category}
    </Badge>
  );
};

export default TaskCategorySelector;