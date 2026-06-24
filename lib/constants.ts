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
    "Mendampingi bisnis tumbuh melalui konsultasi strategis — renewable energy, business development, IT & digital transformation, HR & operations, sales & project management, hingga financial solutions.",
  description:
    "Konsultan profesional berpengalaman 7+ tahun di energi terbarukan, pengembangan bisnis, transformasi digital, SDM, penjualan, manajemen proyek, dan solusi keuangan — berbasis di Jakarta.",
  url: "https://arywibowo.co.id",
  email: "aku@arywibowo.co.id",
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
      "Konsultasi perencanaan dan implementasi solusi energi terbarukan untuk bisnis yang ingin meningkatkan efisiensi operasional sekaligus berkomitmen pada keberlanjutan lingkungan.",
    features: [
      "Analisis kebutuhan energi & efisiensi operasional",
      "Roadmap transisi energi hijau bertahap",
      "Evaluasi ROI dan kelayakan proyek energi",
      "Koordinasi pemangku kepentingan internal & eksternal",
    ],
  },
  {
    id: "business-development",
    title: "Business Development",
    usp: "Membuka peluang pasar baru dan memperkuat pertumbuhan bisnis.",
    icon: TrendingUp,
    description:
      "Pendampingan strategi ekspansi bisnis, identifikasi peluang pasar, dan penyusunan model pertumbuhan yang scalable — dari UMKM hingga operasi skala enterprise.",
    features: [
      "Market research & analisis kompetitif",
      "Strategi penetrasi dan ekspansi pasar",
      "Partnership & alliance building",
      "Pengembangan model bisnis berkelanjutan",
    ],
  },
  {
    id: "it-digital",
    title: "IT & Digital",
    usp: "Transformasi digital yang meningkatkan efisiensi operasional.",
    icon: Cpu,
    description:
      "Solusi teknologi informasi dan digitalisasi proses bisnis — dari otomasi workflow, integrasi sistem, hingga pengembangan platform web dan advisory implementasi AI.",
    features: [
      "Digital transformation strategy",
      "System integration & API development",
      "Web platform & workflow automation",
      "AI implementation advisory",
    ],
  },
  {
    id: "hr-consulting",
    title: "HR Consulting",
    usp: "Optimalisasi SDM dan hubungan industrial yang produktif.",
    icon: Users,
    description:
      "Layanan konsultasi SDM menyeluruh — mulai dari rekrutmen dan talent acquisition, struktur remunerasi, pengembangan organisasi, hingga kepatuhan regulasi ketenagakerjaan.",
    features: [
      "Rekrutmen & talent acquisition",
      "Struktur remunerasi & benefit",
      "Employee engagement & retensi",
      "Industrial relations & compliance",
    ],
  },
  {
    id: "sales-project-management",
    title: "Sales & Project Management",
    usp: "Eksekusi proyek tepat waktu dengan target penjualan tercapai.",
    icon: Briefcase,
    description:
      "Manajemen proyek end-to-end dengan fokus pada pencapaian target penjualan, koordinasi tim lapangan, pelaporan real-time, dan manajemen pemangku kepentingan.",
    features: [
      "Project planning & execution",
      "Sales monitoring & performance reporting",
      "Koordinasi tim multidisiplin",
      "Stakeholder & risk management",
    ],
  },
  {
    id: "financial-solutions",
    title: "Financial Solutions",
    usp: "Perencanaan keuangan bisnis yang transparan dan terstruktur.",
    icon: LineChart,
    description:
      "Konsultasi keuangan dan akuntansi untuk membantu bisnis mengelola arus kas, perencanaan anggaran, analisis profitabilitas, dan proses akuntansi yang lebih efisien.",
    features: [
      "Financial planning & budgeting",
      "Cash flow analysis & forecasting",
      "Profitability & performance reporting",
      "Accounting process advisory",
    ],
  },
];

export const aboutContent = {
  summary:
    "Kombinasi pengalaman business development, hubungan klien, dan keahlian teknologi untuk solusi bisnis yang berdampak.",
  bio: [
    "Profesional konsultan dengan pengalaman lebih dari 7 tahun di business development, hubungan klien, energi terbarukan, dan transformasi digital. Latar belakang teknik komputer memperkuat pendekatan analitis dalam merancang solusi bisnis terukur — dari strategi pertumbuhan pasar hingga implementasi sistem digital.",
    "Berpengalaman memimpin proyek lintas industri telekomunikasi dan energi, mengkoordinasikan tim multidisiplin, serta mengembangkan platform digital untuk otomasi operasi bisnis. Menggabungkan keahlian di pengembangan bisnis, SDM, penjualan, manajemen proyek, IT, dan keuangan untuk menghadirkan konsultasi terintegrasi yang memberikan dampak nyata bagi organisasi.",
  ],
  coreStrengths: [
    "Business Development & Hubungan Klien",
    "Konsultasi Energi Terbarukan",
    "Transformasi IT & Digital",
    "Konsultasi SDM & Organisasi",
    "Sales & Project Management",
    "Solusi Keuangan Bisnis",
  ],
} as const;