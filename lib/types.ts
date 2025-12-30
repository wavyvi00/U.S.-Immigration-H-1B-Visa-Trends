// Updated types to include data source metadata
export interface DataSourceInfo {
  source: 'live' | 'cached' | 'mock' | 'fallback';
  lastUpdated: string;
  cached?: boolean;
  error?: string;
  dataSource?: string; // Legacy field for compatibility
}

export interface CountryData {
  countryCode: string;
  countryName: string;
  visaCount: number;
  percentage: number;
  approvalRate?: number;
  denialRate?: number;
}

export interface StateData {
  stateCode: string;
  stateName: string;
  visaCount: number;
  percentage: number;
}

export interface EmployerData {
  employerName: string;
  visaCount: number;
  approvalRate?: number;
}

export interface TimeSeriesDataPoint {
  year: number;
  month?: number;
  totalVisas: number;
  approvalRate: number;
  denialRate?: number;
}

export interface YearlyComparison {
  year: number;
  totalVisas: number;
  approvalRate: number;
  yoyChange: number;
}

export interface InsightData {
  type: 'spike' | 'decline' | 'milestone' | 'trend';
  title: string;
  description: string;
  year?: number;
  value?: number | string;
}

export interface DashboardMetrics {
  totalVisas: number;
  ytdVisas: number;
  approvalRate: number;
  denialRate: number;
  topCountries: CountryData[];
  topStates: StateData[];
  yearlyComparisons: YearlyComparison[];
}

export interface VisaDataset extends DataSourceInfo {
  year?: number;
  metrics: DashboardMetrics;
  countries: CountryData[];
  states: StateData[];
  topEmployers?: EmployerData[];
  timeSeries: TimeSeriesDataPoint[];
  insights: InsightData[];
}
