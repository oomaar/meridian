export type OverviewStats = {
  label: string;
  total: number;
  valueSub?: string;
  statistics: {
    delta: string;
    spark: number[];
    deltaType: "up" | "down";
  };
};
