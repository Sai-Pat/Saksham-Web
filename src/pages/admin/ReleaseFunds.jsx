import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase/client';
import AIBadge from '../../components/AIBadge'; // Assuming AIBadge component is available

export default function ReleaseFunds() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDocuments, setShowDocuments] = useState({});

    useEffect(() => {
        fetchApprovedApplications();
    }, []);

    const fetchApprovedApplications = async () => {
        try {
            // Fetch applications that are both AI and Human approved
            const { data, error } = await supabase
                .from('applications') // Assuming 'applications' table exists
                .select('*, documents(*)') // Select all application fields and related documents
                .eq('ai_approved', true)
                .eq('human_approved', true);

            if (error) {
                throw error;
            }
            setApplications(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReleaseFunds = async (applicationId) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('applications')
                .update({ funds_released: true, status: 'Funds Released' })
                .eq('id', applicationId);

            if (error) {
                throw error;
            }
            // Refresh the list of applications
            fetchApprovedApplications();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleDocuments = (applicationId) => {
        setShowDocuments(prev => ({
            ...prev,
            [applicationId]: !prev[applicationId]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="border-b-4 border-orange-500 bg-white shadow-md mb-8"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button onClick={() => navigate('/admin/dashboard')} className="text-orange-600 hover:text-orange-800 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h17.25" />
                                </svg>
                            </button>
                            <h1 className="text-lg font-bold text-orange-800">Release Funds</h1>
                        </div>
                    </div>
                </div>
            </motion.header>

            <main className="mx-auto max-w-7xl">
                {loading && <p className="text-center text-gray-600">Loading applications...</p>}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"><strong className="font-bold">Error!</strong><span className="block sm:inline"> {error}</span></div>}

                {!loading && applications.length === 0 && (
                    <p className="text-center text-gray-600">No approved applications found for fund release.</p>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map(app => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-orange-200"
                        >
                            <h3 className="text-xl font-bold text-orange-800">Application ID: {app.id?.slice(0, 8)}</h3>
                            <p className="text-gray-600 mt-2">Applicant: {app.applicant_name}</p>
                            <p className="text-gray-600">Scheme: {app.scheme_name}</p>
                            <p className="text-gray-600">Amount Requested: ₹{app.amount_requested}</p>

                            <div className="mt-4 flex items-center space-x-2">
                                {app.ai_approved && <AIBadge />} {/* AI Approved Badge */}
                                {app.human_approved && (
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                        <svg className="-ml-1 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                            <circle cx="4" cy="4" r="3" />
                                        </svg>
                                        Human Approved
                                    </span>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col space-y-3">
                                <button
                                    onClick={() => toggleDocuments(app.id)}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    {showDocuments[app.id] ? 'Hide Documents' : 'Check Documents'}
                                </button>

                                {showDocuments[app.id] && app.documents && app.documents.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 space-y-2 text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200"
                                    >
                                        <p className="font-semibold">Uploaded Documents:</p>
                                        <ul className="list-disc list-inside">
                                            {app.documents.map(doc => (
                                                <li key={doc.id}>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {doc.name || `Document ${doc.id?.slice(0, 4)}`}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                <button
                                    onClick={() => handleReleaseFunds(app.id)}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={app.funds_released || loading}
                                >
                                    {app.funds_released ? 'Funds Released' : (loading ? 'Releasing...' : 'Release Funds')}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
