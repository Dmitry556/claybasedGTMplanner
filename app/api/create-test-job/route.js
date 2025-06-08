import { nanoid } from 'nanoid';

export async function GET(req) {
  // Initialize job store
  global.jobStore = global.jobStore || new Map();
  
  // Create a test job
  const jobId = nanoid();
  
  global.jobStore.set(jobId, {
    email: 'test@example.com',
    website: 'https://example.com',
    positioning: 'yes',
    status: 'processing',
    createdAt: new Date(),
    results: null
  });
  
  return Response.json({
    success: true,
    jobId: jobId,
    message: 'Test job created. Use this job_id in Clay.',
    currentJobs: Array.from(global.jobStore.keys())
  });
}
