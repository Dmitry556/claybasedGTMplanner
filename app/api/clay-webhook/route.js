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

    // Get job from store
    const job = global.jobStore.get(job_id);
    if (!job) {
      return Response.json({ 
        success: false, 
        error: 'Job not found' 
      }, { status: 404 });
    }

    // Update job with results
    job.status = 'completed';
    job.completedAt = new Date();
    job.results = {
      research: research_output,
      gtm: gtm_plan,
      campaigns: campaigns
    };
    
    global.jobStore.set(job_id, job);

    console.log('Updated job:', job_id);

    return Response.json({ 
      success: true,
      message: 'Results received'
    });

  } catch (error) {
    console.error('Error processing Clay webhook:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to process results' 
    }, { status: 500 });
  }
}
