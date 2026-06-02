export const READING_FILLER = [
  "The key insight here is that these operations must be atomic with respect to any observable side effects. When reasoning about concurrent systems, the ordering of events — not just their occurrence — determines correctness.",
  "Consider the implications of this constraint on the design space. Any implementation that violates this invariant will produce results that are difficult to reason about, and failures will manifest as rare, hard-to-reproduce bugs in production.",
  "The formal treatment in the next section makes this precise, but the intuition is straightforward: once a value is committed, the system behaves as if that value always existed from the beginning.",
];
