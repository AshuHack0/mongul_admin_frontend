import React from "react";
import { Typography } from "@mui/material";

const WIDTH = 800;
const HEIGHT = 260;
const PAD_LEFT = 56;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 30;

const INNER_WIDTH = WIDTH - PAD_LEFT - PAD_RIGHT;
const INNER_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM;

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const formatDateLabel = (isoDate) => {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const LINES = [
  { key: "grossRevenue", label: "Gross revenue", color: "#a1a1aa" },
  { key: "platformRevenue", label: "Platform revenue", color: "#2563eb" },
  { key: "mentorShare", label: "Mentor share", color: "#16a34a" },
];

/**
 * Dependency-free SVG line chart for the platform-revenue trend. No
 * charting library is installed in this project, so this draws plain
 * <svg> polylines/points scaled into a fixed viewBox (it scales to the
 * container width via width="100%").
 */
const RevenueLineChart = ({ series = [] }) => {
  const points = series.length ? series : [];
  const n = points.length;

  const maxValue =
    Math.max(
      1,
      ...points.map((p) => Math.max(p.grossRevenue, p.platformRevenue, p.mentorShare))
    ) * 1.15;

  const xFor = (i) => (n <= 1 ? PAD_LEFT : PAD_LEFT + (i / (n - 1)) * INNER_WIDTH);
  const yFor = (value) => PAD_TOP + INNER_HEIGHT - (value / maxValue) * INNER_HEIGHT;

  const pathFor = (key) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(p[key])}`).join(" ");

  const yGridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxValue);

  const tickEvery = Math.max(1, Math.ceil(n / 6));

  if (!n) {
    return (
      <Typography style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>
        No revenue recorded yet for this period.
      </Typography>
    );
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height={HEIGHT}
        role="img"
        aria-label="Platform revenue trend"
      >
        {yGridValues.map((value) => (
          <g key={value}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yFor(value)}
              y2={yFor(value)}
              stroke="#f0f0f0"
              strokeWidth={1}
            />
            <text
              x={PAD_LEFT - 8}
              y={yFor(value) + 4}
              textAnchor="end"
              fontSize="10"
              fill="#a1a1aa"
            >
              {formatMoney(value)}
            </text>
          </g>
        ))}

        {points.map((p, i) =>
          i % tickEvery === 0 || i === n - 1 ? (
            <text
              key={p.date}
              x={xFor(i)}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#a1a1aa"
            >
              {formatDateLabel(p.date)}
            </text>
          ) : null
        )}

        {LINES.map((line) => (
          <path
            key={line.key}
            d={pathFor(line.key)}
            fill="none"
            stroke={line.color}
            strokeWidth={2}
          />
        ))}

        {LINES.map((line) =>
          points.map((p, i) => (
            <circle
              key={`${line.key}-${p.date}`}
              cx={xFor(i)}
              cy={yFor(p[line.key])}
              r={2.5}
              fill={line.color}
            >
              <title>
                {`${formatDateLabel(p.date)} — ${line.label}: ${formatMoney(p[line.key])}`}
              </title>
            </circle>
          ))
        )}
      </svg>

      <div style={{ display: "flex", gap: 16, marginTop: 4, flexWrap: "wrap" }}>
        {LINES.map((line) => (
          <div key={line.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: line.color,
                display: "inline-block",
              }}
            />
            <Typography style={{ fontSize: "0.75rem", color: "#71717a" }}>
              {line.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueLineChart;
