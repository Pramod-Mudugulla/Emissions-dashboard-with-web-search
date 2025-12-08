import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { fetchSummary } from '../api';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-3 rounded-lg border border-white/10">
                <p className="text-white font-medium">{label}</p>
                <p className="text-primary-foreground text-sm">
                    {new Intl.NumberFormat().format(payload[0].value)} tons CO2e
                </p>
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetchSummary();
                // Transform data for charts if necessary, or usage as is
                // Grouping by sector and year for better visualization
                setData(result);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    // Process data for charts
    // 1. Total emissions by year
    const emissionsByYear = Object.values(data.reduce((acc, curr) => {
        if (!acc[curr.year]) acc[curr.year] = { year: curr.year, value: 0 };
        acc[curr.year].value += curr.value;
        return acc;
    }, {})).sort((a, b) => a.year - b.year);

    // 2. Emissions by Sector (latest year)
    const latestYear = Math.max(...data.map(d => d.year));
    const emissionsBySector = data
        .filter(d => d.year === latestYear)
        .map(d => ({ name: d.sector_name, value: d.value }));

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Emissions Overview</h1>
                    <p className="text-muted-foreground">Tracking carbon footprint across key sectors</p>
                </div>
                <div className="text-right">
                    <span className="text-sm text-muted-foreground">Latest Update</span>
                    <div className="text-white font-mono">{new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Trend Chart */}
                <div className="glass-card p-6 rounded-xl col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-6">Global Emission Trends ({emissionsByYear[0]?.year} - {latestYear})</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={emissionsByYear}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="year" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdown by Sector */}
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-6">Sector Breakdown ({latestYear})</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={emissionsBySector} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="#666" />
                                <YAxis dataKey="name" type="category" width={100} stroke="#999" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                        <div>
                            <div className="text-muted-foreground text-sm mb-2">Total Emissions</div>
                            <div className="text-2xl font-bold text-white">
                                {new Intl.NumberFormat().format(
                                    emissionsByYear.find(d => d.year === latestYear)?.value || 0
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-primary mt-4">+2.4% from previous year</div>
                    </div>
                    <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                        <div>
                            <div className="text-muted-foreground text-sm mb-2">Active Sectors</div>
                            <div className="text-2xl font-bold text-white">{emissionsBySector.length}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-4">Monitoring global industries</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
