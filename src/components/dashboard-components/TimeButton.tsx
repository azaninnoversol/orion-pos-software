import React, { useEffect, useState } from "react";

//components
import { Button } from "@/components/ui/button";

//icons
import { Clock } from "lucide-react";

const TimeButton = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // 0 -> 12
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;

      setTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Button className="rounded-sm !bg-transparent !text-gray-600">
      <Clock className="mr-1" />
      <span>{time}</span>
    </Button>
  );
};

export default React.memo(TimeButton);
