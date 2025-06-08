import { nanoid } from 'nanoid';

// Simple in-memory store for job tracking (in production, use a database)
global.jobStore = global.jobStore || new Map();

export async function POST(req) {
  try {
    const { email, website, positioning } = await req.json();
    
    // Generate unique job ID
    const jobId = nanoid();
    
    // Store job info
    global.jobStore.set(jobId, {
      email,
      website,
      positioning,
      status: 'processing',
      createdAt: new Date(),
      results: null
    });

    // Prepare data for Clay webhook
    const clayPayload = {
      job_id: jobId,
      email: email,
      website: website,
      positioning_clear: positioning,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/api/clay-webhook`
    };

    // Send to Clay webhook
    const clayResponse = await fetch(
      'https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-93b823b1-e3e3-49b8-8fc0-834585c5aa24',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clayPayload)
      }
    );

    if (!clayResponse.ok) {
      throw new Error('Failed to submit to Clay');
    }

    console.log('Submitted to Clay:', jobId);

    return Response.json({ 
      success: true, 
      jobId: jobId,
      message: 'Analysis started'
    });

  } catch (error) {
    console.error('Error submitting to Clay:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to start analysis. Please try again.' 
    }, { status: 500 });
  }
}
