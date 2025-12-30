'use client';

import { InsightData } from '@/lib/types';
import { TrendingUp, TrendingDown, AlertCircle, Award } from 'lucide-react';

interface InsightsPanelProps {
    insights: InsightData[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
    const getIcon = (type: InsightData['type']) => {
        switch (type) {
            case 'spike':
                return <TrendingUp className="w-5 h-5" />;
            case 'decline':
                return <TrendingDown className="w-5 h-5" />;
            case 'milestone':
                return <Award className="w-5 h-5" />;
            case 'trend':
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getColorClass = (type: InsightData['type']) => {
        switch (type) {
            case 'spike':
                return 'border-green-200 bg-green-50';
            case 'decline':
                return 'border-red-200 bg-red-50';
            case 'milestone':
                return 'border-amber-200 bg-amber-50';
            case 'trend':
                return 'border-blue-200 bg-blue-50';
        }
    };

    return (
        <div className="chart-container">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 Most Memorable Insights
            </h2>
            <p className="text-gray-600 text-sm mb-6">
                Automatically detected notable patterns and records in the data
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-4 bg-white border rounded-lg transition-all hover:shadow-md ${getColorClass(insight.type)}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded ${getColorClass(insight.type)}`}>
                                {getIcon(insight.type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-base mb-1 text-gray-900">{insight.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {insight.description}
                                </p>
                                {insight.year && (
                                    <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                        FY {insight.year}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
