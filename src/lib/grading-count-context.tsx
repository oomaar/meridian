"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const Ctx = createContext<{ count: number; decrement: () => void }>({
  count: 0,
  decrement: () => {},
});

export function GradingCountProvider({
  initial,
  children,
}: {
  initial: number;
  children: ReactNode;
}) {
  const [count, setCount] = useState(initial);
  return (
    <Ctx.Provider
      value={{ count, decrement: () => setCount((c) => Math.max(0, c - 1)) }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useGradingCount() {
  return useContext(Ctx);
}
