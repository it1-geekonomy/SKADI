import { PhoneIcon, StarIcon, CalendarIcon, RadioIcon } from "./Icons";

const features = [
  {
    icon: <PhoneIcon />,
    title: "Answers every call",
    text: "No voicemail. No wait. Skadi picks up instantly and handles the entire conversation from hello to booked.",
  },
  {
    icon: <StarIcon />,
    title: "Qualifies leads live",
    text: "Smart questions, real-time intent scoring. Only the leads worth your time get escalated to you.",
  },
  {
    icon: <CalendarIcon />,
    title: "Books appointments",
    text: "Syncs with your calendar. Converts calls to confirmed bookings — zero back and forth.",
  },
  {
    icon: <RadioIcon />,
    title: "Custom to your business",
    text: "Trained on your tone, FAQs, and industry. Skadi sounds like she's been on your team for years.",
  },
];

const callLog = [
  {
    name: "James R. — Real Estate Inquiry",
    time: "2 min ago",
    status: "booked",
    statusLabel: "✓ Appointment booked",
    note: "Viewing scheduled Thursday 3PM. Budget confirmed. High intent.",
  },
  {
    name: "Sarah M. — Clinic Booking",
    time: "14 min ago",
    status: "qualified",
    statusLabel: "→ Lead qualified",
    note: "Follow-up requested. Transferred to calendar for Friday AM.",
  },
  {
    name: "Arjun T. — Service Quote",
    time: "38 min ago",
    status: "booked",
    statusLabel: "✓ Appointment booked",
    note: "Quote call booked Friday AM. Third call this week — warm lead.",
  },
];

export default function Features() {
  return (
    <div className="bg-parchment-dark" id="features">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px]">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
          What Skadi does
        </p>
        <h2 className="font-bebas text-[clamp(44px,5vw,64px)] leading-none tracking-[0.04em] text-forest mb-16">
          Everything a receptionist does.
          <br />
          Nothing they can&apos;t.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Feature list */}
          <div className="flex flex-col">
            {features.map((f, i) => (
              <div
                key={i}
                className={`flex gap-5 items-start py-7 border-b border-stone ${i === 0 ? "pt-0" : ""} ${i === features.length - 1 ? "border-b-0" : ""}`}
              >
                <div className="w-10 h-10 flex-shrink-0 bg-[rgba(28,69,50,0.08)] rounded-lg flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-obsidian mb-1.5">
                    {f.title}
                  </div>
                  <p className="text-[13px] text-mid leading-[1.65] font-light">
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual panel */}
          <div className="bg-forest rounded-2xl p-9 min-h-[480px] flex flex-col gap-3.5 relative overflow-hidden">
            {/* Radial glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[radial-gradient(circle,rgba(183,149,106,0.2)_0%,transparent_70%)]" />

            <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[rgba(245,240,232,0.3)] mb-1">
              Live call log
            </div>

            {callLog.map((call, i) => (
              <div
                key={i}
                className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-[18px]"
              >
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-[13px] font-medium text-white">{call.name}</span>
                  <span className="text-[11px] text-[rgba(255,255,255,0.35)]">{call.time}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-[3px] rounded-full font-medium border ${
                    call.status === "booked"
                      ? "bg-[rgba(183,149,106,0.25)] text-[#D4B48A] border-[rgba(183,149,106,0.3)]"
                      : "bg-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.6)] border-[rgba(245,240,232,0.15)]"
                  }`}
                >
                  {call.statusLabel}
                </span>
                <p className="text-[12px] text-[rgba(255,255,255,0.4)] font-light mt-2 leading-[1.5]">
                  {call.note}
                </p>
              </div>
            ))}

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <div className="font-bebas text-[16px] text-[rgba(255,255,255,0.2)] tracking-[0.12em]">
                SKADI
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.35)]">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot" />
                Always on
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
