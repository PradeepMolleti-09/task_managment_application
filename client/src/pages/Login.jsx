import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'

import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Login = () => {
    const navigate = useNavigate()
    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            axios.defaults.withCredentials = true

            const url = state === 'Sign Up'
                ? `${backendUrl}/api/auth/register`
                : `${backendUrl}/api/auth/login`

            const payload = state === 'Sign Up'
                ? { name, email, password }
                : { email, password }

            const { data } = await axios.post(url, payload)

            if (data.success) {
                toast.success(data.message || 'Success')
                setIsLoggedIn(true)
                await getUserData()
                navigate('/dashboard')
            } else {
                toast.error(data.message || 'Operation failed')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Server error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen px-4 bg-[#000414] relative overflow-hidden'>
            {/* Background elements */}
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full'></div>
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full'></div>

            <motion.img
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    <motion.h2 
                        key={state}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='text-3xl font-bold text-white mb-2'
                    >
                        {state === 'Sign Up' ? 'Get Started' : 'Welcome Back'}
                    </motion.h2>
                    <p className='text-gray-400 text-sm'>
                        {state === 'Sign Up' ? 'Create an account to manage your tasks' : 'Login to access your dashboard'}
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className='space-y-4'>
                    <AnimatePresence mode='wait'>
                        {state === 'Sign Up' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='relative'
                            >
                                <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                                <input
                                    type='text'
                                    placeholder='Full Name'
                                    className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-colors'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className='relative'>
                        <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                        <input
                            type='email'
                            placeholder='Email Address'
                            className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-colors'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className='relative'>
                        <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            className='w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-colors'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors'
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {state === 'Login' && (
                        <div className='text-right'>
                            <span
                                onClick={() => navigate('/reset-password')}
                                className='text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors'
                            >
                                Forgot password?
                            </span>
                        </div>
                    )}

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4'
                    >
                        {loading ? 'Processing...' : (state === 'Sign Up' ? 'Create Account' : 'Sign In')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className='mt-8 pt-6 border-t border-white/5 text-center'>
                    <p className='text-gray-400 text-sm'>
                        {state === 'Sign Up' ? 'Already have an account?' : "New to the platform?"}
                        <button
                            className='ml-2 text-purple-400 font-semibold hover:underline'
                            onClick={() => {
                                setState(state === 'Sign Up' ? 'Login' : 'Sign Up')
                                setShowPassword(false)
                            }}
                        >
                            {state === 'Sign Up' ? 'Sign In' : 'Create Account'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login

