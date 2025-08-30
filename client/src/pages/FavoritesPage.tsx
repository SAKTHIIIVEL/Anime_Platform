import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '@/services/api';
import AnimeCard from '@/components/AnimeCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    
    if (token) {
      loadFavorites();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await userAPI.getFavorites();
      // backend returns { success, data: { favorites, pagination } }
      const items = (response?.data?.favorites || []);
      setFavorites(items);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Sign in to see your favorites</h1>
            <p className="text-muted-foreground mb-8">
              Create an account or sign in to save your favorite anime
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/login')}
                className="bg-gradient-primary text-foreground shadow-glow-primary"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/register')}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My <span className="bg-gradient-primary bg-clip-text text-transparent">Favorites</span>
          </h1>
          <p className="text-muted-foreground">Your saved anime collection</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] bg-card rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {favorites.length} anime in your favorites
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {favorites.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">No favorites yet</h2>
            <p className="text-muted-foreground mb-8">
              Start exploring and add anime to your favorites
            </p>
            <Button
              onClick={() => navigate('/search')}
              className="bg-gradient-primary text-foreground shadow-glow-primary"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Anime
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FavoritesPage;