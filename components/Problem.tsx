import { PhoneIcon, ClockIcon, MoonIcon, UsersIcon } from "./Icons";

const stats = [
  { num: "62%", label: "of small business calls go unanswered — only 1 in 3 reaches a live person" },
  { num: "2 min", label: "is all it takes — 60% of callers hang up if not answered within 2 minutes" },
  { num: "85%", label: "of callers who hit voicemail never call back — and 62% call a competitor instead" },
  { num: "$126K", label: "lost annually by the average small business due to missed calls alone" },
];

const pains = [
  {
    icon: <PhoneIcon />,
    title: "Calls go to voicemail",
    text: "High-intent leads call once. No answer means they're calling your competitor before your voicemail even finishes.",
  },
  {
    icon: <ClockIcon />,
    title: "You respond too late",
    text: "Prospects expect an answer in under 60 seconds. Most businesses respond in hours. The deal is already gone.",
  },
  {
    icon: <MoonIcon />,
    title: "After-hours is a dead zone",
    text: "90% of businesses have no system for leads outside office hours. Half your pipeline walks out the door every night.",
  },
  {
    icon: <UsersIcon />,
    title: "Hiring more staff isn't the answer",
    text: "More people means more cost, inconsistency, and training time. And they still won't work at 2am on a Sunday.",
  },
];

export default function Problem() {
  return (
    <div className="bg-parchment-dark" id="problem">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px]">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
          The problem
        </p>
        <h2 className="font-bebas text-[clamp(44px,5vw,64px)] leading-none tracking-[0.04em] text-forest mb-5">
          Your business is bleeding
          <br />
          revenue every day.
        </h2>
        <p className="text-[17px] text-mid leading-[1.75] font-light max-w-[520px]">
          Most business owners don't realise it. Every unanswered call is a lead
          that walked straight to your competitor — and never came back.
        </p>

        <div className="mt-16">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[72px]">
            {stats.map((s, i) => (
              <div
                key={i}
                className="p-6 bg-[rgba(255,255,255,0.3)] rounded-lg"
              >
                <div className="font-bebas text-[72px] text-forest tracking-[0.02em] leading-none mb-2">
                  {s.num}
                </div>
                <div className="text-[15px] text-mid font-light leading-[1.5]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Pain points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pains.map((p, i) => (
              <div
                key={i}
                className="flex gap-[18px] items-start p-6 bg-[rgba(255,255,255,0.3)] rounded-lg"
              >
                <div className="w-10 h-10 flex-shrink-0 bg-[rgba(28,69,50,0.08)] rounded-lg flex items-center justify-center mt-0.5">
                  {p.icon}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-obsidian mb-1.5">
                    {p.title}
                  </div>
                  <p className="text-[13px] text-mid leading-[1.65] font-light">
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
