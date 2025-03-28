-- migrate:up
CREATE SCHEMA IF NOT EXISTS registration;

CREATE TABLE registration.event_logs (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

