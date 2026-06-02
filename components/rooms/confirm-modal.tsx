import { Button } from "@/components/ui/button";
import { Check, People } from "@/components/ui/icons";
import { formatDay, formatTime, formatWeekday } from "@/lib/format";
import type { AvailabilitySlot } from "@/lib/rooms";

export function ConfirmModal({
  name,
  onDone,
  slot,
}: {
  name: string;
  onDone: () => void;
  slot: AvailabilitySlot;
}) {
  const day = slot.startsAt.slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-7">
      <div className="absolute inset-0 animate-fade-in bg-black/45" />
      <div className="relative w-full max-w-xs animate-pop-in rounded-3xl bg-background p-7 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/40">
          <Check size={34} width={3} />
        </div>
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-foreground">
          Ditt rum är bokat!
        </h2>
        <p className="mb-5 text-sm text-sub">
          Vi ses i rummet. En bekräftelse är på väg.
        </p>

        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 text-left">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <People size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-foreground">{slot.room.name}</p>
            <p className="mt-0.5 text-xs text-sub">
              {formatWeekday(day)} {formatDay(day)} · {formatTime(slot.startsAt)}–
              {formatTime(slot.endsAt)}
            </p>
            <p className="mt-0.5 truncate text-xs text-faint">{name}</p>
          </div>
        </div>

        <Button onClick={onDone}>Klar</Button>
      </div>
    </div>
  );
}
