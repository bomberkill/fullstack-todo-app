import { Response, Request } from "express";
import Task, { Itask } from "../models/Task";
import { Types } from "mongoose";

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized, user not found in request' });
            return;
        }
        const tasks: Itask[] = await Task.find({ userId: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).json({ message: 'Error fetching tasks', error: error.message })
        }else {
            res.status(500).json({ message: 'An unknown error occurred' })
        }
    }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const { title, description, completed } = req.body;

    if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found in request' });
        return;
    }
  

    if (!title || !description) {
        res.status(400).json({ message: 'Title and description are required' });
        return;
    }

    try {
        const newTask: Itask = new Task({
            title,
            description,
            completed,
            userId: req.user._id,
        });

        const savedTask: Itask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).json({ message: 'Error creating task', error: error.message })
        }else {
            res.status(500).json({ message: 'An unknown error occurred' })
        }
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.id;

    if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found in request' });
        return;
    }  

    try {
        const task: Itask | null = await Task.findById(taskId);

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        if (!task.userId.equals(req.user._id as Types.ObjectId)) {
            res.status(403).json({ message: 'Not authorized to access this task' });
            return;
        }      

        res.status(200).json(task);
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).json({ message: 'Error fetching task', error: error.message })
        }else {
            res.status(500).json({ message: 'An unknown error occurred' })
        }
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.id;
    const { title, description, completed } = req.body;

    if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found in request' });
        return;
    }  

    const updateFields: Partial<Itask> = {};

    if (title !== undefined) {
        if (title === "") {
            res.status(400).json({ message: 'Title cannot be empty if provided for update' });
            return;
        }
        updateFields.title = title;
    }
    if (description !== undefined) {
        updateFields.description = description;
    }
    if (completed !== undefined && typeof completed === 'boolean') {
        updateFields.completed = completed;
    }

    if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ message: 'No valid fields provided for update.' });
        return;
    }
    try {
        const taskToUpdate: Itask | null = await Task.findById(taskId);

        if (!taskToUpdate) {
            res.status(404).json({ message: 'Task not found for update' });
            return;
        }

        
        if (!taskToUpdate.userId.equals(req.user._id as Types.ObjectId)) {
            res.status(403).json({ message: 'Not authorized to update this task' });
            return;
        }
        const updatedTask: Itask | null = await Task.findByIdAndUpdate(
            taskId,
            updateFields,
            { new: true, runValidators: true, context: "query" }
        );

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found or update failed unexpectedly' });
            return;
        }      

        res.status(200).json(updatedTask);
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).json({ message: 'Error updating task', error: error.message })
        }else {
            res.status(500).json({ message: 'An unknown error occurred' })
        }
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.id;
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found in request' });
        return;
    }  
    try {
        const taskToDelete: Itask | null = await Task.findById(taskId);

        if (!taskToDelete) {
            res.status(404).json({ message: 'Task not found for deletion' });
            return;
        }

        if (!taskToDelete.userId.equals(req.user._id as Types.ObjectId)) {
            res.status(403).json({ message: 'Not authorized to delete this task' });
            return;
        }
        const deletedTask: Itask | null = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            res.status(404).json({ message: 'Task not found or delete failed unexpectedly' });
            return;
        }      
        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).json({ message: 'Error deleting task', error: error.message })
        }else {
            res.status(500).json({ message: 'An unknown error occurred' })
        }
    }
}