import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animeAPI } from '@/services/api';
import VideoPlayer from '@/components/VideoPlayer';
import PDFViewer from '@/components/PDFViewer';
import CommentBox from '@/components/CommentBox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, BookOpen, Eye, Star, ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AnimeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anime, setAnime] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      loadAnimeDetails();
      checkFavoriteStatus();
    }
  }, [id]);

  const loadAnimeDetails = async () => {
    try {
      const animeObj = await animeAPI.getById(id!);
      setAnime(animeObj);
      // load related by category (exclude current)
      if (animeObj?.category) {
        const res = await animeAPI.search('', undefined, animeObj.category);
        const items = res?.data?.animes || [];
        setRelated(items.filter((a: any) => a.id !== animeObj.id).slice(0, 6));
      }
      // load episodes
      const epRes = await animeAPI.getEpisodes(animeObj.id.toString());
      const eps = epRes?.data?.episodes || [];
      setEpisodes(eps);
      if (eps.length > 0) {
        setActiveEpisode(eps[0]);
      } else {
        setActiveEpisode(null);
      }
    } catch (error) {
      console.error('Failed to load anime details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load anime details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.favorites && id) {
      setIsFavorite(user.favorites.includes(id));
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please login to add favorites',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      const response = await animeAPI.toggleFavorite(id!);
      setIsFavorite(response.isFavorite);
      toast({
        title: 'Success',
        description: response.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: anime?.title,
        text: anime?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Share link copied to clipboard',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="animate-pulse">
            <div className="h-[500px] bg-card rounded-xl mb-8" />
            <div className="h-8 bg-card rounded w-1/3 mb-4" />
            <div className="h-4 bg-card rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Anime not found</h1>
          <Button onClick={() => navigate('/')} className="bg-gradient-primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Media Column */}
          <div className="lg:col-span-2">
            {/* Thumbnail First */}
            {anime.thumbnailUrl && (
              <div className="w-full mb-6">
                <img
                  src={anime.thumbnailUrl}
                  alt={anime.title}
                  className="w-full max-h-[460px] object-fill rounded-xl border border-border"
                />
              </div>
            )}

            {/* Episode selector and Player */}
            {episodes.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Episodes</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {episodes.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setActiveEpisode(ep)}
                      className={`text-left px-3 py-2 rounded border ${activeEpisode?.id === ep.id ? 'border-primary text-primary' : 'border-border text-foreground/80'} hover:border-primary/50`}
                    >
                      Ep {ep.number}: {ep.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(activeEpisode || anime).type === 'video' ? (
              <VideoPlayer videoUrl={(activeEpisode && (activeEpisode.videoUrl)) || anime.fileUrl} title={(activeEpisode && activeEpisode.title) || anime.title} />
            ) : (
              <PDFViewer pdfUrl={(activeEpisode && (activeEpisode.pdfUrl)) || anime.fileUrl} title={(activeEpisode && activeEpisode.title) || anime.title} />
            )}

            {/* Anime Info */}
            <div className="mt-8 bg-card rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{anime.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {anime.views?.toLocaleString?.() || anime.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {anime.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleToggleFavorite}
                    variant="outline"
                    size="icon"
                    className={isFavorite ? 'text-accent border-accent' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {anime.category}
                </Badge>
                <Badge variant="secondary" className="bg-secondary/20">
                  {anime.type === 'video' ? (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Video
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3 h-3 mr-1" />
                      Novel
                    </>
                  )}
                </Badge>
              </div>

              <p className="text-foreground/80 leading-relaxed">{anime.description}</p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Uploaded by <span className="text-primary">{anime.uploadedBy}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Anime by Category */}
            <div className="bg-card rounded-xl p-6 border border-border mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Related Anime</h3>
              <div className="space-y-4">
                {related.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No related anime found.</p>
                ) : (
                  related.map((ra) => (
                    <div key={ra.id} className="flex gap-3 cursor-pointer" onClick={() => navigate(`/anime/${ra.id}`)}>
                      <img src={ra.thumbnailUrl} alt={ra.title} className="w-16 h-20 rounded-lg object-cover border border-border" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground line-clamp-2">{ra.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{ra.category}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 bg-card rounded-xl p-6 border border-border">
          <CommentBox animeId={id!} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AnimeDetailsPage;