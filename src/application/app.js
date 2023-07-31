import express from "express"
import { errorMiddleware } from "../middlewares/errorMiddleware.js";
import { notFoundMiddleware } from "../middlewares/notFoundMiddleware.js";
import { publicRouter } from "../routes/publicAPI.js";
import { privateRouter } from "../routes/privateAPI.js";

export const app = express();
app.use(express.json());

app.use(publicRouter);
app.use(privateRouter);

app.use(errorMiddleware)
app.use(notFoundMiddleware)