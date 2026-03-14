
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'

const Header = () => {
    const { userData, isLoggedIn } = useContext(AppContent)
    const navigate = useNavigate()

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-4 text-center relative z-10'>

            {/* Small Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md'
            >
                <span className='w-2 h-2 rounded-full bg-purple-500 animate-pulse'></span>
                <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>Secure Task Ecosystem 2.0</span>
            </motion.div>

            {/* Title Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h1 className='text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[0.9] sm:leading-[0.9]'>
                    Elevate your <br />
                    <span className='bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent'>Productivity.</span>
                </h1>

                <p className='text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed'>
                    A state-of-the-art workspace featuring JWT-protected sessions,
                    AES-256 task encryption, and a seamless developer experience.
                    Built for speed. Designed for security.
                </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='flex flex-col sm:flex-row items-center gap-4'
            >
                <button
                    onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                    className='group relative bg-white text-black font-black px-10 py-5 rounded-[2rem] hover:scale-105 transition-all flex items-center gap-3 overflow-hidden shadow-2xl shadow-white/10'
                >
                    <span className='relative z-10'>{isLoggedIn ? 'Go to Workspace' : 'Get Started Now'}</span>
                    <ArrowRight className='relative z-10 group-hover:translate-x-1 transition-transform' size={20} />
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity'></div>
                </button>

                {!isLoggedIn && (
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-white/5 border border-white/10 text-white font-bold px-10 py-5 rounded-[2rem] hover:bg-white/10 transition-all backdrop-blur-md'
                    >
                        View Demo
                    </button>
                )}
            </motion.div>

            {/* Feature Pills */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='grid grid-cols-2 md:grid-cols-3 gap-8 mt-24 opacity-40 hover:opacity-100 transition-opacity'
            >
                <div className='flex items-center gap-3 text-white'>
                    <Shield size={20} className='text-purple-500' />
                    <span className='text-xs font-bold uppercase tracking-widest'>JWT Secured</span>
                </div>
                <div className='flex items-center gap-3 text-white'>
                    <Lock size={20} className='text-blue-500' />
                    <span className='text-xs font-bold uppercase tracking-widest'>AES-256 Encrypted</span>
                </div>
                <div className='flex items-center gap-3 text-white hidden md:flex'>
                    <Zap size={20} className='text-indigo-500' />
                    <span className='text-xs font-bold uppercase tracking-widest'>Real-time Sync</span>
                </div>
            </motion.div>
        </div>
    )
}

export default Header;
