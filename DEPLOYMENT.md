# Deployment Guide

## Quick Start

This guide will help you deploy the NHL Ratings Dashboard to Vercel.

### Prerequisites

- GitHub account
- Vercel account (free tier works)
- Git configured on your machine
- Data files ready for upload

## Step 1: Configure Git (if not already done)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Initialize Git Repository

From the parent directory (`NHL Ratings Data`):

```bash
cd nhl-ratings-dashboard
git init
git add .
git commit -m "feat: initial commit of NHL ratings dashboard"
```

## Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `nhl-ratings-dashboard`
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"
6. Copy the repository URL

## Step 4: Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nhl-ratings-dashboard.git
git push -u origin main
```

## Step 5: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `nhl-ratings-dashboard` repository
5. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
6. Click "Deploy"
7. Wait ~2 minutes for deployment to complete
8. You'll get a URL like: `https://nhl-ratings-dashboard.vercel.app`

### Via Vercel CLI (Alternative)

```bash
npm i -g vercel
vercel login
cd nhl-ratings-dashboard
vercel
```

## Step 6: Upload Data Files to Vercel Blob

### Option A: Via Vercel Dashboard (Recommended)

1. Go to your project on Vercel
2. Click "Storage" tab
3. Click "Create Database" → "Blob"
4. Name it: `nhl-data`
5. Click "Create"
6. Go to the "Blob" section
7. Click "Upload Files"
8. Upload all your data files:
   - `J37 Ratings Data.xlsx`
   - `NHL Google DMA Data.csv`
   - `NHL TTD DMA Data.xlsx`
   - `Amazon DMA Data.xlsx`
   - `Campaign Mapping.xlsx`
   - `DMA Mapping Table.xlsx`
   - `Reach Frequency.xlsx`

### Option B: Via CLI

```bash
vercel blob upload "path/to/J37 Ratings Data.xlsx"
vercel blob upload "path/to/NHL Google DMA Data.csv"
# ... repeat for each file
```

## Step 7: Update API Route to Load Real Data

Once files are uploaded, you need to update the API route to load them from Blob storage.

Edit `app/api/data/route.ts` to actually load and process the uploaded files.

Example:

```typescript
import { list, head } from '@vercel/blob';
import * as XLSX from 'xlsx';

export async function GET() {
  // List all blobs
  const { blobs } = await list();

  // Find your data files
  const ratingsFile = blobs.find(b => b.pathname === 'J37 Ratings Data.xlsx');

  // Download and process
  const response = await fetch(ratingsFile.url);
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer);
  // ... process data

  return NextResponse.json(processedData);
}
```

## Step 8: Verify Deployment

1. Visit your deployed URL
2. Check that data loads correctly
3. Test all charts and interactions
4. Verify metrics are calculated correctly

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Common issues:
  - TypeScript errors: Run `npm run build` locally first
  - Missing dependencies: Check `package.json`
  - Environment variables: Add in Vercel dashboard

### Data Not Loading

- Verify Blob storage is enabled
- Check environment variable `BLOB_READ_WRITE_TOKEN` is set
- Verify file names match exactly (case-sensitive)

### Charts Not Displaying

- Check browser console for errors
- Verify data format matches TypeScript types
- Check recharts is installed: `npm list recharts`

## Custom Domain (Optional)

1. Go to your project on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Every push to `main` branch will automatically trigger a new deployment:

```bash
git add .
git commit -m "fix: update analysis logic"
git push
```

Vercel will:
1. Detect the push
2. Build the project
3. Deploy automatically
4. Keep previous deployments for rollback

## Environment Variables

If you need to add secrets or configuration:

1. Go to project settings on Vercel
2. Click "Environment Variables"
3. Add variables:
   - `BLOB_READ_WRITE_TOKEN` (automatically added with Blob storage)
   - Any custom variables you need

## Data Updates

To update data files:

1. Go to Vercel dashboard → Storage → Blob
2. Delete old file
3. Upload new file
4. Dashboard will automatically refresh

Or via CLI:

```bash
vercel blob delete "J37 Ratings Data.xlsx"
vercel blob upload "path/to/updated/J37 Ratings Data.xlsx"
```

## Monitoring

View deployment and runtime logs:

1. Go to your project on Vercel
2. Click "Logs" tab
3. Filter by:
   - Build logs
   - Function logs
   - Access logs

## Cost

Vercel Free Tier includes:
- Unlimited deployments
- 100GB bandwidth/month
- 100GB-hrs compute time/month
- Blob storage: 1GB free

For most use cases, the free tier is sufficient. Upgrade to Pro ($20/month) if you exceed limits.

## Next Steps

- Set up custom domain
- Add authentication if needed
- Configure analytics
- Set up monitoring/alerts
- Add more visualizations
