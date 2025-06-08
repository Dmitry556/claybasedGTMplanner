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

    const job = global.jobStore.get(jobId);
    
    if (!job) {
      return Response.json({ 
        success: false, 
        error: 'Job not found' 
      }, { status: 404 });
    }

    if (job.status !== 'completed') {
      return Response.json({ 
        success: false, 
        error: 'Results not ready yet' 
      }, { status: 202 });
    }

    return Response.json({
      success: true,
      data: {
        jobId: jobId,
        email: job.email,
        website: job.website,
        positioning: job.positioning,
        results: job.results
      }
    });

  } catch (error) {
    console.error('Error getting results:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to retrieve results' 
    }, { status: 500 });
  }
}
