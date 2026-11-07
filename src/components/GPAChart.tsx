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
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">
        GPA Progress
      </h2>

      <p className="mb-6 text-sm text-slate-500 sm:text-base">
        Track your semester and cumulative GPA over time.
      </p>

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="term"
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
              angle={-20}
              textAnchor="end"
              height={55}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tick={{
                fontSize: 12,
                fill: "#64748b",
              }}
            />

            <Tooltip
              contentStyle={{
                fontSize: "13px",
                borderRadius: "8px",
              }}
            />

            <Legend
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "10px",
              }}
            />

            <Line
              type="monotone"
              dataKey="semesterGPA"
              name="SEM-GPA"
              stroke="#2563eb"
              strokeWidth={3}
              connectNulls={false}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />

            <Line
              type="monotone"
              dataKey="cumulativeGPA"
              name="CUM-GPA"
              stroke="#16a34a"
              strokeWidth={3}
              connectNulls
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}