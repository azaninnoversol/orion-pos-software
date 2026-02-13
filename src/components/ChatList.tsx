import React from "react";
import Image from "next/image";
import Heading from "./Heading";
import { IMAGES } from "@/utils/resourses";
import { ChatListType } from "@/container/cashier-pages/inbox/inbox";

interface Props extends ChatListType {
  onClick?: (id: string) => void;
  bySelfActive: boolean;
  isActive: boolean;
  unreadCount: any;
}

function ChatList({ onClick, isActive, name, role, id, bySelfActive, unreadCount }: Props) {
  return (
    <button
      className={`
    w-full px-3 py-2 
    flex items-center justify-between 
    cursor-pointer transition
    ${isActive ? "bg-purple-900 dark:bg-gray-700 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
  `}
      onClick={() => onClick?.(id)}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src={IMAGES.UserImg}
          alt={name}
          width={60}
          height={60}
          className="
        rounded-full object-cover object-center
        w-10 h-10 
        sm:w-12 sm:h-12 
        md:w-14 md:h-14
      "
        />

        <div className="flex flex-col overflow-hidden">
          <Heading
            isLineShow
            className={`
          font-medium capitalize truncate
          text-sm sm:text-base
          ${isActive ? "text-white" : "dark:text-gray-200"}
        `}
          >
            {name} {bySelfActive && <span className="text-[10px] sm:text-xs">(YOU)</span>}
          </Heading>
        </div>
      </div>

      {unreadCount > 0 && (
        <span
          className="
        flex items-center justify-center
        min-w-[20px] min-h-[20px]
        px-1.5 sm:px-2 
        bg-red-500 text-white 
        rounded-full
        text-[10px] sm:text-xs font-semibold
      "
        >
          {unreadCount}
        </span>
      )}
    </button>
  );
}

export default React.memo(ChatList);
