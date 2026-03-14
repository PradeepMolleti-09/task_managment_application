import React, { useContext, useEffect, useState, useCallback } from 'react'
import { AppContent } from '../context/AppContext'
import NavBar from '../components/NavBar'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, LayoutGrid, ListTodo, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const Dashboard = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const [tasks, setTasks] = useState([])
    const [counts, setCounts] = useState({ total: 0, pending: 0, 'in-progress': 0, completed: 0 })
    const [loading, setLoading] = useState(true)
    const [taskToEdit, setTaskToEdit] = useState(null)
    
    // Filters & Pagination
    const [statusFilter, setStatusFilter] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchTasks = useCallback(async () => {
        setLoading(true)
        try {
            // If we are on a page > 1 and it might be empty (after delete), backend handles total but we should check
            const { data } = await axios.get(`${backendUrl}/api/tasks`, {
                params: {
                    page,
                    status: statusFilter,
                    search: debouncedSearch,
                    limit: 6
                },
                withCredentials: true
            })
            if (data.success) {
                // Handle case where current page > total pages (e.g. after deletion)
                if (data.pages > 0 && page > data.pages) {
                    setPage(data.pages);
                    return; // useEffect will trigger another fetch with corrected page
                }
                setTasks(data.tasks)
                setTotalPages(data.pages)
                if (data.counts) setCounts(data.counts)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [backendUrl, page, statusFilter, debouncedSearch])

    useEffect(() => {
        if (userData) fetchTasks()
    }, [userData, fetchTasks])

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return
        try {
            const { data } = await axios.delete(`${backendUrl}/api/tasks/${id}`, { withCredentials: true })
            if (data.success) {
                toast.success(data.message)
                fetchTasks()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed")
        }
    }

    const handleEdit = (task) => {
        setTaskToEdit(task)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='min-h-screen bg-[#000414] text-white selection:bg-purple-500/30 font-sans'>
            <NavBar />
            
            {/* Ambient Background */}
            <div className='fixed top-0 left-0 w-full h-full pointer-events-none opacity-20'>
                <div className='absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600 blur-[150px] rounded-full animate-pulse'></div>
                <div className='absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[150px] rounded-full animate-pulse' style={{ animationDelay: '2s' }}></div>
            </div>

            <main className='pt-28 pb-20 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto relative z-10'>
                
                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className='text-4xl sm:text-5xl font-black tracking-tight mb-2'>
                            Workspace.
                        </h1>
                        <p className='text-gray-500 font-medium max-w-md'>
                            Manage your tasks with end-to-end security and real-time synchronization.
                        </p>
                    </motion.div>

                    <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto overflow-hidden'>
                        <div className='relative flex-1 sm:w-64'>
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
                            <input 
                                type="text" 
                                placeholder="Filter by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm'
                            />
                        </div>
                        <div className='relative sm:w-48'>
                            <Filter className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
                            <select 
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm appearance-none'
                            >
                                <option value="" className='bg-[#000414]'>All Status</option>
                                <option value="pending" className='bg-[#000414]'>Pending</option>
                                <option value="in-progress" className='bg-[#000414]'>In Progress</option>
                                <option value="completed" className='bg-[#000414]'>Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-12'>
                    
                    {/* Left: Sticky Form */}
                    <div className='lg:w-1/3 order-2 lg:order-1'>
                        <div className='sticky top-28'>
                            <TaskForm 
                                backendUrl={backendUrl} 
                                onSuccess={fetchTasks} 
                                taskToEdit={taskToEdit}
                                setTaskToEdit={setTaskToEdit}
                            />
                            
                            {/* Summary Card */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='mt-8 p-6 bg-white/5 border border-white/10 rounded-[2rem] hidden lg:block'
                            >
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='bg-white/5 p-4 rounded-2xl'>
                                        <p className='text-3xl font-bold'>{counts.total}</p>
                                        <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Total Tasks</p>
                                    </div>
                                    <div className='bg-green-500/10 p-4 rounded-2xl border border-green-500/10'>
                                        <p className='text-3xl font-bold text-green-400'>{counts.completed}</p>
                                        <p className='text-[10px] text-green-500 font-bold uppercase tracking-widest'>Completed</p>
                                    </div>
                                    <div className='bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/10'>
                                        <p className='text-3xl font-bold text-yellow-500'>{counts['in-progress']}</p>
                                        <p className='text-[10px] text-yellow-600 font-bold uppercase tracking-widest'>Active</p>
                                    </div>
                                    <div className='bg-blue-500/10 p-4 rounded-2xl border border-blue-500/10'>
                                        <p className='text-3xl font-bold text-blue-400'>{counts.pending}</p>
                                        <p className='text-[10px] text-blue-500 font-bold uppercase tracking-widest'>Pending</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right: Task List */}
                    <div className='lg:w-2/3 order-1 lg:order-2'>
                        {loading ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                {[1,2,3,4].map(i => (
                                    <div key={i} className='h-64 rounded-[2rem] bg-white/5 animate-pulse border border-white/5'></div>
                                ))}
                            </div>
                        ) : tasks.length > 0 ? (
                            <div className='space-y-8'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                    <AnimatePresence mode='popLayout'>
                                        {tasks.map(task => (
                                            <TaskItem 
                                                key={task._id} 
                                                task={task} 
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className='flex justify-center items-center gap-6 mt-12'>
                                        <button 
                                            disabled={page === 1}
                                            onClick={() => setPage(p => p - 1)}
                                            className='p-4 rounded-2xl border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all'
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <div className='flex gap-2'>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === p ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        <button 
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                            className='p-4 rounded-2xl border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all'
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='flex flex-col items-center justify-center py-32 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 text-center px-10'
                            >
                                <div className='w-20 h-20 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-purple-600/20'>
                                    <ListTodo size={32} />
                                </div>
                                <h3 className='text-2xl font-bold text-white mb-2'>No tasks found.</h3>
                                <p className='text-gray-500 max-w-xs'>
                                    Start by creating a new task or adjust your filters to see more.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard

