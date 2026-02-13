import React from "react";

// icons
import { MessagesSquare } from "lucide-react";

const ChatNotSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <MessagesSquare className="stroke-[#4148c7] max-[1362px]:w-[25vw] max-[1362px]:h-[25vw] w-90 h-90" />
      <p className="text-gray-400 text-lg text-center mt-4 max-[900px]:text-sm">Your inbox is ready. Select a chat to continue.</p>
    </div>
  );
};

export default React.memo(ChatNotSelected);
