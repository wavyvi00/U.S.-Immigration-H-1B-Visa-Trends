// Utility functions for formatting and calculations

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (num: number, decimals: number = 1): string => {
    return `${num.toFixed(decimals)}%`;
};

export const formatCompactNumber = (num: number): string => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
};

export const calculateYoYChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};

export const getChangeIndicator = (change: number): 'positive' | 'negative' | 'neutral' => {
    if (change > 0.5) return 'positive';
    if (change < -0.5) return 'negative';
    return 'neutral';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};
