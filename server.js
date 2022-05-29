import express from "express";
import dotenv from "dotenv";
import requestLogger from "./middlewares/requestLogger.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import resourceNotFound from "./middlewares/resourceNotFound.js";
import connect from "./lib/db.js";
import usersRouter from "./routes/usersRouter.js";
import recipesRouter from "./routes/recipesRouter.js";

dotenv.config();
connect();
const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);

app.use(resourceNotFound);
app.use(globalErrorHandler);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`listen on ${port}`);
});
