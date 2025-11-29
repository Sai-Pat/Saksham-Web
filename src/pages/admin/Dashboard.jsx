import { supabase } from '../../supabase/client'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
    const { session, role } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="border-b-4 border-orange-500 bg-white shadow-md"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-orange-800">Admin Panel</h1>
                                <p className="text-xs text-gray-600">Restricted Access</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-orange-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-orange-800">Welcome, Administrator</h2>
                    <p className="mt-2 text-gray-600">System Control Center</p>
                </motion.div>

                {/* Admin Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8"
                >
                    <h2 className="text-2xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-green-600 rounded-full"></span>
                        Admin Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Create Scheme Card */}
                        <Link to="/admin/create-scheme" className="group relative block rounded-xl border-2 border-orange-200 bg-white p-6 shadow-lg transition-all hover:border-orange-500 hover:shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-orange-800">Create Scheme</h3>
                                    <p className="mt-1 text-sm text-gray-600">Define new welfare schemes with allocated funds and eligibility criteria.</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 group-hover:bg-orange-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Release Funds Card */}
                        <Link to="/admin/release-funds" className="group relative block rounded-xl border-2 border-green-200 bg-white p-6 shadow-lg transition-all hover:border-green-500 hover:shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-green-800">Release Funds</h3>
                                    <p className="mt-1 text-sm text-gray-600">Review and release funds for approved applications.</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-green-600 group-hover:text-white transition-colors">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.075 60.075 0 0 1 15.794 0L20.25 10.5M2.25 18.75a3.75 3.75 0 0 0 4.867 0M2.25 18.75V7.5A2.25 2.25 0 0 1 4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5v11.25m-18 0h18" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Add Skill Courses Card */}
                        <Link to="/admin/add-skill-courses" className="group relative block rounded-xl border-2 border-blue-200 bg-white p-6 shadow-lg transition-all hover:border-blue-500 hover:shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-blue-800">Add Skill Courses</h3>
                                    <p className="mt-1 text-sm text-gray-600">Manage and add new skill development courses for beneficiaries.</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 12 21a8.987 8.987 0 0 1 9-6.738V6.552a8.967 8.967 0 0 0-6-2.79Z" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>
                {/* Main Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8 rounded-xl border-2 border-orange-200 bg-white p-12 text-center shadow-lg"
                >
                    <div className="mx-auto max-w-2xl">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-orange-800">RESTRICTED AREA</h3>
                        <p className="mt-4 text-gray-600">
                            You have successfully authenticated as an administrator. This is a secure area with elevated privileges.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
