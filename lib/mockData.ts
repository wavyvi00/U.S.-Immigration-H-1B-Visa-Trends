// Mock data generator based on real USCIS/DOL statistics
import { VisaDataset, CountryData, StateData, TimeSeriesDataPoint, InsightData, EmployerData, YearlyComparison } from './types';

// Based on FY 2024 real data from USCIS
const generateCountryData = (year: number): CountryData[] => {
    const baseData2024: CountryData[] = [
        { countryCode: 'IND', countryName: 'India', visaCount: 283397, percentage: 71.0, approvalRate: 85.2, denialRate: 14.8 },
        { countryCode: 'CHN', countryName: 'China', visaCount: 46680, percentage: 11.7, approvalRate: 82.1, denialRate: 17.9 },
        { countryCode: 'PHL', countryName: 'Philippines', visaCount: 5248, percentage: 1.3, approvalRate: 88.5, denialRate: 11.5 },
        { countryCode: 'CAN', countryName: 'Canada', visaCount: 4222, percentage: 1.1, approvalRate: 91.2, denialRate: 8.8 },
        { countryCode: 'KOR', countryName: 'South Korea', visaCount: 3983, percentage: 1.0, approvalRate: 87.9, denialRate: 12.1 },
        { countryCode: 'MEX', countryName: 'Mexico', visaCount: 3821, percentage: 0.96, approvalRate: 84.3, denialRate: 15.7 },
        { countryCode: 'TWN', countryName: 'Taiwan', visaCount: 3456, percentage: 0.87, approvalRate: 89.1, denialRate: 10.9 },
        { countryCode: 'PAK', countryName: 'Pakistan', visaCount: 2987, percentage: 0.75, approvalRate: 79.8, denialRate: 20.2 },
        { countryCode: 'BRA', countryName: 'Brazil', visaCount: 2654, percentage: 0.66, approvalRate: 86.4, denialRate: 13.6 },
        { countryCode: 'NGA', countryName: 'Nigeria', visaCount: 2342, percentage: 0.59, approvalRate: 76.2, denialRate: 23.8 },
        { countryCode: 'NPL', countryName: 'Nepal', visaCount: 2198, percentage: 0.55, approvalRate: 83.7, denialRate: 16.3 },
        { countryCode: 'GBR', countryName: 'United Kingdom', visaCount: 1987, percentage: 0.50, approvalRate: 92.3, denialRate: 7.7 },
        { countryCode: 'COL', countryName: 'Colombia', visaCount: 1876, percentage: 0.47, approvalRate: 85.1, denialRate: 14.9 },
        { countryCode: 'TUR', countryName: 'Turkey', visaCount: 1654, percentage: 0.41, approvalRate: 82.6, denialRate: 17.4 },
        { countryCode: 'FRA', countryName: 'France', visaCount: 1543, percentage: 0.39, approvalRate: 93.1, denialRate: 6.9 },
    ];

    // Adjust data for different years with realistic variance
    if (year === 2024) return baseData2024;

    const yearFactor = year === 2023 ? 0.97 : year === 2022 ? 0.92 : year === 2021 ? 0.78 : 0.85;
    return baseData2024.map(country => ({
        ...country,
        visaCount: Math.round(country.visaCount * yearFactor),
        approvalRate: country.approvalRate ? country.approvalRate + (Math.random() - 0.5) * 2 : undefined,
        denialRate: country.denialRate ? country.denialRate + (Math.random() - 0.5) * 2 : undefined,
    }));
};

const generateStateData = (year: number): StateData[] => {
    const baseStates: StateData[] = [
        { stateCode: 'CA', stateName: 'California', visaCount: 95234, percentage: 23.8 },
        { stateCode: 'TX', stateName: 'Texas', visaCount: 52341, percentage: 13.1 },
        { stateCode: 'NY', stateName: 'New York', visaCount: 41287, percentage: 10.3 },
        { stateCode: 'NJ', stateName: 'New Jersey', visaCount: 28765, percentage: 7.2 },
        { stateCode: 'WA', stateName: 'Washington', visaCount: 24532, percentage: 6.1 },
        { stateCode: 'IL', stateName: 'Illinois', visaCount: 19876, percentage: 5.0 },
        { stateCode: 'MA', stateName: 'Massachusetts', visaCount: 18543, percentage: 4.6 },
        { stateCode: 'VA', stateName: 'Virginia', visaCount: 15234, percentage: 3.8 },
        { stateCode: 'GA', stateName: 'Georgia', visaCount: 12987, percentage: 3.3 },
        { stateCode: 'FL', stateName: 'Florida', visaCount: 11654, percentage: 2.9 },
    ];

    const yearFactor = year === 2024 ? 1 : year === 2023 ? 0.97 : 0.92;
    return baseStates.map(state => ({
        ...state,
        visaCount: Math.round(state.visaCount * yearFactor),
    }));
};

const generateTimeSeries = (): TimeSeriesDataPoint[] => {
    return [
        { year: 2015, totalVisas: 275317, approvalRate: 86.3, denialRate: 13.7 },
        { year: 2016, totalVisas: 298712, approvalRate: 85.9, denialRate: 14.1 },
        { year: 2017, totalVisas: 335659, approvalRate: 84.5, denialRate: 15.5 },
        { year: 2018, totalVisas: 342871, approvalRate: 82.3, denialRate: 17.7 },
        { year: 2019, totalVisas: 359267, approvalRate: 84.7, denialRate: 15.3 },
        { year: 2020, totalVisas: 281234, approvalRate: 79.1, denialRate: 20.9 }, // COVID impact
        { year: 2021, totalVisas: 301456, approvalRate: 82.5, denialRate: 17.5 },
        { year: 2022, totalVisas: 356789, approvalRate: 83.9, denialRate: 16.1 },
        { year: 2023, totalVisas: 386318, approvalRate: 85.1, denialRate: 14.9 },
        { year: 2024, totalVisas: 399395, approvalRate: 84.8, denialRate: 15.2 },
    ];
};

const generateEmployerData = (): EmployerData[] => {
    return [
        { employerName: 'Cognizant Technology Solutions', visaCount: 18234, approvalRate: 87.2 },
        { employerName: 'Infosys Limited', visaCount: 15876, approvalRate: 85.9 },
        { employerName: 'Tata Consultancy Services', visaCount: 14532, approvalRate: 86.4 },
        { employerName: 'Google LLC', visaCount: 12987, approvalRate: 94.1 },
        { employerName: 'Amazon.com Services LLC', visaCount: 11234, approvalRate: 92.8 },
        { employerName: 'Microsoft Corporation', visaCount: 10876, approvalRate: 93.5 },
        { employerName: 'Meta Platforms Inc.', visaCount: 8765, approvalRate: 91.7 },
        { employerName: 'Apple Inc.', visaCount: 7654, approvalRate: 92.3 },
        { employerName: 'Deloitte Consulting LLP', visaCount: 6987, approvalRate: 88.9 },
        { employerName: 'Accenture LLP', visaCount: 6543, approvalRate: 89.2 },
    ];
};

const generateInsights = (year: number): InsightData[] => {
    const insights: InsightData[] = [
        {
            title: 'India Dominates H-1B Approvals',
            description: 'Indian nationals accounted for 71% of all H-1B visa approvals in FY 2024, maintaining a steady trend from previous years.',
            year: 2024,
            value: '71%',
            type: 'milestone',
        },
        {
            title: 'Record High Approvals',
            description: 'FY 2024 saw the highest number of H-1B approvals at 399,395, a 3% increase from FY 2023.',
            year: 2024,
            value: 399395,
            type: 'spike',
        },
        {
            title: 'COVID-19 Impact',
            description: 'FY 2020 experienced a significant 22% decline in H-1B visas due to pandemic-related travel restrictions and economic uncertainty.',
            year: 2020,
            value: '-22%',
            type: 'decline',
        },
        {
            title: 'Tech Giants Lead Applications',
            description: 'Major tech companies (Google, Amazon, Microsoft, Meta, Apple) collectively accounted for over 50,000 H-1B approvals in FY 2024.',
            year: 2024,
            type: 'trend',
        },
        {
            title: 'California Remains Top Destination',
            description: 'Nearly 1 in 4 H-1B visa holders work in California, with the state receiving 23.8% of all approvals.',
            year: 2024,
            value: '23.8%',
            type: 'milestone',
        },
    ];

    return insights;
};

const generateYearlyComparisons = (): YearlyComparison[] => {
    const timeSeries = generateTimeSeries();
    return timeSeries.map((data, idx) => ({
        year: data.year,
        totalVisas: data.totalVisas,
        yoyChange: idx > 0 ? ((data.totalVisas - timeSeries[idx - 1].totalVisas) / timeSeries[idx - 1].totalVisas) * 100 : 0,
        approvalRate: data.approvalRate || 0,
    }));
};

export const generateMockDataset = (year: number = 2024): VisaDataset => {
    const countries = generateCountryData(year);
    const totalVisas = countries.reduce((sum, c) => sum + c.visaCount, 0);
    const ytdVisas = Math.round(totalVisas * 0.75); // Simulating 75% of year completed

    return {
        source: 'mock',
        countries,
        states: generateStateData(year),
        timeSeries: generateTimeSeries(),
        topEmployers: generateEmployerData(),
        insights: generateInsights(year),
        metrics: {
            totalVisas,
            ytdVisas,
            approvalRate: 84.8,
            denialRate: 15.2,
            topCountries: countries.slice(0, 5),
            topStates: generateStateData(year).slice(0, 5),
            yearlyComparisons: generateYearlyComparisons(),
        },
        lastUpdated: new Date().toISOString(),
    };
};
