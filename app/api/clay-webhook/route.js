// Remove edge runtime - it doesn't support global variables
// export const runtime = 'edge'; 

export async function POST(req) {
  try {
    // Initialize job store if it doesn't exist
    global.jobStore = global.jobStore || new Map();
    
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
    
    // Get job from store
    const job = global.jobStore.get(job_id);
    if (!job) {
      console.log('Job not found. Available jobs:', Array.from(global.jobStore.keys()));
      return Response.json({ 
        success: false, 
        error: 'Job not found - it may have expired. Please submit a new request.',
        jobId: job_id,
        availableJobs: Array.from(global.jobStore.keys())
      }, { status: 404 });
    }

    // Parse results if they're strings with markdown
    let parsedResearch = research_output;
    let parsedGtm = gtm_plan;
    let parsedCampaigns = campaigns;
    
    // Helper function to extract JSON from markdown
    const extractJSON = (input) => {
      if (typeof input === 'string') {
        // Check if it has markdown code blocks
        if (input.includes('```json')) {
          const match = input.match(/```json\s*([\s\S]*?)\s*```/);
          if (match && match[1]) {
            try {
              return JSON.parse(match[1]);
            } catch (e) {
              console.error('Failed to parse JSON from markdown:', e);
            }
          }
        }
        // Try to parse as-is if it's valid JSON
        try {
          return JSON.parse(input);
        } catch (e) {
          // If it's not valid JSON, return as-is
          return input;
        }
      }
      return input;
    };
    
    // Parse each output
    parsedResearch = extractJSON(research_output);
    parsedGtm = extractJSON(gtm_plan);
    parsedCampaigns = extractJSON(campaigns);
    
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
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
