// Custom hook for fetching H-1B data
'use client';

import { useState, useEffect } from 'react';
import type { VisaDataset } from '@/lib/types';
import { generateMockDataset } from '@/lib/mockData';

interface UseH1BDataOptions {
    year: number;
    useLiveData?: boolean;
}

interface UseH1BDataReturn {
    data: VisaDataset | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    lastUpdated: string | null;
    isLive: boolean;
}

export function useH1BData({ year, useLiveData = true }: UseH1BDataOptions): UseH1BDataReturn {
    const [data, setData] = useState<VisaDataset | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    const fetchData = async (forceRefresh = false) => {
        if (!useLiveData) {
            // Use mock data
            setData(generateMockDataset(year));
            setLoading(false);
            setIsLive(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const url = `/api/h1b-data?year=${year}${forceRefresh ? '&refresh=true' : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
            setLastUpdated(result.lastUpdated);
            setIsLive(result.source === 'live' && !result.fallback);
        } catch (err) {
            console.error('Error fetching H-1B data:', err);
            setError(err instanceof Error ? err : new Error('Unknown error'));

            // Fallback to mock data
            setData(generateMockDataset(year));
            setIsLive(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, useLiveData]);

    return {
        data,
        loading,
        error,
        refetch: () => fetchData(true),
        lastUpdated,
        isLive,
    };
}
