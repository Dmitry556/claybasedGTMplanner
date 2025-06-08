// Test script to simulate Clay webhook response
// Run with: node test-webhook.js

const testData = {
  job_id: "test-job-123",
  research_output: {
    company_intelligence: {
      exact_description: "Test company that does amazing things",
      company_stage: {
        headcount: "50-100",
        funding: "Series B",
        founded_when: "2020",
        hq_location: "San Francisco"
      }
    }
  },
  gtm_plan: {
    positioning_assessment: "CLEAR - The company has excellent positioning",
    recommended_positioning: "The leading solution for X that does Y",
    swot: {
      strengths: ["Strong technical team", "Great product-market fit"],
      weaknesses: ["Limited marketing", "No enterprise features"],
      opportunities: ["Expanding market", "New use cases emerging"],
      threats: ["Competition increasing", "Market saturation risk"]
    },
    market_sizing: {
      tam: "$10B",
      sam: "$1B", 
      som: "$100M"
    },
    ideal_customer_profile: "B2B SaaS companies with 50-500 employees that need better analytics",
    personas: [
      {
        title: "VP of Engineering",
        daily_reality: "Managing 20 developers across 3 teams",
        measured_on: "Deployment frequency and uptime",
        current_pain: "Can't get visibility into team productivity"
      },
      {
        title: "CTO",
        daily_reality: "Balancing technical debt with new features",
        measured_on: "Product velocity and technical excellence",
        current_pain: "No unified view of engineering metrics"
      },
      {
        title: "Engineering Manager",
        daily_reality: "Running standups and sprint planning",
        measured_on: "Team velocity and happiness",
        current_pain: "Manual reporting takes hours each week"
      }
    ],
    segments: [
      {
        name: "The Scaling Startups",
        target: "B2B SaaS companies with 50-200 employees growing 50%+ annually",
        market_size: "~5,000 companies",
        pain_created: "Engineering team doubled but productivity didn't"
      },
      {
        name: "The Enterprise Converts", 
        target: "Traditional companies building software teams of 20+ developers",
        market_size: "~3,000 companies",
        pain_created: "Using enterprise tools that don't fit modern development"
      },
      {
        name: "The Remote-First",
        target: "Distributed teams across 5+ timezones with 30+ engineers",
        market_size: "~4,000 companies",
        pain_created: "Async communication makes tracking progress impossible"
      }
    ],
    competitive_positioning: "Unlike traditional APM tools, we focus on developer experience metrics"
  },
  campaigns: {
    campaignIdeas: [
      {
        name: "The Productivity Paradox",
        target: "VPs of Engineering at SaaS companies with 50+ developers",
        emailBody: "Hi [Name], [Company] added 20 engineers last year but deployment frequency stayed flat. Engineering productivity metrics are hard when you're using 5 different tools. We helped Acme Corp increase deployment frequency by 40% with unified analytics. Worth exploring how we map productivity?"
      },
      {
        name: "The Sprint Planning Time Sink",
        target: "Engineering Managers at companies using Jira + GitHub",
        emailBody: "Hi [Name], Your team probably spends Monday mornings in sprint planning trying to reconcile Jira with GitHub commits. Manual reporting eats 5+ hours weekly. TechCo eliminated their planning meetings after implementing our automated insights. Ready to reclaim those hours?"
      },
      {
        name: "The Remote Visibility Gap",
        target: "CTOs at distributed companies with engineers in 5+ timezones",
        emailBody: "Hi [Name], With engineers across [X] countries, getting a pulse on productivity means late night Slack messages. Real-time dashboards beat async standups. RemoteCo improved team alignment by 60% using our platform. Interested in unified visibility?"
      }
    ],
    socialProofNote: "",
    veoGrowthPitch: "Want VeoGrowth to execute these campaigns? We'll identify 10,000+ engineering leaders at scaling SaaS companies and deliver hyper-personalized outreach.",
    prospectTargetingNote: "These campaigns would target approximately 12,000 qualified prospects - engineering leaders at B2B SaaS companies showing growth signals and technical complexity indicators."
  }
};

// Send to local webhook
fetch('http://localhost:3000/api/clay-webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
  console.log('Webhook response:', data);
  console.log('\nNow you can visit: http://localhost:3000/results/test-job-123');
})
.catch(err => {
  console.error('Error:', err);
  console.log('\nMake sure your dev server is running: npm run dev');
});
