
import { useState } from 'react';
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
  Users,
  Copy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DemoTranscriptProps {
  onBack: () => void;
  podcastTitle?: string;
}

const DemoTranscript = ({ onBack, podcastTitle = "Sample Podcast Episode" }: DemoTranscriptProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const demoShowNotes = {
    summary: "This is a demo transcript page showcasing how your podcast analysis would look. In this sample episode, we explore the fundamentals of productivity, discussing time management strategies, goal setting techniques, and the importance of maintaining work-life balance. The conversation covers practical tips for entrepreneurs and professionals looking to optimize their daily routines.",
    keyTakeaways: [
      "Time blocking is essential for productivity and focus",
      "Setting clear daily priorities helps reduce decision fatigue",
      "Taking regular breaks actually improves overall performance",
      "Batch processing similar tasks saves significant time",
      "The 80/20 rule applies to most business activities",
      "Consistent morning routines set the tone for successful days"
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Introduction",
        description: "Welcome and overview of today's productivity discussion"
      },
      {
        timestamp: "02:30",
        title: "Time Management Fundamentals",
        description: "Core principles of effective time management"
      },
      {
        timestamp: "08:15",
        title: "Goal Setting Strategies",
        description: "How to set and achieve meaningful goals"
      },
      {
        timestamp: "14:45",
        title: "Work-Life Balance",
        description: "Maintaining boundaries and personal well-being"
      },
      {
        timestamp: "22:10",
        title: "Practical Implementation",
        description: "Real-world tips and tools for immediate application"
      },
      {
        timestamp: "28:30",
        title: "Q&A and Wrap-up",
        description: "Listener questions and final thoughts"
      }
    ],
    quotes: [
      {
        text: "Productivity isn't about doing more things, it's about doing the right things efficiently.",
        speaker: "Host",
        timestamp: "05:20"
      },
      {
        text: "The key to success is not working harder, but working smarter and with intention.",
        speaker: "Guest Expert",
        timestamp: "12:45"
      },
      {
        text: "Every minute spent planning saves ten minutes in execution.",
        speaker: "Host",
        timestamp: "18:30"
      }
    ],
    socialCaptions: [
      "🚀 Just dropped: Essential productivity tips that actually work! Listen now ⬇️",
      "💡 Time management game-changer: The one strategy that transformed my workflow",
      "🎯 Stop working harder and start working smarter. New episode is live!",
      "⏰ 30 minutes that could change how you approach your daily routine forever"
    ]
  };

  const demoTranscript = `Welcome to today's episode on productivity and time management. I'm your host, and today we're diving deep into the strategies that can transform how you approach your daily work and life.

[00:30] Let's start with a question: How many of you feel like there aren't enough hours in the day? I think we've all been there. The good news is that productivity isn't about finding more time - it's about making better use of the time we have.

[02:30] The first principle I want to discuss is time blocking. This is where you dedicate specific blocks of time to specific activities. Instead of having a general to-do list, you're assigning each task a specific time slot in your calendar.

[05:20] As I always say, "Productivity isn't about doing more things, it's about doing the right things efficiently." This mindset shift is crucial.

[08:15] Now, let's talk about goal setting. Many people set goals, but few people set them effectively. The key is to make them specific, measurable, and time-bound. Vague goals lead to vague results.

[12:45] Our guest expert shared something profound: "The key to success is not working harder, but working smarter and with intention." This really resonates with what we're discussing today.

[14:45] Work-life balance is another critical aspect. It's not about perfect balance every day - it's about making conscious choices about where you invest your energy.

[18:30] Remember this: "Every minute spent planning saves ten minutes in execution." Planning isn't just helpful - it's essential.

[22:10] Let's get practical. Here are three tools I recommend: First, use a digital calendar for time blocking. Second, try the Pomodoro Technique for focused work sessions. Third, implement a weekly review process.

[28:30] As we wrap up, remember that productivity is a personal journey. What works for others might not work for you, and that's okay. The key is to experiment, adapt, and find your own rhythm.

Thank you for listening, and I'll see you in the next episode!`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDuration = (timestamp: string) => {
    return timestamp;
  };

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
                    <CardTitle className="text-white text-2xl">{podcastTitle}</CardTitle>
                    <p className="text-gray-300 mt-2">Demo transcript showing AI-generated content</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        30:45
                      </span>
                      <span>2.1 MB</span>
                      <span>Demo Content</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-300">
                  Demo
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Show Notes */}
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
                <p className="text-gray-300 leading-relaxed">{demoShowNotes.summary}</p>
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
                  {demoShowNotes.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Chapters */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Chapters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoShowNotes.chapters.map((chapter, index) => (
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

          {/* Quotes */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Quote className="h-5 w-5" />
                Notable Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoShowNotes.quotes.map((quote, index) => (
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

          {/* Social Captions */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media Captions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoShowNotes.socialCaptions.map((caption, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-gray-300">{caption}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(caption, 'Caption')}
                      className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                    >
                      {copied === 'Caption' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Full Transcript</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(demoTranscript, 'Transcript')}
                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
              >
                <Download className="h-4 w-4 mr-2" />
                {copied === 'Transcript' ? 'Copied!' : 'Copy Transcript'}
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {demoTranscript}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoTranscript;
