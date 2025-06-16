import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileAudio, 
  Clock, 
  Download, 
  Share2, 
  ArrowLeft,
  Quote,
  Lightbulb,
  BookOpen,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ShowNotes {
  summary: string;
  keyTakeaways: string[];
  chapters: Array<{
    timestamp: string;
    title: string;
    description: string;
  }>;
  quotes: Array<{
    text: string;
    speaker: string;
    timestamp: string;
  }>;
  resources: string[];
  socialCaptions: string[];
}

interface Podcast {
  id: string;
  title: string;
  description: string;
  processing_status: string;
  created_at: string;
  duration: number;
  file_size: number;
  transcript: string;
  show_notes: string;
  key_takeaways: string[];
  timestamps: any;
}

interface PodcastDetailsProps {
  podcastId: string;
  onBack: () => void;
}

const PodcastDetails = ({ podcastId, onBack }: PodcastDetailsProps) => {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState<ShowNotes | null>(null);

  useEffect(() => {
    fetchPodcastDetails();
  }, [podcastId]);

  const fetchPodcastDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', podcastId)
        .single();

      if (error) throw error;
      
      setPodcast(data);
      
      // Parse show notes if available
      if (data.show_notes) {
        try {
          const parsed = JSON.parse(data.show_notes);
          setShowNotes(parsed);
        } catch (e) {
          console.error('Failed to parse show notes:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching podcast:', error);
      toast({
        title: "Error",
        description: "Failed to load podcast details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` 
                   : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/5 backdrop-blur-lg border-white/20 p-6">
          <p className="text-white">Podcast not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={onBack}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <FileAudio className="h-12 w-12 text-purple-400" />
                  <div>
                    <CardTitle className="text-white text-2xl">{podcast.title}</CardTitle>
                    <p className="text-gray-300 mt-2">{podcast.description}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {podcast.duration ? formatDuration(podcast.duration) : 'Unknown'}
                      </span>
                      <span>{formatFileSize(podcast.file_size || 0)}</span>
                      <span>Created {new Date(podcast.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Badge className={
                  podcast.processing_status === 'completed' ? 'bg-green-500/20 text-green-300' :
                  podcast.processing_status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-red-500/20 text-red-300'
                }>
                  {podcast.processing_status}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Show Notes */}
          {showNotes && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Summary */}
              <Card className="bg-white/5 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{showNotes.summary}</p>
                </CardContent>
              </Card>

              {/* Key Takeaways */}
              <Card className="bg-white/5 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Key Takeaways
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {showNotes.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chapters */}
          {showNotes?.chapters && showNotes.chapters.length > 0 && (
            <Card className="bg-white/5 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Chapters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {showNotes.chapters.map((chapter, index) => (
                    <div key={index} className="border-l-2 border-purple-400 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-purple-400 font-mono text-sm">{chapter.timestamp}</span>
                        <h4 className="text-white font-medium">{chapter.title}</h4>
                      </div>
                      <p className="text-gray-300 text-sm">{chapter.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quotes */}
          {showNotes?.quotes && showNotes.quotes.length > 0 && (
            <Card className="bg-white/5 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Notable Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {showNotes.quotes.map((quote, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <blockquote className="text-gray-300 italic mb-2">"{quote.text}"</blockquote>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-400">— {quote.speaker}</span>
                        <span className="text-gray-500">{quote.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Captions */}
          {showNotes?.socialCaptions && showNotes.socialCaptions.length > 0 && (
            <Card className="bg-white/5 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media Captions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {showNotes.socialCaptions.map((caption, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-gray-300">{caption}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(caption, 'Caption')}
                        className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                      >
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transcript */}
          {podcast.transcript && (
            <Card className="bg-white/5 backdrop-blur-lg border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Full Transcript</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(podcast.transcript, 'Transcript')}
                  className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copy Transcript
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {podcast.transcript}
                  </p>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastDetails;
