# RabbitMQ + Express + Node.js + React + Docker

A small full-stack demo:

- React UI to create and monitor jobs
- Express API to create jobs and read job status
- RabbitMQ queue for async processing
- Worker process that consumes queue messages and updates job status
- Docker Compose to run everything together

## Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/health
- RabbitMQ UI: http://localhost:15672 (guest / guest)

## Run

```bash
docker compose up --build
```

Open the frontend and create a job. The worker will pick it up and update its status from `pending` to `processing` to `completed`.

## API

- `GET /api/health`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs`
  ```json
  { "title": "Send invoice" }
  ```

## Notes

- Job data is stored in a shared Docker volume as JSON for simplicity.
- The backend and worker both use the same RabbitMQ queue name.
