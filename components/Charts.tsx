'use client';

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesDataPoint, CountryData, EmployerData } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface TrendChartProps {
    data: TimeSeriesDataPoint[];
    type?: 'line' | 'area' | 'bar';
    title: string;
    dataKey: 'totalVisas' | 'approvalRate';
}

export default function TrendChart({ data, type = 'line', title, dataKey }: TrendChartProps) {
    const chartData = data.map(d => ({
        year: d.year,
        value: dataKey === 'totalVisas' ? d.totalVisas : d.approvalRate || 0,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-md">
                    <p className="text-sm font-semibold text-gray-900">{payload[0].payload.year}</p>
                    <p className="text-lg font-bold text-blue-600">
                        {dataKey === 'totalVisas'
                            ? formatNumber(payload[0].value)
                            : formatPercentage(payload[0].value)
                        }
                    </p>
                </div>
            );
        }
        return null;
    };

    const ChartComponent = type === 'area' ? AreaChart : type === 'bar' ? BarChart : LineChart;
    const DataComponent = type === 'area' ? Area : type === 'bar' ? Bar : Line;

    return (
        <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
            <ResponsiveContainer width="100%" height={350}>
                <ChartComponent data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="year"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) =>
                            dataKey === 'totalVisas' ? `${(value / 1000).toFixed(0)}K` : `${value}%`
                        }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <DataComponent
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="#2563eb"
                        fillOpacity={type === 'area' ? 0.2 : 1}
                        {...(type === 'line' && { dot: { fill: '#2563eb', r: 3 } })}
                    />
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
}

interface CountryBreakdownProps {
    countries: CountryData[];
    title: string;
}

export function CountryBreakdown({ countries, title }: CountryBreakdownProps) {
    const chartData = countries.slice(0, 8).map(c => ({
        name: c.countryName,
        visas: c.visaCount,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 border border-purple-500/30">
                    <p className="text-sm font-semibold">{payload[0].payload.name}</p>
                    <p className="text-lg font-bold text-purple-400">
                        {formatNumber(payload[0].value)} visas
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-container">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} layout="vertical">
                    <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        type="number"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#9ca3af"
                        style={{ fontSize: '11px' }}
                        width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="visas" fill="url(#colorBar)" radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

interface EmployerChartProps {
    employers: EmployerData[];
    title: string;
}

export function EmployerChart({ employers, title }: EmployerChartProps) {
    const chartData = employers.slice(0, 10).map(e => ({
        name: e.employerName.split(' ')[0], // Shorten names
        visas: e.visaCount,
        approvalRate: e.approvalRate,
    }));

    return (
        <div className="chart-container">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <defs>
                        <linearGradient id="colorEmployer" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        style={{ fontSize: '10px' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                        content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="glass-card p-3 border border-teal-500/30">
                                        <p className="text-sm font-semibold">{payload[0].payload.name}</p>
                                        <p className="text-lg font-bold text-teal-400">
                                            {formatNumber(payload[0].value)} visas
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Approval: {formatPercentage(payload[0].payload.approvalRate)}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="visas" fill="url(#colorEmployer)" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
