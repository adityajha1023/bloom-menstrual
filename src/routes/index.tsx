import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Sparkles, Droplet, Egg, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [nextPeriod, setNextPeriod] = useState<string>("--");
  const [ovulation, setOvulation] = useState<string>("--");
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [regularity, setRegularity] = useState<string>("--");
  const [chartData, setChartData] = useState<
    { name: string; days: number }[]
  >([]);
  const [hasData, setHasData] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const storedDate = localStorage.getItem("last_period");
        const storedLength = localStorage.getItem("cycle_length");
        const pastCycles = JSON.parse(
          localStorage.getItem("past_cycles") || "[]"
        );

        // 🚨 NO DATA → SHOW EMPTY STATE
        if (!storedDate || !storedLength) {
          setHasData(false);
          return;
        }

        const length = Number(storedLength);
        setCycleLength(length);

        const avg =
          pastCycles.length > 0
            ? pastCycles.reduce((a: number, b: number) => a + b, 0) /
              pastCycles.length
            : length;

        const res = await fetch("https://https://bloom-menstrual.onrender.com/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cycle_length: length,
            avg_cycle: avg,
            last_period: storedDate.split("T")[0],
          }),
        });

        const data = await res.json();

        setNextPeriod(
          new Date(data.next_period).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        );

        setOvulation(
          new Date(data.ovulation_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        );

        const allCycles = [...pastCycles, length];

        if (allCycles.length > 1) {
          const avgVal =
            allCycles.reduce((a: number, b: number) => a + b, 0) /
            allCycles.length;

          const variance =
            allCycles.reduce(
              (a: number, b: number) => a + (b - avgVal) ** 2,
              0
            ) / allCycles.length;

          const std = Math.sqrt(variance);

          if (std < 2) setRegularity("Regular");
          else if (std < 5) setRegularity("Moderate");
          else setRegularity("Irregular");
        } else {
          setRegularity("Normal");
        }

        const combined = [...pastCycles, length].slice(-7);
        const formatted = combined.map((val: number, i: number) => ({
          name: `Cycle ${i + 1}`,
          days: val,
        }));
        setChartData(formatted);

      } catch (err) {
        console.error(err);
      }
    };

    fetchPrediction();
  }, []);

  // 🚨 EMPTY STATE UI
  if (!hasData) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center space-y-12">
        <h1 className="text-2xl font-medium text-[#2E2E2E]">
          Let’s get started
        </h1>

        <p className="text-sm text-gray-500 max-w-sm">
          Set your last period date and cycle length to unlock personalized predictions.
        </p>

        <Link
          to="/track"
          className="rounded-full bg-[#de5590] px-6 py-3 text-sm text-white hover:opacity-90"
        >
          Set your cycle
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-4">

      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F6C1CC]/40 px-3 py-1 text-xs text-gray-600">
          <Sparkles className="h-3 w-3" /> Dashboard
        </span>

        <h1 className="text-3xl font-medium tracking-tight text-[#2E2E2E]">
          Your cycle insights
        </h1>

        <p className="text-sm text-gray-500">
          Based on your personalized data
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-8 md:col-span-2">
          <p className="text-sm text-gray-500">Next Period</p>
          <h2 className="text-5xl font-light text-[#2E2E2E] mt-4">
            {nextPeriod}
          </h2>
        </div>

        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
          <p className="text-sm text-gray-500">Ovulation</p>
          <h2 className="text-xl mt-3">{ovulation}</h2>
        </div>

        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
          <p className="text-sm text-gray-500">Regularity</p>
          <h2 className="text-lg mt-3">{regularity}</h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
        {chartData.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No cycle history yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#EFEFEF" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="days" stroke="#E8A0BF" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </main>
  );
}