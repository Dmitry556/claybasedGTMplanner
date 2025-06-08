# Clay Workflow Setup Guide

## Overview

The Clay workflow needs to execute 3 AI prompts in sequence:

1. **Research** (Gemini 2.5 Pro) - Extract company intelligence
2. **GTM Plan** (Claude Opus) - Create strategic analysis  
3. **Campaigns** (Claude Opus) - Generate campaign ideas

## Webhook Input

Your Clay webhook will receive:

```json
{
  "job_id": "unique-id",
  "email": "user@company.com",
  "website": "https://example.com",
  "positioning_clear": "yes/no/unsure",
  "callback_url": "https://your-app.vercel.app/api/clay-webhook"
}
```

## Clay Workflow Steps

### Step 1: Research with Gemini 2.5 Pro

Use the research prompt from earlier:

```
Extract intelligence from {{website}} that reveals how to write irresistible cold emails to their customers...
[Full research prompt here]
```

Store output as: `research_output`

### Step 2: GTM Plan with Claude Opus  

Input:
- `{{research_output}}` from Step 1
- `{{positioning_clear}}` from webhook

Use the GTM creation prompt:

```
Transform the research into a comprehensive GTM plan...
[Full GTM prompt here]
```

Store output as: `gtm_plan`

### Step 3: Campaigns with Claude Opus

Input:
- `{{research_output}}` from Step 1  
- `{{gtm_plan}}` from Step 2

Use the campaign creation prompt:

```
You are VeoGrowth's elite AI strategist creating world-class B2B cold email campaigns...
[Full campaign prompt here with case study accuracy rules]
```

Store output as: `campaigns`

### Step 4: Send Results Back

HTTP POST to `{{callback_url}}` with:

```json
{
  "job_id": "{{job_id}}",
  "research_output": {{research_output}},
  "gtm_plan": {{gtm_plan}},
  "campaigns": {{campaigns}}
}
```

## Error Handling

If any step fails, send error webhook:

```json
{
  "job_id": "{{job_id}}",
  "status": "error",
  "error": "Description of what failed"
}
```

## Testing

1. Use the test-webhook.js script to simulate Clay responses
2. Monitor your Vercel logs for webhook receipt
3. Check Clay execution logs for any errors
