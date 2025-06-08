export async function GET() {
  // Simulate Clay webhook response
  const testData = {
    job_id: "test-" + Date.now(),
    research_output: { /* test data */ },
    gtm_plan: { /* test data */ },
    campaigns: { /* test data */ }
  };
  
  global.jobStore = global.jobStore || new Map();
  global.jobStore.set(testData.job_id, {
    status: 'completed',
    results: testData
  });
  
  return Response.json({ 
    success: true, 
    testUrl: `/results/${testData.job_id}` 
  });
}
