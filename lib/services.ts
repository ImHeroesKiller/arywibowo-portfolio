import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Cpu,
  LineChart,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react";

export const serviceIds = [
  "renewableEnergy",
  "businessDevelopment",
  "itDigital",
  "hrConsulting",
  "salesProjectManagement",
  "financialSolutions",
] as const;

export type ServiceId = (typeof serviceIds)[number];

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  renewableEnergy: Sun,
  businessDevelopment: TrendingUp,
  itDigital: Cpu,
  hrConsulting: Users,
  salesProjectManagement: Briefcase,
  financialSolutions: LineChart,
};