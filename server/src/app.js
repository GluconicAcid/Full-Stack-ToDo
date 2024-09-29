import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin: process.env.MONGODB_URI,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));

app.use(urlencoded({extended: true, limit: '16kb'}));

app.use(express.static('public'));

app.use(cookieParser());

//routes import and declaration

import userRouter from './routes/user.route.js'
import taksRouter from './routes/task.route.js'

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taksRouter);

export { app }