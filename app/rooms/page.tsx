"use client";

import { useState } from "react";

import { WeekView } from "@/components/rooms/week-view";
import { WhoScreen } from "@/components/rooms/who-screen";
import type { AvailabilitySlot } from "@/lib/rooms";

export default function RoomsPage() {
  // The picked slot lives in state and is handed to the who-screen as a prop —
  // null means we're still on the week view.
  const [bookingSlot, setBookingSlot] = useState<AvailabilitySlot | null>(null);

  return bookingSlot ? (
    <WhoScreen onBack={() => setBookingSlot(null)} slot={bookingSlot} />
  ) : (
    <WeekView onNext={setBookingSlot} />
  );
}
