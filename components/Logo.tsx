import { Link } from "@/i18n/navigation";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex min-w-0 shrink-0 items-center rounded-md text-lg font-extrabold tracking-[-0.045em] text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-xl"
      aria-label="Ary Wibowo — Home"
    >
      <span className="truncate">Ary Wibowo<span className="text-primary">.</span></span>
    </Link>
  );
}
