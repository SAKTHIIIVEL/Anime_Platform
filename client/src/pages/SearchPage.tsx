import { useState, useEffect } from 'react';
import { animeAPI } from '@/services/api';
import AnimeCard from '@/components/AnimeCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const categories = ['All', 'Action', 'Adventure', 'Psychological', 'Dark Fantasy', 'Superhero'];

  useEffect(() => {
    // Load all anime on mount
    handleSearch();
  }, []);

  // Run search automatically whenever filters or query change
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    handleSearch();
  }, 500); // wait 500ms after typing before searching

  return () => clearTimeout(delayDebounce);
}, [searchQuery, selectedType, selectedCategory]);


  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await animeAPI.search(
        searchQuery,
        selectedType === 'all' ? undefined : selectedType,
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setSearchResults(response?.data?.animes || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Search <span className="bg-gradient-primary bg-clip-text text-transparent">Anime</span>
          </h1>
          <p className="text-muted-foreground">Find your favorite anime videos and novels</p>
        </div>

        {/* Search Bar & Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card rounded-xl p-6 border border-border shadow-elevated">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search anime titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-background border-border focus:border-primary"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[150px] bg-background border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="novel">Novel</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px] bg-background border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={handleSearch}
                className="bg-gradient-primary text-foreground shadow-glow-primary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] bg-card rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No anime found matching your criteria</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters</p>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;