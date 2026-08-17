"use client";

import { useState } from "react";
import { homeFaqs } from "@/lib/constants/faqs";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div id="faq">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-[100px]">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mb-4">
          FAQ
        </p>
        <h2 className="font-bebas text-[clamp(38px,4.4vw,58px)] leading-[1.02] tracking-[0.04em] text-forest mb-14 max-w-[820px]">
          Frequently asked questions
          <br />
          about never missing business calls.
        </h2>

        <div className="flex flex-col gap-3 max-w-[900px]">
          {homeFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`rounded-xl border transition-colors duration-200 ${
                  isOpen
                    ? "border-forest bg-parchment-dark"
                    : "border-stone bg-parchment-dark/60 hover:border-forest"
                }`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left text-[15px] md:text-[16px] font-semibold leading-[1.5] text-forest cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        isOpen
                          ? "border-forest bg-forest"
                          : "border-[rgba(28,69,50,0.25)] bg-parchment"
                      }`}
                    >
                      <svg
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                        className={`h-3 w-3 fill-none stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round] transition-transform duration-300 ${
                          isOpen ? "rotate-180 stroke-parchment" : "stroke-forest"
                        }`}
                      >
                        <path d="M2.5 5l4.5 4.5L11.5 5" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-answer-${index}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pr-6 md:pr-16 text-[14px] font-light leading-[1.75] text-mid">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
