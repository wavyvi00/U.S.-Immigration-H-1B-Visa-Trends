'use client';

import { useState, useMemo } from 'react';
import { BarChart3, Globe2, TrendingUp, Lightbulb, RefreshCw, Database } from 'lucide-react';
import { generateMockDataset } from '@/lib/mockData';
import { useH1BData } from '@/lib/hooks/useH1BData';
import MetricCard from '@/components/MetricCard';
import WorldMap from '@/components/WorldMap';
import TrendChart, { CountryBreakdown, EmployerChart } from '@/components/Charts';
import InsightsPanel from '@/components/InsightsPanel';
import { formatNumber, formatPercentage } from '@/lib/utils';

type TabType = 'overview' | 'geographic' | 'trends' | 'insights';

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Use live data hook with fallback to mock data
  const { data, loading, error, refetch, lastUpdated, isLive } = useH1BData({
    year: selectedYear,
    useLiveData: true
  });

  // Fallback to mock data if no data available
  const dataset = data || generateMockDataset(selectedYear);

  const availableYears = [2024, 2023, 2022, 2021, 2020];
  const currentYearIndex = dataset.metrics.yearlyComparisons.findIndex((y: { year: number }) => y.year === selectedYear);
  const yoyChange = currentYearIndex > 0
    ? dataset.metrics.yearlyComparisons[currentYearIndex].yoyChange
    : 0;

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'geographic' as TabType, label: 'Geographic', icon: Globe2 },
    { id: 'trends' as TabType, label: 'Trends', icon: TrendingUp },
    { id: 'insights' as TabType, label: 'Insights', icon: Lightbulb },
  ];

  // Format date on client-side only to avoid hydration mismatch
  const formattedLastUpdated = useMemo(() => {
    return new Date(dataset.lastUpdated).toLocaleString();
  }, [dataset.lastUpdated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Modern & Clean */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
                U.S. Immigration & H-1B Visa Trends
              </h1>
              <p className="text-sm text-gray-600">
                Aggregated data from USCIS, Department of Labor, and DHS
              </p>
            </div>

            {/* Year Filter - Enhanced */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <label className="text-sm font-semibold text-gray-700">Fiscal Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer shadow-sm"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>FY {year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs - Modern Bottom Border Style */}
          <nav className="flex gap-1 border-b border-gray-200 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 relative ${activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50/30'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50/50 hover:border-gray-300'
                    }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                  title="Total H-1B Approvals"
                  value={dataset.metrics.totalVisas}
                  subtitle={`Fiscal Year ${selectedYear}`}
                  change={yoyChange}
                  icon={<BarChart3 className="w-4 h-4" />}
                />
                <MetricCard
                  title="Year-to-Date"
                  value={dataset.metrics.ytdVisas}
                  subtitle="As of latest data"
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <MetricCard
                  title="Approval Rate"
                  value={formatPercentage(dataset.metrics.approvalRate)}
                  subtitle={`${formatPercentage(dataset.metrics.denialRate)} denial rate`}
                  trend="positive"
                  icon={<BarChart3 className="w-4 h-4" />}
                />
                <MetricCard
                  title="Top Country"
                  value={dataset.metrics.topCountries[0].countryName}
                  subtitle={`${formatPercentage(dataset.metrics.topCountries[0].percentage)} of total`}
                  icon={<Globe2 className="w-4 h-4" />}
                />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Stats</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 5 Countries</h3>
                  <div className="space-y-3">
                    {dataset.metrics.topCountries.map((country, idx) => (
                      <div key={`${country.countryCode}-${idx}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500 w-6">#{idx + 1}</span>
                          <span className="text-sm font-medium text-gray-900">{country.countryName}</span>
                        </div>
                        <span className="text-sm text-gray-600">{formatNumber(country.visaCount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 5 States</h3>
                  <div className="space-y-3">
                    {dataset.metrics.topStates.map((state, idx) => (
                      <div key={state.stateCode} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500 w-6">#{idx + 1}</span>
                          <span className="text-sm font-medium text-gray-900">{state.stateName}</span>
                        </div>
                        <span className="text-sm text-gray-600">{formatNumber(state.visaCount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Geographic Tab */}
        {activeTab === 'geographic' && (
          <div className="space-y-8">
            <WorldMap data={dataset.countries} selectedYear={selectedYear} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CountryBreakdown
                countries={dataset.countries}
                title="Top Countries by Visa Count"
              />
              {dataset.topEmployers && (
                <EmployerChart
                  employers={dataset.topEmployers}
                  title="Top H-1B Employers"
                />
              )}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendChart
                data={dataset.timeSeries}
                type="area"
                title="Total H-1B Visas Over Time"
                dataKey="totalVisas"
              />
              <TrendChart
                data={dataset.timeSeries}
                type="line"
                title="Approval Rate Trends"
                dataKey="approvalRate"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Overview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Visas</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">YoY Change</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Approval Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.metrics.yearlyComparisons.slice().reverse().map((year) => (
                      <tr key={year.year} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">FY {year.year}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatNumber(year.totalVisas)}</td>
                        <td className={`py-3 px-4 text-right font-medium ${year.yoyChange > 0 ? 'text-green-600' : year.yoyChange < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                          {year.yoyChange > 0 ? '+' : ''}{formatPercentage(year.yoyChange)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatPercentage(year.approvalRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            <InsightsPanel insights={dataset.insights} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Data Sources & Legal Disclaimer
          </h3>
          <div className="space-y-4 text-xs text-gray-600">
            <div>
              <strong className="text-gray-900">Data Sources:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>U.S. Citizenship and Immigration Services (USCIS) H-1B Disclosure Data</li>
                <li>Department of Labor (DOL) Labor Condition Application (LCA) Statistics</li>
                <li>Department of Homeland Security (DHS) Immigration Statistics</li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <strong className="text-amber-900">⚠️ Important Note:</strong>
              <p className="mt-1 text-amber-800">
                This application displays aggregated, anonymized public data only.
                No personal information or individual petition details are tracked, stored, or displayed.
              </p>
            </div>

            <div className="text-gray-500">
              <p suppressHydrationWarning>Last Updated: {formattedLastUpdated}</p>
              <p className="mt-1">
                For official information, visit <a href="https://www.uscis.gov" className="text-blue-600 hover:underline">USCIS.gov</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
