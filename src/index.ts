import express from "express";
import cors from 'cors'
import loggerMiddleware from "./middlewares/loggerMiddleware";
import morgan from 'morgan'

import router from './routes/index'
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 8080;

app.use(express.json())

app.use(cors())

app.use(loggerMiddleware);


app.use(morgan('tiny'))

app.use('/api',router)




app.get("/", (req, res) => {
  res.json("Hi there!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});