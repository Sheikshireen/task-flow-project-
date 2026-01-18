import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Task } from '@/hooks/useTasks';
import { CheckCircle2, Clock, TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';

interface TaskChartProps {
  tasks: Task[];
}

const COLORS = {
  completed: '#22c55e',
  pending: '#f59e0b',
  low: '#3b82f6',
  medium: '#8b5cf6',
  high: '#ef4444',
  urgent: '#dc2626',
};

const TaskChart = ({ tasks }: TaskChartProps) => {
  const chartData = useMemo(() => {
    // Status distribution
    const statusData = [
      { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: COLORS.completed },
      { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: COLORS.pending },
    ].filter(item => item.value > 0);

    // Priority distribution
    const priorityData = [
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: COLORS.low },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: COLORS.medium },
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: COLORS.high },
      { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: COLORS.urgent },
    ].filter(item => item.value > 0);

    // Category distribution
    const categoryMap = new Map<string, number>();
    tasks.forEach(task => {
      if (task.category) {
        categoryMap.set(task.category, (categoryMap.get(task.category) || 0) + 1);
      }
    });
    const categoryData = Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
    }));

    // Progress distribution
    const progressRanges = [
      { range: '0-25%', min: 0, max: 25 },
      { range: '26-50%', min: 26, max: 50 },
      { range: '51-75%', min: 51, max: 75 },
      { range: '76-99%', min: 76, max: 99 },
      { range: '100%', min: 100, max: 100 },
    ];

    const progressData = progressRanges.map(({ range, min, max }) => ({
      name: range,
      value: tasks.filter(t => t.progress >= min && t.progress <= max && t.status !== 'completed').length,
    })).filter(item => item.value > 0);

    // Daily completion trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return startOfDay(date);
    });

    const completionTrend = last7Days.map(date => {
      const completedOnDate = tasks.filter(task => {
        if (task.status !== 'completed') return false;
        const completedDate = startOfDay(new Date(task.updated_at));
        return completedDate.getTime() === date.getTime();
      }).length;

      return {
        date: format(date, 'MMM dd'),
        completed: completedOnDate,
      };
    });

    return {
      statusData,
      priorityData,
      categoryData,
      progressData,
      completionTrend,
    };
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const avgProgress = tasks.length > 0
      ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
      : 0;

    const overdueTasks = tasks.filter(task =>
      task.due_date &&
      new Date(task.due_date) < new Date() &&
      task.status !== 'completed'
    ).length;

    return {
      total,
      completed,
      pending,
      completionRate,
      avgProgress,
      overdueTasks,
    };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks to analyze yet</p>
            <p className="text-sm">Create some tasks to see your progress charts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Completion Overview */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Task Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>

            {chartData.statusData.length > 0 && (
              <ChartContainer
                config={{
                  completed: { label: 'Completed', color: COLORS.completed },
                  pending: { label: 'Pending', color: COLORS.pending },
                }}
                className="h-[200px]"
              >
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Priority Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.priorityData.length > 0 ? (
            <ChartContainer
              config={{
                low: { label: 'Low', color: COLORS.low },
                medium: { label: 'Medium', color: COLORS.medium },
                high: { label: 'High', color: COLORS.high },
                urgent: { label: 'Urgent', color: COLORS.urgent },
              }}
              className="h-[200px]"
            >
              <PieChart>
                <Pie
                  data={chartData.priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {chartData.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No priority data</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progress Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{stats.completionRate}%</div>
                <div className="text-xs text-muted-foreground">Completion Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.avgProgress}%</div>
                <div className="text-xs text-muted-foreground">Avg Progress</div>
              </div>
            </div>

            {chartData.completionTrend.length > 0 && (
              <ChartContainer
                config={{
                  completed: { label: 'Completed', color: COLORS.completed },
                }}
                className="h-[120px]"
              >
                <AreaChart data={chartData.completionTrend}>
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke={COLORS.completed}
                    fill={COLORS.completed}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      {chartData.categoryData.length > 0 && (
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Categories Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartData.categoryData.reduce((acc, item, index) => {
                acc[item.name] = { label: item.name, color: item.color };
                return acc;
              }, {} as any)}
              className="h-[200px]"
            >
              <BarChart data={chartData.categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Overdue Tasks Alert */}
      {stats.overdueTasks > 0 && (
        <Card className="glass border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-destructive" />
              <div>
                <div className="font-semibold text-destructive">{stats.overdueTasks} Overdue</div>
                <div className="text-sm text-muted-foreground">
                  Tasks past their due date
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskChart;