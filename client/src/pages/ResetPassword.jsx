import React, { useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import axios from 'axios'

const ResetPassword = () => {
    const navigate = useNavigate()
    const inputRefs = useRef([])

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleInput = (e, index) => {
        if (e.target.value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').slice(0, 6)
        paste.split('').forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

    const sendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/sendRestPasswordOTP`,
                { email }
            )
            if (data.success) {
                toast.success(data.message)
                setStep(2)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault()
        const enteredOtp = inputRefs.current.map(i => i.value).join('')
        if (enteredOtp.length !== 6) return toast.error('Enter valid 6-digit OTP')
        setOtp(enteredOtp)
        toast.success('OTP verified')
        setStep(3)
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        if (newPassword.length < 6) return toast.error('Password must be at least 6 characters')
        setLoading(true)
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/resetPassword`,
                { email, otp, newPassword }
            )
            if (data.success) {
                toast.success(data.message)
                navigate('/login')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen px-4 bg-[#000414] relative overflow-hidden'>
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full'></div>
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full'></div>

            <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={assets.logo}
                alt='Logo'
                onClick={() => navigate('/')}
                className='absolute left-5 sm:left-20 top-8 w-28 sm:w-32 cursor-pointer z-20'
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-[400px] z-10'
            >
                <div className='text-center mb-8'>
                    <h2 className='text-2xl font-bold text-white mb-2'>Reset Password</h2>
                    <p className='text-gray-400 text-sm'>
                        {step === 1 ? "Enter your email to receive OTP" : step === 2 ? "Enter the 6-digit code we sent you" : "Set your new secure password"}
                    </p>
                </div>

                <AnimatePresence mode='wait'>
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={sendOtp}
                            className='space-y-6'
                        >
                            <div className='relative'>
                                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                                <input
                                    type='email'
                                    placeholder='Email Address'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-colors'
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30'
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={verifyOtp}
                            className='space-y-6'
                        >
                            <div className='flex justify-between gap-2' onPaste={handlePaste}>
                                {Array(6).fill(0).map((_, index) => (
                                    <input
                                        key={index}
                                        type='text'
                                        maxLength='1'
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        onInput={(e) => handleInput(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className='w-full aspect-square bg-white/5 border border-white/10 text-white text-xl font-bold text-center rounded-xl focus:border-purple-500 transition-colors'
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity'
                            >
                                Verify OTP
                            </button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.form
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={resetPassword}
                            className='space-y-6'
                        >
                            <div className='relative'>
                                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='New password'
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className='w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-colors'
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors'
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30'
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className='mt-8 pt-6 border-t border-white/5 text-center'>
                    <button
                        onClick={() => navigate('/login')}
                        className='text-gray-400 text-sm flex items-center justify-center gap-2 hover:text-white transition-colors mx-auto'
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default ResetPassword

