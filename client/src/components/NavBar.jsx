import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, LayoutDashboard, ShieldCheck, User, ChevronDown } from 'lucide-react'
import axios from 'axios'

const NavBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent)

    const logout = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/logout`,
                {},
                { withCredentials: true }
            )

            if (data.success) {
                setIsLoggedIn(false)
                setUserData(null)
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed")
        }
    }

    const sendVerifyOtp = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/sendVerifyOTP`,
                {},
                { withCredentials: true }
            )
            if (data.success) {
                toast.success(data.message)
                navigate('/verify-email')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending OTP")
        }
    }

    return (
        <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='fixed top-0 left-0 w-full z-[100] px-6 py-4 sm:px-12 lg:px-24 flex justify-between items-center bg-[#000414]/40 backdrop-blur-md border-b border-white/5'
        >
            <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                src={assets.logo}
                alt="Logo"
                className='w-28 sm:w-32 cursor-pointer drop-shadow-2xl'
                onClick={() => navigate('/')}
            />

            <div className='flex items-center gap-4'>
                {userData ? (
                    <div className='relative group'>
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className='flex items-center gap-3 bg-white/5 border border-white/10 pl-1.5 pr-4 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-all shadow-xl'
                        >
                            <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold text-sm shadow-lg'>
                                {userData.name[0].toUpperCase()}
                            </div>
                            <div className='hidden sm:block text-left'>
                                <p className='text-xs font-bold text-white line-clamp-1'>{userData.name}</p>
                                <p className='text-[10px] text-gray-500 font-medium'>
                                    {userData.isVerified ? 'Verified' : 'Unverified'}
                                </p>
                            </div>
                            <ChevronDown size={14} className='text-gray-500 group-hover:text-white transition-colors' />
                        </motion.div>

                        <div className='absolute right-0 top-full pt-3 hidden group-hover:block w-56'>
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className='bg-[#0A0F29]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden'
                            >
                                {!userData.isVerified && (
                                    <button
                                        onClick={sendVerifyOtp}
                                        className='w-full flex items-center gap-3 px-4 py-3 text-sm text-yellow-500 hover:bg-white/5 rounded-xl transition-colors font-medium border-b border-white/5 mb-1'
                                    >
                                        <ShieldCheck size={18} /> Verify Account
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors font-medium ${location.pathname === '/dashboard' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                                >
                                    <LayoutDashboard size={18} /> Workspace
                                </button>
                                <button
                                    onClick={logout}
                                    className='w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium mt-1'
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className='bg-white text-black font-bold px-8 py-2.5 rounded-full text-sm hover:bg-gray-200 transition-colors shadow-xl shadow-white/5'
                    >
                        Login
                    </motion.button>
                )}
            </div>
        </motion.nav>
    )
}

export default NavBar

