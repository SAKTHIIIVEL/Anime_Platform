import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, Heart, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const refreshAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setIsLoggedIn(!!token);
      setIsAdmin(user.role === 'admin' || user.email === 'sssakthivel928@gmail.com');
    };
    refreshAuth();
    window.addEventListener('authChanged', refreshAuth);
    return () => window.removeEventListener('authChanged', refreshAuth);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary">
              <span className="text-foreground font-bold text-xl">AV</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AnimeVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/search" className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/favorites" className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors">
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-primary/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-primary/10">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-primary text-foreground shadow-glow-primary">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            <Link
              to="/"
              className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full hover:bg-primary/10">
                    Login
                  </Button>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-gradient-primary text-foreground shadow-glow-primary">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;