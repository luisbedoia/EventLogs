export enum EventType {
  FORM = "FORM",
  API = "API",
}

export interface EventLog {
  id?: number;
  type: EventType;
  description: string;
  eventDate: Date;
}

export class EventLogError extends Error {
  constructor(message: string, name: string) {
    super(message);
    this.name = name;
  }
}

export class NotFoundError extends EventLogError {
  constructor(message: string) {
    super(message, "NotFoundError");
  }
}
