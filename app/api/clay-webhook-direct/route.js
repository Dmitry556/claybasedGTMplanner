// Direct webhook that bypasses job system for testing
export async function POST(req) {
  try {
    const data = await req.json();
    console.log('Received from Clay:', JSON.stringify(data, null, 2));
    
    // Extract results
    const { research_output, gtm_plan, campaigns } = data;
    
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
              return input;
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
    const parsedResearch = extractJSON(research_output);
    const parsedGtm = extractJSON(gtm_plan);
    const parsedCampaigns = extractJSON(campaigns);
    
    // Create a simple HTML response with the data
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Clay Results</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #1a1a1a;
            color: white;
            padding: 20px;
            margin: 0;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #3b82f6; }
        h2 { color: #8b5cf6; margin-top: 30px; }
        pre { 
            background: #2a2a2a; 
            padding: 20px; 
            border-radius: 8px; 
            overflow-x: auto;
            border: 1px solid #444;
        }
        .success { 
            background: #065f46; 
            color: #34d399; 
            padding: 15px; 
            border-radius: 8px;
            margin-bottom: 20px;
        }
        a {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }
        a:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Clay Webhook Results</h1>
        <div class="success">✅ Successfully received data from Clay!</div>
        
        <h2>Research Output</h2>
        <pre>${JSON.stringify(parsedResearch, null, 2)}</pre>
        
        <h2>GTM Plan</h2>
        <pre>${JSON.stringify(parsedGtm, null, 2)}</pre>
        
        <h2>Campaigns</h2>
        <pre>${JSON.stringify(parsedCampaigns, null, 2)}</pre>
        
        <a href="/">Go to Homepage</a>
    </div>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error processing Clay webhook:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to process results',
      details: error.message
    }, { status: 500 });
  }
}
