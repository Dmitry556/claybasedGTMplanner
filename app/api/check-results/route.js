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

    return Response.json({
      success: true,
      jobId: jobId,
      status: job.status,
      completed: job.status === 'completed',
      createdAt: job.createdAt,
      completedAt: job.completedAt
    });

  } catch (error) {
    console.error('Error checking results:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to check status' 
    }, { status: 500 });
  }
}
