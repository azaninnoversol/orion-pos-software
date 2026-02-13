// components
import { Plan } from "@/components/registerSteps/StepThree";

// types
import { ButtonItem } from "@/container/UserJourneyMap";

// library
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const strengths: string[] = [
  "Tailored specifically for restaurants and cafés - not a generic solution.",
  "User-friendly and intuitive interface for admin , staff and cashiers.",
  "Highly customizable (menu, payment methods, reports, etc.).",
  "Competitive pricing compared to global alternatives.",
  "Local technical support with fast response time.",
];

export const weakness: string[] = [
  "Brand trust is still developing compared to established global names.",
  "Limited third-party integrations (e.g., accounting, delivery apps).",
];

export const oppurtunities: string[] = [
  "High interest from small & medium businesses seeking simple, effective POS systems.",
  "Targeting emerging markets (MENA, Africa) where competition is weaker.",
  "Potential to integrate with delivery apps (e.g., Talabat, Mrsool).",
  "Room to add features like inventory tracking, return handling, or CRM.",
];

export const threats: string[] = [
  "Strong competition from major players like Foodics, Square, Toast, Loyverse.",
  "Price wars or aggressive discounts from larger competitors.",
  "Rapid tech changes may require continuous updates.",
  "Customer resistance to switching POS systems",
];

export const says: string[] = [
  "“I need to see performance across all my branches.”",
  "“Reports should be accurate and easy to compare.”",
  "“It's hard to manage staff permissions manually.”",
  "“The system must scale as we grow.”",
];

export const thinks: string[] = [
  "Believes central control is key to efficiency.",
  "Considers data- driven decisions essential for growth.",
  "Considers data- driven decisions essential for growth.",
  "Thinks consistency across branches builds the brand.",
];

export const does: string[] = [
  "Reviews real-time reports daily.",
  "Coordinates with branch managers regularly.",
  "Assigns permissions to staff by role.",
  "Analyzes customer trends to adjust menus.",
];

export const feels: string[] = [
  "Stressed when reports are delayed or inaccurate.",
  "Confident with centralized control.",
  "Pressured to keep operations consistent across branches.",
  "Satisfied when expansion runs smoothly.",
];

export const saysTwo: string[] = [
  "“I need a system that's easy to use for my staff.”",
  "“I don't want to waste time training new employees.”",
  "“I want to see real- time sales reports.”",
  "“It must help reduce human error and save time.”",
];

export const thinksTwo: string[] = [
  "Believes central control is key to efficiency.",
  "Considers data- driven decisions essential for growth.",
  "Considers data- driven decisions essential for growth.",
  "Thinks consistency across branches builds the brand.",
];

export const doesTwo: string[] = [
  "Reviews real-time reports daily.",
  "Coordinates with branch managers regularly.",
  "Assigns permissions to staff by role.",
  "Analyzes customer trends to adjust menus.",
];

export const feelsTwo: string[] = [
  "Stressed when reports are delayed or inaccurate.",
  "Confident with centralized control.",
  "Pressured to keep operations consistent across branches.",
  "Satisfied when expansion runs smoothly.",
];

export const saysThree: string[] = [
  "“I need to see performance across all my branches.”",
  "“Reports should be accurate and easy to compare.”",
  "“It's hard to manage staff permissions manually.”",
  "“The system must scale as we grow.”",
];

export const thinksThree: string[] = [
  "Believes central control is key to efficiency.",
  "Considers data- driven decisions essential for growth.",
  "Considers data- driven decisions essential for growth.",
  "Thinks consistency across branches builds the brand.",
];

export const doesThree: string[] = [
  "Reviews real-time reports daily.",
  "Coordinates with branch managers regularly.",
  "Assigns permissions to staff by role.",
  "Analyzes customer trends to adjust menus.",
];

export const feelsThree: string[] = [
  "Stressed when reports are delayed or inaccurate.",
  "Confident with centralized control.",
  "Pressured to keep operations consistent across branches.",
  "Satisfied when expansion runs smoothly.",
];

export const goals: string[] = [
  "Centralize data and operations across all branches.",
  "Access real-time performance insights for every location.",
  "Maintain consistency in menu, pricing, and customer experience.",
];

export const motivations: string[] = [
  "Expand the food chain into new regions.",
  "Strengthen the brand's market reputation.",
  "Make decisions based on accurate, real-time data.",
];

export const needs: string[] = [
  "A cloud-based POS with centralized control.",
  "Unified reporting dashboards covering all branches.",
  "Multi-user access with role-based permissions.",
];

export const frustrations: string[] = [
  "Difficult to track and compare branch performance with outdated tools.",
  "Reports are often delayed or inaccurate.",
  "High operational costs due to inefficient systems.",
];

export const goalsTwo: string[] = [
  "Speed up checkout and order processing.",
  "Track sales and inventory accurately.",
  "Update menus and prices easily.",
];

export const motivationsTwo: string[] = [
  "Build customer loyalty through great service.",
  "Grow the restaurant's reputation locally.",
  "Reduce stress from daily operations.",
];

export const needsTwo: string[] = ["Easy-to-use POS for staff training.", "Real-time sales tracking.", "Simple menu and pricing management."];

export const frustrationsTwo: string[] = [
  "Slow checkout frustrates customers.",
  "Manual processes lead to errors.",
  "Difficult to track staff performance with old tools.",
];

export const goalsThree: string[] = ["Provide fast checkout", "Update seasonal menus quickly.", "Track best-selling drinks and items"];

export const motivationsThree: string[] = [
  "Create a modern, hassle-free experience.",
  "Build customer loyalty with promotions.",
  "Keep the café brand fresh and relevant.",
];

export const needsThree: string[] = [
  "Flexible POS for quick menu edits.",
  "Simple interface for baristas and staff.",
  "Insights into top-selling products.",
];

export const frustrationsThree: string[] = [
  "Current POS is rigid for frequent updates.",
  "Long queues during peak hours.",
  "No customer insights to guide offers.",
];

export const btnSectionOne: ButtonItem[] = [
  { name: "Stage", purple: true },
  { name: "Awareness", purple: true },
  { name: "Onboarding", purple: true },
  { name: "Use", purple: true },
  { name: "Service", purple: true },
  { name: "Reflection", purple: true },
];

export const btnSectionTwo: ButtonItem[] = [
  { name: "User Action", purple: false },
  { name: "Searches for enterprise POS.", purple: false },
  { name: "Configures branches in POS.", purple: false },
  { name: "Monitors sales in all branches.", purple: false },
  { name: "Manages staff permissions.", purple: false },
  { name: "Prepares reports for decisions.", purple: false },
];

export const btnSectionThree: ButtonItem[] = [
  { name: "Touchpoints", purple: false },
  { name: "Competitor sites, Reviews.", purple: false },
  { name: "Cloud dashboard, Support.", purple: false },
  { name: "Real-time dashboard.", purple: false },
  { name: "Role management in system.", purple: false },
  { name: "Analytics dashboard,Export.", purple: false },
];

export const btnSectionFour: ButtonItem[] = [
  { name: "Pain Points", purple: false },
  { name: "Unsure which POS scales best.", purple: false },
  { name: "Complex setup for many outlets.", purple: false },
  { name: "Delayed or inaccurate reports.", purple: false },
  { name: "Tedious manual updates.", purple: false },
  { name: "Reports too complex.", purple: false },
];

export const btnSectionFive: ButtonItem[] = [
  { name: "Opportunities", purple: false },
  { name: "Highlight scalability in marketing.", purple: false },
  { name: "Offer branch templates & training.", purple: false },
  { name: "Provide live synced data.", purple: false },
  { name: "Role-based quick permissions.", purple: false },
  { name: "Easy export, clear charts.", purple: false },
];

export const twoBtnSectionTwo: ButtonItem[] = [
  { name: "User Action", purple: false },
  { name: "Searches for a POS that fits his restaurant.", purple: false },
  { name: "signs up and sets up the POS.", purple: false },
  { name: "Adds a new item with price.", purple: false },
  { name: "Processes orders during rush hours.", purple: false },
  { name: "Reviews daily sales report.", purple: false },
];

export const twoBtnSectionThree: ButtonItem[] = [
  { name: "Touchpoints", purple: false },
  { name: "Website, Demo videos, Sales rep.", purple: false },
  { name: "Setup wizard, Customer support.", purple: false },
  { name: "POS dashboard, Menu management.", purple: false },
  { name: "Checkout screen, Kitchen display.", purple: false },
  { name: "Analytics dashboard, Email report.", purple: false },
];

export const twoBtnSectionFour: ButtonItem[] = [
  { name: "Pain Points", purple: false },
  { name: "Confused by too many options.", purple: false },
  { name: "Time-consuming setup, learning curve.", purple: false },
  { name: "Struggles if the interface is complex.", purple: false },
  { name: "Long queues if POS lags.", purple: false },
  { name: "Hard to interpret data.", purple: false },
];

export const twoBtnSectionFive: ButtonItem[] = [
  { name: "Opportunities", purple: false },
  { name: "Clear value proposition + free demo.", purple: false },
  { name: "Provide easy onboarding + 24/7 support.", purple: false },
  { name: "Intuitive Ul with quick add/edit.", purple: false },
  { name: "Fast checkout + offline backup.", purple: false },
  { name: "Simple, visual analytics.", purple: false },
];

export const threeBtnSectionTwo: ButtonItem[] = [
  { name: "User Action", purple: false },
  { name: "Looks for affordable POS for small café.", purple: false },
  { name: "Installs POS, sets up small menu.", purple: false },
  { name: "Updates menu", purple: false },
  { name: "Processes orders quickly at counter.", purple: false },
  { name: "Tracks daily sales.", purple: false },
];

export const threeBtnSectionThree: ButtonItem[] = [
  { name: "Touchpoints", purple: false },
  { name: "Social media, Ads, Website.", purple: false },
  { name: "Mobile/tablet app.", purple: false },
  { name: "POS menu editor.", purple: false },
  { name: "Checkout screen.", purple: false },
  { name: "Dashboard, Mobile Web.", purple: false },
];

export const threeBtnSectionFour: ButtonItem[] = [
  { name: "Pain Points", purple: false },
  { name: "Budget constraints.", purple: false },
  { name: "Limited tech knowledge.", purple: false },
  { name: "Time wasted editing manually.", purple: false },
  { name: "slow checkout frustrates customers.", purple: false },
  { name: "Hard to analyze trends.", purple: false },
];

export const threeBtnSectionFive: ButtonItem[] = [
  { name: "Opportunities", purple: false },
  { name: "Emphasize affordable pricing.", purple: false },
  { name: "Provide step-by-step guide.", purple: false },
  { name: "One-click menu updates.", purple: false },
  { name: "Speed-optimized checkout.", purple: false },
  { name: "Simple mobile-friendly analytics.", purple: false },
];

export const plans: Plan[] = [
  {
    title: "Silver",
    price: "$9 / mo",
    features: [
      "Access to basic tools",
      "Email customer support",
      "5GB cloud storage",
      "Single user access",
      "Weekly usage reports",
      "Community forum access",
      "Standard data security",
      "Basic analytics dashboard",
      "Limited API access",
      "1 active project",
      "Standard update cycle",
      "Cancel anytime",
    ],
    gradient: "bg-gradient-to-br from-gray-200 from-50% to-white to-90%",
  },
  {
    title: "Gold",
    price: "$19 / mo",
    features: [
      "All Silver features",
      "Priority email & chat support",
      "50GB cloud storage",
      "Up to 3 team members",
      "Daily performance insights",
      "Early access to new tools",
      "Advanced analytics dashboard",
      "Custom integrations",
      "Enhanced API access",
      "Up to 5 active projects",
      "Faster update cycle",
      "Cancel or upgrade anytime",
    ],
    gradient: "bg-gradient-to-br from-purple-500 from-50% to-white to-90%",
    popular: true,
  },
  {
    title: "Platinum",
    price: "$29 / mo",
    features: [
      "All Gold features",
      "24/7 dedicated support",
      "1TB secure cloud storage",
      "Unlimited team members",
      "AI-powered reports",
      "Custom branding options",
      "Full API + developer tools",
      "Unlimited project slots",
      "Advanced access controls",
      "Dedicated account manager",
      "Priority feature requests",
      "Exclusive beta features",
    ],
    gradient: "bg-gradient-to-br from-yellow-400 from-50% to-white to-90%",
  },
];

export const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
};

export function formatText(str: string = ""): string {
  if (!str) return "";

  const spaced = str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([A-Z][a-z]+)([A-Z][a-z]+)/g, "$1 $2")
    .replace(/_/g, " ");

  return spaced
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const formatTime = (time?: string | number) => {
  if (!time) return "-";

  let date: Date;

  if (typeof time === "number") {
    date = new Date(time);
  } else {
    const [hour, minute] = time.split(":").map(Number);
    date = new Date();
    date.setHours(hour, minute, 0, 0);
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  return `${h12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1_00_00_000) return (num / 1_00_00_000).toFixed(2).replace(/\.00$/, "") + "Cr"; // Crore
  if (num >= 1_00_000) return (num / 1_00_000).toFixed(2).replace(/\.00$/, "") + "L"; // Lakh
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.00$/, "") + "K";
  return num.toString();
};

export const formatDiscountEndDate = (endDate: any) => {
  if (!endDate) return null;
  const date = new Date(endDate);

  const options = { day: "2-digit", month: "short", year: "numeric", weekday: "long" };
  const formattedDate = date.toLocaleDateString("en-GB", options as any);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} - ${time}`;
};
