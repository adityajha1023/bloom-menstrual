import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [periodDays, setPeriodDays] = useState<Date[]>([]);
  const [ovulationDay, setOvulationDay] = useState<Date | null>(null);

  useEffect(() => {
    const storedDate = localStorage.getItem("last_period");
    const storedLength = localStorage.getItem("cycle_length");

    if (!storedDate || !storedLength) return;

    const start = new Date(storedDate);
    const length = Number(storedLength);

    // Next period start
    const nextPeriod = new Date(start);
    nextPeriod.setDate(nextPeriod.getDate() + length);

    // Generate 5-day period window
    const periodRange: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(nextPeriod);
      d.setDate(d.getDate() + i);
      periodRange.push(d);
    }
    setPeriodDays(periodRange);

    // Ovulation day
    const ovu = new Date(start);
    ovu.setDate(ovu.getDate() + (length - 14));
    setOvulationDay(ovu);
  }, []);

  return (
    <main className="space-y-4 max-w-fit">

      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F6C1CC]/40 px-3 py-1 text-xs text-gray-600">
          <Sparkles className="h-3 w-3" /> Calendar
        </span>

        <h1 className="mt-3 text-3xl tracking-tight font-medium text-[#2E2E2E]">
          Your cycle calendar
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View your upcoming period and ovulation days.
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 flex justify-center">

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            period: periodDays,
            ovulation: ovulationDay ? [ovulationDay] : [],
          }}
          modifiersClassNames={{
            period: "bg-[#E8A0BF] text-white rounded-full",
            ovulation: "bg-[#F6C1CC] text-[#2E2E2E] rounded-full",
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-600">

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#E8A0BF]" />
          Period
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#F6C1CC]" />
          Ovulation
        </div>

      </div>

    </main>
  );
}