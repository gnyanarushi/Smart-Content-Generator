import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { OverviewSection } from '@/components/OverviewSection';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Set dark mode by default for the AI theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      
      {!isLoading && (
        <main className="relative">
          {/* SEO Meta Data */}
          <>
            <title>AI Scribe Studio - Smart Content Creation Platform</title>
            <meta name="description" content="Transform your ideas into compelling content with AI Scribe Studio. Generate blogs, social media posts, and marketing copy 10x faster with our advanced AI writing assistant." />
            <meta name="keywords" content="AI writing, content creation, copywriting, blog generator, social media content, marketing copy" />
            <link rel="canonical" href="https://aiscribestudio.com" />
          </>

          {/* Hero Section */}
          <HeroSection />

          {/* Features Section */}
          <FeaturesSection />

          {/* Overview Section */}
          <OverviewSection />

          {/* Footer */}
          <footer className="py-20 px-4 border-t border-border/50">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gradient mb-4">
                  AI Scribe Studio
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Empowering creators with intelligent content generation. 
                  Join thousands who've transformed their content workflow.
                </p>
              </div>
              
              <div className="border-t border-border/30 pt-8">
                <p className="text-sm text-muted-foreground">
                  © 2024 AI Scribe Studio. All rights reserved. Built with ❤️ and AI.
                </p>
              </div>
            </div>
          </footer>
        </main>
      )}
    </>
  );
};

export default Index;