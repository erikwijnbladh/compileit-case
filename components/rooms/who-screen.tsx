"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmModal } from "@/components/rooms/confirm-modal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, People } from "@/components/ui/icons";
import { formatDay, formatTime, formatWeekday } from "@/lib/format";
import type { AvailabilitySlot } from "@/lib/rooms";

export function WhoScreen({
  onBack,
  slot,
}: {
  onBack: () => void;
  slot: AvailabilitySlot;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const day = slot.startsAt.slice(0, 10);

  async function book() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: slot.room.id,
          bookerName: name.trim(),
          startsAt: slot.startsAt,
          endsAt: slot.endsAt,
        }),
      });

      if (response.ok) {
        setConfirmed(true);
        return;
      }

      setError(
        response.status === 409
          ? "Tiden är tyvärr redan bokad. Välj en annan."
          : "Något gick fel. Försök igen.",
      );
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto flex h-dvh max-h-dvh w-full max-w-md flex-col overflow-hidden px-6 pb-safe pt-18 sm:max-w-lg sm:px-8 sm:pb-8">
        <header className="mb-6 flex items-center gap-3.5">
          <button
            aria-label="Tillbaka"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card shadow-xs transition hover:bg-surface-muted active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            onClick={onBack}
            type="button"
          >
            <ChevronLeft />
          </button>
          <h1 className="whitespace-nowrap text-4xl font-bold leading-none tracking-normal">
            Vem bokar?
          </h1>
        </header>

        {/* booking summary */}
        <div className="mb-7 flex items-center gap-3.5 rounded-2xl border border-line bg-card p-4 shadow-md">
          <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <People size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-tight text-foreground">
              {slot.room.name}
            </p>
            <p className="mt-0.5 text-sm text-sub">
              {formatWeekday(day)} {formatDay(day)} · {formatTime(slot.startsAt)}–
              {formatTime(slot.endsAt)}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-background px-2.5 py-1.5 text-xs text-sub">
            <People size={13} /> {slot.room.capacity}
          </span>
        </div>

        <label
          className="mb-3 block text-lg font-medium text-foreground"
          htmlFor="booker"
        >
          Förnamn och efternamn
        </label>
        <input
          autoFocus
          className={`h-14 w-full rounded-xl border bg-card px-4 text-base text-foreground outline-none transition ${
            name ? "border-accent-line ring-2 ring-accent-soft" : "border-line"
          }`}
          id="booker"
          onChange={(event) => setName(event.target.value)}
          placeholder="Skriv ditt fullständiga namn här"
          value={name}
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="flex-1" />
        <Button
          className="mb-2"
          disabled={!name.trim() || saving}
          onClick={book}
        >
          {saving ? "Bokar…" : "Boka"}
        </Button>
      </section>

      {confirmed && (
        <ConfirmModal
          name={name.trim()}
          onDone={() => router.push("/")}
          slot={slot}
        />
      )}
    </main>
  );
}
