import React, { useEffect, useMemo, useRef, useState } from "react";

// component
import CustomModal from "../CustomModal";
import Heading from "../Heading";
import CustomTooltip from "../CustomTooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// next and icons and images
import Image from "next/image";
import { Check, CheckCheck, CircleMinus, CircleX, Cog, EllipsisVertical, LoaderCircle, Search, Send, Trash2 } from "lucide-react";
import { IMAGES } from "@/utils/resourses";

//types and utils
import { ChatListType, getChatId } from "@/container/cashier-pages/inbox/inbox";

interface ChatData {
  chatData: ChatListType;
  onClick?: (id: string) => void;
  onCloseChat?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  messages?: any[];
  currentUser?: any;
  sending?: boolean;
  messageLoading?: boolean;
  typingUsers?: any;
  userStatus?: any;
  valueFindMsg?: string;
  onChangeFindMsg?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFindMsgSubmit?: (e: React.FormEvent) => void;
  deleteMsgHandler?: () => void;
  deleteSelectedMessages?: () => void;
  setDeleteMode?: React.Dispatch<React.SetStateAction<boolean>>;
  deleteMode?: boolean;
  selectedMsgs?: string[];
  setSelectedMsgs?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedChatId?: string;
  setSelectedChatId?: React.Dispatch<React.SetStateAction<string>>;
}

const SelectChatHeader = ({
  chatData,
  onCloseChat,
  typingUsers,
  userStatus,
  currentUser,
  valueFindMsg,
  onChangeFindMsg,
  deleteMsgHandler,
  setDeleteMode,
}: ChatData) => {
  const getStatusText = () => {
    if (!chatData || !currentUser) return "";
    let chatId = "_" + chatData.id;
    const chatIdGenerated = getChatId(currentUser.id, chatData.id);
    const chatUserStatus = userStatus?.[chatId];
    const typing = typingUsers?.[chatIdGenerated]?.length > 0;
    if (typing) return "typing...";
    if (chatUserStatus?.online) return "Online";
    if (chatUserStatus?.lastSeen) return `${new Date(chatUserStatus.lastSeen).toLocaleString()}`;
    return "";
  };

  return (
    <header className="dark:bg-[#1d1d27] bg-white w-full p-3 px-3 flex items-center gap-3 justify-between">
      <div className="flex gap-2.5 items-center">
        <div>
          <Image
            src={chatData?.image || IMAGES.UserImg}
            alt={chatData?.id}
            width={100}
            height={100}
            className="rounded-full w-14 h-14 object-cover object-center max-[361px]:w-10 max-[361px]:h-10"
          />
        </div>

        <div className="flex flex-col items-start gap-1">
          <Heading
            isLineShow={true}
            className="flex flex-row gap-2 items-baseline dark:text-gray-200 text-base font-medium capitalize max-[361px]:text-[14px]"
          >
            {chatData?.name}
            <p className={`rounded-full text-white bg-[#3238a1] px-2 py-1 text-sm max-[361px]:text-[12px]`}>{chatData?.role}</p>
          </Heading>
          <span className="text-[12px] text-green-400 max-[361px]:text-[10px]">{getStatusText()}</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <DropdownMenu>
          <CustomTooltip title="Filter Message">
            <DropdownMenuTrigger asChild>
              <Search className="cursor-pointer text-black dark:text-white" />
            </DropdownMenuTrigger>
          </CustomTooltip>

          <DropdownMenuContent align="end" className="w-60 p-0 bg-gray-900 text-white">
            <div className="py-2 px-3 font-semibold text-sm bg-gray-800 sticky top-0 flex items-center gap-2">
              <Search size={16} />
              Find Message
            </div>

            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-2 top-3" size={16} color="#aaa" />
                <Input
                  placeholder="Find Messages"
                  className="pl-8 font-medium text-[#ddd] rounded-md border h-[38px] dark:bg-[#1d1d27] dark:text-white"
                  onChange={onChangeFindMsg}
                  value={valueFindMsg}
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <CustomTooltip title="More Options">
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="cursor-pointer text-black dark:text-white" />
            </DropdownMenuTrigger>
          </CustomTooltip>

          <DropdownMenuContent align="end" className="w-48 max-h-96 overflow-y-auto p-0">
            <h3 className="py-2 sticky top-0 font-semibold text-sm bg-gray-800 z-10 text-white flex items-center gap-1 pl-2">
              <Cog size={18} />
              Options
            </h3>

            <DropdownMenuItem className="cursor-pointer" onClick={deleteMsgHandler}>
              <CircleMinus />
              Clear Chat
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer" onClick={onCloseChat}>
              <CircleX size={18} />
              Close Chat
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer" onClick={() => setDeleteMode?.(true)}>
              <Trash2 size={18} />
              Delete Messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const SelectedChatBox = ({
  chatData,
  onCloseChat,
  value,
  onChange,
  onSubmit,
  deleteMsgHandler,
  messages,
  currentUser,
  sending,
  messageLoading,
  typingUsers,
  userStatus,
  deleteSelectedMessages,
  setDeleteMode,
  deleteMode,
  selectedMsgs,
  setSelectedMsgs,
  selectedChatId,
  setSelectedChatId,
}: ChatData) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [findMsg, setFindMsg] = useState<string>("");

  const chatIdGenerated = getChatId(currentUser.id, chatData.id);
  const typing = typingUsers?.[chatIdGenerated]?.length > 0;

  const onChangeFindMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFindMsg(e.target.value);
  };

  const filterMessages = useMemo(() => {
    return messages?.filter((msg) => !msg.deletedBy?.includes(currentUser?.id || "") && msg.text.toLowerCase().includes(findMsg.toLowerCase()));
  }, [findMsg, messages, currentUser?.id]);

  useEffect(() => {
    if (selectedChatId) {
      setFindMsg("");
    }
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative h-full w-full min-h-[87vh]">
      <SelectChatHeader
        chatData={chatData}
        onCloseChat={onCloseChat}
        typingUsers={typingUsers}
        userStatus={userStatus}
        currentUser={currentUser}
        valueFindMsg={findMsg}
        onChangeFindMsg={onChangeFindMsg}
        deleteMsgHandler={deleteMsgHandler}
        setDeleteMode={setDeleteMode}
      />

      <div className="absolute top-[70px] bottom-[50px] left-0 right-0 px-3 py-2 overflow-y-auto space-y-2 mt-2 mx-2">
        {filterMessages?.length === 0 && !messageLoading && (
          <div className="flex items-center justify-center min-h-[80%] text-gray-100 text-lg max-sm:text-[3.5vw] whitespace-nowrap">
            No messages yet. Start the conversation!
          </div>
        )}

        {messageLoading ? (
          <div className="flex items-center justify-center h-full py-5">
            <LoaderCircle className="animate-spin text-white" size={50} />
          </div>
        ) : (
          <>
            {filterMessages?.map((msg) => {
              const isSelected = selectedMsgs?.includes(msg.id);

              return (
                <div
                  key={msg.id}
                  className={`flex items-center gap-2 ${msg.senderId === currentUser?.id ? "justify-end" : "justify-start"} ${
                    isSelected ? "bg-gray-500/30 rounded-sm" : ""
                  }`}
                >
                  {deleteMode && msg.senderId !== currentUser?.id && (
                    <input
                      type="checkbox"
                      className={`w-5 h-5 cursor-pointer rounded-sm appearance-none border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700 checked:bg-purple-500 checked:border-purple-500
      checked:after:content-['✔'] checked:after:text-white checked:after:block checked:after:text-xs checked:after:text-center checked:after:leading-[1.1rem] transition-all duration-200`}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedMsgs?.((prev) => (prev.includes(msg.id) ? prev.filter((id) => id !== msg.id) : [...prev, msg.id]));
                      }}
                    />
                  )}

                  <div
                    className={`relative max-w-[70%] px-3 py-2 rounded-lg text-white ${
                      msg.senderId === currentUser?.id ? "bg-purple-500 ml-auto rounded-br-none" : "bg-gray-600 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className="text-[10px] text-gray-200 mt-1 block text-right">
                      {msg.timestamp &&
                        (typeof msg.timestamp.toDate === "function"
                          ? msg.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}

                      {msg.senderId === currentUser?.id && (
                        <span className="inline-block pl-0.5">
                          {msg.status === "sent" && <Check className="text-gray-100" size={14} />}
                          {msg.status === "delivered" && <CheckCheck className="text-gray-100" size={14} />}
                          {msg.status === "read" && <CheckCheck className="text-blue-300" size={14} />}
                        </span>
                      )}
                    </div>

                    <span
                      className={`absolute w-0 h-0 border-t-[8px] border-b-[8px] ${
                        msg.senderId === currentUser?.id
                          ? "border-l-[8px] border-l-purple-500 border-t-transparent border-b-transparent -right-2 top-1"
                          : "border-r-[8px] border-r-gray-600 border-t-transparent border-b-transparent -left-2 top-1"
                      }`}
                    />
                  </div>

                  {deleteMode && msg.senderId === currentUser?.id && (
                    <input
                      type="checkbox"
                      className={`w-5 h-5 cursor-pointer rounded-sm appearance-none border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700 checked:bg-purple-500 checked:border-purple-500
      checked:after:content-['✔'] checked:after:text-white checked:after:block checked:after:text-xs checked:after:text-center checked:after:leading-[1.1rem] transition-all duration-200`}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedMsgs?.((prev) => (prev.includes(msg.id) ? prev.filter((id) => id !== msg.id) : [...prev, msg.id]));
                      }}
                    />
                  )}
                </div>
              );
            })}

            {typing && (
              <div
                className={`relative max-w-[70%] px-3 py-2 rounded-lg text-white flex items-center gap-2 text-sm italic w-fit ${
                  chatData.id === currentUser?.id ? "bg-purple-500 ml-auto rounded-br-none" : "bg-gray-600 rounded-bl-none"
                }`}
              >
                <span>{chatData.name} is typing...</span>
                <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce" />
                <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce animation-delay-200" />
                <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce animation-delay-400" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form className="absolute bottom-0.5 w-full" onSubmit={onSubmit}>
        {deleteMode ? (
          <div className="bg-purple-900 text-white p-2 text-center flex justify-between px-4">
            <span>{selectedMsgs?.length} selected</span>
            <div className="flex items-center gap-2">
              <CustomTooltip title="Delete Selected Messages">
                <button onClick={() => deleteSelectedMessages?.()} className="cursor-pointer" type="button">
                  <Trash2 size={18} />
                </button>
              </CustomTooltip>
              <CustomTooltip title="Close">
                <button
                  onClick={() => {
                    setDeleteMode?.(false);
                    setSelectedMsgs?.([]);
                  }}
                  className="cursor-pointer"
                  type="button"
                >
                  <CircleX size={18} />
                </button>
              </CustomTooltip>
            </div>
          </div>
        ) : (
          <>
            <Input
              placeholder="Message..."
              className="pl-4 font-medium text-[#828282] pb-2 w-full rounded-sm border-2 h-[40px] dark:text-white dark:bg-[#1d1d27] bg-white"
              onChange={onChange}
              value={value}
              disabled={sending}
              readOnly={sending}
            />

            <Button
              type="submit"
              className="text-white text-5xl absolute bottom-0.5 right-0 bg-purple-500 hover:bg-purple-800 p-[7px] cursor-pointer rounded-none"
            >
              {sending ? <LoaderCircle className="animate-spin" /> : <Send />}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export { SelectedChatBox, SelectChatHeader };
