import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase/client';

export default function CreateScheme() {
    const navigate = useNavigate();
    const [schemeName, setSchemeName] = useState('');
    const [totalFundAllocated, setTotalFundAllocated] = useState('');
    const [eligibility, setEligibility] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { data, error } = await supabase
                .from('schemes') // Assuming a 'schemes' table exists
                .insert([
                    { name: schemeName, fund_allocated: parseFloat(totalFundAllocated), eligibility: eligibility }
                ]);

            if (error) {
                throw error;
            }

            setSuccess(true);
            setSchemeName('');
            setTotalFundAllocated('');
            setEligibility('');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
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
                            <h1 className="text-lg font-bold text-orange-800">Create New Scheme</h1>
                        </div>
                    </div>
                </div>
            </motion.header>

            <main className="mx-auto max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-orange-200">
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label htmlFor="schemeName" className="block text-sm font-medium text-gray-700">Name of Scheme</label>
                        <input
                            type="text"
                            id="schemeName"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border"
                            value={schemeName}
                            onChange={(e) => setSchemeName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="totalFundAllocated" className="block text-sm font-medium text-gray-700">Total Fund Allocated</label>
                        <input
                            type="number"
                            id="totalFundAllocated"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border"
                            value={totalFundAllocated}
                            onChange={(e) => setTotalFundAllocated(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700">Eligibility Criteria</label>
                        <textarea
                            id="eligibility"
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border"
                            value={eligibility}
                            onChange={(e) => setEligibility(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Scheme created successfully.</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Scheme'}
                    </button>
                </motion.form>
            </main>
        </div>
    );
}
