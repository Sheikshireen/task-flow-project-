import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckSquare,
  Shield,
  Database,
  Code2,
  Lock,
  Layers,
  Zap,
  Users,
  Github,
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Authentication',
      description: 'Email/password authentication powered by Supabase Auth with session management and automatic token refresh.',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Row Level Security',
      description: 'Every user can only access their own data through PostgreSQL RLS policies, ensuring complete data isolation.',
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'PostgreSQL Database',
      description: 'Robust data persistence with Supabase PostgreSQL, featuring automatic timestamps and optimized indexes.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Real-time Updates',
      description: 'Instant task updates with optimistic UI patterns for a smooth, responsive user experience.',
    },
  ];

  const techStack = [
    { name: 'React.js', category: 'Frontend Framework' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Supabase', category: 'Backend & Auth' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Vite', category: 'Build Tool' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Code2 className="h-4 w-4" />
            Full Stack Developer Intern Assignment
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">TaskFlow</span>
            <br />
            <span className="text-foreground">Task Management System</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A secure, full-stack web application demonstrating modern development practices
            with React, Supabase, and PostgreSQL for efficient personal task management.
          </p>
        </section>

        {/* Project Overview */}
        <section className="mb-16">
          <div className="glass rounded-2xl p-8 border border-border/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl gradient-bg shadow-glow shrink-0">
                <CheckSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Project Overview</h2>
                <p className="text-muted-foreground">
                  TaskFlow is a personal task management system built as a technical assignment for a
                  Full Stack Developer Intern position. The application showcases proficiency in
                  modern web development technologies and best practices for building secure,
                  scalable applications.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Core Functionality
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    User registration and authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Create, read, update, and delete tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Mark tasks as completed/pending
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Search and filter tasks
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-secondary" />
                  Architecture Highlights
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Component-based React architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Custom hooks for state management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Type-safe development with TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Responsive, accessible UI design
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Security & Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass border-border/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="glass rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300 text-center group"
              >
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{tech.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-muted-foreground mb-4">
            Built with ❤️ for the Full Stack Developer Intern Technical Assignment
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Github className="h-4 w-4" />
            View Source Code
          </a>
        </footer>
      </main>
    </div>
  );
};

export default About;
