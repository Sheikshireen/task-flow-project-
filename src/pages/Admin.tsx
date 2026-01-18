import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  CheckSquare,
  TrendingUp,
  Search,
  Calendar,
  Clock,
  Target,
  Crown,
  GraduationCap,
  BarChart3,
  Filter,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/hooks/useTasks';
import { format } from 'date-fns';

interface AdminProfile extends Profile {
  user_id: string;
  email?: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  avgTasksPerUser: number;
}

const ADMIN_EMAIL = 'sheik@gmail.com';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    avgTasksPerUser: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, isAdmin, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Get user emails from auth.users (this would require admin privileges in production)
      const profilesWithEmails = await Promise.all(
        (profilesData || []).map(async (profile) => {
          try {
            // In a real admin scenario, you'd have admin privileges to access user emails
            // For now, we'll show user IDs
            return {
              ...profile,
              user_id: profile.id,
              email: `user-${profile.id.slice(0, 8)}@example.com`, // Mock email for demo
            };
          } catch {
            return {
              ...profile,
              user_id: profile.id,
              email: 'N/A',
            };
          }
        })
      );

      setProfiles(profilesWithEmails);
      setTasks(tasksData || []);

      // Calculate stats
      const totalUsers = profilesWithEmails.length;
      const totalTasks = tasksData?.length || 0;
      const completedTasks = tasksData?.filter(t => t.status === 'completed').length || 0;
      const pendingTasks = totalTasks - completedTasks;
      const avgTasksPerUser = totalUsers > 0 ? Math.round(totalTasks / totalUsers) : 0;

      setStats({
        totalUsers,
        totalTasks,
        completedTasks,
        pendingTasks,
        avgTasksPerUser,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const filteredProfiles = profiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTasks = (userId: string) => {
    return tasks.filter(task => task.user_id === userId);
  };

  const getTaskStatsForUser = (userId: string) => {
    const userTasks = getUserTasks(userId);
    const completed = userTasks.filter(t => t.status === 'completed').length;
    const total = userTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, completionRate };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You don't have administrator privileges to access this page.
            This area is restricted to authorized administrators only.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-500" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-primary">Sheik Shireen</span>!
            Monitor and manage all platform activities from this centralized dashboard.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-600">
              <Shield className="h-3 w-3 mr-1" />
              Administrator Access
            </Badge>
            <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-600">
              <GraduationCap className="h-3 w-3 mr-1" />
              Princeton Institute of Engineering & Technology
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users ({stats.totalUsers})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              All Tasks ({stats.totalTasks})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                      <p className="text-3xl font-bold text-blue-500">{stats.totalTasks}</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-blue-500/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
                      <p className="text-3xl font-bold text-green-500">{stats.completedTasks}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Tasks/User</p>
                      <p className="text-3xl font-bold text-purple-500">{stats.avgTasksPerUser}</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500/60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : (
                    tasks.slice(0, 10).map((task) => {
                      const userProfile = profiles.find(p => p.id === task.user_id);
                      return (
                        <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={userProfile?.avatar_url || undefined} />
                            <AvatarFallback>
                              {userProfile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {userProfile?.full_name || 'Unknown User'} created task "{task.title}"
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(task.created_at), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                            {task.status}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="glass border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredProfiles.map((profile) => {
                  const userTasks = getUserTasks(profile.id);
                  const taskStats = getTaskStatsForUser(profile.id);

                  return (
                    <Card
                      key={profile.id}
                      className="glass border-border/50 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedUser(selectedUser === profile.id ? null : profile.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                            <AvatarImage src={profile.avatar_url || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                              {profile.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{profile.full_name || 'No Name'}</h3>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Tasks</span>
                            <Badge variant="outline">{taskStats.total}</Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completed</span>
                              <span>{taskStats.completed}/{taskStats.total}</span>
                            </div>
                            <Progress value={taskStats.completionRate} className="h-2" />
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {format(new Date(profile.created_at), 'MMM yyyy')}</span>
                          </div>
                        </div>

                        {selectedUser === profile.id && (
                          <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                            <h4 className="font-medium text-sm">Recent Tasks</h4>
                            {userTasks.slice(0, 3).map((task) => (
                              <div key={task.id} className="flex items-center justify-between text-sm">
                                <span className="truncate flex-1 mr-2">{task.title}</span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Statistics */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Task Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                  </div>

                  {/* Priority Distribution */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Priority Distribution</h4>
                    {['urgent', 'high', 'medium', 'low'].map((priority) => {
                      const count = tasks.filter(t => t.priority === priority).length;
                      const percentage = stats.totalTasks > 0 ? Math.round((count / stats.totalTasks) * 100) : 0;
                      return (
                        <div key={priority} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{priority}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getPriorityColor(priority).split(' ')[0]}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-8 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* All Tasks List */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    All Tasks ({stats.totalTasks})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {loading ? (
                      Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                          <Skeleton className="w-8 h-8 rounded" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                    ) : (
                      tasks.map((task) => {
                        const userProfile = profiles.find(p => p.id === task.user_id);
                        return (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                          >
                            <div className={`w-3 h-3 rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-medium text-sm truncate ${
                                  task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                                }`}>
                                  {task.title}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{userProfile?.full_name || 'Unknown'}</span>
                                <span>•</span>
                                <span>{format(new Date(task.created_at), 'MMM d')}</span>
                                {task.category && (
                                  <>
                                    <span>•</span>
                                    <span>{task.category}</span>
                                  </>
                                )}
                              </div>
                              {task.progress > 0 && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>{task.progress}%</span>
                                  </div>
                                  <Progress value={task.progress} className="h-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;