import express from "express";
import cors from 'cors'
import loggerMiddleware from "./middlewares/loggerMiddleware";
import morgan from 'morgan'

import router from './routes/index'
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 8080;

app.use(cors())

app.use(loggerMiddleware);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Property Listing API',
      version: '1.0.0',
      description: 'A Property Listing API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*ts'],
};


const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs,{ explorer: true }));

app.use(morgan('tiny'))

app.use('/api',router)

app.use(express.json())


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});