import Image from "next/image";

export default function Testimonial() {
  return (
    <div>
      <div className="max-w-[1120px] mx-auto py-10 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[1100px] md:min-h-[700px] overflow-hidden rounded-2xl">
          {/* Image side */}
          <div className="relative overflow-hidden bg-obsidian min-h-[1000px] md:min-h-[600px]">
            <Image
              src="/photo.jpg"
              alt="Business professional"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover saturate-[0.7] brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(28,69,50,0.4)] to-transparent" />
          </div>

          {/* Content side */}
          <div className="bg-forest px-14 py-[72px] flex flex-col justify-center min-h-[500px] md:min-h-[600px]">
            <div className="font-bebas text-[80px] text-[rgba(245,240,232,0.1)] leading-[0.8] mb-5">
              &ldquo;
            </div>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <p className="text-[20px] text-parchment leading-[1.6] font-light italic mb-9">
              We were losing 3–4 qualified leads every week to voicemail. Skadi
              solved that in the first 48 hours. Booking rate went up 40% in
              month one.
            </p>
            <div>
              <div className="text-[15px] font-semibold text-parchment">
                Marcus Reid
              </div>
              <div className="text-[12px] text-[rgba(245,240,232,0.45)] font-light mt-1">
                Principal Broker, Reid &amp; Associates Realty
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
