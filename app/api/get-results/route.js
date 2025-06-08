export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return Response.json({ 
        success: false, 
        error: 'No job ID provided' 
      }, { status: 400 });
    }

    // Initialize job store
    global.jobStore = global.jobStore || new Map();
    
    // Get job from store
    const job = global.jobStore.get(jobId);
    
    if (!job) {
      console.log('Job not found:', jobId);
      console.log('Available jobs:', Array.from(global.jobStore.keys()));
      
      return Response.json({ 
        success: false, 
        error: 'Job not found',
        jobId: jobId
      }, { status: 404 });
    }

    // Check if job is still processing
    if (job.status === 'processing') {
      return Response.json({ 
        success: false, 
        error: 'Results not ready yet',
        status: 'processing'
      }, { status: 202 });
    }

    // Ensure all data is properly structured
    const results = {
      research: job.results?.research || {},
      gtm: job.results?.gtm || {},
      campaigns: job.results?.campaigns || {}
    };

    return Response.json({
      success: true,
      data: {
        jobId: jobId,
        email: job.email || 'Not provided',
        website: job.website || 'Not provided',
        positioning: job.positioning || 'Not provided',
        results: results
      }
    });

  } catch (error) {
    console.error('Error getting results:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to retrieve results',
      details: error.message
    }, { status: 500 });
  }
}
