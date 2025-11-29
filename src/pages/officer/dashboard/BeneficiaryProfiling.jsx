import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import GlassCard from '../../../components/common/GlassCard';
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
        male: '#3B82F6',
        female: '#EC4899',
        sc: '#FF9933',
        st: '#138808',
        approved: '#22C55E',
        rejected: '#EF4444',
        pending: '#F59E0B'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4 md:p-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-orange-500 to-saffron-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-green-600 to-green-700 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-saffron-600 to-green-700 bg-clip-text text-transparent">
                            {t('actions.profiling')}
                        </h1>
                        <p className="text-black text-sm md:text-base mt-1 font-medium">Comprehensive beneficiary analytics and insights</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/officer/dashboard')} className="!text-black">
                        ← Back to Dashboard
                    </Button>
                </div>

                {/* Filter Buttons */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {['all', 'sc', 'st', 'male', 'female'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`px-6 py-2.5 rounded-lg font-bold transition-all shadow-md ${selectedFilter === filter
                                    ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white'
                                    : 'bg-white text-black hover:bg-gray-100'
                                }`}
                        >
                            {filter.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total SC Count */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">🏛️</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">SC Beneficiaries</h3>
                            <p className="text-4xl font-bold text-black mb-1">2,940</p>
                            <p className="text-xs text-black font-medium">Scheduled Caste category</p>
                        </div>
                    </div>

                    {/* Total ST Count */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">🌳</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">ST Beneficiaries</h3>
                            <p className="text-4xl font-bold text-black mb-1">2,020</p>
                            <p className="text-xs text-black font-medium">Scheduled Tribe category</p>
                        </div>
                    </div>

                    {/* Benefited Percentage */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">📊</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">Benefited</h3>
                            <p className="text-4xl font-bold text-black mb-1">87.5%</p>
                            <p className="text-xs text-black font-medium">Successfully benefited</p>
                        </div>
                    </div>

                    {/* Frauds Detected */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">Frauds Detected</h3>
                            <p className="text-4xl font-bold text-black mb-1">23</p>
                            <p className="text-xs text-black font-medium">AI-powered detection</p>
                        </div>
                    </div>

                    {/* Total Funds Released */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">💰</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">Funds Released</h3>
                            <p className="text-4xl font-bold text-black mb-1">₹45.2Cr</p>
                            <p className="text-xs text-black font-medium">Total disbursed amount</p>
                        </div>
                    </div>

                    {/* Automation Percentage */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">🤖</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">Automation</h3>
                            <p className="text-4xl font-bold text-black mb-1">92%</p>
                            <p className="text-xs text-black font-medium">Reduced manual work</p>
                        </div>
                    </div>

                    {/* Male Count */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">👨</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">Male</h3>
                            <p className="text-4xl font-bold text-black mb-1">5,240</p>
                            <p className="text-xs text-black font-medium">52.4% of total</p>
                        </div>
                    </div>

                    {/* Female Count */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">👩</span>
                                </div>
                            </div>
                            <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">Female</h3>
                            <p className="text-4xl font-bold text-black mb-1">4,760</p>
                            <p className="text-xs text-black font-medium">47.6% of total</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* State-wise Distribution */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-orange-100">
                        <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-green-600 rounded-full"></span>
                            State-wise Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stateWiseData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="state" stroke="#000" />
                                <YAxis stroke="#000" />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #FF9933' }} />
                                <Legend />
                                <Bar dataKey="sc" fill={COLORS.sc} name="SC" />
                                <Bar dataKey="st" fill={COLORS.st} name="ST" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gender Distribution */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-100">
                        <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-pink-600 rounded-full"></span>
                            Gender Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    <Cell fill={COLORS.male} />
                                    <Cell fill={COLORS.female} />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Age Range Distribution */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-blue-100">
                        <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></span>
                            Age Range Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ageRangeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" stroke="#000" />
                                <YAxis stroke="#000" />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #8B5CF6' }} />
                                <Bar dataKey="count" fill="#8B5CF6" name="Beneficiaries" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-purple-100">
                        <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-red-600 rounded-full"></span>
                            Monthly Application Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" stroke="#000" />
                                <YAxis stroke="#000" />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #22C55E' }} />
                                <Legend />
                                <Line type="monotone" dataKey="approved" stroke={COLORS.approved} strokeWidth={3} name="Approved" />
                                <Line type="monotone" dataKey="rejected" stroke={COLORS.rejected} strokeWidth={3} name="Rejected" />
                                <Line type="monotone" dataKey="pending" stroke={COLORS.pending} strokeWidth={3} name="Pending" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-300">
                        <h4 className="text-lg font-bold text-black mb-3">📈 Key Insights</h4>
                        <ul className="space-y-2 text-black">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="font-medium">87.5% beneficiary success rate</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="font-medium">92% automation achieved</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="font-medium">₹45.2Cr funds disbursed</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300">
                        <h4 className="text-lg font-bold text-black mb-3">🎯 Performance Metrics</h4>
                        <ul className="space-y-2 text-black">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span className="font-medium">10,000 total beneficiaries</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span className="font-medium">2,940 SC + 2,020 ST</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span className="font-medium">Balanced gender ratio</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300">
                        <h4 className="text-lg font-bold text-black mb-3">🔒 Security & Compliance</h4>
                        <ul className="space-y-2 text-black">
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">⚠</span>
                                <span className="font-medium">23 frauds detected by AI</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="font-medium">99.7% accuracy rate</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="font-medium">Real-time monitoring active</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryProfiling;
