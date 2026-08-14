# Providend Take Home — Specs

## Scope

### Context

- Client notes:
  - Assume notes are in markdown format → in production this will not be there

### Key features

- List notes for given clientId
- Add new note for given clientId
- Simple authorization check
  - Assume authorId is provided
  - Check if user is assigned to client

### Assumptions

- Users can only see the notes they are assigned to
- Users can only access the notes they are assigned to → server
- Authentication is out of scope → however, in production there will be a JWT in the bearer token header
- Edit and deletion of notes are out of scope
- The contents will be hardcoded in Nest.js:
  - Client
  - Note
  - ClientAssignment
  - User

## Schemas

### Client

- `id`
- `name`

### Note

- `id`
- `clientId` → which client the note is assigned to
- `authorId` → who is responsible for that client
- `content` → the content itself
- `createdAt`

### ClientAssignment

Many-to-many, since it's assumed a user may be assigned to multiple clients.

- `clientId` → the id of the client
- `userId` → the id of the user

### User

- `id`
- `name`

## Frontend

**Tech stack:** React

### UI page(s)

#### `/` → the home page

- Table that contains the following information: clientId
  - Include pagination
  - Each row has these columns:
    - ID
    - Client Name
    - createdAt
    - Actions → view only
- Modal to add notes
  - Client dropdown → displays the client name and the client id
  - Notes contents → text area
  - Cancel button
  - Submit button → calls `[POST] /notes`

**Notes:** `userId` will be stored in localStorage.

## Backend

**Tech stack:** NestJS

### Endpoints

#### `[GET] /notes/u/:userId` → get the list of notes a user is authorised to

Query params:

- `page_no` → current page no; `0` by default
- `page_size` → no of records per page; `30` by default

Steps:

- Check if `userId` is valid → if not valid, return 0
- Return 30 rows based on the page, as well as the current `page_no` and total page size

#### `[GET] /notes/:id` → get the note with that specific ID

- `id` → the id of the note

Steps:

- Middleware to check if user is authorised
- If not authorised, return `403`
- Else, return the note contents

#### `[POST] /notes` → add a new note

Body:

- `authorId` → the user that wrote the note
- `clientId` → the client
- `content` → allow this to be empty for now

Steps:

- Check if `userId` is valid → if not, return `404`
- Check if `clientId` is valid → if not, return `404`
- Write the note into the notes table

## Open questions

- The home page table is described as listing notes but the columns list "Client Name" and "createdAt" without note content — presumably note ID + client name + createdAt, with the "view" action opening the note.
