import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarIcon, Plus, X, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track — Bloom" },
      {
        name: "description",
        content:
          "Log your last period and cycle length to get personalized AI predictions.",
      },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [past, setPast] = useState<number[]>([]);

  const addPast = () => setPast((p) => [...p, 28]);
  const removePast = (i: number) =>
    setPast((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    console.log("BUTTON CLICKED");

    if (!date) {
      alert("Please select a date");
      return;
    }

    localStorage.setItem("last_period", date.toISOString());
    localStorage.setItem("cycle_length", String(cycleLength));
    localStorage.setItem("past_cycles", JSON.stringify(past));

    console.log("Saved to localStorage");

    window.location.href = "/";
  };

  return (
    <main className="space-y-4 max-w-xl">

      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F6C1CC]/40 px-3 py-1 text-xs text-gray-600">
          <Sparkles className="h-3 w-3" /> Track
        </span>

        <h1 className="mt-3 text-3xl tracking-tight font-medium text-[#2E2E2E]">
          Tell us about your cycle
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          A few gentle details help us predict your next period and ovulation.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#EFEFEF] rounded-2xl p-8 space-y-7"
      >

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2E2E2E]">
            Last period date
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border border-[#EFEFEF] bg-white px-4 py-3 text-left text-sm hover:border-[#F6C1CC]",
                  !date && "text-gray-400"
                )}
              >
                {date ? format(date, "PPP") : "Pick a date"}
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Cycle Length */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2E2E2E]">
            Cycle length
          </label>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={20}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-28 rounded-xl border border-[#EFEFEF] px-4 py-3 text-sm focus:outline-none focus:border-[#F6C1CC]"
            />
            <span className="text-sm text-gray-500">days</span>
          </div>
        </div>

        {/* Past cycles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#2E2E2E]">
              Past cycle lengths{" "}
              <span className="text-xs text-gray-500">— optional</span>
            </label>

            <button
              type="button"
              onClick={addPast}
              className="inline-flex items-center gap-1 rounded-full border border-[#EFEFEF] px-3 py-1.5 text-xs text-[#2E2E2E] hover:bg-[#F6C1CC]/40"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>

          {past.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#EFEFEF] px-4 py-5 text-center text-xs text-gray-500">
              Add past cycles to improve predictions.
            </p>
          ) : (
            <div className="space-y-2">
              {past.map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="number"
                    min={20}
                    max={45}
                    value={val}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPast((p) =>
                        p.map((x, idx) => (idx === i ? v : x))
                      );
                    }}
                    className="w-24 rounded-xl border border-[#EFEFEF] px-3 py-2 text-sm focus:outline-none focus:border-[#F6C1CC]"
                  />

                  <span className="text-xs text-gray-500">days</span>

                  <button
                    type="button"
                    onClick={() => removePast(i)}
                    className="ml-auto rounded-full p-1.5 text-gray-400 hover:bg-[#F6C1CC]/40"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#de5590] px-6 py-3.5 text-sm font-medium text-white hover:opacity-90"
        >
          Save & predict
        </button>
      </form>
    </main>
  );
}