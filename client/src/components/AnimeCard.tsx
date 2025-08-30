import { Link } from 'react-router-dom';
import { Play, BookOpen, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnimeCardProps { anime: any }

const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <Link
      to={`/anime/${anime.id}`}
      className="group relative block overflow-hidden rounded-xl bg-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.thumbnailUrl || anime.thumbnail}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-background/80 backdrop-blur-sm border-primary/20">
            {anime.type === 'video' ? (
              <Play className="w-3 h-3 mr-1" />
            ) : (
              <BookOpen className="w-3 h-3 mr-1" />
            )}
            {anime.type === 'video' ? 'Video' : 'Novel'}
          </Badge>
        </div>
        
        {/* Rating */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold text-foreground">{anime.rating}</span>
        </div>
        
        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
            {anime.title}
          </h3>
          <p className="text-sm text-foreground/70 line-clamp-2 mb-2">
            {anime.description}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{anime.views.toLocaleString()}</span>
            </span>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {anime.category}
            </Badge>
          </div>
          
          {/* Episodes/Pages Count */}
          <div className="mt-2 text-xs text-foreground/60">
            {anime.type === 'video' 
              ? `${anime.episodes ?? 'undefined'} Episodes`
              : `${anime.pages ?? 'undefined'} Pages`
            }
          </div>
        </div>
      </div>
      
      {/* Hover Effect Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      </div>
    </Link>
  );
};

export default AnimeCard;