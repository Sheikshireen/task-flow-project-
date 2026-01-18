import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, User, Crown } from 'lucide-react';

const UserProfile = () => {
  const { profile, loading, createProfile } = useProfile();

  // Default profile data
  const defaultProfile = {
    name: "Sheik Shireen",
    education: "4th Year, Princeton Institute of Engineering and Technology for Women",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80", // Beautiful girl avatar
    role: "Computer Science Student"
  };

  useEffect(() => {
    // Auto-create profile if it doesn't exist
    if (!loading && !profile) {
      createProfile(defaultProfile.name, defaultProfile.avatar);
    }
  }, [loading, profile, createProfile]);

  if (loading) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayProfile = profile || {
    full_name: defaultProfile.name,
    avatar_url: defaultProfile.avatar
  };

  return (
    <Card className="glass border-border/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-16 h-16 ring-2 ring-primary/20">
              <AvatarImage
                src={displayProfile.avatar_url || defaultProfile.avatar}
                alt={displayProfile.full_name || defaultProfile.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {displayProfile.full_name || defaultProfile.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                👩‍🎓 Student
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>{defaultProfile.education}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                💻 Computer Science
              </Badge>
              <Badge variant="outline" className="text-xs bg-success/5 border-success/20">
                🎯 Task Management Pro
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">🎓</div>
              <div className="text-xs text-muted-foreground">Engineering Student</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">🚀</div>
              <div className="text-xs text-muted-foreground">Tech Enthusiast</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">✨</div>
              <div className="text-xs text-muted-foreground">Task Wizard</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;