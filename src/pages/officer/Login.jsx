import { useState, useEffect } from 'react'
import { auth, db } from '../../firebase/client'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

export default function OfficerLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [captchaInput, setCaptchaInput] = useState('')
    const [captchaCode, setCaptchaCode] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const generateCaptcha = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
        let code = ''
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)]
        }
        setCaptchaCode(code)
    }

    useEffect(() => {
        generateCaptcha()
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        if (captchaInput !== captchaCode) {
            setMessage('Error: Invalid Security Code')
            setLoading(false)
            return
        }

        try {
            await signInWithEmailAndPassword(auth, email, password)

            const officerSnap = await getDoc(doc(db, "officers", email));
            if (officerSnap.exists()) {
                navigate("/officer/dashboard");
                return;
            }

            // Fallback check for admin if needed, or just error
            const adminSnap = await getDoc(doc(db, "admin", email));
            if (adminSnap.exists()) {
                navigate("/admin/dashboard");
                return;
            }

            setMessage("Error: Role not found for this user.");

        } catch (error) {
            setMessage(`Error: ${error.message}`)
        } finally {
            setLoading(false)
            generateCaptcha()
            setCaptchaInput('')
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Left Panel - Blue Gradient */}
            <div className="w-full md:w-1/2 bg-split-gradient text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative overlay if needed */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                {/* Header */}
                <div className="z-10">
                    <div className="flex items-center gap-4 mb-2">
                        <img src="/gov.svg" alt="Emblem" className="h-16 w-auto brightness-0 invert" />
                        <div className="border-l border-white/30 pl-4">
                            <p className="text-sm font-medium tracking-wider opacity-90">GOVERNMENT OF INDIA</p>
                            <h1 className="text-xl md:text-2xl font-bold leading-tight">Ministry of Social Justice<br />and Empowerment</h1>
                        </div>
                    </div>
                </div>

                {/* Center Content */}
                <div className="z-10 my-12">
                    <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-3 mb-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide">SAKSHAM</h2>
                    </div>
                    <p className="text-lg md:text-xl text-blue-50 max-w-lg leading-relaxed">
                        Single Window Interface for Officer Administration and Scheme Management. Empowering governance through digital transformation.
                    </p>
                </div>

                {/* Footer */}
                <div className="z-10 text-xs text-blue-100 flex justify-between items-end">
                    <div>
                        <p>© 2025 | All rights reserved</p>
                        <p className="mt-1 opacity-70">Designed, Developed & Hosted by NIC</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Portal Website</a>
                        <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl md:shadow-none p-8 border border-gray-100 md:border-none">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-govt-blue-dark inline-block border-b-4 border-govt-blue-dark pb-2">OFFICE LOGIN</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-govt-blue-light focus:border-transparent transition-all"
                                placeholder="Enter Username / Email"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-govt-blue-light focus:border-transparent transition-all"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {showPassword ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    )}
                                    {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                </svg>
                            </button>
                        </div>

                        {/* Captcha */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex-1 text-center font-mono text-xl font-bold tracking-widest text-gray-700 select-none bg-white py-2 rounded border border-gray-100 shadow-sm">
                                    {captchaCode}
                                </div>
                                <button
                                    type="button"
                                    onClick={generateCaptcha}
                                    className="p-2 text-gray-500 hover:text-govt-blue-dark hover:bg-blue-50 rounded-full transition-colors"
                                    title="Refresh Captcha"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-govt-blue-light focus:border-transparent transition-all"
                                    placeholder="Enter Security Code"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {message && (
                            <div className={`p-3 rounded-lg text-sm text-center ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-govt-blue-light hover:bg-govt-blue-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="text-center space-y-4 pt-2">
                            <p className="text-xs text-gray-500 max-w-xs mx-auto">
                                Please update your Email-ID and Mobile Number after LOGIN.
                            </p>

                            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-govt-blue-dark transition-colors">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
