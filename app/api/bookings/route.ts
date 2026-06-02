import { createBooking } from "@/lib/bookings";

const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  if (!body) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { roomId, bookerName, startsAt, endsAt } = body;

  if (
    typeof roomId !== "number" ||
    typeof bookerName !== "string" ||
    bookerName.trim().length === 0 ||
    typeof startsAt !== "string" ||
    !dateTimePattern.test(startsAt) ||
    typeof endsAt !== "string" ||
    !dateTimePattern.test(endsAt) ||
    endsAt <= startsAt
  ) {
    return Response.json({ error: "Invalid booking." }, { status: 400 });
  }

  const result = createBooking({
    roomId,
    bookerName: bookerName.trim(),
    startsAt,
    endsAt,
  });

  if (!result.ok) {
    return result.reason === "conflict"
      ? Response.json({ error: "Tiden är redan bokad." }, { status: 409 })
      : Response.json({ error: "Ogiltig bokning." }, { status: 400 });
  }

  return Response.json({ id: result.id }, { status: 201 });
}
