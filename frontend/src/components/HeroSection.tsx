import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(titleRef.current, 
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(subtitleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.6'
      )
      .fromTo(buttonsRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4'
      );

      // Floating animation for decorative elements
      gsap.to('.float-1', {
        y: -20,
        duration: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      });

      gsap.to('.float-2', {
        y: -30,
        duration: 4,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1
      });

      gsap.to('.float-3', {
        y: -25,
        duration: 3.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="float-1 absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="float-2 absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
        <div className="float-3 absolute bottom-40 left-20 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Title */}
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          Create Stunning Content with{' '}
          <span className="text-gradient block">AI Power</span>
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Transform your ideas into compelling content with our advanced AI writing assistant. 
          From blogs to social media, we've got your creative needs covered.
        </p>

        {/* CTA Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button className="btn-hero group" onClick={() => window.location.href = '/dashboard'}>
            Start Creating for Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button variant="outline" size="lg" className="rounded-full px-8 py-4 text-lg border-border bg-card/50 backdrop-blur-sm hover:bg-card">
            Watch Demo
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-3 text-muted-foreground">
            <Zap className="h-5 w-5 text-primary" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-muted-foreground">
            <Sparkles className="h-5 w-5 text-secondary" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-muted-foreground">
            <ArrowRight className="h-5 w-5 text-accent" />
            <span>Easy to Use</span>
          </div>
        </div>
      </div>
    </section>
  );
};