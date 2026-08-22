import React from "react";
import { Stack, Typography } from "@mui/material";

const SIZE = 180;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

/**
 * Dependency-free SVG donut chart (stroke-dasharray segment technique) for
 * the all-time platform-vs-mentor split. "Unallocated" covers payments
 * recorded before any RevenuePolicy existed (they were snapshotted at 0/0).
 */
const RevenueSplitDonut = ({ platformRevenue = 0, mentorShare = 0, grossRevenue = 0 }) => {
  const unallocated = Math.max(0, grossRevenue - platformRevenue - mentorShare);
  const total = platformRevenue + mentorShare + unallocated;

  const segments = [
    { label: "Platform revenue", value: platformRevenue, color: "#2563eb" },
    { label: "Mentor share", value: mentorShare, color: "#16a34a" },
    ...(unallocated > 0
      ? [{ label: "Unallocated (pre-policy)", value: unallocated, color: "#d4d4d8" }]
      : []),
  ];

  let offset = 0;

  return (
    <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Revenue split">
        {total <= 0 ? (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={STROKE}
          />
        ) : (
          segments.map((seg) => {
            const fraction = seg.value / total;
            const dash = fraction * CIRCUMFERENCE;
            const dashArray = `${dash} ${CIRCUMFERENCE - dash}`;
            const el = (
              <circle
                key={seg.label}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeDasharray={dashArray}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
              >
                <title>{`${seg.label}: ${formatMoney(seg.value)} (${(fraction * 100).toFixed(1)}%)`}</title>
              </circle>
            );
            offset += dash;
            return el;
          })
        )}
        <text x={CENTER} y={CENTER - 4} textAnchor="middle" fontSize="11" fill="#a1a1aa">
          Total
        </text>
        <text x={CENTER} y={CENTER + 14} textAnchor="middle" fontSize="14" fontWeight="700" fill="#111111">
          {formatMoney(total)}
        </text>
      </svg>

      <Stack spacing={1}>
        {(total <= 0 ? [{ label: "No revenue yet", value: 0, color: "#d4d4d8" }] : segments).map((seg) => (
          <Stack key={seg.label} direction="row" spacing={1} alignItems="center">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: seg.color,
                display: "inline-block",
              }}
            />
            <Typography style={{ fontSize: "0.8rem", color: "#52525b" }}>
              {seg.label}
              {total > 0 ? ` — ${formatMoney(seg.value)}` : ""}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default RevenueSplitDonut;
