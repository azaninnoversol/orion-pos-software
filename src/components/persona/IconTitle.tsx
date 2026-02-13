import React from "react";

export interface IconTitleProps {
  icon: React.ReactNode;
  label: string;
  ans: string;
}

const IconTitle: React.FC<IconTitleProps> = ({ icon, label, ans }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-[#ECECFA] p-2 rounded-full w-[42px] h-[42px] flex items-center justify-center">
        {icon}
      </div>
      <p className="text-gray-700">
        {label}: <strong>{ans}</strong>
      </p>
    </div>
  );
};

export default React.memo(IconTitle);
