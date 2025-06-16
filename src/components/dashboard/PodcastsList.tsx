
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio } from 'lucide-react';
import PodcastCard from './PodcastCard';

interface Podcast {
  id: string;
  title: string;
  description: string;
  processing_status: string;
  created_at: string;
  duration: number;
  file_size: number;
}

interface PodcastsListProps {
  podcasts: Podcast[];
  onShowUpload: () => void;
  onDeletePodcast: (podcastId: string, podcastTitle: string) => Promise<void>;
  onViewPodcast: (podcastId: string) => void;
}

const PodcastsList = ({ podcasts, onShowUpload, onDeletePodcast, onViewPodcast }: PodcastsListProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Your Podcasts</CardTitle>
      </CardHeader>
      <CardContent>
        {podcasts.length === 0 ? (
          <div className="text-center py-12">
            <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No podcasts uploaded yet</p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600" onClick={onShowUpload}>
              Upload Your First Podcast
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {podcasts.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                onDelete={onDeletePodcast}
                onView={onViewPodcast}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PodcastsList;
