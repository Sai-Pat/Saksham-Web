import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md text-center rounded-2xl border-2 border-red-200 bg-white p-8 shadow-xl"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.174 3.35 1.94 3.35h14.71c1.766 0 2.806-1.85 1.939-3.35L13.736 2.07a1.125 1.125 0 0 0-1.972 0L3.693 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </motion.div>
                <h2 className="text-3xl font-bold text-red-800">Unauthorized Access</h2>
                <p className="mt-4 text-gray-600">
                    You do not have the necessary permissions to view this page.
                </p>
                <Link
                    to="/"
                    className="mt-8 inline-flex items-center rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-orange-700"
                >
                    Go to Home
                </Link>
            </motion.div>
        </div>
    );
}
