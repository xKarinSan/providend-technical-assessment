# Client Notes — Providend Take Home

A small client-notes tool: advisers see the notes for clients they are assigned
to, and can add new ones. Requirements are in [specs.md](./specs.md).

- `backend/` — NestJS API, all data hardcoded in memory
- `frontend/` — React + Vite + TypeScript

## Running it

Two terminals:

```bash
cd backend && npm install && npm run start:dev   # http://localhost:3000
cd frontend && npm install && npm run dev        # http://localhost:5173
```

The frontend reads `VITE_API_BASE_URL` (see `frontend/.env`, defaults to
`http://localhost:3000`). CORS is enabled on the API; restrict it with the
`CORS_ORIGIN` env var (comma separated) if needed.

## API

| Method | Path                | Notes                                                     |
| ------ | ------------------- | --------------------------------------------------------- |
| GET    | `/notes/u/:userId`  | Paginated notes the user may see. `page_no` (0), `page_size` (30) |
| GET    | `/notes/:id`        | One note. Requires `x-user-id`; 401 unknown, 403 unassigned |
| POST   | `/notes`            | `{ authorId, clientId, content }`; content may be empty     |
| GET    | `/clients/u/:userId`| Clients the user is assigned to — the add-note dropdown     |
| GET    | `/users`            | Seed users, so the UI can offer an "acting as" picker       |

`GET /notes/u/:userId` returns `{ data, page_no, page_size, total_pages,
total_records }`. An unknown user gets an empty page rather than an error, per
the spec's "not valid, return 0".

## Notes on the implementation

- **Authentication is out of scope.** The acting user's id lives in
  localStorage and is sent as an `x-user-id` header, standing in for the JWT
  bearer token a production build would use. `NoteAccessMiddleware` does the
  authorisation check the spec asks for; swapping the header for a verified
  token subject is the only change needed.
- **Authorisation is by assignment, not authorship** — a user sees every note
  for a client they are assigned to, including notes written by colleagues.
  `POST /notes` refuses (403) a client the author is not assigned to, which
  follows from the same assumption.
- **All data is hardcoded** in `backend/src/data/seed.ts` and held in memory by
  `DataService`, so writes last until the process restarts. Seed timestamps are
  fixed rather than relative so the data is stable across restarts.
- **Note content is rendered as markdown** in the view modal, per the spec's
  assumption about the note format.
- **Two endpoints beyond the spec** (`/clients/u/:userId`, `/users`) exist
  because the add-note dropdown and the user picker need them.

## With more time, I would
- Implement a database connection, especially with Postgres
- Use Supabase authentication
- Add logging for the backend
- Add client-side caching (ie lazy loading) for the clients and the paginated notes