import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckSquare, LogOut, Info, LayoutDashboard, User, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'sheik@gmail.com';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleProfileClick = () => {
    navigate('/dashboard');
    // We'll handle tab switching in the Dashboard component
    setTimeout(() => {
      const profileTab = document.querySelector('[value="profile"]') as HTMLElement;
      if (profileTab) {
        profileTab.click();
      }
    }, 100);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg gradient-bg shadow-glow group-hover:shadow-lg transition-all duration-300">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">TaskFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant={isActive('/dashboard') ? 'default' : 'ghost'}
                    size="sm"
                    className={isActive('/dashboard') ? 'gradient-bg' : ''}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant={isActive('/admin') ? 'default' : 'ghost'}
                      size="sm"
                      className={isActive('/admin') ? 'gradient-bg bg-gradient-to-r from-purple-500 to-blue-500' : ''}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/about">
                  <Button
                    variant={isActive('/about') ? 'default' : 'ghost'}
                    size="sm"
                    className={isActive('/about') ? 'gradient-bg' : ''}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfileClick}
                  className="flex items-center gap-2"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xs">
                      SS
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/about">
                  <Button
                    variant={isActive('/about') ? 'default' : 'ghost'}
                    size="sm"
                    className={isActive('/about') ? 'gradient-bg' : ''}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="gradient-bg shadow-glow hover:shadow-lg transition-all">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
