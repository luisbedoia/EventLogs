import { AsyncMessage } from "rabbitmq-client";
import { EventLog } from "../domain";
import { PostgresEventLogRepository } from "../infrastructure";
import { pool } from "../infrastructure/postgres";
import { CreateEventLogUseCase } from "../application";
import { logger } from "../utils/logger";

export const createEventLogListener = async (message: AsyncMessage) => {
  try {
    const { type, description, eventDate } = message.body;

    const event: EventLog = {
      type,
      description,
      eventDate,
    };

    const eventLogRepository = new PostgresEventLogRepository(pool);
    const useCase = new CreateEventLogUseCase(eventLogRepository);
    await useCase.execute(event);
  } catch (error) {
    logger.error(error);
  }
};
