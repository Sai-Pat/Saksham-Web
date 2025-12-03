import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Button from '../../../components/common/Button';

const BeneficiaryProfiling = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock data for various statistics
    const stateWiseData = [
        { state: 'Delhi', beneficiaries: 1200, sc: 450, st: 280 },
        { state: 'UP', beneficiaries: 2400, sc: 890, st: 620 },
        { state: 'Bihar', beneficiaries: 1800, sc: 670, st: 450 },
        { state: 'MP', beneficiaries: 1500, sc: 520, st: 380 },
        { state: 'Rajasthan', beneficiaries: 1100, sc: 410, st: 290 },
    ];

    const genderData = [
        { name: 'Male', value: 5240, percentage: 52.4 },
        { name: 'Female', value: 4760, percentage: 47.6 },
    ];

    const ageRangeData = [
        { range: '18-25', count: 1200 },
        { range: '26-35', count: 2800 },
        { range: '36-45', count: 3200 },
        { range: '46-60', count: 2100 },
        { range: '60+', count: 700 },
    ];

    const monthlyTrendData = [
        { month: 'Jan', approved: 120, rejected: 30, pending: 45 },
        { month: 'Feb', approved: 150, rejected: 25, pending: 38 },
        { month: 'Mar', approved: 180, rejected: 20, pending: 42 },
        { month: 'Apr', approved: 210, rejected: 18, pending: 35 },
        { month: 'May', approved: 240, rejected: 15, pending: 28 },
        { month: 'Jun', approved: 280, rejected: 12, pending: 22 },
    ];

    const COLORS = {
        primary: '#3b82f6', // govt-blue-light
        secondary: '#64748b', // govt-gray
        accent: '#2563eb', // govt-blue-dark
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        chart1: '#0ea5e9',
        chart2: '#6366f1',
        chart3: '#8b5cf6'
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src="/gov.svg" alt="Emblem" className="h-12 w-auto" />
                            <div className="border-l-2 border-gray-200 pl-4">
                                <h1 className="text-lg font-bold text-govt-text leading-tight">Officer Portal</h1>
                                <p className="text-xs text-gray-500 font-medium">Ministry of Social Justice and Empowerment</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/officer/dashboard')}
                            className="text-sm font-medium text-govt-blue-dark hover:text-blue-700 flex items-center gap-1"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-govt-text">{t('actions.profiling')}</h1>
                        <p className="text-gray-600 mt-1">Beneficiary analytics and demographic insights.</p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {['all', 'sc', 'st', 'male', 'female'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm ${selectedFilter === filter
                                    ? 'bg-govt-blue-light text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {filter.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total SC Count */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <span className="text-xl">🏛️</span>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">SC Beneficiaries</h3>
                        <p className="text-3xl font-bold text-govt-text mt-1">2,940</p>
                    </div>

                    {/* Total ST Count */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <span className="text-xl">🌳</span>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+8%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">ST Beneficiaries</h3>
                        <p className="text-3xl font-bold text-govt-text mt-1">2,020</p>
                    </div>

                    {/* Benefited Percentage */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                <span className="text-xl">📊</span>
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Success Rate</h3>
                        <p className="text-3xl font-bold text-govt-text mt-1">87.5%</p>
                    </div>

                    {/* Funds Released */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <span className="text-xl">💰</span>
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Funds Released</h3>
                        <p className="text-3xl font-bold text-govt-text mt-1">₹45.2Cr</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* State-wise Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-govt-text mb-6">State-wise Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stateWiseData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="state" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Bar dataKey="sc" fill={COLORS.chart1} name="SC" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="st" fill={COLORS.chart2} name="ST" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gender Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-govt-text mb-6">Gender Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill={COLORS.chart1} />
                                    <Cell fill={COLORS.chart2} />
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Age Range Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-govt-text mb-6">Age Range Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ageRangeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill={COLORS.chart3} name="Beneficiaries" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-govt-text mb-6">Monthly Application Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="approved" stroke={COLORS.success} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="rejected" stroke={COLORS.danger} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="pending" stroke={COLORS.warning} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="text-lg font-bold text-blue-900 mb-3">📈 Key Insights</h4>
                        <ul className="space-y-2 text-blue-800 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                87.5% beneficiary success rate
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                92% automation achieved
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                ₹45.2Cr funds disbursed
                            </li>
                        </ul>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                        <h4 className="text-lg font-bold text-green-900 mb-3">🎯 Performance Metrics</h4>
                        <ul className="space-y-2 text-green-800 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                10,000 total beneficiaries
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                Balanced gender ratio
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h4 className="text-lg font-bold text-slate-900 mb-3">🔒 Security & Compliance</h4>
                        <ul className="space-y-2 text-slate-800 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                23 frauds detected by AI
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                99.7% accuracy rate
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BeneficiaryProfiling;
