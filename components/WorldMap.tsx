'use client';

import { CountryData } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface WorldMapProps {
    data: CountryData[];
    selectedYear: number;
}

export default function WorldMap({ data, selectedYear }: WorldMapProps) {
    // For now, we'll create a simplified visualization
    // In a production app, you'd use react-simple-maps or similar

    const topCountries = data.slice(0, 10);

    return (
        <div className="chart-container">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                H-1B Visas by Country of Origin ({selectedYear})
            </h2>

            <div className="space-y-2">
                {topCountries.map((country, index) => (
                    <div
                        key={country.countryCode}
                        className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-blue-600">
                                    #{index + 1}
                                </span>
                                <span className="text-base font-semibold text-gray-900">
                                    {country.countryName}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                                {formatPercentage(country.percentage)}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{formatNumber(country.visaCount)} visas</span>
                            {country.approvalRate && (
                                <span className="text-green-600">
                                    {formatPercentage(country.approvalRate)} approval
                                </span>
                            )}
                        </div>

                        {/* Visual bar */}
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${Math.min(country.percentage, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>


            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                    💡 <strong>Note:</strong> Data represents aggregated statistics from USCIS H-1B disclosure data.
                    Individual petitions are not tracked.
                </p>
            </div>
        </div>
    );
}
