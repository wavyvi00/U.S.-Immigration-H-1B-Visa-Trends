# H-1B Visa Dashboard - Real Data System

## 🔄 Automatic Data Updates

This dashboard uses **REAL government data** with automatic updates:

### Data Sources
- **DOL (Department of Labor)**: H-1B Labor Condition Applications
- **USCIS**: H-1B petition outcomes

### Update Schedule
✅ **Automatic Updates**: Every Sunday at midnight (via Vercel Cron)
✅ **Data Freshness**: Updates within days of government releases
✅ **No Manual Work**: Completely automated pipeline

## 📊 How It Works

1. **Vercel Cron Job** runs weekly (`/api/cron/update-h1b-data`)
2. **Downloads** latest CSV files from DOL/USCIS
3. **Processes** millions of records 
4. **Aggregates** statistics by country, state, employer
5. **Stores** in `/data/processed/` as JSON
6. **Serves** to frontend via `/api/h1b-data`

## 🚀 Initial Setup (One-Time)

To populate initial data, trigger the cron job manually:

\`\`\`bash
# Set your cron secret
echo "CRON_SECRET=your_random_secret_here" >> .env.local

# Trigger data fetch (local development)
curl http://localhost:3000/api/cron/update-h1b-data \\
  -H "Authorization: Bearer your_random_secret_here"
\`\`\`

## 📦 Deployment to Vercel

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Environment Variable**:
   - `CRON_SECRET`: Random string for auth
4. **Deploy**

Vercel will automatically:
- Run the cron job weekly
- Download and process real data
- Serve updated statistics

## 📈 Data Updates

- **DOL Data**: Released quarterly (Jan, Apr, Jul, Oct)
- **USCIS Data**: Released annually (Oct/Nov)
- **Your Dashboard**: Checks weekly, updates when new data available

## ✅ No Mock Data

**This system uses ONLY real government data.** If data isn't available yet:
- Frontend shows a message to run initial fetch
- After first run, always serves real data
- Never uses mock/fake data

## 🔐 Security

The cron endpoint requires authentication:
- Protected by `CRON_SECRET` environment variable
- Only Vercel Cron and authorized requests can trigger updates
- Data files are processed and sanitized

## 📝 Data Structure

Processed data includes:
- Total H-1B applications
- Approval/denial rates
- Top 20 countries
- Top 20 states  
- Top 20 employers
- Historical trends

All sourced from official government disclosures.
