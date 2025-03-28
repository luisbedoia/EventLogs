import { EventLog } from "../domain";

export interface EventLogRepository {
  create(eventLog: EventLog): Promise<void>;
  get(id: string): Promise<EventLog>;
  filter(
    filter: Filter,
    page: number,
    limit: number
  ): Promise<EventLogPagination>;
}

export interface QueueService {
  enqueue(eventLog: EventLog): Promise<void>;
}

export interface Filter {
  type?: string;
  timeRange?: {
    from: Date;
    to: Date;
  };
}

export interface EventLogPagination {
  page: number;
  total: number;
  data: EventLog[];
}

export class EnqueueEventLogUseCase {
  constructor(private queueService: QueueService) {}

  async execute(eventLog: EventLog): Promise<void> {
    await this.queueService.enqueue(eventLog);
  }
}

export class CreateEventLogUseCase {
  constructor(private eventLogRepository: EventLogRepository) {}

  async execute(eventLog: EventLog): Promise<void> {
    return this.eventLogRepository.create(eventLog);
  }
}

export class GetEventLogUseCase {
  constructor(
    private readonly id: string,
    private eventLogRepository: EventLogRepository
  ) {}

  async execute(): Promise<EventLog> {
    return this.eventLogRepository.get(this.id);
  }
}

export class FilterEventLogUseCase {
  constructor(
    private readonly eventLogRepository: EventLogRepository,
    private readonly filter: Filter,
    private readonly page: number,
    private readonly limit: number
  ) {}

  async execute(): Promise<EventLogPagination> {
    return this.eventLogRepository.filter(this.filter, this.page, this.limit);
  }
}
