
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FileAudio, Trash2, Eye } from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  description: string;
  processing_status: string;
  created_at: string;
  duration: number;
  file_size: number;
}

interface PodcastCardProps {
  podcast: Podcast;
  onDelete: (podcastId: string, podcastTitle: string) => Promise<void>;
  onView: (podcastId: string) => void;
}

const PodcastCard = ({ podcast, onDelete, onView }: PodcastCardProps) => {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'Unknown';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` 
                   : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ready';
      case 'processing': return 'Processing...';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <FileAudio className="h-8 w-8 text-purple-400" />
        <div>
          <h3 className="text-white font-medium">{podcast.title}</h3>
          <p className="text-gray-400 text-sm">
            Created {new Date(podcast.created_at).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
            <span>{formatDuration(podcast.duration)}</span>
            <span>•</span>
            <span>{formatFileSize(podcast.file_size || 0)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={getStatusColor(podcast.processing_status)}>
          {getStatusText(podcast.processing_status)}
        </Badge>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          onClick={() => onView(podcast.id)}
          disabled={podcast.processing_status === 'processing'}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Podcast</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{podcast.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(podcast.id, podcast.title)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PodcastCard;
