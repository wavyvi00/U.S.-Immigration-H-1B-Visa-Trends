'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatPercentage, getChangeIndicator } from '@/lib/utils';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: number;
    icon?: React.ReactNode;
    trend?: 'positive' | 'negative' | 'neutral';
}

export default function MetricCard({
    title,
    value,
    subtitle,
    change,
    trend,
}: MetricCardProps) {
    const displayValue = typeof value === 'number' ? formatNumber(value) : value;
    const trendIndicator = trend || (change ? getChangeIndicator(change) : 'neutral');

    return (
        <div className="metric-card group">
            {/* Label - Small, Uppercase, Muted */}
            <div className="metric-label mb-3">
                {title}
            </div>

            {/* Value - Large, Bold, Emphasized */}
            <div className="metric-value mb-2 number-update">
                {displayValue}
            </div>

            {/* Subtitle */}
            {subtitle && (
                <p className="text-xs text-gray-500 mb-3">
                    {subtitle}
                </p>
            )}

            {/* Change Indicator - Minimal Badge */}
            {change !== undefined && (
                <div className="flex items-center gap-2 mt-auto">
                    {trendIndicator === 'positive' && (
                        <div className="badge-minimal badge-positive flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{formatPercentage(Math.abs(change))}</span>
                        </div>
                    )}
                    {trendIndicator === 'negative' && (
                        <div className="badge-minimal badge-negative flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            <span>{formatPercentage(change)}</span>
                        </div>
                    )}
                    <span className="text-xs text-gray-400">vs. last year</span>
                </div>
            )}
        </div>
    );
}
