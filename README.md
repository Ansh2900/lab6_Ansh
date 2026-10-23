# Week 7 Task API

Express API for tasks, with Sequelize and SQLite, request validation, Passport sessions, and Redis response caching.

## Installation

```bash
npm install
```

## Environment

Copy the example file and keep `.env` private:

```bash
copy .env.example .env
```

## Redis

Redis must be running before the API starts. With Docker:

```bash
docker run --name week7-redis -p 6379:6379 redis:7-alpine
```

## Run

```bash
npm run dev
```

The API listens on port 3000.

## Test record

| Test | Expected result | Result |
| --- | --- | --- |
| GET /api/tasks/health | 200 JSON status response | 200 `{"status":"ok","service":"task-api"}` |
| POST invalid task | 400 with validation errors | 400 error array for title `x` and priority `99` |
| POST valid task | 201 and a task with id | 201 task id 2, title `Finish Week 7 lab` |
| GET missing task | 404 Task not found | Not rechecked. The API now waits for Redis, and Redis is not running on this machine. |
| Security header check | At least one Helmet header | `X-Content-Type-Options: nosniff` on GET /api/tasks/health |
| GET /api/auth/me before login | 401 Sign in required | 401 `{"error":"Sign in required"}` |
| Register, login, then GET /me | 201, 200, then 200 with current user | 201 register, 200 login, 200 `{"id":1,"email":"ansh@example.com"}` |
| Two GET /api/tasks calls | database then cache source | Requires a running Redis server |
| Create task then GET /api/tasks | database source and fresh data after invalidation | Requires a running Redis server |

`npm audit` reported 19 vulnerabilities (12 moderate, 7 high). `npm audit fix --force` would downgrade Sequelize to 3.30.0, so that command was not used.
