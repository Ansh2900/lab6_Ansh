# Week 7 Task API

SENG3080 Week 7 lab. An Express task API using Sequelize to interact with SQLite, input validation, Passport session login and Redis caching.

## Installation

From this folder:

```bash
npm install
```

## Environment

The .env file is not checked in. When running the API, copy the example and change the session secret to something else:

```bash
copy .env.example .env
```

The example contains:

```text
PORT=3000
SESSION_SECRET=replace-this-with-a-long-random-value
REDIS_URL=redis://localhost:6379
```

## Redis

Run Redis prior to the API. Server starts as it connects to Redis.

With Docker:

```bash
docker run --name week7-redis -p 6379:6379 redis:7-alpine
```

Here, Redis 8.10.2 is installed and running on this Windows machine on port 6379 via the redis-server application.

## Run

```bash
npm run dev
```

Running `npm start` would start the same server but not use nodemon. The API is running on port 3000.

## Why these packages are used

- Sequelize converts the Task model to the SQL table Tasks and passes queries with parameters.
- express-validator does not accept an invalid title, finished value or priority prior to sending the request to the database.
- Sets defensive response headers (e.g. X-Content-Type-Options).
- Compression is used to compress appropriate answers.
- Passport Local validates the email and bcrypt password hash, and stores the user id in the session.
- The `GET /api/tasks` response is stored in Redis with the key `tasks:all` for 60 seconds. If the create, update, or delete is successful, the key is deleted.

## Test record

| Test | Expected result | Result |
| --- | --- | --- |
| GET /api/tasks/health | 200 JSON status response | 200 `{"status":"ok","service":"task-api"}` |
| POST invalid task | 400, array of errors on title x, priority 99 | 400, array of errors on title x, priority 99 |
| POST valid task | 201 and a task with id | 201 task id 2, title `Finish Week 7 lab` |
| GET missing task | 404 Task not found | 404 `{"error":"Task not found"}` |
| Additional security header validation | Additional headers that must be present in the response | Additional security header that must be present in the response to GET /api/tasks/health |
| GET /api/auth/me (before login) | 401 Sign in required | 401 `{"error":"Sign in required"}` |
| Register, login, then GET /me | 201, 200, then 200 with current user | 201 register, 200 login, 200 `{"id":1,"email":"ansh@example.com"}` |
| Two GET /api/tasks requests | database | first response will be `source: database`, second response will be `source: cache` |
| Create task then GET /api/tasks | database source and fresh data after invalidation | 201 created task id 3; then GET returned a database source and included that task |

## Security audit

There were no vulnerabilities that could not be addressed by downgrading Sequelize to 3.30.0, so no `npm audit fix --force` was performed.
