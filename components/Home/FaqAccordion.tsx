"use client";

import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8d6bf] bg-white shadow-sm">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.question}
            className={index !== items.length - 1 ? "border-b border-[#efe0cc]" : ""}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-[#fff8f1]"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
            >
              <span className="text-sm font-bold text-slate-900 md:text-base">{faq.question}</span>
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dcc3a6] text-[#8a4f2b]">
                {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
              </span>
            </button>

            <div
              id={`faq-panel-${index}`}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-slate-700">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
