import express from "express";
import cors from 'cors'
import loggerMiddleware from "./middlewares/loggerMiddleware";
import morgan from 'morgan'
import multer from "multer";
import router from './routes/index'

const app = express();
const port = 8080;

app.use(cors())

app.use(loggerMiddleware);


app.use(morgan('tiny'))

app.use('/api',router)

app.use(express.json())


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});