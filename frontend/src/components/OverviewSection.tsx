import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Clock, 
  Users, 
  Trophy,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Users, value: '50K+', label: 'Active Users', color: 'text-primary' },
  { icon: Clock, value: '10M+', label: 'Hours Saved', color: 'text-secondary' },
  { icon: BarChart3, value: '98%', label: 'Satisfaction Rate', color: 'text-accent' },
  { icon: Trophy, value: '#1', label: 'AI Writing Tool', color: 'text-primary' }
];

const benefits = [
  'Generate content 10x faster than traditional methods',
  'Maintain consistent brand voice across all platforms',
  'Access to 30+ content templates and formats',
  'Built-in SEO optimization and keyword research',
  'Real-time collaboration with team members',
  'Advanced analytics and performance tracking'
];

export const OverviewSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stats animation
      gsap.fromTo('.stat-card',
        { y: 80, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.2,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Content blocks animation
      gsap.fromTo('.content-block',
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.3,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            end: 'bottom 50%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Benefits list animation
      gsap.fromTo('.benefit-item',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.benefits-list',
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Floating animation for decorative elements
      gsap.to('.float-element', {
        y: -15,
        duration: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="float-element absolute top-40 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl" />
        <div className="float-element absolute bottom-40 right-20 w-40 h-40 bg-gradient-secondary opacity-10 rounded-full blur-2xl" />
        <div className="float-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats section */}
        <div ref={statsRef} className="mb-32">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm border-primary/20 bg-primary/5">
              Trusted by Thousands
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose{' '}
              <span className="text-gradient">AI Scribe Studio?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card 
                  key={index}
                  className="stat-card card-gradient p-8 text-center border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center">
                      <IconComponent className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Content overview */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="content-block">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-secondary/20 bg-secondary/5">
              How It Works
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              From Idea to Publication in{' '}
              <span className="text-gradient-secondary">Minutes</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our AI-powered platform streamlines your entire content creation workflow. 
              Simply input your ideas, choose your format, and watch as our advanced algorithms 
              transform your concepts into polished, publication-ready content.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <span className="text-foreground">Input your topic or brief</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-secondary">2</span>
                </div>
                <span className="text-foreground">Choose format and style preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent">3</span>
                </div>
                <span className="text-foreground">Get AI-generated content in seconds</span>
              </div>
            </div>

            <button className="btn-hero group" onClick={() => window.location.href = '/dashboard'}>
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="content-block">
            <Card className="card-gradient p-8 border-border">
              <h4 className="text-2xl font-semibold mb-6 text-center">
                What You Get
              </h4>
              <div className="benefits-list space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Join thousands of satisfied creators
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-gradient-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    4.9/5 average rating
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};