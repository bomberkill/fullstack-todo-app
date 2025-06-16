import express, {Router} from "express"
import { getAllTasks, createTask, deleteTask, getTaskById, updateTask } from "../controllers/taskController"
import { protect } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.route("/")
    .post(protect, createTask)
    .get(protect, getAllTasks);
    
router.route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
