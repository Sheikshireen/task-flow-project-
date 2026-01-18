import { CheckSquare, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-results';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No matching tasks</h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="p-6 rounded-2xl gradient-bg shadow-glow animate-float">
          <CheckSquare className="h-12 w-12 text-primary-foreground" />
        </div>
        <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-card border border-border shadow-md">
          <Plus className="h-4 w-4 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Get started by creating your first task. Stay organized and boost your productivity!
      </p>
    </div>
  );
};

export default EmptyState;
