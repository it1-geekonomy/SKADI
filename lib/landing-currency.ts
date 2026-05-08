"use client";

import { useEffect, useMemo, useState } from "react";

export type LandingCurrency = "USD" | "INR";

const USD_TO_INR_RATE = 83;

function detectCurrency(): LandingCurrency {
  if (typeof window === "undefined") return "USD";

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isIndiaLocale = languages.some((lang) =>
    lang.toLowerCase().endsWith("-in")
  );
  const isIndiaTimeZone = timeZone === "Asia/Kolkata" || timeZone === "Asia/Calcutta";

  return isIndiaLocale || isIndiaTimeZone ? "INR" : "USD";
}

async function detectCurrencyFromIp(signal: AbortSignal): Promise<LandingCurrency | null> {
  try {
    const res = await fetch("/api/visitor-country", {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { country?: string | null };
    if (!data.country) return null;

    return data.country.toUpperCase() === "IN" ? "INR" : "USD";
  } catch {
    return null;
  }
}

export function useLandingCurrency() {
  const [currency, setCurrency] = useState<LandingCurrency>("USD");

  useEffect(() => {
    const fallbackCurrency = detectCurrency();
    setCurrency(fallbackCurrency);

    const controller = new AbortController();
    void detectCurrencyFromIp(controller.signal).then((ipCurrency) => {
      if (ipCurrency) {
        setCurrency(ipCurrency);
      }
    });

    return () => controller.abort();
  }, []);

  return useMemo(() => {
    const locale = currency === "INR" ? "en-IN" : "en-US";
    const rate = currency === "INR" ? USD_TO_INR_RATE : 1;

    const formatMoney = (usdAmount: number, compact = false) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
        notation: compact ? "compact" : "standard",
        compactDisplay: "short",
      }).format(Math.round(usdAmount * rate));

    const formatCurrencyAmount = (amount: number, compact = false) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
        notation: compact ? "compact" : "standard",
        compactDisplay: "short",
      }).format(Math.round(amount));

    return {
      currency,
      symbol: currency === "INR" ? "₹" : "$",
      formatMoney,
      formatCurrencyAmount,
    };
  }, [currency]);
}
