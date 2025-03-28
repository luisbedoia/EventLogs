import { Connection } from "rabbitmq-client";
import { logger } from "../utils/logger";

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672";

console.log(rabbitUrl);

export const rabbit = new Connection(rabbitUrl);

rabbit.on("error", (err) => {
  logger.error("RabbitMQ connection error", err);
});


