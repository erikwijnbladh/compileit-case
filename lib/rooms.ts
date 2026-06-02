import { getDb, type Room } from "@/lib/db";
import { addDays, type DateRange } from "@/lib/date-range";

const slotStartHour = 8;
const slotEndHour = 17;

export type RoomBooking = {
  id: number;
  startsAt: string;
  endsAt: string;
};

export type RoomWithBookings = {
  id: number;
  name: string;
  capacity: number;
  bookings: RoomBooking[];
};

export type AvailabilitySlot = {
  endsAt: string;
  room: {
    id: number;
    name: string;
    capacity: number;
  };
  startsAt: string;
};

export type AvailabilityDay = {
  date: string;
  slots: AvailabilitySlot[];
};

export type AvailabilityResponse = {
  from: string;
  to: string;
  rooms: RoomWithBookings[];
  days: AvailabilityDay[];
};

type RoomBookingRow = {
  id: number;
  name: string;
  capacity: number;
  booking_id: number | null;
  starts_at: string | null;
  ends_at: string | null;
};

export function getRoomsInDateRange({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const rows = getDb()
    .prepare(
      `
      SELECT
        rooms.id,
        rooms.name,
        rooms.capacity,
        bookings.id AS booking_id,
        bookings.starts_at,
        bookings.ends_at
      FROM rooms
      LEFT JOIN bookings
        ON bookings.room_id = rooms.id
        AND bookings.starts_at < @to
        AND bookings.ends_at > @from
      ORDER BY rooms.name ASC, bookings.starts_at ASC
    `,
    )
    .all({ from, to }) as RoomBookingRow[];

  const rooms = new Map<number, RoomWithBookings>();

  for (const row of rows) {
    const room = rooms.get(row.id) ?? {
      id: row.id,
      name: row.name,
      capacity: row.capacity,
      bookings: [],
    };

    if (row.booking_id && row.starts_at && row.ends_at) {
      room.bookings.push({
        id: row.booking_id,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
      });
    }

    rooms.set(row.id, room);
  }

  return Array.from(rooms.values());
}

export function getRoom(id: number): Room | undefined {
  return getDb()
    .prepare("SELECT id, name, capacity FROM rooms WHERE id = ?")
    .get(id) as Room | undefined;
}

// A bookable slot is one hour, aligned to the top of the hour, inside the
// 08–17 window, Monday–Friday — the same rules the availability grid uses.
export function isBookableSlot(startsAt: string, endsAt: string): boolean {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  if (start.getMinutes() !== 0 || start.getSeconds() !== 0) return false;
  if (end.getTime() - start.getTime() !== 60 * 60 * 1000) return false;
  if (start.getHours() < slotStartHour || start.getHours() >= slotEndHour) {
    return false;
  }

  const weekday = start.getDay();
  return weekday >= 1 && weekday <= 5;
}

export function getRoomAvailability(range: DateRange): AvailabilityResponse {
  const rooms = getRoomsInDateRange(range);
  const days = getWorkdaysInRange(range.from, range.to).map((date) => ({
    date,
    slots: getAvailableSlotsForDay(rooms, date),
  }));

  return {
    from: range.from,
    to: range.to,
    rooms,
    days,
  };
}

function getAvailableSlotsForDay(rooms: RoomWithBookings[], date: string) {
  const slots: AvailabilitySlot[] = [];

  for (let hour = slotStartHour; hour < slotEndHour; hour += 1) {
    const startsAt = `${date}T${String(hour).padStart(2, "0")}:00:00`;
    const endsAt = `${date}T${String(hour + 1).padStart(2, "0")}:00:00`;

    for (const room of rooms) {
      const booked = room.bookings.some(
        (booking) => booking.startsAt < endsAt && booking.endsAt > startsAt,
      );

      if (!booked) {
        slots.push({
          endsAt,
          room: {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
          },
          startsAt,
        });
      }
    }
  }

  return slots;
}

function getWorkdaysInRange(from: string, to: string) {
  const days: string[] = [];
  let day = from.slice(0, 10);
  const endDay = to.slice(0, 10);

  while (day < endDay) {
    if (isWorkday(day)) {
      days.push(day);
    }

    day = addDays(day, 1);
  }

  return days;
}

function isWorkday(day: string) {
  const weekday = new Date(`${day}T12:00:00`).getDay();

  return weekday >= 1 && weekday <= 5;
}
