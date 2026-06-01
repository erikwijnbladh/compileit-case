import "server-only";

import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "booking-system.sqlite");
const schemaPath = path.join(process.cwd(), "db", "schema.sql");

let db: Database.Database | null = null;

export type Room = {
  id: number;
  name: string;
  capacity: number;
};

export type Booking = {
  id: number;
  roomId: number;
  bookerName: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
};

type BookingRow = {
  id: number;
  room_id: number;
  booker_name: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
};

export function getDb() {
  if (!db) {
    mkdirSync(dataDir, { recursive: true });

    db = new Database(databasePath);
    db.pragma("foreign_keys = ON");
    db.pragma("journal_mode = WAL");

    db.exec(readFileSync(schemaPath, "utf8"));
  }

  return db;
}

export function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    roomId: row.room_id,
    bookerName: row.booker_name,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
  };
}
