"use client";

import { PlusMinusIcon } from "@assets/index";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useState } from "react";

interface FAQ {
  _id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="rounded-[10px] border border-white-100 before:!bg-white-100">
      {faqs.map((item, index) => (
        <Accordion
          key={index}
          expanded={expanded === item._id}
          onChange={() => setExpanded(expanded === item._id ? null : item._id)}
        >
          <AccordionSummary>
            {item.question}
            <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0.5">
              <PlusMinusIcon isFocused={expanded === item?._id} />
            </div>
          </AccordionSummary>

          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
