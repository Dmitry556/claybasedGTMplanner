// Debug endpoint to see all stored results
export async function GET(req) {
  global.jobStore = global.jobStore || new Map();
  
  const jobs = [];
  
  // Get all jobs with details
  for (const [id, job] of global.jobStore.entries()) {
    jobs.push({
      id,
      status: job.status,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      email: job.email,
      website: job.website,
      hasResults: !!(job.results),
      viewUrl: `/results/${id}`,
      directLink: `https://claybased-gt-mplanner.vercel.app/results/${id}`
    });
  }
  
  return Response.json({
    totalJobs: jobs.length,
    jobs: jobs,
    instructions: {
      toCompleteJob: "POST to /api/complete-job with {jobId: 'xxx'} to manually complete",
      toViewResults: "Visit the viewUrl or directLink for any completed job"
    }
  });
}
