import type { LucideIcon } from "lucide-react";
import { Globe, Layers, Users } from "lucide-react";

export const serviceIds = [
  "digitalBusinessExpansion",
  "integratedHrManagement",
  "operationalBusinessSupport",
] as const;

export type ServiceId = (typeof serviceIds)[number];

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  digitalBusinessExpansion: Globe,
  integratedHrManagement: Users,
  operationalBusinessSupport: Layers,
};