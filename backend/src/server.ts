import dotenv from "dotenv";
import express, {Request, Express, Response, NextFunction} from "express";
import cors from "cors";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes"
import authRoutes from "./routes/authRoutes"
import { errorHandler, notFound } from "./middleware/errorMiddleware";

dotenv.config()

// Express App initialization
const app: Express = express()

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/todoappdb";

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Succesfully connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Todo App Backend");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", error.stack);
    res.status(500).json({message: "Something broke on the server!"});
});

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler); 