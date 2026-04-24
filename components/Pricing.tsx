const plans = [
  {
    tier: "Starter",
    price: "$699",
    period: "Setup + $349 / month",
    features: [
      "Up to 500 calls / month",
      "Lead qualification",
      "Calendar booking",
      "Custom voice & tone",
      "Email summaries",
    ],
    featured: false,
    btnLabel: "Get started",
  },
  {
    tier: "Growth — Most Popular",
    price: "$999",
    period: "Setup + $599 / month",
    features: [
      "Unlimited calls",
      "Advanced lead scoring",
      "CRM integration",
      "Multi-language support",
      "Priority support",
      "Monthly performance report",
    ],
    featured: true,
    btnLabel: "Get started",
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "Tailored to your business",
    features: [
      "Multiple locations",
      "Custom integrations",
      "Dedicated account manager",
      "White-label option",
      "SLA guaranteed uptime",
    ],
    featured: false,
    btnLabel: "Talk to us",
  },
];

export default function Pricing() {
  return (
    <div className="bg-parchment-dark" id="pricing">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px]">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
          Simple pricing
        </p>
        <h2 className="font-bebas text-[clamp(44px,5vw,64px)] leading-none tracking-[0.04em] text-forest mb-14">
          One Skadi.
          <br />
          Every call covered.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`rounded-xl p-9 border transition-colors duration-200 ${
                plan.featured
                  ? "bg-forest border-forest"
                  : "bg-parchment border-stone hover:border-forest"
              }`}
            >
              <p
                className={`text-[10px] font-semibold tracking-[0.16em] uppercase mb-5 ${
                  plan.featured ? "text-[rgba(245,240,232,0.4)]" : "text-mid"
                }`}
              >
                {plan.tier}
              </p>
              <div
                className={`font-bebas leading-none mb-1 ${
                  plan.featured ? "text-parchment" : "text-forest"
                } ${plan.price === "Custom" ? "text-[36px] pt-2" : "text-[56px]"}`}
              >
                {plan.price}
              </div>
              <p
                className={`text-[13px] font-light mb-7 ${
                  plan.featured ? "text-[rgba(245,240,232,0.4)]" : "text-mid"
                }`}
              >
                {plan.period}
              </p>

              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 items-start text-[13px] font-light">
                    {/* Checkmark icon */}
                    <svg
                      className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round] ${
                        plan.featured ? "stroke-gold" : "stroke-forest"
                      }`}
                      viewBox="0 0 14 14"
                    >
                      <path d="M2 7l3.5 3.5L12 4" />
                    </svg>
                    <span className={plan.featured ? "text-[rgba(245,240,232,0.65)]" : "text-mid"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-[13px] rounded-md text-[13px] font-medium tracking-[0.04em] transition-all duration-150 cursor-pointer border ${
                  plan.featured
                    ? "bg-parchment text-forest border-parchment hover:bg-parchment/90"
                    : "bg-transparent text-forest border-stone hover:bg-forest hover:text-parchment hover:border-forest"
                }`}
              >
                {plan.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
