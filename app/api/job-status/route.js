export async function GET(req) {
  global.jobStore = global.jobStore || new Map();
  
  const jobs = [];
  for (const [id, job] of global.jobStore.entries()) {
    jobs.push({
      id,
      status: job.status,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      hasResults: !!job.results
    });
  }
  
  return Response.json({
    totalJobs: jobs.length,
    jobs: jobs
  });
}
