import { NextFunction, Request, Response } from "express";
import { EventLog, EventType } from "../domain";
import {
  EnqueueEventLogUseCase,
  FilterEventLogUseCase,
  GetEventLogUseCase,
} from "../application";
import {
  PostgresEventLogRepository,
  RabbitQueueService,
} from "../infrastructure";
import { rabbit } from "../infrastructure/rabbit";
import { pool } from "../infrastructure/postgres";

const jsonEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const description = req.body.description;

    const eventDate = new Date();
    const eventLog: EventLog = {
      type: EventType.API,
      description,
      eventDate,
    };

    const queueService = new RabbitQueueService(rabbit);
    const enqueueEventLogUseCase = new EnqueueEventLogUseCase(queueService);
    await enqueueEventLogUseCase.execute(eventLog);

    res.json({ message: "Event Successfully Enqueued" });
  } catch (error) {
    next(error);
  }
};

const formEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const description = req.body.description;
    const eventDate = new Date();
    const eventLog: EventLog = {
      type: EventType.FORM,
      description,
      eventDate,
    };

    const queueService = new RabbitQueueService(rabbit);
    const enqueueEventLogUseCase = new EnqueueEventLogUseCase(queueService);
    await enqueueEventLogUseCase.execute(eventLog);

    res.json({ message: "Event Successfully Enqueued" });
  } catch (error) {
    next(error);
  }
};

export const createEventController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestType = req.get("Content-Type");

  switch (requestType) {
    case "application/json":
      jsonEventController(req, res, next);
      break;
    case "application/x-www-form-urlencoded":
      formEventController(req, res, next);
      break;
    default:
      res.status(400).json({ error: "Format not supported" });
      break;
  }
};

export const getEventLogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const eventLogRepository = new PostgresEventLogRepository(pool);
    const useCase = new GetEventLogUseCase(id, eventLogRepository);
    const event = await useCase.execute();

    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const filterEventLogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.query.type as string;
    let timeRange = undefined;
    if (req.query.from && req.query.to) {
      const from = req.query.from as string;
      const to = req.query.to as string;
      timeRange = {
        from: new Date(from),
        to: new Date(to),
      };
    }
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const eventLogRepository = new PostgresEventLogRepository(pool);
    const useCase = new FilterEventLogUseCase(
      eventLogRepository,
      { type, timeRange },
      page,
      limit
    );
    const event = await useCase.execute();

    res.json(event);
  } catch (error) {
    next(error);
  }
};
