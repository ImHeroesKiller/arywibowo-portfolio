import type { OptimizedImageSources } from "@/lib/images";

export const projectIds = [
  "financialSolution",
  "ida",
  "superappsPerdana",
  "bespokeSolarEv",
  "integratedHrConcept",
  "businessDigitalization",
  "logisticsHrCollaboration",
] as const;

export type ProjectId = (typeof projectIds)[number];

export const projectImageSources: Record<ProjectId, OptimizedImageSources> = {
  financialSolution: {
    avif: "/images/projects/financial-solution-icon.avif",
    webp: "/images/projects/financial-solution-icon.webp",
    fallback: "/images/projects/financial-solution-icon.png",
    width: 480,
    height: 342,
  },
  ida: {
    avif: "/images/projects/ida-preview.avif",
    webp: "/images/projects/ida-preview.webp",
    fallback: "/images/projects/ida-preview.png",
    width: 480,
    height: 480,
  },
  superappsPerdana: {
    avif: "/images/projects/superapps-portal-icon.avif",
    webp: "/images/projects/superapps-portal-icon.webp",
    fallback: "/images/projects/superapps-portal-icon.png",
    width: 480,
    height: 440,
  },
  bespokeSolarEv: {
    avif: "/images/projects/bespoke-solar-preview.avif",
    webp: "/images/projects/bespoke-solar-preview.webp",
    fallback: "/images/projects/bespoke-solar-preview.jpg",
    width: 800,
    height: 541,
  },
  integratedHrConcept: {
    avif: "/images/projects/perada-logo.avif",
    webp: "/images/projects/perada-logo.webp",
    fallback: "/images/projects/perada-logo.png",
    width: 320,
    height: 121,
  },
  businessDigitalization: {
    avif: "/images/projects/perada-perkasa-logo.avif",
    webp: "/images/projects/perada-perkasa-logo.webp",
    fallback: "/images/projects/perada-perkasa-logo.png",
    width: 320,
    height: 126,
  },
  logisticsHrCollaboration: {
    avif: "/images/projects/perada-perdana-logo.avif",
    webp: "/images/projects/perada-perdana-logo.webp",
    fallback: "/images/projects/perada-perdana-logo.png",
    width: 320,
    height: 93,
  },
};

/** @deprecated Use projectImageSources — kept for OG/structured data references */
export const projectImages: Record<ProjectId, string> = {
  financialSolution: projectImageSources.financialSolution.webp,
  ida: projectImageSources.ida.webp,
  superappsPerdana: projectImageSources.superappsPerdana.webp,
  bespokeSolarEv: projectImageSources.bespokeSolarEv.webp,
  integratedHrConcept: projectImageSources.integratedHrConcept.webp,
  businessDigitalization: projectImageSources.businessDigitalization.webp,
  logisticsHrCollaboration: projectImageSources.logisticsHrCollaboration.webp,
};

export const projectLinks: Record<ProjectId, string> = {
  financialSolution: "https://danawangsa.arywibowo.id/en",
  ida: "https://ida.arywibowo.id",
  superappsPerdana: "https://portal.perada.net/#/",
  bespokeSolarEv: "https://bespokesolar.com.au",
  integratedHrConcept: "https://perada.net",
  businessDigitalization: "https://perada.net",
  logisticsHrCollaboration: "https://perada.net",
};

export const projectPreviewHosts: Record<ProjectId, string> = {
  financialSolution: "danawangsa.arywibowo.id",
  ida: "ida.arywibowo.id",
  superappsPerdana: "portal.perada.net",
  bespokeSolarEv: "bespokesolar.com.au",
  integratedHrConcept: "perada.net",
  businessDigitalization: "perada.net",
  logisticsHrCollaboration: "perada.net",
};

export const projectImageFit: Record<ProjectId, "contain" | "cover"> = {
  financialSolution: "contain",
  ida: "contain",
  superappsPerdana: "contain",
  bespokeSolarEv: "cover",
  integratedHrConcept: "contain",
  businessDigitalization: "contain",
  logisticsHrCollaboration: "contain",
};