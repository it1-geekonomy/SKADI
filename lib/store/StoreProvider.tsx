"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

/**
 * Single Redux store instance per browser session.
 *
 * In the Next.js App Router, the store is created once on the client and
 * reused across navigations. `useState` with a lazy initializer gives us
 * a stable, render-safe instance per mount (and works with SSR — each
 * server request gets its own store, preventing cross-request leakage).
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => makeStore());
  return <Provider store={store}>{children}</Provider>;
}
