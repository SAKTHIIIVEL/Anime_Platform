import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animeAPI, adminAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Upload, Users, Film, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<'video' | 'novel'>('video');
  // For holding the actual uploaded file
const [editThumbnail, setEditThumbnail] = useState<File | null>(null);
// For holding the preview URL (string)
const [editThumbnailPreview, setEditThumbnailPreview] = useState<string | null>(null);


  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'video' | 'novel'>('video');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [episodeAnimeId, setEpisodeAnimeId] = useState<string | null>(null);
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [episodeType, setEpisodeType] = useState<'video' | 'novel'>('video');
  const [episodeVideo, setEpisodeVideo] = useState<File | null>(null);
  const [episodePdf, setEpisodePdf] = useState<File | null>(null);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [currentEpisodes, setCurrentEpisodes] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
    loadData();
  }, []);

  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
      toast({
        title: 'Access Denied',
        description: 'Admin access required',
        variant: 'destructive',
      });
    }
  };

  const loadData = async () => {
    try {
      const [animeResponse, usersResponse] = await Promise.all([
        animeAPI.getList(),
        adminAPI.getUsers(),
      ]);
      setAnimeList(animeResponse?.data?.animes || []);
      setUsers(usersResponse || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // When an anime is selected for episode creation, infer type and next number
  useEffect(() => {
    const inferEpisodeDefaults = async () => {
      if (!episodeAnimeId) return;
      setEpisodeLoading(true);
      try {
        // find anime in list for base type
        const selected = animeList.find((a) => String(a.id) === String(episodeAnimeId));
        if (selected?.type === 'video' || selected?.type === 'novel') {
          setEpisodeType(selected.type);
        }
        const res = await animeAPI.getEpisodes(String(episodeAnimeId));
        const eps = res?.data?.episodes || [];
        setCurrentEpisodes(eps);
        if (eps.length > 0) {
          // assume consistent type across episodes
          if (eps[0]?.type === 'video' || eps[0]?.type === 'novel') {
            setEpisodeType(eps[0].type);
          }
          const maxNum = eps.reduce((m: number, e: any) => Math.max(m, Number(e.number) || 0), 0);
          setEpisodeNumber(maxNum + 1);
        } else {
          // no episodes yet → start at 1
          setEpisodeNumber(1);
        }
      } catch (e) {
        // ignore
      } finally {
        setEpisodeLoading(false);
      }
    };
    inferEpisodeDefaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeAnimeId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'video' && !videoFile) {
      toast({ title: 'Error', description: 'Video file is required', variant: 'destructive' });
      return;
    }
    if (type === 'novel' && !pdfFile) {
      toast({ title: 'Error', description: 'PDF file is required', variant: 'destructive' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('type', type);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      if (type === 'video' && videoFile) formData.append('video', videoFile);
      if (type === 'novel' && pdfFile) formData.append('pdf', pdfFile);

      // Long-running upload - show optimistic toast and await completion
      toast({ title: 'Uploading…', description: 'Please wait while your file is uploaded.' });
      const res = await animeAPI.upload(formData);
      const ok = res?.success !== false;
      toast({ title: ok ? 'Success' : 'Uploaded', description: ok ? 'Anime uploaded successfully' : 'Upload completed' });

      // Reset form (including files)
      setTitle('');
      setDescription('');
      setCategory('');
      setThumbnailFile(null);
      setVideoFile(null);
      setPdfFile(null);
      setType('video');

      // Reload data
      loadData();
    } catch (error: any) {
      // If backend finished but client timed out earlier, we may still see data added.
      const message = error?.message?.includes('timeout') ? 'Upload timed out on client, but may have completed. Please refresh to confirm.' : 'Failed to upload anime';
      toast({ title: 'Upload Issue', description: message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this anime?')) return;

    try {
      await animeAPI.delete(id);
      toast({ title: 'Success', description: 'Anime deleted successfully' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete anime', variant: 'destructive' });
    }
  };

  const startEdit = (anime: any) => {
    setEditingId(anime.id);
    setEditTitle(anime.title);
    setEditDescription(anime.description);
    setEditCategory(anime.category);
    setEditType(anime.type);
    setEditThumbnail(null);
    setEditThumbnailPreview(anime.thumbnailUrl || null);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      // Show uploading toast if there's a file upload
      if (editThumbnail) {
        toast({ title: 'Uploading…', description: 'Please wait while the thumbnail is uploaded.' });
      }
      
      // Check if we have a new thumbnail file
      if (editThumbnail) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        formData.append('category', editCategory);
        formData.append('type', editType);
        formData.append('thumbnail', editThumbnail);
        
        await animeAPI.update(editingId, formData);
      } else {
        // Use JSON for text-only updates
        await animeAPI.update(editingId, {
          title: editTitle,
          description: editDescription,
          category: editCategory,
          type: editType
        });
      }
      
      toast({ title: 'Success', description: 'Anime updated successfully' });
      setEditingId(null);
      setEditThumbnail(null);
      setEditThumbnailPreview(null);
      loadData();
    } catch (error: any) {
      // If backend finished but client timed out earlier, we may still see data updated.
      const message = error?.message?.includes('timeout') ? 'Update timed out on client, but may have completed. Please refresh to confirm.' : 'Failed to update anime';
      toast({ title: 'Update Issue', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-card rounded w-1/3 mb-4" />
            <div className="h-64 bg-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Admin <span className="bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
        </h1>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="upload">Upload Anime</TabsTrigger>
            <TabsTrigger value="manage">Manage Anime</TabsTrigger>
            <TabsTrigger value="episode">Add Episode</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload New Anime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter anime title"
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Action, Adventure"
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={type} onValueChange={(v: any) => setType(v)}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="novel">Novel (PDF)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail</Label>
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                        className="bg-background border-border"
                      />
                    </div>

                    {type === 'video' ? (
                      <div className="space-y-2">
                        <Label htmlFor="video">Video File</Label>
                        <Input
                          id="video"
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          className="bg-background border-border"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="pdf">PDF File</Label>
                        <Input
                          id="pdf"
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                          className="bg-background border-border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter anime description"
                      className="min-h-[100px] bg-background border-border"
                    />
                  </div>

                  <Button type="submit" className="bg-gradient-primary text-foreground shadow-glow-primary">
                    Upload Anime
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  Manage Anime ({animeList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Flex container: table on left, form on right */}
                <div className="flex gap-6">
                  {/* Left side: Anime table */}
                  <div className="flex-1 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {animeList.map((anime) => (
                          <TableRow key={anime.id} className="border-border">
                            <TableCell className="font-medium">{anime.title}</TableCell>
                            <TableCell>{anime.type}</TableCell>
                            <TableCell>{anime.category}</TableCell>
                            <TableCell>{(anime.views || 0).toLocaleString?.() || anime.views}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="hover:bg-primary/10"
                                  onClick={() => startEdit(anime)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(anime.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Right side: Edit form (only visible when editing) */}
                  {editingId && (
                    <div className="w-[500px] flex-shrink-0 border border-border rounded-lg p-6 bg-background">
                      <h4 className="font-semibold text-lg mb-4">Edit Anime</h4>
                      <form onSubmit={submitEdit} className="grid gap-4">
                        <div>
                          <Label htmlFor="etitle">Title</Label>
                          <Input id="etitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="ecategory">Category</Label>
                          <Input id="ecategory" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="edescription">Description</Label>
                          <Textarea id="edescription" maxLength={500} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="etype">Type</Label>
                          <Select value={editType} onValueChange={(v: any) => setEditType(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="novel">Novel (PDF)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="ethumbnail">Thumbnail</Label>
                          <Input 
                            id="ethumbnail" 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setEditThumbnail(file);
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setEditThumbnailPreview(url);
                              }
                            }}
                          />
                          {editThumbnailPreview && (
                            <div className="mt-2">
                              <img 
                                src={editThumbnailPreview} 
                                alt="Thumbnail preview" 
                                className="w-20 h-20 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="bg-gradient-primary">Save</Button>
                          <Button type="button" variant="outline" onClick={() => {
                            setEditingId(null);
                            setEditThumbnail(null);
                            setEditThumbnailPreview(null);
                          }}>Cancel</Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-border">
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{new Date(user.createdAt || user.joinDate).toLocaleDateString()}</TableCell>
                          <TableCell>{user.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Episode Tab */}
          <TabsContent value="episode">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Add Episode to Anime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!episodeAnimeId || !episodeTitle || !episodeNumber) return;
                    try {
                      toast({ title: 'Uploading…', description: 'Please wait while the episode is uploaded.' });
                      const fd = new FormData();
                      fd.append('title', episodeTitle);
                      fd.append('number', String(episodeNumber));
                      fd.append('type', episodeType);
                      if (episodeType === 'video' && episodeVideo) fd.append('video', episodeVideo);
                      if (episodeType === 'novel' && episodePdf) fd.append('pdf', episodePdf);
                      const resEp = await animeAPI.createEpisode(episodeAnimeId, fd);
                      const okEp = resEp?.success !== false;
                      toast({ title: okEp ? 'Success' : 'Uploaded', description: okEp ? 'Episode created successfully' : 'Episode upload completed' });
                      // Reset episode form
                      setEpisodeAnimeId(null);
                      setEpisodeTitle('');
                      setEpisodeNumber(1);
                      setEpisodeType('video');
                      setEpisodeVideo(null); setEpisodePdf(null);
                    } catch (err: any) {
                      const message = err?.message?.includes('timeout') ? 'Upload timed out on client, but may have completed. Please refresh to confirm.' : 'Failed to create episode';
                      toast({ title: 'Upload Issue', description: message, variant: 'destructive' });
                    }
                  }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div>
                    <Label>Anime</Label>
                    <Select value={episodeAnimeId || ''} onValueChange={(v: any) => setEpisodeAnimeId(v)}>
                      <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Select anime" /></SelectTrigger>
                      <SelectContent>
                        {animeList.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>{a.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {episodeLoading && <div className="text-xs text-muted-foreground mt-1">Loading episode info…</div>}
                  </div>
                  <div>
                    <Label>Episode Title</Label>
                    <Input value={episodeTitle} onChange={(e) => setEpisodeTitle(e.target.value)} className="bg-background border-border" />
                  </div>
                  <div>
                    <Label>Episode Number</Label>
                    <Input type="number" value={episodeNumber} onChange={(e) => setEpisodeNumber(Number(e.target.value))} className="bg-background border-border" />
                    {currentEpisodes.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">Last: {currentEpisodes[currentEpisodes.length - 1]?.number}. Next suggested: {episodeNumber}</div>
                    )}
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={episodeType} onValueChange={(v: any) => setEpisodeType(v)}>
                      <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="novel">Novel (PDF)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Episode thumbnail removed as requested */}
                  {episodeType === 'video' ? (
                    <div>
                      <Label>Video</Label>
                      <Input type="file" accept="video/*" onChange={(e) => setEpisodeVideo(e.target.files?.[0] || null)} className="bg-background border-border" />
                    </div>
                  ) : (
                    <div>
                      <Label>PDF</Label>
                      <Input type="file" accept="application/pdf" onChange={(e) => setEpisodePdf(e.target.files?.[0] || null)} className="bg-background border-border" />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <Button type="submit" className="bg-gradient-primary">Create Episode</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;