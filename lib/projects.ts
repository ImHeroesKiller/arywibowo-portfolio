export const projectIds = [
  "financialSolution",
  "superappsPerdana",
  "bespokeSolarEv",
  "integratedHrConcept",
  "businessDigitalization",
  "logisticsHrCollaboration",
] as const;

export type ProjectId = (typeof projectIds)[number];

export const projectImages: Record<ProjectId, string> = {
  financialSolution: "/images/projects/financial-solution-icon.png",
  superappsPerdana: "/images/projects/superapps-portal-icon.png",
  bespokeSolarEv: "/images/projects/bespoke-solar-preview.jpg",
  integratedHrConcept: "/images/projects/perada-logo.png",
  businessDigitalization: "/images/projects/perada-perkasa-logo.png",
  logisticsHrCollaboration: "/images/projects/perada-perdana-logo.png",
};

export const projectLinks: Record<ProjectId, string> = {
  financialSolution: "https://danawangsa.arywibowo.id/en",
  superappsPerdana: "https://portal.perada.net/#/",
  bespokeSolarEv: "https://bespokesolar.com.au",
  integratedHrConcept: "https://perada.net",
  businessDigitalization: "https://perada.net",
  logisticsHrCollaboration: "https://perada.net",
};

export const projectPreviewHosts: Record<ProjectId, string> = {
  financialSolution: "danawangsa.arywibowo.id",
  superappsPerdana: "portal.perada.net",
  bespokeSolarEv: "bespokesolar.com.au",
  integratedHrConcept: "perada.net",
  businessDigitalization: "perada.net",
  logisticsHrCollaboration: "perada.net",
};

export const projectImageFit: Record<ProjectId, "contain" | "cover"> = {
  financialSolution: "contain",
  superappsPerdana: "contain",
  bespokeSolarEv: "cover",
  integratedHrConcept: "contain",
  businessDigitalization: "contain",
  logisticsHrCollaboration: "contain",
};