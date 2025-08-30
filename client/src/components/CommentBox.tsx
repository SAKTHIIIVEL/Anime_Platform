import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { animeAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  userId: string;
  username: string;
  comment: string;
  timestamp: string;
  avatar: string;
}

interface CommentBoxProps {
  animeId: string;
}

const CommentBox = ({ animeId }: CommentBoxProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    loadComments();
  }, [animeId]);

  const mapBackendComment = (c: any) => ({
    id: c.id,
    userId: c.userId,
    username: c.user?.username || 'User',
    comment: c.comment,
    timestamp: c.createdAt,
    avatar: c.user?.avatarUrl || ''
  });

  const loadComments = async () => {
    try {
      const response = await animeAPI.getComments(animeId);
      const items = (response?.data?.comments || []).map(mapBackendComment);
      setComments(items);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        variant: 'destructive',
      });
      return;
    }

    if (!isLoggedIn) {
      toast({
        title: 'Login Required',
        description: 'Please login to post comments',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await animeAPI.addComment(animeId, newComment);
      const created = mapBackendComment(response?.data?.comment || response);
      setComments([created, ...comments]);
      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment posted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-foreground">Comments</h3>
      
      {/* Add Comment Form */}
      {isLoggedIn ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts about this anime..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] bg-card border-border focus:border-primary"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={isLoading}
            className="bg-gradient-primary text-foreground shadow-glow-primary"
          >
            {isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      ) : (
        <div className="bg-card/50 border border-border rounded-lg p-4">
          <p className="text-muted-foreground">
            Please <a href="/login" className="text-primary hover:underline">login</a> to post comments.
          </p>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.avatar} alt={comment.username} />
                  <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{comment.username}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-foreground/90">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentBox;