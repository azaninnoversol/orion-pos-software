export type KitchenButtonType = "all" | "pending" | "preparing" | "ready" | "completed";

export interface ButtonsType {
  text?: string;
  status?: KitchenButtonType;
}

export const buttonsType: ButtonsType[] = [
  {
    text: "All",
    status: "all",
  },
  {
    text: "Pending",
    status: "pending",
  },
  {
    text: "Preparing",
    status: "preparing",
  },
  {
    text: "Ready",
    status: "ready",
  },
  {
    text: "Completed",
    status: "completed",
  },
];
