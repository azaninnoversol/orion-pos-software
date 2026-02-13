//page + sections
import Analysis from "@/container/Analysis";
import EmpthyMap from "@/container/EmpthyMap";
import Hero from "@/container/Hero";
import Overview from "@/container/Overview";
import Problem from "@/container/Problem";
import PersonaPage from "@/container/PersonaPage";
import UserJourneyMap from "@/container/UserJourneyMap";
import DesignSystem from "@/container/DesignSystem";
import WireFrame from "@/container/WireFrame";
import DesignUI from "@/container/DesignUI";
import DarkMode from "@/container/DarkMode";
import Contact from "@/container/Contact";

//next
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - My App",
  description: "Welcome to the Home page of My App!",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Overview />
      <Problem />
      <Analysis />
      <EmpthyMap />
      <PersonaPage />
      <UserJourneyMap />
      <DesignSystem />
      <WireFrame />
      <DesignUI />
      <Contact />
      <DarkMode />
    </>
  );
}
