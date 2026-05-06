"use client";

import React, { useMemo } from "react";

export type DailyPoint = { label: string; value: number };

export function AreaLineChart({
  title,
  subtitleRight,
  points,
}: {
  title: string;
  subtitleRight?: string;
  points: DailyPoint[];
}) {
  const w = 760;
  const h = 220;
  const padX = 28;
  const padY = 18;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const { pathLine, pathArea, yTicks, max } = useMemo(() => {
    const vals = points.map((p) => p.value);
    const maxVal = Math.max(1, ...vals);
    const minVal = 0;

    const x = (i: number) =>
      padX + (points.length <= 1 ? 0 : (i / (points.length - 1)) * chartW);
    const y = (v: number) =>
      padY + (1 - (v - minVal) / (maxVal - minVal)) * chartH;

    const coords = points.map((p, i) => [x(i), y(p.value)] as const);
    const line = coords
      .map(([cx, cy], i) => `${i === 0 ? "M" : "L"} ${cx.toFixed(2)} ${cy.toFixed(2)}`)
      .join(" ");

    const area =
      `${line} ` +
      `L ${(padX + chartW).toFixed(2)} ${(padY + chartH).toFixed(2)} ` +
      `L ${padX.toFixed(2)} ${(padY + chartH).toFixed(2)} Z`;

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      y: padY + (1 - t) * chartH,
      value: Math.round(t * maxVal),
    }));

    return { pathLine: line, pathArea: area, yTicks: ticks, max: maxVal };
  }, [points, chartW, chartH]);

  return (
    <div className="lg:col-span-2 card bg-surface border border-border rounded-[12px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-text-muted">
          {title}
        </h2>
        {subtitleRight ? (
          <span className="text-[11px] text-text-muted">{subtitleRight}</span>
        ) : null}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full min-w-[560px] h-[220px]"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id="skadiArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(124,109,240,0.35)" />
              <stop offset="100%" stopColor="rgba(124,109,240,0)" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {yTicks.map((t) => (
            <g key={t.y}>
              <line
                x1={padX}
                x2={padX + chartW}
                y1={t.y}
                y2={t.y}
                stroke="rgba(42,42,42,0.7)"
                strokeWidth="1"
              />
              <text
                x={6}
                y={t.y + 4}
                fontSize="10"
                fill="rgba(136,136,136,0.9)"
              >
                {t.value}
              </text>
            </g>
          ))}

          {/* Area + line */}
          <path d={pathArea} fill="url(#skadiArea)" className="skadi-chart-area" />
          <path
            d={pathLine}
            fill="none"
            stroke="rgba(124,109,240,1)"
            strokeWidth="2.25"
            pathLength={1}
            className="skadi-chart-line"
          />

          {/* Points */}
          {points.map((p, i) => {
            const cx =
              padX + (points.length <= 1 ? 0 : (i / (points.length - 1)) * chartW);
            const cy =
              padY + (1 - (p.value / max)) * chartH;
            return (
              <g key={`${p.label}-${i}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="rgba(124,109,240,1)"
                  className="skadi-chart-point"
                >
                  <title>
                    {p.label}: {p.value} call(s)
                  </title>
                </circle>
                {i % 2 === 0 ? (
                  <text
                    x={cx}
                    y={padY + chartH + 16}
                    fontSize="10"
                    textAnchor="middle"
                    fill="rgba(136,136,136,0.9)"
                  >
                    {p.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function OutcomesDonut({
  title,
  total,
  items,
  animate = true,
}: {
  title: string;
  total: number;
  items: Array<{ label: string; value: number; color: string }>;
  animate?: boolean;
}) {
  const size = 140;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;

  const segments = useMemo(() => {
    let acc = 0;
    return items.map((it) => {
      const pct = total > 0 ? it.value / total : 0;
      const len = pct * circ;
      const off = acc;
      acc += len;
      return { ...it, len, off, pct: Math.round(pct * 100) };
    });
  }, [items, total, circ]);

  return (
    <div className="card bg-surface border border-border rounded-[12px] p-6">
      <h2 className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-5">
        {title}
      </h2>

      <div className="flex items-center gap-5">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="rgba(42,42,42,0.7)"
            strokeWidth={stroke}
          />
          <g transform={`rotate(-90 ${c} ${c})`}>
            {segments.map((s, idx) =>
              s.len > 0 ? (
                <circle
                  key={s.label}
                  cx={c}
                  cy={c}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${s.len} ${circ - s.len}`}
                  strokeDashoffset={-s.off}
                  strokeLinecap="round"
                >
                  {animate ? (
                    <>
                      <animate
                        attributeName="stroke-dasharray"
                        from={`0 ${circ}`}
                        to={`${s.len} ${circ - s.len}`}
                        dur="0.9s"
                        begin={`${idx * 0.12}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="opacity"
                        from="0"
                        to="1"
                        dur="0.25s"
                        begin={`${idx * 0.12}s`}
                        fill="freeze"
                      />
                    </>
                  ) : null}
                  <title>
                    {s.label}: {s.value} ({s.pct}%)
                  </title>
                </circle>
              ) : null
            )}
          </g>
          <text
            x={c}
            y={c - 2}
            textAnchor="middle"
            fontSize="18"
            fill="rgba(232,232,232,1)"
            className="fill-text-main"
          >
            {total}
          </text>
          <text
            x={c}
            y={c + 16}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(136,136,136,0.9)"
          >
            calls
          </text>
        </svg>

        <div className="flex-1 space-y-3">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[11px] text-text-dim truncate">
                  {s.label}
                </span>
              </div>
              <span className="text-[11px] text-text-main font-medium tabular-nums">
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

