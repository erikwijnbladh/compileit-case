# Boka rum

A small meeting-room booking system for the Compileit fullstack assignment.

## Run it

```bash
npm install
npm run db:seed   # creates the SQLite DB + demo bookings for the current work week
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> `npm run db:seed` wipes the bookings table and reseeds it for the **current** Monday–Friday, so the demo always has data on the week you land on. Re-run it any time the data looks stale.

The backend is just an HTTP endpoint, so you can hit it directly:

```txt
http://localhost:3000/api/rooms?from=YYYY-MM-DD&to=YYYY-MM-DD
```

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · SQLite (`better-sqlite3`).

## Notes

**Client vs Server.** A Server Component could read the DB directly (simpler, no API route). I chose an explicit `/api/rooms` endpoint because it's framework-agnostic — any client could hit it — and it makes the backend↔frontend boundary the brief grades on actually visible. Trade-off: more moving parts than this app strictly needs.

**Availability is computed on the backend, not the client.** I prefer the frontend to receive data it's intended to use. So `lib/rooms.ts` returns a ready-to-render `days → slots` shape and the UI just maps over it.

**One type for the API, shared both ways.** The shape of the `/api/rooms` response is defined once in `lib/rooms.ts` and reused by the frontend, so the two can't fall out of sync, change the backend and the frontend stops compiling until it's fixed.

**Booking flow.** Pick a slot → "Vem bokar?" (enter a name) → confirmation modal. The selected slot is kept in React state and handed to the next screen as a prop — no URL/query passing involved. _Boka_ POSTs to `/api/bookings`, which re-validates the room + slot server-side (a hand-edited request can't book an off-grid time) and relies on the `UNIQUE (room_id, starts_at)` constraint to reject a slot that got taken in the meantime (409).

**On the booking model.** In reality you probably wouldn't handle bookings quite like this — you'd likely want some kind of short-lived reservation/hold to stop two people racing for the same slot while one of them is still typing their name, etc. But the unique constraint is a real, stateful guarantee at the DB level, so for the scope of this assignment it's enough.

**Design.** Built from my Figma mockup: [Boka ett rum — Mobile](https://www.figma.com/design/5bVY3TGlVfOsLm5f7Xo8Jr/Boka-ett-rum-%E2%80%94-Mobile?m=auto&t=3pBy7ek1tYpOvUKM-6) (password: `duck-adobe-tone-field`). I used the layout from the Figma, I did make minor changes however, took some liberty on the room filter, made it so we see the full work week.

## Model + assumptions

- **Bookable window:** Monday–Friday, one-hour slots `08:00`–`17:00`. Hard-coded in `lib/rooms.ts` for now; in a real app it'd be per-room config.
- **A week range** is `from = Monday 00:00`, `to = Saturday 00:00` (`to` exclusive) — e.g. `from=2026-06-01&to=2026-06-06` is Mon–Fri.
- **Bookings are validated server-side** — the room must exist and the slot must be a real 08–17 weekday hour — and **double-booking** is blocked by a `UNIQUE (room_id, starts_at)` constraint (the API returns 409 if it's already taken).

## What I'd do next

- A short-lived reservation/hold for proper concurrency (see "On the booking model").
- Show booked slots too, with who booked them.
- Smarter handling of past dates.
- I can't say how well this would scale, so I guess that's a future thing, making sure it's performant with big data sets.
- Filter on more things than just room names i.e size, time spans etc.
