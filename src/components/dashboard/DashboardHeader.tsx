
import { Button } from '@/components/ui/button';
import { Plus, User, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface DashboardHeaderProps {
  user: User | null;
  onShowUpload: () => void;
  onSignOut: () => void;
}

const DashboardHeader = ({ user, onShowUpload, onSignOut }: DashboardHeaderProps) => {
  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile functionality coming soon!",
    });
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
      </div>
      <div className="flex gap-3">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold border-none"
          onClick={onShowUpload}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Upload
        </Button>
        <Button 
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold border-none" 
          onClick={handleProfileClick}
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white font-semibold border-none"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
