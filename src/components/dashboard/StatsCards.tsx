
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileAudio, Play } from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  description: string;
  processing_status: string;
  created_at: string;
  duration: number;
  file_size: number;
}

interface StatsCardsProps {
  podcasts: Podcast[];
}

const StatsCards = ({ podcasts }: StatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/5 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Podcasts</p>
              <p className="text-2xl font-bold text-white">{podcasts.length}</p>
            </div>
            <FileAudio className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/5 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">
                {podcasts.filter(p => p.processing_status === 'completed').length}
              </p>
            </div>
            <Play className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/5 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Processing</p>
              <p className="text-2xl font-bold text-white">
                {podcasts.filter(p => p.processing_status === 'processing').length}
              </p>
            </div>
            <Upload className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/5 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Hours</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(podcasts.reduce((acc, p) => acc + (p.duration || 0), 0) / 3600)}
              </p>
            </div>
            <FileAudio className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
