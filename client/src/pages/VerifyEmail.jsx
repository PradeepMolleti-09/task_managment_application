import React, { useContext, useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const VerifyEmail = () => {
    const inputRefs = useRef([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const {
        backendUrl,
        isLoggedIn,
        userData,
        getUserData
    } = useContext(AppContent)

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        if (userData?.isVerified) {
            navigate('/')
        }
    }, [isLoggedIn, userData, navigate])

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

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const otp = inputRefs.current.map(i => i.value).join('')
            const { data } = await axios.post(
                `${backendUrl}/api/auth/verifyEmail`,
                { otp },
                { withCredentials: true }
            )

            if (data.success) {
                toast.success(data.message)
                await getUserData()
                navigate('/dashboard')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-4 bg-[#000414] relative overflow-hidden'>
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
                <div className='text-center mb-10'>
                    <div className='w-16 h-16 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-600/10'>
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className='text-2xl font-bold text-white mb-2'>Verify Account</h2>
                    <p className='text-gray-400 text-sm'>
                        We've sent a 6-digit code to your email address. Please enter it below.
                    </p>
                </div>

                <form onSubmit={submitHandler} className='space-y-8'>
                    <div className='flex justify-between gap-2' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input
                                key={index}
                                type='text'
                                maxLength='1'
                                required
                                ref={el => (inputRefs.current[index] = el)}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className='w-full aspect-square bg-white/5 border border-white/10 text-white text-xl font-bold text-center rounded-xl focus:border-purple-500 transition-colors'
                            />
                        ))}
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30'
                    >
                        {loading ? 'Verifying...' : 'Complete Verification'}
                    </button>
                </form>

                <div className='mt-8 pt-6 border-t border-white/5 text-center'>
                    <button
                        onClick={() => navigate('/login')}
                        className='text-gray-400 text-sm flex items-center justify-center gap-2 hover:text-white transition-colors mx-auto'
                    >
                        <ArrowLeft size={16} /> Change Account
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default VerifyEmail

