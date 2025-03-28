import { Pool } from "pg";
import {
  EventLogPagination,
  EventLogRepository,
  Filter,
  QueueService,
} from "../application";
import { EventLog, NotFoundError } from "../domain";
import { Connection, Publisher, PublisherProps } from "rabbitmq-client";
import { logger } from "../utils/logger";

export class RabbitQueueService implements QueueService {
  private readonly queue = "event-logs";
  private readonly routingKey = "event.logs";
  private readonly exchange = "registration";
  private readonly publisherProps: PublisherProps = {
    confirm: true,
    maxAttempts: 3,
    exchanges: [{ exchange: this.exchange, type: "topic" }],
    queues: [{ queue: this.queue }],
    queueBindings: [
      {
        exchange: this.exchange,
        queue: this.queue,
        routingKey: this.routingKey,
      },
    ],
  };
  private readonly publisher: Publisher;

  constructor(rabbit: Connection) {
    try {
      this.publisher = rabbit.createPublisher(this.publisherProps);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async enqueue(event: EventLog): Promise<void> {
    try {
      await this.publisher.send(this.queue, event);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export class PostgresEventLogRepository implements EventLogRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async create(event: EventLog): Promise<void> {
    try {
      const query = {
        text: "INSERT INTO registration.event_logs (type, description, event_date) VALUES ($1, $2, $3) RETURNING *",
        values: [event.type, event.description, event.eventDate],
      };

      await this.pool.query(query);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async get(id: string): Promise<EventLog> {
    try {
      const query = {
        text: "SELECT * FROM registration.event_logs WHERE id = $1",
        values: [id],
      };

      const { rows, rowCount } = await this.pool.query(query);

      if (rowCount === 0) {
        throw new NotFoundError("Event not found: id=" + id);
      }

      const result: EventLog = {
        id: rows[0].id,
        type: rows[0].type,
        description: rows[0].description,
        eventDate: rows[0].event_date,
      };

      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async filter(
    filter: Filter,
    page: number,
    limit: number
  ): Promise<EventLogPagination> {
    try {
      const typeQuery = filter.type
        ? `type='${filter.type}'`
        : "type IS NOT NULL";
      const timeRangeQuery = filter.timeRange
        ? `AND event_date BETWEEN '${filter.timeRange.from.toISOString()}' AND '${filter.timeRange.to.toISOString()}'`
        : "";
      const limitQuery = `limit ${limit}`;
      const offsetQuery = `offset ${(page - 1) * limit}`;
      const sortQuery = "ORDER BY event_date ASC";

      const query = {
        text: `SELECT * FROM registration.event_logs WHERE ${typeQuery} ${timeRangeQuery} ${sortQuery} ${limitQuery} ${offsetQuery}`,
        values: [],
      };

      const totalQuery = {
        text: `SELECT COUNT(*) FROM registration.event_logs WHERE ${typeQuery} ${timeRangeQuery}`,
        values: [],
      };

      const { rows } = await this.pool.query(query);

      const { rows: totalRows } = await this.pool.query(totalQuery);

      const result: EventLog[] = rows.map((row) => {
        return {
          id: row.id,
          type: row.type,
          description: row.description,
          eventDate: row.event_date,
        };
      });

      return {
        page,
        total: Math.ceil(totalRows[0].count / limit),
        data: result,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
