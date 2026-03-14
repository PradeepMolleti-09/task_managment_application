import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Plus, Save, X, AlignLeft, Type, Clock } from 'lucide-react'

const TaskForm = ({ backendUrl, onSuccess, taskToEdit, setTaskToEdit }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('pending')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || '')
            setDescription(taskToEdit.description || '')
            setStatus(taskToEdit.status || 'pending')
        } else {
            setTitle('')
            setDescription('')
            setStatus('pending')
        }
    }, [taskToEdit])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return toast.warning("Title cannot be empty")
        
        setLoading(true)
        try {
            const endpoint = taskToEdit 
                ? `${backendUrl}/api/tasks/${taskToEdit._id}` 
                : `${backendUrl}/api/tasks`
            const method = taskToEdit ? 'put' : 'post'

            const { data } = await axios[method](
                endpoint,
                { title, description, status },
                { withCredentials: true }
            )

            if (data.success) {
                toast.success(data.message)
                if (!taskToEdit) {
                    setTitle('')
                    setDescription('')
                    setStatus('pending')
                }
                if (setTaskToEdit) setTaskToEdit(null)
                onSuccess()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Task action failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] w-full shadow-2xl relative overflow-hidden group'
        >
            <div className='absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity'>
                {taskToEdit ? <Save size={80} /> : <Plus size={80} />}
            </div>

            <div className='relative z-10'>
                <h2 className='text-2xl font-bold text-white mb-6 flex items-center gap-2'>
                    {taskToEdit ? 'Edit Task' : 'Create Task'}
                </h2>
                
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1'>
                            <Type size={14} /> Title
                        </label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className='w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600'
                            placeholder='What needs to be done?'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1'>
                            <AlignLeft size={14} /> Description
                        </label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="4"
                            className='w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 resize-none'
                            placeholder='Add details (stored with AES-256 encryption)...'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1'>
                            <Clock size={14} /> Status
                        </label>
                        <div className='grid grid-cols-3 gap-2'>
                            {['pending', 'in-progress', 'completed'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={`py-2 text-[10px] font-bold uppercase tracking-tighter rounded-xl border transition-all ${
                                        status === s 
                                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' 
                                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    {s.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='flex gap-3 pt-4'>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-purple-600/10 disabled:opacity-50 flex items-center justify-center gap-2'
                        >
                            {loading ? 'Processing...' : (taskToEdit ? 'Update Changes' : 'Save Task')}
                            {!loading && (taskToEdit ? <Save size={18} /> : <Plus size={18} />)}
                        </button>
                        
                        {taskToEdit && (
                            <button 
                                type="button" 
                                onClick={() => setTaskToEdit(null)}
                                className='p-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-red-500/20 hover:border-red-500/30 transition-all group'
                            >
                                <X size={20} className='group-hover:rotate-90 transition-transform' />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default TaskForm

