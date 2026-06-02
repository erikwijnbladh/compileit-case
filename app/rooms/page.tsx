"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CalendarMessage } from "@/components/rooms/calendar-message";
import { DateArrow } from "@/components/rooms/date-arrow";
import { EmptyDay } from "@/components/rooms/empty-day";
import { SlotCard } from "@/components/rooms/slot-card";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronLeft, ChevronRight, People } from "@/components/ui/icons";
import { addDays, defaultWorkWeekDateRange } from "@/lib/date-range";
import { formatDay, formatRangeLabel, formatWeekday, getWeekNumber } from "@/lib/format";
import type { AvailabilityResponse } from "@/lib/rooms";

type FetchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: AvailabilityResponse };

type Selection = { roomId: number; startsAt: string };

export default function RoomsPage() {
  const [weekStart, setWeekStart] = useState(() =>
    defaultWorkWeekDateRange().from.slice(0, 10),
  );
  const from = weekStart;
  const to = addDays(weekStart, 5);

  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [reloadToken, setReloadToken] = useState(0);

  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<number> | null>(
    null,
  );
  const [selected, setSelected] = useState<Selection | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    setSelected(null); // reset picker on week change

    fetch(`/api/rooms?from=${from}&to=${to}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        return response.json() as Promise<AvailabilityResponse>;
      })
      .then((data) => {
        if (active) {
          setState({ status: "ready", data });
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: "error" });
        }
      });

    return () => {
      active = false;
    };
  }, [from, to, reloadToken]);

  const data = state.status === "ready" ? state.data : null;
  const rooms = data?.rooms ?? [];
  const days = data?.days ?? [];

  const isRoomOn = (roomId: number) =>
    selectedRoomIds === null || selectedRoomIds.has(roomId);
  const selectedCount =
    selectedRoomIds === null ? rooms.length : selectedRoomIds.size;
  const allRoomsSelected =
    selectedRoomIds === null || selectedCount === rooms.length;

  function toggleRoom(roomId: number) {
    const base = new Set(selectedRoomIds ?? rooms.map((room) => room.id));
    if (base.has(roomId)) {
      base.delete(roomId);
    } else {
      base.add(roomId);
    }

    setSelectedRoomIds(base.size === rooms.length ? null : base);

    if (selected && !base.has(selected.roomId)) {
      setSelected(null);
    }
  }

  const canGoToPreviousWeek =
    weekStart > defaultWorkWeekDateRange().from.slice(0, 10);

  const chipLabel =
    rooms.length === 0 || allRoomsSelected
      ? "Alla rum"
      : selectedCount === 0
        ? "Inga rum"
        : selectedCount === 1
          ? (rooms.find((room) => isRoomOn(room.id))?.name ?? "1 rum")
          : `${selectedCount} rum`;

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto flex h-dvh max-h-dvh w-full max-w-md flex-col overflow-hidden px-6 pb-safe pt-18 sm:max-w-lg sm:px-8 sm:pb-8">
        <header className="mb-5 flex items-center gap-3.5">
          <Link
            aria-label="Tillbaka"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-card shadow-xs transition hover:bg-surface-muted active:scale-90 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-foreground"
            href="/"
          >
            <ChevronLeft />
          </Link>
          <h1 className="whitespace-nowrap text-4xl font-bold leading-none tracking-normal">
            Välj en tid
          </h1>
        </header>

        {/* room filter */}
        <div className="relative z-20 mb-4 self-stretch">
          <label className="mb-2 block text-xs font-medium tracking-wide text-faint">
            Visa rum
          </label>
          <button
            aria-expanded={filterOpen}
            className={`flex w-full items-center gap-2.5 rounded-xl border bg-card px-3.5 py-3 transition ${
              filterOpen
                ? "border-accent-line ring-2 ring-accent-soft"
                : "border-line shadow-xs"
            }`}
            onClick={() => setFilterOpen((open) => !open)}
            type="button"
          >
            <span
              className={`flex-1 text-left text-base font-medium ${
                selectedCount === 0 ? "text-faint" : "text-foreground"
              }`}
            >
              {chipLabel}
            </span>
            <span
              className="text-sub transition-transform duration-200"
              style={{ transform: filterOpen ? "rotate(180deg)" : "rotate(0)" }}
            >
              <ChevronDown />
            </span>
          </button>

          {filterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFilterOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-line bg-card shadow-xl">
                {rooms.map((room) => {
                  const on = isRoomOn(room.id);
                  return (
                    <button
                      className={`flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-3 text-left transition-colors ${
                        on ? "bg-accent-soft" : "bg-transparent"
                      }`}
                      key={room.id}
                      onClick={() => toggleRoom(room.id)}
                      type="button"
                    >
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {room.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-faint">
                        <People size={12} /> {room.capacity}
                      </span>
                      <span
                        className={`ml-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 text-white transition ${
                          on ? "border-accent bg-accent" : "border-line"
                        }`}
                      >
                        {on && <Check size={14} width={2.8} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* date nav */}
        <div className="mb-3 flex items-center justify-between">
          <DateArrow
            disabled={!canGoToPreviousWeek}
            label="Föregående vecka"
            onClick={() => setWeekStart((week) => addDays(week, -7))}
          >
            <ChevronLeft size={15} />
          </DateArrow>
          <p className="text-sm font-medium leading-none">
            {days.length > 0 ? formatRangeLabel(days) : "—"}
            {days.length > 0 && (
              <span className="text-faint">
                {" "}
                · v.{getWeekNumber(days[0].date)}
              </span>
            )}
          </p>
          <DateArrow
            label="Nästa vecka"
            onClick={() => setWeekStart((week) => addDays(week, 7))}
          >
            <ChevronRight />
          </DateArrow>
        </div>

        {/* calendar grid */}
        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden rounded-2xl border border-line bg-card shadow-lg">
          {state.status === "loading" && (
            <CalendarMessage>Laddar tider…</CalendarMessage>
          )}
          {state.status === "error" && (
            <CalendarMessage>
              <span>Kunde inte hämta tider.</span>
              <button
                className="mt-1 cursor-pointer rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-muted"
                onClick={() => setReloadToken((token) => token + 1)}
                type="button"
              >
                Försök igen
              </button>
            </CalendarMessage>
          )}
          {state.status === "ready" && (
            <div className="flex h-full min-h-0">
              {days.map((day, dayIndex) => {
                const visibleSlots = day.slots.filter((slot) =>
                  isRoomOn(slot.room.id),
                );
                return (
                  <section
                    className={`flex h-full w-31 shrink-0 flex-col ${
                      dayIndex ? "border-l border-line" : ""
                    }`}
                    key={day.date}
                  >
                    <header className="border-b border-line bg-surface-muted px-2 pb-2.5 pt-3 text-center">
                      <p className="text-xs font-medium uppercase leading-none tracking-wider text-faint">
                        {formatWeekday(day.date)}
                      </p>
                      <p className="mt-1 text-sm font-bold leading-none">
                        {formatDay(day.date)}
                      </p>
                    </header>
                    <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-1 pt-2">
                      {visibleSlots.length ? (
                        visibleSlots.map((slot) => (
                          <SlotCard
                            key={slot.startsAt + slot.room.id}
                            onSelect={() =>
                              setSelected((current) =>
                                current?.roomId === slot.room.id &&
                                current?.startsAt === slot.startsAt
                                  ? null
                                  : {
                                      roomId: slot.room.id,
                                      startsAt: slot.startsAt,
                                    },
                              )
                            }
                            selected={
                              selected?.roomId === slot.room.id &&
                              selected?.startsAt === slot.startsAt
                            }
                            slot={slot}
                          />
                        ))
                      ) : (
                        <EmptyDay />
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button className="mb-2" disabled={!selected}>
            Nästa
          </Button>
        </div>
      </section>
    </main>
  );
}
