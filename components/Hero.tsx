import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen overflow-hidden relative">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 pt-[100px] pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[60px]">
      {/* Left */}
      <div className="pt-10">
        {/* Badge */}
        <div className="animate-fade-up-1 inline-flex items-center gap-2 px-3.5 py-[7px] bg-[rgba(28,69,50,0.08)] border border-[rgba(28,69,50,0.18)] rounded-full text-[11px] font-medium text-forest tracking-[0.1em] uppercase mb-9">
          <div className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse-dot" />
          AI Voice Agent · Live 24/7
        </div>

        {/* Wordmark */}
        <div className="animate-fade-up-2 mb-7">
          <span className="font-bebas text-[clamp(72px,10vw,120px)] text-forest tracking-[0.08em] leading-[0.9] block">
            SKADI
          </span>
          <span className="text-[11px] font-normal tracking-[0.26em] text-mid uppercase mt-2.5 block">
            Always on &nbsp;·&nbsp; Always closing.
          </span>
        </div>

        {/* Description */}
        <p className="animate-fade-up-3 text-[18px] text-mid leading-[1.75] font-light mb-11 max-w-[480px]">
          An AI voice agent that picks up every call, qualifies every lead, and
          books every appointment — 24 hours a day, 7 days a week.
        </p>

        {/* Actions */}
        <div className="animate-fade-up-4 flex gap-3 flex-wrap">
          <Link
            href="#"
            className="px-8 py-3.5 bg-forest text-parchment rounded text-[14px] font-medium tracking-[0.04em] no-underline transition-all duration-200 hover:bg-canopy hover:-translate-y-px"
          >
            Get Started Free
          </Link>
          <Link
            href="#problem"
            className="px-8 py-3.5 bg-transparent text-forest border border-[1.5px] border-forest rounded text-[14px] font-medium tracking-[0.04em] no-underline transition-all duration-200 hover:bg-forest hover:text-parchment"
          >
            See the Problem
          </Link>
        </div>
      </div>

      {/* Mobile Image */}
      <div className="md:hidden relative h-[50vh] mt-12 animate-fade-in-1">
        <div className="w-full h-full rounded-t-[16px] overflow-hidden relative bg-forest">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop"
            alt="Professional on phone call"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,69,50,0.5)] via-[rgba(28,69,50,0.1)] to-transparent" />
        </div>
        
        {/* Mobile float card */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-parchment border border-stone rounded-xl px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] max-w-[280px] w-[calc(100%-2rem)]">
          <div className="text-[9px] font-semibold tracking-[0.14em] uppercase text-light-mid mb-1">
            This month
          </div>
          <div className="font-bebas text-[28px] text-forest tracking-[0.04em] leading-none">
            247
          </div>
          <div className="text-[11px] text-mid font-light mt-0.5">
            calls answered by Skadi
          </div>
        </div>
      </div>

      {/* Desktop Image */}
      <div className="hidden md:flex animate-fade-in-1 relative h-screen items-center">
        <div className="w-full h-[80vh] rounded-t-[16px] overflow-hidden relative bg-forest">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop"
            alt="Professional on phone call"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,69,50,0.5)] via-[rgba(28,69,50,0.1)] to-transparent" />
        </div>

        {/* Float card */}
        <div className="absolute bottom-[60px] -left-10 bg-parchment border border-stone rounded-xl px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] min-w-[220px]">
          <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-light-mid mb-2">
            This month
          </div>
          <div className="font-bebas text-[36px] text-forest tracking-[0.04em] leading-none">
            247
          </div>
          <div className="text-[12px] text-mid font-light mt-1">
            calls answered by Skadi
          </div>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
}
