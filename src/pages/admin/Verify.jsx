import { useState } from 'react'
import { supabase } from '../../supabase/client'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AdminVerify() {
    const location = useLocation()
    const [email, setEmail] = useState(location.state?.email || '')
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleVerify = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { data, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        })

        if (verifyError) {
            setError(verifyError.message)
            setLoading(false)
            return
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()

        if (profileError) {
            console.error('Profile Error:', profileError)
            setError(`Database Error: ${profileError.message}. Did you run the SQL script?`)
            setLoading(false)
            return
        }

        if (profile?.role !== 'admin') {
            await supabase.auth.signOut()
            setError('Unauthorized: You are not an Admin.')
            setLoading(false)
            return
        }

        navigate('/admin/dashboard')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                        </svg>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-orange-800">Verify Admin Access</h2>
                    <p className="mt-2 text-gray-600">Enter the 6-digit code sent to {email}</p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="rounded-2xl border-2 border-orange-200 bg-white p-8 shadow-xl"
                >
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-2 block w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">6-Digit OTP Code</label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                                maxLength={6}
                                className="mt-2 block w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-center text-2xl font-mono tracking-widest text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                placeholder="000000"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify & Login'
                            )}
                        </button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-6 text-center"
                >
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="text-sm text-gray-600 transition-colors hover:text-orange-600"
                    >
                        ← Back to Login
                    </button>
                </motion.div>
            </motion.div>
        </div>
    )
}
