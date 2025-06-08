export const runtime = 'edge'; // Optional: Use edge runtime for better performance

// This config disables authentication for this endpoint
export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req) {
  try {
    // Log raw request body for debugging
    const rawBody = await req.text();
    console.log('Raw body received:', rawBody);
    
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return Response.json({ 
        success: false, 
        error: 'Invalid JSON in request body',
        details: parseError.message
      }, { status: 400 });
    }
    
    console.log('Parsed data:', JSON.stringify(data, null, 2));
    
    // Extract job ID and results
    const { job_id, research_output, gtm_plan, campaigns } = data;
    
    if (!job_id) {
      return Response.json({ 
        success: false, 
        error: 'No job ID provided',
        received: Object.keys(data)
      }, { status: 400 });
    }

    // Initialize job store if it doesn't exist
    global.jobStore = global.jobStore || new Map();
    
    // Get job from store
    const job = global.jobStore.get(job_id);
    if (!job) {
      console.log('Job not found. Available jobs:', Array.from(global.jobStore.keys()));
      return Response.json({ 
        success: false, 
        error: 'Job not found',
        jobId: job_id,
        availableJobs: Array.from(global.jobStore.keys())
      }, { status: 404 });
    }

    // Parse results if they're strings
    let parsedResearch = research_output;
    let parsedGtm = gtm_plan;
    let parsedCampaigns = campaigns;
    
    // Try to parse if they're strings with markdown
    if (typeof research_output === 'string' && research_output.includes('```json')) {
      try {
        const jsonMatch = research_output.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          parsedResearch = JSON.parse(jsonMatch[1]);
        }
      } catch (e) {
        console.error('Failed to parse research_output:', e);
      }
    }
    
    // Update job with results
    job.status = 'completed';
    job.completedAt = new Date();
    job.results = {
      research: parsedResearch,
      gtm: parsedGtm,
      campaigns: parsedCampaigns
    };
    
    global.jobStore.set(job_id, job);

    console.log('Successfully updated job:', job_id);

    return Response.json({ 
      success: true,
      message: 'Results received',
      jobId: job_id
    });

  } catch (error) {
    console.error('Error processing Clay webhook:', error);
    console.error('Error stack:', error.stack);
    return Response.json({ 
      success: false, 
      error: 'Failed to process results',
      details: error.message
    }, { status: 500 });
  }
}
