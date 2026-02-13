"use client";
import React from "react";

//components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type AccordionItemType = {
  id: string;
  title: string;
  content: string;
};

type SingleAccordionProps = {
  type: "single";
  collapsible?: boolean;
  items: AccordionItemType[];
  defaultValue?: string;
};

type MultipleAccordionProps = {
  type: "multiple";
  items: AccordionItemType[];
  defaultValue?: string[];
};

type Props = SingleAccordionProps | MultipleAccordionProps;

function CustomAccordion(props: Props) {
  return (
    <Accordion {...props} className="w-full bg-card px-4 rounded-lg">
      {props.items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="outline-none! no-underline! rounded-none">{item.title}</AccordionTrigger>
          <AccordionContent className="pt-2! border-t dark:border-t-white border-t-black">{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default React.memo(CustomAccordion);
