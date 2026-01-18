import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { CheckSquare, ArrowRight, Shield, Zap, ListTodo } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <Navbar />

      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center py-20">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Shield className="h-4 w-4" />
              Secure Task Management
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Organize Your Tasks
              <br />
              <span className="gradient-text">With Confidence</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A secure, modern task management system built with React and Supabase.
              Your data is protected with enterprise-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {loading ? (
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              ) : user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="gradient-bg shadow-glow hover:shadow-lg transition-all text-lg px-8">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="gradient-bg shadow-glow hover:shadow-lg transition-all text-lg px-8">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
            {[
              {
                icon: <CheckSquare className="h-6 w-6" />,
                title: 'Easy Task Management',
                description: 'Create, edit, and organize tasks with an intuitive interface.',
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Secure by Design',
                description: 'Your data is protected with Row Level Security policies.',
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Fast & Responsive',
                description: 'Built with modern tech for a smooth, snappy experience.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
