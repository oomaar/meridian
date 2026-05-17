export type Program = {
  id: string;
  code: string;
  name: string;
  degreeType: "BS" | "BA" | "MS" | "MA" | "PhD";
  departmentId: string;
};
