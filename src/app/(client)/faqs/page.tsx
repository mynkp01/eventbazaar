"use client";
import { PlusMinusIcon } from "@assets/index";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useState } from "react";
import { FAQs } from "src/app/global";

const FAQsPage = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex w-full flex-col items-start gap-8 px-14 py-10 md:px-20 lg:px-24">
        <p className="text-3xl font-medium text-black-50 sm:text-5xl">
          Frequently Asked Questions
        </p>

        <div className="rounded-[10px] border border-white-100 before:!bg-white-100">
          {FAQs.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === item._id}
              onChange={() =>
                setExpanded(expanded === item._id ? null : item._id)
              }
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
      </div>
    </div>
  );
};

export default FAQsPage;
