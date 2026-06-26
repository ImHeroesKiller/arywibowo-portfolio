import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Landmark,
  Sun,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export const serviceIds = [
  "renewableEnergy",
  "businessDevelopment",
  "itDigitalTransformation",
  "integratedHrManagement",
  "salesProjectManagement",
  "financialSolutions",
] as const;

export type ServiceId = (typeof serviceIds)[number];

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  renewableEnergy: Sun,
  businessDevelopment: TrendingUp,
  itDigitalTransformation: Cpu,
  integratedHrManagement: Users,
  salesProjectManagement: Target,
  financialSolutions: Landmark,
};