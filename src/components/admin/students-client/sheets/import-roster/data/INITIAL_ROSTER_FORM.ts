import type { ImportRosterForm } from "../types/ImportRosterForm";

export const INITIAL_ROSTER_FORM: ImportRosterForm = {
  file: null,
  state: "idle",
  progress: 0,
};
