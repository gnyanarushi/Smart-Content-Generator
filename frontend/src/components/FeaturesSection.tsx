import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';
import { 
  PenTool, 
  Brain, 
  Zap, 
  Target, 
  Globe, 
  Shield,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: 'Advanced AI Writing',
    description: 'Leverage cutting-edge language models to create human-like content that engages your audience.',
    color: 'text-primary'
  },
  {
    icon: PenTool,
    title: 'Multiple Content Types',
    description: 'From blog posts to social media content, emails to product descriptions - we cover it all.',
    color: 'text-secondary'
  },
  {
    icon: Zap,
    title: 'Lightning Speed',
    description: 'Generate high-quality content in seconds, not hours. Boost your productivity exponentially.',
    color: 'text-accent'
  },
  {
    icon: Target,
    title: 'SEO Optimized',
    description: 'Built-in SEO optimization ensures your content ranks higher and reaches more people.',
    color: 'text-primary'
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Create content in over 30 languages with native-level fluency and cultural awareness.',
    color: 'text-secondary'
  },
  {
    icon: Shield,
    title: 'Plagiarism Free',
    description: 'Every piece of content is original and unique, backed by advanced plagiarism detection.',
    color: 'text-accent'
  },
  {
    icon: Sparkles,
    title: 'Creative Enhancement',
    description: 'Transform bland content into engaging stories with our creative writing algorithms.',
    color: 'text-primary'
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    description: 'Track your content performance and optimize based on real-time engagement metrics.',
    color: 'text-secondary'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work seamlessly with your team with real-time collaboration and version control.',
    color: 'text-accent'
  }
];

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Cards stagger animation
      gsap.fromTo('.feature-card',
        { y: 100, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: {
            amount: 1.2,
            from: 'start'
          },
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            end: 'bottom 40%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Hover animations for cards
      const cards = document.querySelectorAll('.feature-card');
      cards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        const content = card.querySelector('.feature-content');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(icon, { scale: 1.2, rotation: 5, duration: 0.3, ease: 'back.out(1.7)' });
          gsap.to(content, { y: -5, duration: 0.3, ease: 'power2.out' });
          gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(content, { y: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-4 relative">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful Features for{' '}
            <span className="text-gradient-secondary">Modern Creators</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, optimize, and scale your content creation workflow with the power of AI.
          </p>
        </div>

        {/* Features grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="feature-card card-gradient p-8 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="feature-icon mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center group-hover:bg-gradient-primary/20 transition-colors`}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                </div>
                
                <div className="feature-content">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-lg text-muted-foreground mb-8">
            Ready to transform your content creation process?
          </p>
          <button className="btn-hero">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};