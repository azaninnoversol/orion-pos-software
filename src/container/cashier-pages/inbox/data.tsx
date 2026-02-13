//firebase
import { db, dbRealtime } from "@/utils/config";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, Unsubscribe, updateDoc } from "firebase/firestore";

//images
import { IMAGES } from "@/utils/resourses";

//next
import { StaticImageData } from "next/image";
import { staffManageService } from "@/services/api_service";
import { BranchValue } from "@/container/dashboard-pages/StaffManage";
import { push, ref, set, update } from "firebase/database";

export interface SearchChatBoxProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type role = "all" | "cashier" | "admin" | "manager" | "kitchen";

export interface FilterRole {
  type: role;
  name: string;
}

export const filterRole: FilterRole[] = [
  {
    name: "All",
    type: "all",
  },
  {
    name: "Manager",
    type: "manager",
  },
  {
    name: "Cashier",
    type: "cashier",
  },
  {
    name: "Kitchen",
    type: "kitchen",
  },
];

export type UserType = "sender" | "receiver";

export interface Message {
  id: string;
  sender: UserType;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  type: role;
  image: string | StaticImageData;
  messages: Message[];
}

export const startTyping = async (chatId: string, userId: string, timeout = 2000) => {
  if (!chatId || !userId) return;

  const typingRef = doc(db, "chats", chatId, "typingStatus", userId);

  try {
    await setDoc(typingRef, { isTyping: true, timestamp: serverTimestamp() });

    setTimeout(async () => {
      await setDoc(typingRef, { isTyping: false, timestamp: serverTimestamp() });
    }, timeout);
  } catch (error) {
    console.error("Error updating typing status:", error);
  }
};

export const listenTyping = (chatId: string, currentUserId: string, callback: (typingUsers: string[]) => void): Unsubscribe => {
  const typingRef = collection(db, "chats", chatId, "typingStatus");

  const unsubscribe = onSnapshot(typingRef, (snapshot) => {
    const typingNow: string[] = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data() as { isTyping?: boolean };
      if (data.isTyping && doc.id !== currentUserId) {
        typingNow.push(doc.id);
      }
    });
    callback(typingNow);
  });

  return unsubscribe;
};

export const stopTyping = async (chatId: string, userId: string) => {
  const typingRef = doc(db, "chats", chatId, "typingStatus", userId);
  try {
    await setDoc(typingRef, { isTyping: false, timestamp: serverTimestamp() });
  } catch (error) {
    console.error("Error stopping typing:", error);
  }
};

export const setOnlineStatus = async (chatId: string, userId: string, state: "online" | "offline") => {
  if (!chatId || !userId) return;

  const statusRef = doc(db, "chats", chatId, "status", userId);
  try {
    await setDoc(statusRef, {
      state,
      last_changed: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error setting chat user status:", error);
  }
};

export const listenUserStatus = (chatId: string, userId: string, callback: (status: { state: string; last_changed: any }) => void): Unsubscribe => {
  if (!chatId || !userId) return () => {};

  const statusRef = doc(db, "chats", chatId, "status", userId);

  const unsubscribe = onSnapshot(statusRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as { state: string; last_changed: any });
    }
  });

  return unsubscribe;
};

export const mockChats: Chat[] = [
  {
    id: "chat1",
    title: "John Doe",
    type: "cashier",
    image: IMAGES.userOne,
    messages: [
      {
        id: "msg1",
        sender: "receiver",
        text: "Hello! How are you?",
        timestamp: "2025-12-05T10:00:00Z",
      },
      {
        id: "msg2",
        sender: "sender",
        text: "I am good, thanks! How about you?",
        timestamp: "2025-12-05T10:01:00Z",
      },
      {
        id: "msg3",
        sender: "receiver",
        text: "I'm fine too. What are you working on?",
        timestamp: "2025-12-05T10:02:00Z",
      },
    ],
  },
  {
    id: "chat2",
    title: "Jane Smith",
    type: "kitchen",
    image: IMAGES.userOne,
    messages: [
      {
        id: "msg1",
        sender: "sender",
        text: "Hey Jane! Can you check the latest report?",
        timestamp: "2025-12-05T09:50:00Z",
      },
      {
        id: "msg2",
        sender: "receiver",
        text: "Sure! I will review it now.",
        timestamp: "2025-12-05T09:51:00Z",
      },
    ],
  },
];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: BranchValue;
}

export const getUserProfile = async (callback: (profile: UserProfile | null) => void) => {
  const staffData = await staffManageService?.getAll();

  if (!staffData?.length) {
    callback(null);
    return;
  }

  return staffData?.map((item) => {
    callback({
      id: item.id,
      name: item.name || "",
      email: item.email || "",
      role: item.role || "guest",
      branch: {
        id: item.branch?.id || "",
        name: item.branch?.name || "",
      },
    });
  });
};
