import { PhoneIcon, ClockIcon, MoonIcon, CalendarIcon } from "./Icons";

const fixes = [
  {
    icon: <PhoneIcon />,
    problem: "Calls going unanswered and straight to voicemail",
    solutionTitle: "Every call answered in under 3 seconds",
    solutionBody: "Skadi picks up every inbound call instantly. No voicemail, no wait, no missed opportunity — ever.",
  },
  {
    icon: <ClockIcon />,
    problem: "Slow follow-up losing leads before you even know about them",
    solutionTitle: "Instant response, every time, from the first ring",
    solutionBody: "Skadi qualifies the caller in real time and notifies you immediately when a hot lead is on the line.",
  },
  {
    icon: <MoonIcon />,
    problem: "After-hours leads hitting a dead end with no coverage",
    solutionTitle: "24/7 coverage — nights, weekends, holidays",
    solutionBody: "Skadi never sleeps. Every after-hours call is answered, qualified, and logged — ready for you in the morning.",
  },
  {
    icon: <CalendarIcon />,
    problem: "Qualified leads with no system to convert them into bookings",
    solutionTitle: "Appointments booked directly into your calendar",
    solutionBody: "Skadi syncs with your calendar and converts qualified calls into confirmed appointments — no back and forth.",
  },
];

const timeline = [
  {
    num: "01",
    title: "We onboard Skadi to your business",
    text: "We train Skadi on your tone, FAQs, services, and objections. She learns your world completely in 48 hours — no tech team needed on your end.",
  },
  {
    num: "02",
    title: "Calls come in — Skadi picks up",
    text: "Your number stays exactly the same. Skadi picks up every call instantly — no voicemail, no wait, no friction for your callers.",
  },
  {
    num: "03",
    title: "She qualifies and routes every lead",
    text: "Skadi asks the right questions, scores intent in real time, and routes hot leads directly to you. Cold leads get nurtured automatically.",
  },
  {
    num: "04",
    title: "Appointments land in your calendar",
    text: "Skadi syncs with your calendar and converts qualified calls into confirmed bookings — before you've even looked at your phone.",
  },
];

export default function HowSkadiFixesIt() {
  return (
    <div id="fix">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px]">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
          How Skadi fixes it
        </p>
        <h2 className="font-bebas text-[clamp(44px,5vw,64px)] leading-none tracking-[0.04em] text-forest mb-5">
          Every problem above.
          <br />
          Solved — automatically.
        </h2>
        <p className="text-[17px] text-mid leading-[1.75] font-light max-w-[520px] mb-14">
          Skadi steps in exactly where your business is leaking revenue and seals
          every gap, 24 hours a day.
        </p>

        {/* Fix cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fixes.map((fix, i) => (
            <div
              key={i}
              className="group bg-parchment border border-stone rounded-xl px-8 py-9 transition-all duration-200 hover:border-forest hover:-translate-y-0.5 relative overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-forest opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Icon */}
              <div className="w-9 h-9 bg-[rgba(28,69,50,0.08)] rounded-lg flex items-center justify-center mb-5">
                {fix.icon}
              </div>

              {/* Problem tag */}
              <span className="inline-block text-[10px] font-semibold tracking-[0.12em] uppercase text-[#C0392B] bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.15)] px-2.5 py-[3px] rounded-full mb-2.5">
                Problem
              </span>
              <p className="text-[13px] text-mid font-light mb-5 pb-5 border-b border-stone leading-[1.5]">
                {fix.problem}
              </p>

              {/* Solution tag */}
              <span className="inline-block text-[10px] font-semibold tracking-[0.12em] uppercase text-forest bg-[rgba(28,69,50,0.08)] border border-[rgba(28,69,50,0.15)] px-2.5 py-[3px] rounded-full mb-2.5">
                Skadi fixes it
              </span>
              <p className="text-[14px] font-semibold text-obsidian leading-[1.5] mb-2.5">
                {fix.solutionTitle}
              </p>
              <p className="text-[13px] text-mid font-light leading-[1.65]">
                {fix.solutionBody}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-20">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
            Getting started
          </p>
          <h2 className="font-bebas text-[clamp(44px,5vw,64px)] leading-none tracking-[0.04em] text-forest mb-2">
            Live in 48 hours.
            <br />
            Running forever.
          </h2>
        </div>

        <div className="flex flex-col mt-12 max-w-[700px]">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-8 items-start pb-10 relative">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-forest flex items-center justify-center font-bebas text-[18px] text-parchment tracking-[0.04em] flex-shrink-0">
                  {item.num}
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-px flex-1 bg-stone mt-2 min-h-[40px]" />
                )}
              </div>
              <div className="pt-2.5">
                <div className="text-[17px] font-semibold text-obsidian mb-2">
                  {item.title}
                </div>
                <p className="text-[14px] text-mid leading-[1.7] font-light">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
