import { useState, useEffect } from 'react';
import { animeAPI } from '@/services/api';
import AnimeCard from '@/components/AnimeCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';

const HomePage = () => {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    try {
      const payload = await animeAPI.getList();
      setAnimeList(payload?.data?.animes || []);
    } catch (error) {
      console.error('Failed to load anime:', error);
      setAnimeList([]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Your Gateway to Anime</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Welcome to{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AnimeVerse
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Stream your favorite anime videos and dive into captivating novels.
              All in one place, all for free.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 pb-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Latest Anime</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-card rounded-lg text-sm text-muted-foreground">
                {animeList.length} titles available
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] bg-card rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {animeList.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;