import type { ImportRosterState } from "./ImportRosterState";

export type ImportRosterForm = {
  file: File | null;
  state: ImportRosterState;
  progress: number;
};
