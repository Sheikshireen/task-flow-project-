import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { TaskPriority } from './TaskPrioritySelector';

export type FilterStatus = 'all' | 'pending' | 'completed';
export type SortOption = 'created_desc' | 'created_asc' | 'due_date' | 'priority' | 'progress';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  priorityFilter: TaskPriority | 'all';
  onPriorityFilterChange: (priority: TaskPriority | 'all') => void;
  categoryFilter: string | 'all';
  onCategoryFilterChange: (category: string | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
  availableCategories: string[];
}

const TaskFilters = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  counts,
  availableCategories,
}: TaskFiltersProps) => {
  const statusFilters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityFilters: { value: TaskPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'progress', label: 'Progress' },
  ];

  const activeFiltersCount =
    (priorityFilter !== 'all' ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {statusFilters.map(({ value, label }) => (
              <Button
                key={value}
                variant={filter === value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange(value)}
                className={filter === value ? 'gradient-bg' : ''}
              >
                {label}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    filter === value
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {counts[value]}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              {sortOptions.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onSortChange(value)}
                  className="flex items-center justify-between"
                >
                  {label}
                  {sortBy === value && <div className="w-2 h-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              {priorityFilters.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onPriorityFilterChange(value)}
                  className="flex items-center justify-between"
                >
                  {label}
                  {priorityFilter === value && <div className="w-2 h-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onCategoryFilterChange('all')}
                className="flex items-center justify-between"
              >
                All Categories
                {categoryFilter === 'all' && <div className="w-2 h-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
              {availableCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => onCategoryFilterChange(category)}
                  className="flex items-center justify-between"
                >
                  {category}
                  {categoryFilter === category && <div className="w-2 h-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('');
                onPriorityFilterChange('all');
                onCategoryFilterChange('all');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(priorityFilter !== 'all' || categoryFilter !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          {priorityFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Priority: {priorityFilters.find(p => p.value === priorityFilter)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onPriorityFilterChange('all')}
              />
            </Badge>
          )}
          {categoryFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Category: {categoryFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onCategoryFilterChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
