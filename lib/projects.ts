export const projectIds = [
  "superappsPerdana",
  "integratedHrConcept",
  "businessDigitalization",
  "logisticsHrCollaboration",
] as const;

export type ProjectId = (typeof projectIds)[number];

export const projectImages: Record<ProjectId, string> = {
  superappsPerdana: "/images/projects/superapps-portal-icon.png",
  integratedHrConcept: "/images/projects/perada-logo.png",
  businessDigitalization: "/images/projects/perada-perkasa-logo.png",
  logisticsHrCollaboration: "/images/projects/perada-perdana-logo.png",
};

export const projectLinks: Record<ProjectId, string> = {
  superappsPerdana: "https://portal.perada.net/#/",
  integratedHrConcept: "https://perada.net",
  businessDigitalization: "https://perada.net",
  logisticsHrCollaboration: "https://perada.net",
};

export const projectPreviewHosts: Record<ProjectId, string> = {
  superappsPerdana: "portal.perada.net",
  integratedHrConcept: "perada.net",
  businessDigitalization: "perada.net",
  logisticsHrCollaboration: "perada.net",
};