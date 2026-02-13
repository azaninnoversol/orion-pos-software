"use client";
import React, { useEffect, useMemo, useState } from "react";

//components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatList from "@/components/ChatList";
import CustomTooltip from "@/components/CustomTooltip";
import ChatNotSelected from "@/components/ChatNotSelected";
import { SelectedChatBox } from "@/components/chats-components/SelectedChatBox";
import Loading from "@/app/loading";

//icons
import { Search } from "lucide-react";

//typescript
import { FilterRole, filterRole, role, SearchChatBoxProps, UserProfile } from "./data";
import { StaffManageService, userService } from "@/services/api_service";
import { Status } from "@/container/dashboard-pages/customers/data";

//firebase
import { doc, getDoc } from "firebase/firestore";
import { auth, db, dbRealtime } from "@/utils/config";
import { onAuthStateChanged } from "firebase/auth";
import { get, onDisconnect, onValue, push, ref, set } from "firebase/database";

//toast
import { toast } from "sonner";

//images
import { IMAGES } from "@/utils/resourses";

export interface ChatListType {
  id: string;
  name: string;
  email: string;
  role: role;
  image: string;
}

export interface ChatMessageType {
  id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  read: boolean;
  status: "sent" | "delivered" | "read";
  deletedBy?: string[];
}

export const getChatId = (userId1: string, userId2: string) => {
  return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
};

function Inbox() {
  const [searchChat, setSearchChat] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<role>("all");
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [staffData, setStaffData] = useState<StaffManageService[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [chatsWithStaff, setChatsWithStaff] = useState<ChatListType[]>([]);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [msg, setMsg] = useState<string>("");
  const [messagesByChat, setMessagesByChat] = useState<Record<string, ChatMessageType[]>>({});
  const [userStatus, setUserStatus] = useState<any>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [clearChatData, setClearChatData] = useState<Record<string, any>>({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const searchChatboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchChat(e.target.value);
    setSelectedChatId("");
  };

  const roleSelectHandler = (type: role) => {
    setSelectedRole(type);
    setSelectedChatId("");
  };

  const sendMessageHandler = async (text: string) => {
    if (!selectedChatId || !currentUser?.id || !currentUser?.branch?.id) return;

    const branchId = currentUser.branch.id;
    const chatId = getChatId(currentUser.id, selectedChatId);
    const chatRef = ref(dbRealtime, `inbox/${branchId}/messages/${chatId}`);
    const newMsgRef = push(chatRef);

    const messageData: ChatMessageType = {
      senderId: currentUser.id,
      receiverId: selectedChatId,
      text,
      timestamp: Date.now(),
      read: false,
      status: "sent",
    };

    await set(newMsgRef, messageData);

    const chatListingRef = ref(dbRealtime, `inbox/${branchId}/chats/${chatId}`);
    const chatInfo = chatsWithStaff.find((c) => c.id === selectedChatId);
    await set(chatListingRef, {
      participants: {
        [currentUser.id]: true,
        [selectedChatId]: true,
      },
      lastMessage: text,
      lastUpdated: Date.now(),
      userInfo: chatInfo
        ? {
            [selectedChatId]: {
              name: chatInfo.name,
              email: chatInfo.email,
              role: chatInfo.role,
              image: chatInfo.image,
            },
          }
        : {},
    });
  };

  const onMessageSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || !currentUser?.id || !msg.trim()) return;
    setMsg("");

    const chatId = getChatId(currentUser?.id, selectedChatId);
    const typingRef = ref(dbRealtime, `inbox/${currentUser?.branch.id}/typing/${chatId}/${currentUser?.id}`);

    try {
      await sendMessageHandler(msg);
      set(typingRef, false);
    } catch (error) {
      toast.error(`Error : ${(error as Error).message}`);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);

    if (!currentUser || !selectedChatId || !currentUser.branch?.id) return;

    const chatId = getChatId(currentUser.id, selectedChatId);
    const typingRef = ref(dbRealtime, `inbox/${currentUser.branch.id}/typing/${chatId}/${currentUser.id}`);

    set(typingRef, e.target.value.length > 0);
  };

  const clearChat = async () => {
    if (!currentUser?.branch?.id || !selectedChatId) return;

    const branchId = currentUser.branch.id;
    const chatId = getChatId(currentUser.id, selectedChatId);
    const clearRef = ref(dbRealtime, `inbox/${branchId}/clearChat/${chatId}/${currentUser.id}`);

    try {
      await set(clearRef, Date.now());
      toast.success("Chat cleared!");

      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: prev[chatId]?.filter((m) => false),
      }));
    } catch (error) {
      toast.error("Failed to clear chat: " + (error as Error).message);
    }
  };

  const deleteSelectedMessages = async () => {
    if (!currentUser?.branch?.id || !selectedChatId || selectedMsgs.length === 0) return;

    const branchId = currentUser.branch.id;
    const chatId = getChatId(currentUser.id, selectedChatId);

    try {
      await Promise.all(
        selectedMsgs.map(async (msgId) => {
          const msgRef = ref(dbRealtime, `inbox/${branchId}/messages/${chatId}/${msgId}`);
          const msgSnap = await get(msgRef);
          const msgData = msgSnap.val();

          await set(msgRef, {
            ...msgData,
            deletedBy: [...(msgData.deletedBy || []), currentUser.id],
          });
        }),
      );

      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: prev[chatId].filter((msg) => !selectedMsgs.includes(msg?.id as any)),
      }));

      setSelectedMsgs?.([]);
      setDeleteMode?.(false);
      toast.success("Selected messages deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete messages: " + (error as Error).message);
    }
  };

  const getUnreadCount = (chatId: string) => {
    const msgs = messagesByChat[chatId] || [];
    return msgs.filter((msg) => msg.receiverId === currentUser?.id && !msg.read).length;
  };

  useEffect(() => {
    if (!currentUser?.branch?.id) return;

    const branchId = currentUser.branch.id;
    const clearRef = ref(dbRealtime, `inbox/${branchId}/clearChat`);

    return onValue(clearRef, (snap) => {
      setClearChatData(snap.val() || {});
    });
  }, [currentUser?.branch?.id]);

  useEffect(() => {
    if (!currentUser?.id || !currentUser?.branch?.id) return;

    const chatId = getChatId(currentUser.id, selectedChatId);
    const statusRef = ref(dbRealtime, `inbox/${currentUser.branch.id}/userStatus/${chatId}`);

    set(statusRef, {
      online: true,
      lastSeen: Date.now(),
    });

    const disconnectRef = onDisconnect(statusRef);
    disconnectRef.set({
      online: false,
      lastSeen: Date.now(),
    });
  }, [currentUser?.id, currentUser?.branch?.id]);

  useEffect(() => {
    if (!currentUser?.branch?.id) return;

    const statusRef = ref(dbRealtime, `inbox/${currentUser.branch.id}/userStatus`);

    return onValue(statusRef, (snapshot) => {
      setUserStatus(snapshot.val() || {});
    });
  }, [currentUser?.branch?.id]);

  useEffect(() => {
    if (!currentUser?.branch?.id) return;
    const branchId = currentUser.branch.id;

    chatsWithStaff.forEach((chat) => {
      const chatId = getChatId(currentUser.id, chat.id);
      const chatRef = ref(dbRealtime, `inbox/${branchId}/messages/${chatId}`);

      onValue(chatRef, (snapshot) => {
        const data = snapshot.val() || {};
        const userClearTime = clearChatData?.[chatId]?.[currentUser.id] || 0;

        const msgs = Object.entries(data)
          .map(([key, val]: any) => {
            if (val.senderId !== currentUser.id && val.status === "sent") {
              set(ref(dbRealtime, `inbox/${branchId}/messages/${chatId}/${key}/status`), "delivered");
            }
            return { id: key, ...val };
          })
          .filter((m) => m.timestamp > userClearTime);

        setMessagesByChat((prev) => ({
          ...prev,
          [chatId]: msgs,
        }));
      });
    });
  }, [chatsWithStaff, currentUser]);

  useEffect(() => {
    if (!currentUser?.branch?.id) return;

    const branchId = currentUser.branch.id;
    const unsubscribes: (() => void)[] = [];

    chatsWithStaff.forEach((chat) => {
      const chatId = getChatId(currentUser.id, chat.id);
      const typingRef = ref(dbRealtime, `inbox/${branchId}/typing/${chatId}`);

      const unsubscribe = onValue(typingRef, (snap) => {
        const data = snap.val() || {};
        const typingUserIds = Object.entries(data)
          .filter(([userId, isTyping]) => userId !== currentUser.id && isTyping)
          .map(([userId]) => userId);

        setTypingUsers((prev) => ({
          ...prev,
          [chatId]: typingUserIds,
        }));
      });

      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach((fn) => fn());
  }, [chatsWithStaff, currentUser]);

  useEffect(() => {
    if (!selectedChatId || !currentUser?.branch?.id) return;

    const branchId = currentUser.branch.id;
    const chatId = getChatId(currentUser.id, selectedChatId);

    const msgs = messagesByChat[chatId] || [];
    msgs.forEach((msg) => {
      if (msg.receiverId === currentUser.id && !msg.read) {
        const msgRef = ref(dbRealtime, `inbox/${branchId}/messages/${chatId}/${msg.id}`);
        set(msgRef, { ...msg, read: true, status: "read" });
      }
    });
  }, [selectedChatId, messagesByChat]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          toast.error("User data not found");
          return;
        }
        const userData = userDocSnap.data();

        if (!userData) {
          toast.error("Staff data not found");
          return;
        }

        setCurrentUser({
          id: userData.id || "",
          name: userData.name || "",
          email: userData?.email || "",
          role: userData.role || "guest",
          branch: {
            id: userData.branch?.id || "",
            name: userData.branch?.name || "",
          },
        });
      } catch (error) {
        toast.error("Failed to fetch profile: " + (error as Error).message);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser?.branch?.id) return;

    const fetchSameBranchData = async () => {
      try {
        setStaffLoading(true);

        const allStaff = await userService.getAll();
        const sameBranchStaffData = allStaff?.filter((itm) => itm.branch?.id === currentUser.branch.id);
        console.log(sameBranchStaffData, "sameBranchStaffData");

        setStaffData(sameBranchStaffData || []);
      } catch (err) {
        console.error("Failed to fetch branch staff:", err);
        setStaffData([]);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchSameBranchData();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.branch?.id || staffLoading || !staffData.length) return;
    const branchId = currentUser.branch.id;

    setStatus(Status.FETCHING);

    const addStaffListing = async () => {
      try {
        const chatsRef = ref(dbRealtime, `inbox/${branchId}/chats`);
        const chatId = getChatId(currentUser.id, selectedChatId);

        const staffObjects = staffData.map((staff) => ({
          id: staff.id,
          name: staff.name || "",
          email: staff.email || "",
          role: staff.role || "",
          image: IMAGES.UserImg.src,
          chatId: chatId,
        }));

        await set(chatsRef, staffObjects);
        setChatsWithStaff(staffObjects as any);
        setStatus(Status.IDLE);
      } catch (err) {
        setStatus(Status.IDLE);
        console.error("Failed to add staff listing:", err);
      }
    };

    addStaffListing();
  }, [staffData, staffLoading, currentUser, selectedChatId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedChatId("");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredChats = useMemo(() => {
    if (!currentUser) return [];

    const chats = chatsWithStaff
      .filter((item) => !searchChat.trim() || item.name.toLowerCase().includes(searchChat.toLowerCase()))
      .filter((item) => selectedRole === "all" || item.role === selectedRole);

    const sortedChats = chats.sort((a, b) => {
      const aChatId = getChatId(currentUser.id, a.id);
      const bChatId = getChatId(currentUser.id, b.id);

      const aMsgs = messagesByChat[aChatId] || [];
      const bMsgs = messagesByChat[bChatId] || [];

      const aLast = aMsgs.length ? aMsgs[aMsgs.length - 1].timestamp : 0;
      const bLast = bMsgs.length ? bMsgs[bMsgs.length - 1].timestamp : 0;

      return bLast - aLast;
    });

    return sortedChats;
  }, [chatsWithStaff, searchChat, selectedRole, currentUser, messagesByChat]);

  const findChat = filteredChats.find((item) => item.id === selectedChatId);

  if (!currentUser || staffLoading) {
    return <Loading className="min-h-[80vh]!" />;
  }

  return (
    <section id="inbox">
      <main className="px-2 md:px-7 flex flex-col md:flex-row gap-2">
        {(!isMobileView || (isMobileView && !selectedChatId)) && (
          <div className="w-full md:w-[30rem] min-h-[87.7vh] h-auto overflow-y-auto dark:bg-[#1d1d27] bg-white border-r border-gray-300 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-[#1d1d27] z-20 pb-2">
              <SearchChatBox onChange={searchChatboxHandler} value={searchChat} />

              <div className="flex items-center mt-4 px-3 gap-2 overflow-x-auto pb-3 hide-scrollbar x-scrollbar">
                {filterRole?.map((single: FilterRole, index: number) => (
                  <CustomTooltip key={single?.type || index} title={`Find ${single.name}`}>
                    <Button
                      className={`rounded-full text-white whitespace-nowrap dark:hover:bg-gray-800 max-sm:text-[13px]
                  ${single?.type !== selectedRole ? "bg-[#3238a1]" : "bg-purple-900"}`}
                      onClick={() => roleSelectHandler(single?.type)}
                    >
                      {single?.name}
                    </Button>
                  </CustomTooltip>
                ))}
              </div>
            </div>

            <div className="px-3 w-full h-[calc(87.7vh-150px)] overflow-y-auto hide-scrollbar">
              {status === (Status.FETCHING as Status) ? (
                <Loading className="flex items-center justify-center w-full min-h-[200px]!" />
              ) : filteredChats.length > 0 ? (
                filteredChats.map((chat, idx) => {
                  const chatId = getChatId(currentUser?.id, chat.id);
                  const unreadCount = getUnreadCount(chatId);

                  return (
                    <ChatList
                      {...chat}
                      key={idx}
                      onClick={() => setSelectedChatId(chat.id)}
                      unreadCount={unreadCount}
                      isActive={selectedChatId === chat.id}
                      bySelfActive={currentUser.id === chat.id}
                    />
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm w-full text-center mt-4">No Chats Found</p>
              )}
            </div>
          </div>
        )}

        {(!isMobileView || (isMobileView && selectedChatId)) && (
          <div
            className="min-h-[87.7vh] w-full h-auto overflow-y-auto dark:bg-[#1d1d27] bg-white bg-contain bg-center"
            style={{
              backgroundImage: selectedChatId !== "" ? `url(${IMAGES.bgChat.src})` : undefined,
            }}
          >
            {selectedChatId === "" || !findChat ? (
              <ChatNotSelected />
            ) : (
              <SelectedChatBox
                onChange={handleTyping}
                onSubmit={onMessageSubmitHandler}
                onCloseChat={() => setSelectedChatId("")}
                chatData={filteredChats.find((c) => c.id === selectedChatId)!}
                messages={messagesByChat[getChatId(currentUser?.id, selectedChatId)] || []}
                typingUsers={typingUsers}
                userStatus={userStatus}
                currentUser={currentUser}
                deleteMsgHandler={clearChat}
                deleteSelectedMessages={deleteSelectedMessages}
                deleteMode={deleteMode}
                setDeleteMode={setDeleteMode}
                selectedMsgs={selectedMsgs}
                setSelectedMsgs={setSelectedMsgs}
                value={msg}
                selectedChatId={selectedChatId}
                setSelectedChatId={setSelectedChatId}
              />
            )}
          </div>
        )}
      </main>
    </section>
  );
}

export default React.memo(Inbox);

const SearchChatBox = ({ onChange, value }: SearchChatBoxProps) => {
  return (
    <div className="pt-3 w-full px-3 md:px-4">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 w-5 h-5 text-gray-400" />

        <Input
          placeholder="Search Chat..."
          className="w-full pl-11 text-sm sm:text-base font-medium rounded-md border-2 h-10 sm:h-11 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
};
