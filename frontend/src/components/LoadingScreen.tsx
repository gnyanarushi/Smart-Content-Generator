import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import logo from '@/assets/ai-scribe-logo.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Initial logo animation
    tl.fromTo('.loading-logo', 
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' }
    )
    .fromTo('.loading-text',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo('.loading-tagline',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3'
    );

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Fade out animation
          gsap.to('.loading-screen', {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: onLoadingComplete
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-hero">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo */}
        <div className="loading-logo flex justify-center">
          <div className="relative">
            <img 
              src={logo} 
              alt="AI Scribe Studio" 
              className="w-24 h-24 drop-shadow-2xl pulse-glow"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-xl"></div>
          </div>
        </div>

        {/* Brand name */}
        <div className="loading-text">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
            AI Scribe Studio
          </h1>
          <div className="loading-tagline">
            <p className="text-lg text-muted-foreground">
              Smart Content Creation Platform
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-80 max-w-sm">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out glow-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {progress < 100 ? 'Initializing AI Systems...' : 'Ready!'}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.4s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};