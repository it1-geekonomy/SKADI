import Link from "next/link";

export default function CTA() {
  return (
    <div className="relative min-h-[480px] flex items-center overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-obsidian" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(245,240,232,1) 40px,rgba(245,240,232,1) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(245,240,232,1) 40px,rgba(245,240,232,1) 41px)",
        }}
      />

      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px] w-full relative z-10 text-center">
        <h2 className="font-bebas text-[clamp(56px,8vw,104px)] tracking-[0.04em] leading-[0.95] text-parchment mb-5">
          Never miss
          <br />
          a call{" "}
          <span className="text-gold">again.</span>
        </h2>
        <p className="text-[17px] text-[rgba(245,240,232,0.45)] mb-11 font-light leading-[1.7] max-w-[440px] mx-auto">
          Setup in 48 hours. No tech team needed. Cancel anytime.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link
            href="#"
            className="px-9 py-[15px] bg-parchment text-forest rounded text-[14px] font-semibold no-underline tracking-[0.04em] inline-block transition-opacity duration-200 hover:opacity-90"
          >
            Book Your Free Demo
          </Link>
          <Link
            href="#roi"
            className="px-9 py-[15px] bg-transparent text-parchment border border-[rgba(245,240,232,0.3)] rounded text-[14px] font-medium no-underline tracking-[0.04em] inline-block transition-colors duration-200 hover:border-parchment"
          >
            Calculate Your ROI
          </Link>
        </div>
      </div>
    </div>
  );
}
