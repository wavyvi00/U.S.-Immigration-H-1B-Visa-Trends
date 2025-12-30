# H-1B Visa Data Dashboard

A real-time analytics dashboard for U.S. H-1B visa applications, visualizing data from USCIS and Department of Labor (DOL) OFLC disclosures. Built with Next.js 15, Tailwind CSS, and Recharts.

## Features

- **Real-time Data**: automatically streams and processes widespread Department of Labor (DOL) Excel files.
- **Interactive Visualizations**:
  - **Geographic Distribution**: Heatmap of filings by country.
  - **Top Employers**: Ranked list of companies sponsoring visas.
  - **Trend Analysis**: Visa approval rates and volume over time.
- **Fiscal Year Filtering**: Explore historical data from FY 2021 to present.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Dashboard**:
   Visit [http://localhost:3000](http://localhost:3000)

## Data Pipeline

The application features a robust streaming data pipeline to handle massive government datasets (80MB+ Excel files) without crashing Node.js memory.

- **Source**: Department of Labor (DOL) Office of Foreign Labor Certification (OFLC)
- **Mechanism**:
  1. **Cron Job**: Daily/Weekly check via `/api/cron/update-h1b-data`
  2. **Streaming Download**: Uses system `curl` to fetch large files
  3. **Stream Parsing**: Uses `exceljs.stream.xlsx.WorkbookReader` to process row-by-row
  4. **Aggregation**: summarize stats into lightweight JSON files for the frontend

### Manual Data Update
To manually trigger a data update (requires `CRON_SECRET`):
```bash
curl -H "Authorization: Bearer h1b_data_update_secret_2024" http://localhost:3000/api/cron/update-h1b-data
```

## Deployment

Deploy easily on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add Environment Variable:
   - `CRON_SECRET`: A secure random string for protecting the update route
4. Deploy!

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Maps**: React Simple Maps
- **Data Processing**: ExcelJS (Streaming)

## License

MIT
