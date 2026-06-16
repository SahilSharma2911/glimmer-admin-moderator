import Image from "next/image";
import { ShieldIcon } from "@/lib/icons";

/**
 * The left marketing panel of the auth split-screen.
 * Purely presentational; rendered only on large screens.
 */
export function AuthBrandPanel({ className = "" }: { className?: string }) {
  return (
    <aside
      className={
        "relative flex flex-col justify-between overflow-hidden p-10 text-white " +
        "bg-[linear-gradient(155deg,#2A1C6B_0%,#4B2D9E_50%,#7C5CF0_100%)] " +
        className
      }
    >
      {/* soft glow accents */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

      {/* logo */}
      <div className="relative flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="Glimmers logo"
          width={36}
          height={36}
          priority
        />
        <span className="text-2xl font-semibold tracking-tight">Glimmers</span>
      </div>

      {/* headline */}
      <div className="relative max-w-md">
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight">
          A safer world
          <br />
          for every child.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-white/70">
          The Glimmers safety platform — review, protect, and empower the
          children in your community.
        </p>
      </div>

      {/* footer trust mark */}
      <div className="relative flex items-center gap-2 text-sm text-white/70">
        <ShieldIcon size={18} className="text-white/80" />
        <span>Trusted by communities. Built for safety.</span>
      </div>
    </aside>
  );
}
