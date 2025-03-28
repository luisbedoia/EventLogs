import express from "express";
import {
  createEventController,
  getEventLogController,
  filterEventLogController,
} from "./presentation/controllers";
import {
  createEventValidator,
  filterEventLogValidator,
  getEventLogValidator,
} from "./presentation/validators";
import { errorMiddleware, loggerMiddleware } from "./presentation/middlewares";
import { initRabbitConsumers } from "./infrastructure/rabbitConsumers";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);
app.post("/events", createEventValidator, createEventController);
app.get("/events/:id", getEventLogValidator, getEventLogController);
app.get("/events", filterEventLogValidator, filterEventLogController);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  initRabbitConsumers();
});
