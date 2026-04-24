"use client";

import { useState, useCallback } from "react";

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

export default function ROICalculator() {
  const [calls, setCalls] = useState(200);
  const [missed, setMissed] = useState(40);
  const [deal, setDeal] = useState(500);
  const [close, setClose] = useState(20);

  const leadsLost = Math.round(calls * (missed / 100));
  const revLost = Math.round(leadsLost * (close / 100) * deal);
  const revRecovered = Math.round(revLost * 0.85);
  const annualGain = Math.round((revRecovered - 599) * 12);

  return (
    <div className="bg-forest" id="roi">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px]">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
          ROI Calculator
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-10">
          {/* Heading Section - Left */}
          <div>
            <h2 className="font-bebas text-[clamp(44px,5vw,64px)] leading-none tracking-[0.04em] text-parchment mb-4">
              See what missed calls are costing you.
            </h2>
            <p className="text-[16px] text-[rgba(245,240,232,0.45)] font-light max-w-[480px] leading-[1.7] mb-10">
              Move the sliders to match your business. See your real numbers
              instantly.
            </p>

            {/* Sliders */}
            <div className="flex flex-col gap-8">
            {[
              {
                label: "Calls received per month",
                value: calls,
                displayVal: String(calls),
                min: 50, max: 1000, step: 10,
                onChange: (v: number) => setCalls(v),
              },
              {
                label: "% of calls currently missed",
                value: missed,
                displayVal: missed + "%",
                min: 10, max: 90, step: 5,
                onChange: (v: number) => setMissed(v),
              },
              {
                label: "Average deal value ($)",
                value: deal,
                displayVal: "$" + deal.toLocaleString(),
                min: 100, max: 10000, step: 100,
                onChange: (v: number) => setDeal(v),
              },
              {
                label: "Lead to close rate (%)",
                value: close,
                displayVal: close + "%",
                min: 5, max: 80, step: 5,
                onChange: (v: number) => setClose(v),
              },
            ].map((slider) => (
              <div key={slider.label} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[rgba(245,240,232,0.7)]">
                    {slider.label}
                  </span>
                  <span className="font-bebas text-[22px] text-gold tracking-[0.04em]">
                    {slider.displayVal}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={slider.value}
                  onChange={(e) => slider.onChange(Number(e.target.value))}
                />
              </div>
            ))}
            </div>
          </div>

          {/* Results - Right Side */}
          <div className="bg-[rgba(245,240,232,0.05)] border border-[rgba(245,240,232,0.08)] rounded-xl p-10 flex flex-col gap-7 order-2">
            {[
              {
                label: "Leads lost per month",
                value: leadsLost + " leads",
                highlight: false,
                sub: "calls slipping through without Skadi",
              },
              {
                label: "Revenue lost per month",
                value: fmt(revLost),
                highlight: false,
                sub: "deals that never happen",
              },
              {
                label: "Revenue recovered with Skadi",
                value: fmt(revRecovered) + "/mo",
                highlight: true,
                sub: "additional monthly revenue",
              },
              {
                label: "Your annual gain",
                value: annualGain > 0 ? fmt(annualGain) + "/yr" : "$0",
                highlight: true,
                sub: "vs Skadi Starter plan at $1500/mo",
              },
            ].map((result, i) => (
              <div key={result.label}>
                {i > 0 && <div className="h-px bg-[rgba(245,240,232,0.06)] -mt-7 mb-7" />}
                <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[rgba(245,240,232,0.3)] mb-1.5">
                  {result.label}
                </div>
                <div
                  className={`font-bebas text-[52px] tracking-[0.02em] leading-none ${
                    result.highlight ? "text-gold" : "text-parchment"
                  }`}
                >
                  {result.value}
                </div>
                <div className="text-[12px] text-[rgba(245,240,232,0.35)] font-light mt-1">
                  {result.sub}
                </div>
              </div>
            ))}
            <p className="text-[11px] text-[rgba(245,240,232,0.25)] font-light leading-[1.6] italic">
              * Based on your inputs. Recovery rate fixed at 85% - the
              industry-researched average for AI voice agent lead capture. Actual
              results vary by industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
