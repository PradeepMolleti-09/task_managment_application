import React from 'react'
import { motion } from 'framer-motion'
import { Edit3, Trash2, Calendar, CheckCircle2, Circle, Clock } from 'lucide-react'

const TaskItem = ({ task, onEdit, onDelete }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'completed': return {
                color: 'text-green-400',
                bg: 'bg-green-500/10',
                border: 'border-green-500/20',
                icon: <CheckCircle2 size={14} />
            }
            case 'in-progress': return {
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-500/20',
                icon: <Clock size={14} />
            }
            default: return {
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                icon: <Circle size={14} />
            }
        }
    }

    const info = getStatusInfo(task.status)

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className='bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex flex-col h-full hover:bg-white/10 transition-all duration-300 group shadow-lg shadow-black/20'
        >
            <div className='flex justify-between items-start mb-4'>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${info.bg} ${info.color} ${info.border}`}>
                    {info.icon}
                    {task.status.replace('-', ' ')}
                </div>
                
                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0'>
                    <button 
                        onClick={() => onEdit(task)}
                        className='p-2 bg-white/5 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg'
                        title="Edit Task"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button 
                        onClick={() => onDelete(task._id)}
                        className='p-2 bg-white/5 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg'
                        title="Delete Task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className='flex-1'>
                <h3 className='text-xl font-bold text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors'>
                    {task.title}
                </h3>
                <p className='text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6 font-medium'>
                    {task.description}
                </p>
            </div>
            
            <div className='flex items-center justify-between pt-4 border-t border-white/5'>
                <div className='flex items-center gap-2 text-gray-500'>
                    <Calendar size={12} />
                    <span className='text-[10px] font-bold uppercase tracking-widest'>
                        {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                
                <div className='flex -space-x-2'>
                    <div className={`w-8 h-8 rounded-full border-2 border-[#000414] ${info.bg} flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${info.color}`}>{task.status[0].toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default TaskItem

