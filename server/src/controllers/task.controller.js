import { Task } from '../models/task.model.js'
import { User } from '../models/user.model.js'
import mongoose from 'mongoose'

const createTasks = async (req, res) => {
    try {
            const { title, description, priority }  = req.body;

        if ([title, description].some((field) => field?.trim() === "")) {
            return res.status(401).json({message: "All fields are required"})
        }
        
        const newTask = await Task.create({
            title,
            description,
            priority
        })

        return res.status(200).json({success: true, message: "Task added successfully", task: newTask})

    } catch (error) {
        return res.status(500).json({
            success: false, message: error?.message || "Internal server error"
        })
    }
}

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        return res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        return res.status(500).json({
            success: false, message: error?.message || "Internal server error"
        })
    }
}

const getTasksById = async (req, res) => {
    try {
        const { id } = req.params;

        const tasks = await Task.findById(id);

        if (!tasks) {
            return res.status(404).json({message: "Task not found"})
        }
        
        return res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        return res.status(500).json({
            success: false, message: error?.message || "Internal server error"
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const {id} = req.params;

        const {title, description, completed, priority} = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title: title ? title.trim() : undefined,
                description: description !== undefined ? description : undefined,
                completed: completed !== undefined ? completed : undefined,
                priority: priority || "low",
            },
            { new: true, runValidators: true }
        )

        if (!updatedTask) {
            return res.status(404).json({message: "Task Not Found"})
        }

        return res.status(200).json({
            success: true,
            task: updatedTask,
            message: "Task updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error"
        })
    }
}

const deleteTasks = async (req, res) => {
    try {
        const {id} = req.params;

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({message: "Task Not Found"})
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error"
        })
    }
}

export {
    createTasks,
    getAllTasks,
    getTasksById,
    updateTask,
    deleteTasks
}