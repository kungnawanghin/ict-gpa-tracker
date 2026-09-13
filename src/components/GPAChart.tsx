"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type GPAData = {
  term: string;
  semesterGPA: number | null;
  cumulativeGPA: number | null;
};

type GPAChartProps = {
  data: GPAData[];
};

export default function GPAChart({
  data,
}: GPAChartProps) {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">
        GPA Progress
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Track your semester and cumulative GPA over time.
      </p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="term" />

            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
            />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="semesterGPA"
              name="SEM-GPA"
              stroke="#2563eb"
              strokeWidth={3}
              connectNulls={false}
            />

            <Line
              type="monotone"
              dataKey="cumulativeGPA"
              name="CUM-GPA"
              stroke="#16a34a"
              strokeWidth={3}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}