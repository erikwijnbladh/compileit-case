CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL CHECK (capacity > 0)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  booker_name TEXT NOT NULL CHECK (length(trim(booker_name)) > 0),
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (ends_at > starts_at),
  UNIQUE (room_id, starts_at)
);

CREATE INDEX IF NOT EXISTS idx_bookings_room_time
  ON bookings (room_id, starts_at, ends_at);
