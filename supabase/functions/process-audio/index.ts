
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function log(msg: unknown) {
  console.log("[process-audio] ", msg);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let podcastId: string | undefined = undefined;

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    log("Checking OpenAI API key: " + (openAIApiKey ? "Found" : "Missing"));
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to Supabase Edge Function secrets.');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    podcastId = body.podcastId;
    const audioUrl = body.audioUrl;
    const podcastTitle = body.podcastTitle || "Your Podcast";

    log("Processing podcast: " + podcastId + " with audio: " + audioUrl);

    if (!podcastId || !audioUrl) {
      throw new Error("Missing podcastId or audioUrl in request body");
    }

    // Update status to processing
    await supabase
      .from('podcasts')
      .update({ processing_status: 'processing' })
      .eq('id', podcastId);

    log("Updated podcast status to processing");

    // Extract the file path from the URL
    const urlParts = audioUrl.split('/storage/v1/object/public/audio-files/');
    if (urlParts.length !== 2) {
      throw new Error("Invalid audio URL format");
    }
    const filePath = urlParts[1];
    log("Extracted file path: " + filePath);

    // Download the file directly from Supabase storage using the service client
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('audio-files')
      .download(filePath);

    if (downloadError) {
      log("Storage download error: " + JSON.stringify(downloadError));
      throw new Error(`Failed to download audio file: ${downloadError.message}`);
    }

    if (!fileData) {
      throw new Error("No file data received from storage");
    }

    log("Audio file downloaded successfully, size: " + fileData.size + " bytes");

    if (fileData.size === 0) {
      throw new Error("Downloaded audio file is empty");
    }

    // Check if file is too large (25MB limit for Whisper)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (fileData.size > maxSize) {
      throw new Error(`Audio file too large: ${(fileData.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 25MB.`);
    }

    // Convert blob to the correct format for FormData
    const audioBlob = new Blob([fileData], { type: 'audio/mpeg' });

    // Prepare form data for Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('language', 'en');

    log("Calling OpenAI Whisper API...");
    const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcribeResponse.ok) {
      const errorText = await transcribeResponse.text();
      log("Whisper API error: " + errorText);
      throw new Error(`Whisper API failed: ${transcribeResponse.status} ${errorText}`);
    }

    const transcription = await transcribeResponse.json();
    log("Transcription received, text length: " + (transcription.text?.length || 0));

    if (!transcription || !transcription.text) {
      throw new Error("No transcription text received from Whisper API");
    }

    // Calculate estimated duration from transcription (rough estimate: 150 words per minute)
    const wordCount = transcription.text.split(' ').length;
    const estimatedDuration = Math.round((wordCount / 150) * 60); // seconds

    // Generate show notes using GPT-4o-mini
    log("Generating show notes with GPT-4o-mini...");
    const showNotesResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert podcast content analyst. Create comprehensive show notes from this transcript.

Generate a JSON response with these exact fields:
- summary: A 2-3 paragraph overview of the episode
- keyTakeaways: Array of 5-7 important points as strings
- chapters: Array of chapters with title, timestamp (format: "MM:SS"), and description
- quotes: Array of 3-5 notable quotes with speaker and timestamp
- resources: Array of mentioned resources/links as strings
- socialCaptions: Array of 3-5 social media captions as strings

Format timestamps as "MM:SS" (e.g., "05:30"). Make the response valid JSON only.`
          },
          {
            role: 'user',
            content: `Please analyze this podcast transcript and create show notes:\n\nTitle: ${podcastTitle}\n\nTranscript:\n${transcription.text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!showNotesResponse.ok) {
      const errorText = await showNotesResponse.text();
      log("GPT API error: " + errorText);
      throw new Error(`GPT API failed: ${showNotesResponse.status} ${errorText}`);
    }

    const showNotesData = await showNotesResponse.json();
    log("Show notes generated successfully");

    let showNotes = {
      summary: "Analysis completed successfully. The transcript has been processed and is ready for review.",
      keyTakeaways: ["Transcript available for review", "Content processed successfully"],
      chapters: [{ title: "Full Episode", timestamp: "00:00", description: "Complete episode content" }],
      quotes: [],
      resources: [],
      socialCaptions: [`Check out this episode: "${podcastTitle}"`, "New podcast episode available now!"]
    };

    try {
      const content = showNotesData.choices?.[0]?.message?.content;
      if (content) {
        const parsedNotes = JSON.parse(content);
        // Validate the structure
        if (parsedNotes.summary && Array.isArray(parsedNotes.keyTakeaways)) {
          showNotes = {
            summary: parsedNotes.summary || showNotes.summary,
            keyTakeaways: Array.isArray(parsedNotes.keyTakeaways) ? parsedNotes.keyTakeaways : showNotes.keyTakeaways,
            chapters: Array.isArray(parsedNotes.chapters) ? parsedNotes.chapters : showNotes.chapters,
            quotes: Array.isArray(parsedNotes.quotes) ? parsedNotes.quotes : showNotes.quotes,
            resources: Array.isArray(parsedNotes.resources) ? parsedNotes.resources : showNotes.resources,
            socialCaptions: Array.isArray(parsedNotes.socialCaptions) ? parsedNotes.socialCaptions : showNotes.socialCaptions
          };
        }
      }
    } catch (parseError) {
      log("Failed to parse show notes JSON, using fallback: " + parseError);
    }

    // Update podcast with results
    const { error: updateError } = await supabase
      .from('podcasts')
      .update({
        transcript: transcription.text,
        show_notes: JSON.stringify(showNotes),
        key_takeaways: showNotes.keyTakeaways,
        timestamps: showNotes.chapters,
        duration: estimatedDuration,
        processing_status: 'completed'
      })
      .eq('id', podcastId);

    if (updateError) {
      log("Database update error: " + JSON.stringify(updateError));
      throw updateError;
    }

    log("Podcast processing completed successfully for: " + podcastId);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Podcast processed successfully",
      transcriptLength: transcription.text.length,
      showNotesGenerated: true,
      duration: estimatedDuration
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    log("ERROR: " + (error?.message || String(error)));
    
    // Update podcast status to failed
    if (podcastId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          await supabase
            .from('podcasts')
            .update({ 
              processing_status: 'failed',
              transcript: `Processing failed: ${error?.message || 'Unknown error'}. Please try uploading again.`,
              show_notes: JSON.stringify({
                summary: "Processing failed. Please try uploading again or check your audio file format.",
                keyTakeaways: ["Upload failed - please retry"],
                chapters: [],
                quotes: [],
                resources: [],
                socialCaptions: []
              })
            })
            .eq('id', podcastId);
        }
      } catch (updateErr) {
        log("Failed to update podcast status: " + updateErr);
      }
    }

    return new Response(JSON.stringify({ 
      error: error?.message || String(error),
      podcastId: podcastId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
