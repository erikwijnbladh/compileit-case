import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(projectRoot, "data");
const databasePath = path.join(dataDir, "booking-system.sqlite");
const schemaPath = path.join(projectRoot, "db", "schema.sql");

const rooms = [
  { name: "Delfin", capacity: 10 },
  { name: "Panda", capacity: 6 },
  { name: "Pingvin", capacity: 4 },
  { name: "Koala", capacity: 10 },
  { name: "Elefant", capacity: 20 },
];

const bookerNames = [
  "Alex Andersson",
  "Emma Eriksson",
  "Noah Nilsson",
  "Maja Larsson",
  "William Karlsson",
  "Olivia Svensson",
  "Lucas Persson",
  "Ella Johansson",
  "Liam Lindberg",
  "Alice Berg",
];

const bookingCount = 18;
const bookingDays = 7;
const firstSlotHour = 8;
const lastSlotHour = 17;

mkdirSync(dataDir, { recursive: true });

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.exec(readFileSync(schemaPath, "utf8"));

const seedData = db.transaction(() => {
  const insertRoom = db.prepare(`
    INSERT INTO rooms (name, capacity)
    VALUES (@name, @capacity)
    ON CONFLICT(name) DO UPDATE SET capacity = excluded.capacity
  `);

  for (const room of rooms) {
    insertRoom.run(room);
  }

  db.prepare("DELETE FROM bookings").run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'bookings'").run();

  const savedRooms = db
    .prepare("SELECT id, name, capacity FROM rooms ORDER BY id")
    .all();
  const availableSlots = buildSlots(savedRooms);
  const selectedSlots = shuffle(availableSlots).slice(0, bookingCount);
  const insertBooking = db.prepare(`
    INSERT INTO bookings (room_id, booker_name, starts_at, ends_at)
    VALUES (@roomId, @bookerName, @startsAt, @endsAt)
  `);

  for (const slot of selectedSlots) {
    insertBooking.run({
      ...slot,
      bookerName: randomItem(bookerNames),
    });
  }

  return selectedSlots.length;
});

const seededBookingCount = seedData();
db.close();

console.log(
  `Seeded ${rooms.length} rooms and ${seededBookingCount} bookings in ${databasePath}`,
);

function buildSlots(savedRooms) {
  const slots = [];
  const startDate = getToday();

  for (let day = 0; day < bookingDays; day += 1) {
    const date = addDays(startDate, day);

    for (const room of savedRooms) {
      for (let hour = firstSlotHour; hour < lastSlotHour; hour += 1) {
        slots.push({
          roomId: room.id,
          startsAt: toSlotDateTime(date, hour),
          endsAt: toSlotDateTime(date, hour + 1),
        });
      }
    }
  }

  return slots;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date, days) {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);

  return parsed.toISOString().slice(0, 10);
}

function toSlotDateTime(date, hour) {
  return `${date}T${String(hour).padStart(2, "0")}:00:00`;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}
