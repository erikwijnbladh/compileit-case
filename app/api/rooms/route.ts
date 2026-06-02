import { parseDateRange } from "@/lib/date-range";
import { getRoomAvailability } from "@/lib/rooms";

export async function GET(request: Request) {
  const range = parseDateRange(new URL(request.url).searchParams);

  if ("error" in range) {
    return Response.json({ error: range.error }, { status: 400 });
  }

  return Response.json(getRoomAvailability(range));
}
