import Image from "next/image";

const industries = [
  { label: "Real Estate", src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop" },
  { label: "Clinics & Healthcare", src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop" },
  { label: "Law Firms", src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80&auto=format&fit=crop" },
  { label: "Local Services", src: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80&auto=format&fit=crop" },
  { label: "Automotive", src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&auto=format&fit=crop" },
  { label: "Hospitality", src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop" },
  { label: "Education", src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80&auto=format&fit=crop" },
  { label: "Consulting", src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop" },
];

export default function Industries() {
  return (
    <div>
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px]">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
          Who Skadi works for
        </p>
        <h2 className="font-bebas text-[clamp(44px,5vw,64px)] leading-none tracking-[0.04em] text-forest mb-14">
          If your business takes calls,
          <br />
          Skadi works for you.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {industries.map((ind) => (
            <div
              key={ind.label}
              className="group rounded-xl overflow-hidden relative h-[200px]"
            >
              <Image
                src={ind.src}
                alt={ind.label}
                fill
                className="object-cover saturate-[0.75] brightness-[0.8] transition-all duration-400 group-hover:scale-105 group-hover:saturate-90 group-hover:brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,69,50,0.8)] to-transparent" />
              <div className="absolute bottom-4 left-4 text-[14px] font-semibold text-parchment tracking-[0.02em]">
                {ind.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
