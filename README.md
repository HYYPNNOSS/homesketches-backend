# HomeSketches API

NestJS API for HomeSketches authentication and project data.

## Run locally

```bash
npm install
cp .env.example .env
npm run start:dev
```

Set `DATABASE_URL` in `.env` to your PostgreSQL connection string, then initialize the database:

```bash
npx prisma db push
npx prisma generate
```

Do not start the API until `DATABASE_URL` is set; Prisma intentionally fails fast when the database configuration is missing.

The API listens on `http://localhost:4000/api`.

Authentication uses PostgreSQL through Prisma. Passwords are hashed with bcrypt, emails are normalized and unique, and the controller response remains `{ accessToken, user }` for the frontend.

## Auth endpoints

- `POST /auth/register` with `{ name, email, password }`
- `POST /auth/login` with `{ email, password }`
- `GET /auth/me` with `Authorization: Bearer <accessToken>`
- `GET /projects` for recent generation jobs
- `POST /projects/generate` with `{ name, mode, sourceFiles, brief?, style? }`
- `POST /sketch-to-video/generate` with one `file` upload
- `POST /sketch-to-3d/generate` with one `file` upload
- `POST /sketch-to-plan/generate` with one `file` upload
- `POST /multi-image-to-3d/generate` with 2-12 `files` uploads
- `GET /multi-image-to-3d/:jobId` for walkthrough polling
- `GET /health`

Swagger documentation is available at `http://localhost:4000/docs`.

Supported generation modes are `video`, `3d`, `floor-plan`, and `walkthrough`. The project service currently simulates processing and is the seam for connecting an image/video generation provider and persistent project repository later.