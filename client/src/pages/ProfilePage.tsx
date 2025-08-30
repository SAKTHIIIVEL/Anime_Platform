import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Heart, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Helper function to convert relative URLs to absolute URLs
const toAbsoluteUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${url}`;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameEdit, setNameEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [avatarEdit, setAvatarEdit] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const profile = response?.data?.profile || response?.data?.user || response?.data || response;
      setUser(profile);
      setNameEdit(profile.username || '');
      setEmailEdit(profile.email || '');
      setAvatarEdit(profile.avatarUrl || '');
      setAvatarPreview(toAbsoluteUrl(profile.avatarUrl) || null);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      
      // Check if we have a new avatar file
      if (avatarFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('username', nameEdit);
        formData.append('email', emailEdit);
        formData.append('avatar', avatarFile);
        
        res = await userAPI.updateProfile(formData);
      } else {
        // Use JSON for text-only updates
        res = await userAPI.updateProfile({ 
          username: nameEdit, 
          email: emailEdit, 
          avatarUrl: avatarEdit 
        });
      }
      
      const updated = res?.data?.user || res?.data || { ...user, username: nameEdit, email: emailEdit, avatarUrl: avatarEdit };
      setUser(updated);
      setEditing(false);
      setAvatarFile(null);
      // Update avatar preview with the new avatar URL from the response
      setAvatarPreview(toAbsoluteUrl(updated.avatarUrl) || null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-card rounded-full mx-auto mb-4" />
            <div className="h-8 bg-card rounded w-1/3 mx-auto mb-2" />
            <div className="h-4 bg-card rounded w-1/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-primary/20">
            <AvatarImage src={toAbsoluteUrl(user.avatarUrl || user.avatar)} alt={user.username} />
            <AvatarFallback className="text-2xl bg-gradient-primary text-foreground">
              {user.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">{user.username}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Profile Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Member Since
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {new Date(user.joinDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Favorites
              </CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {user.favorites?.length || 0}
              </div>
              <Button
                onClick={() => navigate('/favorites')}
                variant="link"
                className="p-0 h-auto text-primary"
              >
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uploaded
              </CardTitle>
              <Upload className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {user.uploaded?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!editing ? (
                <>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="text-foreground">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avatar</p>
                      <p className="text-foreground break-all">{user.avatarUrl ? 'Custom avatar set' : 'No avatar set'}</p>
                    </div>
                  </div>
                  <Button onClick={() => setEditing(true)} className="bg-gradient-primary">Edit Profile</Button>
                </>
              ) : (
                <form onSubmit={saveProfile} className="grid gap-4">
                  <div>
                    <Label htmlFor="uname">Username</Label>
                    <Input id="uname" value={nameEdit} onChange={(e) => setNameEdit(e.target.value)} className="bg-background border-border" />
                  </div>
                  <div>
                    <Label htmlFor="uemail">Email</Label>
                    <Input id="uemail" value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} className="bg-background border-border" />
                  </div>
                  <div>
                    <Label htmlFor="uavatar">Avatar</Label>
                    <Input 
                      id="uavatar" 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setAvatarFile(file);
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setAvatarPreview(url);
                        }
                      }}
                      className="bg-background border-border"
                    />
                    {avatarPreview && (
                      <div className="mt-2">
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-20 h-20 object-cover rounded-full border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-gradient-primary">Save</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setEditing(false);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}>Cancel</Button>
                  </div>
                </form>
              )}
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-foreground">
                    {new Date(user.joinDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;