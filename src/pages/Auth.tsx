
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { FileAudio } from 'lucide-react';

const Auth = () => {
  const { user, signUp, signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account."
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <div className="inline-flex items-center gap-2 justify-center mb-4">
            <FileAudio className="h-8 w-8 text-purple-400" />
            <span className="text-white text-xl font-bold">PodcastGenie</span>
          </div>
          <CardTitle className="text-white">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="signin" className="text-white data-[state=active]:bg-purple-600">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-purple-600">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email" className="text-white">Email</Label>
                  <Input 
                    id="signin-email"
                    name="email" 
                    type="email" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password" className="text-white">Password</Label>
                  <Input 
                    id="signin-password"
                    name="password" 
                    type="password" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                  <Input 
                    id="signup-name"
                    name="fullName" 
                    type="text" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input 
                    id="signup-email"
                    name="email" 
                    type="email" 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input 
                    id="signup-password"
                    name="password" 
                    type="password" 
                    required 
                    minLength={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Create a password (min 6 characters)"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
