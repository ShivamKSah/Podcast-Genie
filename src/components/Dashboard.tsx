import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import DashboardHeader from './dashboard/DashboardHeader';
import StatsCards from './dashboard/StatsCards';
import PodcastsList from './dashboard/PodcastsList';

interface Podcast {
  id: string;
  title: string;
  description: string;
  processing_status: string;
  created_at: string;
  duration: number;
  file_size: number;
}

interface DashboardProps {
  setShowUpload: (show: boolean) => void;
  setShowPodcastDetails: (podcastId: string | null) => void;
}

const Dashboard = ({ setShowUpload, setShowPodcastDetails }: DashboardProps) => {
  const { user, signOut } = useAuth();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPodcasts();
    }
  }, [user]);

  const fetchPodcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPodcasts(data || []);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      toast({
        title: "Error",
        description: "Failed to load your podcasts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePodcast = async (podcastId: string, podcastTitle: string) => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', podcastId);

      if (error) throw error;

      // Update local state to remove the deleted podcast
      setPodcasts(podcasts.filter(p => p.id !== podcastId));
      
      toast({
        title: "Success",
        description: `"${podcastTitle}" has been deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting podcast:', error);
      toast({
        title: "Error",
        description: "Failed to delete the podcast",
        variant: "destructive"
      });
    }
  };

  const handleViewPodcast = (podcastId: string) => {
    setShowPodcastDetails(podcastId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          user={user}
          onShowUpload={() => setShowUpload(true)}
          onSignOut={signOut}
        />
        
        <StatsCards podcasts={podcasts} />
        
        <PodcastsList
          podcasts={podcasts}
          onShowUpload={() => setShowUpload(true)}
          onDeletePodcast={handleDeletePodcast}
          onViewPodcast={handleViewPodcast}
        />
      </div>
    </div>
  );
};

export default Dashboard;
