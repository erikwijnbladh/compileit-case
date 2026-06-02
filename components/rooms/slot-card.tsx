import type { AvailabilitySlot } from "@/lib/rooms";

import { formatTime } from "@/lib/format";
import { Check } from "@/components/ui/icons";

export function SlotCard({
  onSelect,
  selected,
  slot,
}: {
  onSelect: () => void;
  selected: boolean;
  slot: AvailabilitySlot;
}) {
  return (
    <button
      className={`relative mb-2 block w-full cursor-pointer rounded-xl border px-2.5 pb-2.5 pt-2.5 text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
        selected
          ? "border-accent bg-accent shadow-lg shadow-accent/30"
          : "border-accent-line bg-card shadow-xs"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span
        className={`mb-1 block text-sm font-semibold leading-none ${
          selected ? "text-white" : "text-foreground"
        }`}
      >
        {slot.room.name}
      </span>
      <span
        className={`block text-xs font-semibold leading-none ${
          selected ? "text-white/85" : "text-accent"
        }`}
      >
        {formatTime(slot.startsAt)}–{formatTime(slot.endsAt)}
      </span>
      {selected && (
        <span className="absolute right-2 top-2 text-white">
          <Check size={15} width={2.8} />
        </span>
      )}
    </button>
  );
}
