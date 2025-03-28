import { Connection } from "rabbitmq-client";
import { logger } from "../utils/logger";

export const rabbit = new Connection("amqp://admin:admin@localhost:5672");

rabbit.on("error", (err) => {
  logger.error("RabbitMQ connection error", err);
});


