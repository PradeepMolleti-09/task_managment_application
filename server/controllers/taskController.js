import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import { encrypt, decrypt } from "../utils/encryption.js";

// CREATE Task
export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }

        // Encrypt description before saving
        const encryptedDescription = encrypt(description);

        const task = await Task.create({
            title,
            description: encryptedDescription,
            status: status || "pending",
            user: req.userId
        });

        res.status(201).json({ 
            success: true, 
            message: "Task created successfully",
            task: {
                ...task._doc,
                description: description // Return unencrypted to user
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET Tasks with Pagination, Search, and Filter
export const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 6, status, search } = req.query;
        const query = { user: req.userId };

        if (status) query.status = status;
        if (search) {
            // Escape regex special characters
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.title = { $regex: safeSearch, $options: "i" };
        }

        const skip = (page - 1) * limit;
        
        // Parallelize counts and task fetching
        const [total, tasks, stats] = await Promise.all([
            Task.countDocuments(query),
            Task.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Task.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ])
        ]);

        // Decrypt descriptions
        const decryptedTasks = tasks.map(task => ({
            ...task._doc,
            description: decrypt(task.description)
        }));

        // Format stats
        const counts = {
            total: stats.reduce((acc, curr) => acc + curr.count, 0),
            pending: stats.find(s => s._id === 'pending')?.count || 0,
            'in-progress': stats.find(s => s._id === 'in-progress')?.count || 0,
            completed: stats.find(s => s._id === 'completed')?.count || 0,
        };

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            tasks: decryptedTasks,
            counts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// UPDATE Task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await Task.findOne({ _id: id, user: req.userId });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        if (title) task.title = title;
        if (description) task.description = encrypt(description);
        if (status) task.status = status;

        await task.save();

        res.status(200).json({ 
            success: true, 
            message: "Task updated successfully",
            task: {
                ...task._doc,
                description: description || decrypt(task.description)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// DELETE Task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET Task By ID
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, user: req.userId });
        
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        res.status(200).json({
            success: true,
            task: {
                ...task._doc,
                description: decrypt(task.description)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
