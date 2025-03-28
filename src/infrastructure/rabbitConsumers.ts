import { createEventLogListener } from "../presentation/listeners";
import { logger } from "../utils/logger";
import { rabbit } from "./rabbit";

export const initRabbitConsumers = async () => {
  try {
    rabbit.createConsumer(
      {
        queue: "event-logs",
      },
      async (message) => {
        await createEventLogListener(message);
      }
    );
  } catch (error) {
    logger.error(error);
  }
};
