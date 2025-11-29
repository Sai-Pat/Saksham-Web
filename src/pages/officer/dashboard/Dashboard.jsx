import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import IconDocs from '../../../components/common/IconDocs';
import IconVisit from '../../../components/common/IconVisit';
import IconChart from '../../../components/common/IconChart';
import { getKPIs } from '../../../api/applications';
import { supabase } from '../../../supabase/client';

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { session } = useAuth();
    const [kpis, setKpis] = useState({
        pendingReviews: 0,
        fieldVisits: 0,
        beneficiaries: 0,
        efficiency: "0%"
    });

    const officerData = {
        firstName: session?.user?.user_metadata?.first_name || 'Steve',
        lastName: session?.user?.user_metadata?.last_name || 'Harrington',
        regNo: session?.user?.user_metadata?.reg_no || 'OFF-2024-001234',
        designation: session?.user?.user_metadata?.designation || 'Field Officer',
        department: session?.user?.user_metadata?.department || 'Social Welfare',
        district: session?.user?.user_metadata?.district || 'New Delhi',
        state: session?.user?.user_metadata?.state || 'Delhi',
        email: session?.user?.email || 'krish3@gov.in',
        phone: session?.user?.user_metadata?.phone || '+91 9173749573',
        joiningDate: session?.user?.user_metadata?.joining_date || '15 Jan 2024'
    };

    useEffect(() => {
        getKPIs().then(setKpis);
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/officer/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4 md:p-6 relative overflow-hidden">
            {/* Decorative Indian Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-orange-500 to-saffron-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-green-600 to-green-700 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-8 border-navy-500 rounded-full opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header with Language Switcher and Logout */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-saffron-600 to-green-700 bg-clip-text text-transparent">
                            {t('Saksham')}
                        </h1>
                        <p className="text-black text-sm md:text-base mt-1 font-medium">Digital Governance Platform</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <Button
                                variant={i18n.language === 'en' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => changeLanguage('en')}
                                className="!text-black"
                            >
                                English
                            </Button>
                            <Button
                                variant={i18n.language === 'hi' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => changeLanguage('hi')}
                                className="!text-black"
                            >
                                हिंदी
                            </Button>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-orange-700"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Officer Profile Card */}
                <div className="mb-6">
                    <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 p-[2px] rounded-2xl shadow-2xl">
                        <div className="bg-white rounded-2xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Profile Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-orange-500 to-green-600 p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                            <img
                                                src="/steve-harrington.png"
                                                alt="Steve Harrington"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Officer Details */}
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-black">
                                                {officerData.firstName} {officerData.lastName}
                                            </h2>
                                            <p className="text-black font-semibold text-lg mt-1">{officerData.designation}</p>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-green-100 rounded-full border-2 border-orange-300">
                                                <span className="text-black font-bold text-sm">Reg No: {officerData.regNo}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-black font-semibold uppercase tracking-wide">Department</p>
                                                <p className="text-black font-bold mt-1">{officerData.department}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-black font-semibold uppercase tracking-wide">Location</p>
                                                <p className="text-black font-bold mt-1">{officerData.district}, {officerData.state}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                            <div className="w-10 h-10 rounded-full bg-navy-600 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-black font-semibold uppercase tracking-wide">Joined</p>
                                                <p className="text-black font-bold mt-1">{officerData.joiningDate}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-black font-semibold uppercase tracking-wide">Email</p>
                                                <p className="text-black font-bold mt-1 text-sm break-all">{officerData.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                                            <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-black font-semibold uppercase tracking-wide">Phone</p>
                                                <p className="text-black font-bold mt-1">{officerData.phone}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                        <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-green-600 rounded-full"></span>
                        Performance Metrics
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Pending Reviews */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="px-3 py-1 bg-orange-100 rounded-full">
                                        <span className="text-xs font-bold text-orange-700">URGENT</span>
                                    </div>
                                </div>
                                <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">{t('Pending Reviews')}</h3>
                                <p className="text-4xl font-bold text-black mb-1">{kpis.pendingReviews}</p>
                                <p className="text-xs text-black font-medium">Applications awaiting review</p>
                            </div>
                        </div>

                        {/* Field Visits */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="px-3 py-1 bg-green-100 rounded-full">
                                        <span className="text-xs font-bold text-green-700">ACTIVE</span>
                                    </div>
                                </div>
                                <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">{t('Field Visits')}</h3>
                                <p className="text-4xl font-bold text-black mb-1">{kpis.fieldVisits}</p>
                                <p className="text-xs text-black font-medium">Scheduled this month</p>
                            </div>
                        </div>

                        {/* Beneficiaries */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-800 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="px-3 py-1 bg-blue-100 rounded-full">
                                        <span className="text-xs font-bold text-blue-700">TOTAL</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-black mb-2">{t('beneficiaries')}</h3>
                                <p className="text-4xl font-bold text-black mb-1">{kpis.beneficiaries}</p>
                                <p className="text-xs text-black font-medium">Under your jurisdiction</p>
                            </div>
                        </div>

                        {/* Efficiency */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50"></div>
                            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div className="px-3 py-1 bg-purple-100 rounded-full">
                                        <span className="text-xs font-bold text-purple-700">SCORE</span>
                                    </div>
                                </div>
                                <h3 className="text-black font-semibold text-sm mb-2 uppercase tracking-wide">{t('efficiency')}</h3>
                                <p className="text-4xl font-bold text-black mb-1">{kpis.efficiency}</p>
                                <p className="text-xs text-black font-medium">Processing efficiency rate</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                        <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-green-600 rounded-full"></span>
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-orange-300"
                            onClick={() => navigate('/officer/document-verification')}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-transparent rounded-bl-full opacity-20"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                    <IconDocs className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-xl text-black mb-2">{t('Verify Documents')}</h3>
                                <p className="text-sm text-black font-medium">Review and verify pending applications with AI assistance</p>
                                <div className="mt-4 flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Get Started</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-green-300"
                            onClick={() => navigate('/officer/field-enumerator')}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-transparent rounded-bl-full opacity-20"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                    <IconVisit className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-xl text-black mb-2">{t('Field Visit')}</h3>
                                <p className="text-sm text-black font-medium">Schedule visits and manage offline data uploads</p>
                                <div className="mt-4 flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Get Started</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-300"
                            onClick={() => navigate('/officer/beneficiary-profiling')}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-transparent rounded-bl-full opacity-20"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                    <IconChart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-xl text-black mb-2">{t('Analytical Dashboard')}</h3>
                                <p className="text-sm text-black font-medium">Access analytics, reports and beneficiary insights</p>
                                <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Get Started</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
