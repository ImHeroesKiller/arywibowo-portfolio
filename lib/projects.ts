export const projectIds = [
  "integratedHrConcept",
  "businessDigitalization",
  "logisticsHrCollaboration",
] as const;

export type ProjectId = (typeof projectIds)[number];

export const projectImages: Record<ProjectId, string> = {
  integratedHrConcept: "/images/projects/perada-logo.png",
  businessDigitalization: "/images/projects/perada-perkasa-logo.png",
  logisticsHrCollaboration: "/images/projects/perada-perdana-logo.png",
};

export const projectLinks: Record<ProjectId, string> = {
  integratedHrConcept: "https://perada.net",
  businessDigitalization: "https://perada.net",
  logisticsHrCollaboration: "https://perada.net",
};