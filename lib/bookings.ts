import { getDb } from "@/lib/db";
import { getRoom, isBookableSlot } from "@/lib/rooms";

export type NewBooking = {
  roomId: number;
  bookerName: string;
  startsAt: string;
  endsAt: string;
};

export type CreateBookingResult =
  | { ok: true; id: number }
  | { ok: false; reason: "conflict" | "invalid" };

export function createBooking(booking: NewBooking): CreateBookingResult {
  // Never trust the client. The request only carries an id + times, so the
  // server re-checks that the room exists and the slot is a real bookable one
  // before writing anything — URL tampering can't create off-grid bookings.
  if (
    !getRoom(booking.roomId) ||
    !isBookableSlot(booking.startsAt, booking.endsAt)
  ) {
    return { ok: false, reason: "invalid" };
  }

  try {
    const result = getDb()
      .prepare(
        `INSERT INTO bookings (room_id, booker_name, starts_at, ends_at)
         VALUES (@roomId, @bookerName, @startsAt, @endsAt)`,
      )
      .run(booking);

    return { ok: true, id: Number(result.lastInsertRowid) };
  } catch (error) {
    // The UNIQUE (room_id, starts_at) constraint is the source of truth for
    // "this slot is taken" — turn that race into a clean conflict result.
    if ((error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
      return { ok: false, reason: "conflict" };
    }

    throw error;
  }
}
