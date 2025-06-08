export async function POST(req) {
  try {
    const data = await req.json();
    console.log('Received from Clay:', JSON.stringify(data, null, 2));
    
    // Extract job ID and results
    const { job_id, research_output, gtm_plan, campaigns } = data;
    
    if (!job_id) {
      return Response.json({ 
        success: false, 
        error: 'No job ID provided' 
      }, { status: 400 });
    }
    
    // Initialize job store
    global.jobStore = global.jobStore || new Map();
    
    // Helper function to extract JSON from markdown
    const extractJSON = (input) => {
      if (typeof input === 'string') {
        if (input.includes('```json')) {
          const match = input.match(/```json\s*([\s\S]*?)\s*```/);
          if (match && match[1]) {
            try {
              return JSON.parse(match[1]);
            } catch (e) {
              console.error('Failed to parse JSON from markdown:', e);
              return input;
            }
          }
        }
        try {
          return JSON.parse(input);
        } catch (e) {
          return input;
        }
      }
      return input;
    };
    
    // Parse each output
    const parsedResults = {
      research: research_output ? extractJSON(research_output) : {},
      gtm: extractJSON(gtm_plan) || {},
      campaigns: extractJSON(campaigns) || {}
    };
    
    // Check if job exists
    let job = global.jobStore.get(job_id);
    
    if (!job) {
      console.log('Job not found, creating new one for:', job_id);
      // Create a new job entry if it doesn't exist
      job = {
        email: 'from-clay@webhook.com',
        website: 'via-clay',
        positioning: 'unknown',
        status: 'processing',
        createdAt: new Date()
      };
      global.jobStore.set(job_id, job);
    }
    
    // Update job with results
    job.status = 'completed';
    job.completedAt = new Date();
    job.results = parsedResults;
    
    global.jobStore.set(job_id, job);
    
    console.log('Successfully updated job:', job_id);
    console.log('Job now has status:', job.status);
    
    return Response.json({ 
      success: true,
      message: 'Results received and job updated',
      jobId: job_id,
      status: job.status
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
