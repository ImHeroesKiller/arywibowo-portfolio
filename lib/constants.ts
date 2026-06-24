import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Cpu,
  LineChart,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react";

export const siteConfig = {
  name: "Ary Wibowo",
  logo: "/images/awi-logo.png",
  title: "Profesional Consultant",
  headline: "Profesional Consultant",
  tagline:
    "Mendampingi bisnis tumbuh melalui konsultasi strategis — dari energi terbarukan hingga transformasi digital.",
  description:
    "Konsultan profesional di bidang energi terbarukan, pengembangan bisnis, IT & digital, SDM, penjualan, dan solusi keuangan — berbasis di Jakarta.",
  url: "https://arywibowo.co.id",
  email: "aku@arywibowo.co.id",
  github: "https://github.com/ImHeroesKiller",
  githubHandle: "ImHeroesKiller",
  linkedin: "https://linkedin.com/in/boworesearch",
  location: "Jakarta, Indonesia",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export type ServiceItem = {
  id: string;
  title: string;
  usp: string;
  icon: LucideIcon;
  description: string;
  features: string[];
};

export const services: ServiceItem[] = [
  {
    id: "renewable-energy",
    title: "Renewable Energy",
    usp: "Strategi transisi energi hijau yang berkelanjutan dan terukur.",
    icon: Sun,
    description:
      "Konsultasi perencanaan dan implementasi solusi energi terbarukan untuk bisnis yang ingin bertransformasi menuju operasi lebih efisien dan ramah lingkungan.",
    features: [
      "Analisis kebutuhan energi & efisiensi",
      "Roadmap transisi energi hijau",
      "Evaluasi ROI proyek energi",
      "Koordinasi dengan pemangku kepentingan",
    ],
  },
  {
    id: "business-development",
    title: "Business Development",
    usp: "Membuka peluang pasar baru dan memperkuat pertumbuhan bisnis.",
    icon: TrendingUp,
    description:
      "Pendampingan strategi ekspansi bisnis, identifikasi peluang pasar, dan penyusunan model pertumbuhan yang scalable untuk UMKM hingga enterprise.",
    features: [
      "Market research & analisis kompetitif",
      "Strategi penetrasi pasar",
      "Partnership & alliance building",
      "Business model development",
    ],
  },
  {
    id: "it-digital",
    title: "IT & Digital",
    usp: "Transformasi digital yang meningkatkan efisiensi operasional.",
    icon: Cpu,
    description:
      "Solusi teknologi informasi dan digitalisasi proses bisnis — dari otomasi workflow, integrasi sistem, hingga pengembangan platform web.",
    features: [
      "Digital transformation strategy",
      "System integration & API",
      "Web & automation development",
      "AI implementation advisory",
    ],
  },
  {
    id: "hr-consulting",
    title: "HR Consulting",
    usp: "Optimalisasi SDM dan hubungan industrial yang produktif.",
    icon: Users,
    description:
      "Layanan konsultasi SDM menyeluruh — rekrutmen, remunerasi, pengembangan organisasi, dan kepatuhan regulasi ketenagakerjaan.",
    features: [
      "Rekrutmen & talent acquisition",
      "Struktur remunerasi & benefit",
      "Employee engagement",
      "Industrial relations & compliance",
    ],
  },
  {
    id: "sales-project-management",
    title: "Sales & Project Management",
    usp: "Eksekusi proyek tepat waktu dengan target penjualan tercapai.",
    icon: Briefcase,
    description:
      "Manajemen proyek end-to-end dengan fokus pada pencapaian target penjualan, koordinasi tim lapangan, dan pelaporan real-time.",
    features: [
      "Project planning & execution",
      "Sales monitoring & reporting",
      "Team coordination",
      "Stakeholder management",
    ],
  },
  {
    id: "financial-solutions",
    title: "Financial Solutions",
    usp: "Perencanaan keuangan bisnis yang transparan dan terstruktur.",
    icon: LineChart,
    description:
      "Konsultasi keuangan dan akuntansi untuk membantu bisnis mengelola arus kas, perencanaan anggaran, dan analisis profitabilitas.",
    features: [
      "Financial planning & budgeting",
      "Cash flow analysis",
      "Profitability reporting",
      "Accounting process advisory",
    ],
  },
];

export const aboutContent = {
  bio: [
    "Profesional berpengalaman di bidang Sumber Daya Manusia, manajemen proyek, dan telekomunikasi dengan pengalaman lebih dari satu dekade di berbagai industri.",
    "Memiliki semangat tinggi terhadap teknologi dan bisnis, serta keahlian dalam berbagai perangkat lunak — dari Google Workspace hingga implementasi AI dan pengembangan web.",
    "Lulusan S1 Computer Engineering dari STMIK Tegal, dengan track record sebagai Project Manager di PT GOS Indoraya dan pengalaman di Indosat Ooredoo, PERDANA, serta berbagai proyek digital seperti OneWork, FreeJobID, dan SaleGuard.",
  ],
  coreStrengths: [
    "Manajemen SDM & Hubungan Industrial",
    "Project & Sales Management",
    "Business Development",
    "IT & Digital Transformation",
    "Telecommunications",
    "Financial & Accounting Advisory",
  ],
  experience: [
    {
      period: "Juli 2017 — Present",
      role: "Project Manager",
      company: "PT GOS Indoraya",
      description:
        "Memimpin eksekusi proyek skala enterprise, koordinasi tim lapangan, dan pencapaian target operasional.",
    },
    {
      period: "2015 — 2017",
      role: "Project Coordinator & Team Lead",
      company: "Indosat Ooredoo",
      description:
        "Mengkoordinasikan proyek telekomunikasi, memimpin tim lapangan, dan memastikan SLA terpenuhi.",
    },
    {
      period: "Juni 2023 — Present",
      role: "Founder & Consultant",
      company: "OneWork, FreeJobID, SaleGuard",
      description:
        "Mengembangkan platform digital untuk otomasi proses kerja, peluang kerja, dan monitoring penjualan distributor.",
    },
  ],
} as const;