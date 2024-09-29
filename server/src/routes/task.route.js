import {Router} from 'express'
import {
    createTasks,
    getAllTasks,
    getTasksById,
    updateTask,
    deleteTasks
} from '../controllers/task.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const router = Router();

router.post("/tasks", verifyJWT, createTasks);
router.get("/tasks", verifyJWT, getAllTasks);
router.get("/tasks/:id", verifyJWT, getTasksById);
router.put("/tasks/:id", verifyJWT, updateTask);
router.delete("/tasks/:id", verifyJWT, deleteTasks);

export default router