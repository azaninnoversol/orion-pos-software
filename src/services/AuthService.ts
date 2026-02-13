// firebase
import { auth, db } from "@/utils/config";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  updateEmail,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// toast
import { toast } from "sonner";

// types
import { BranchValue } from "@/container/dashboard-pages/StaffManage";

// services
import { userService } from "./api_service";

interface RegisterPayload {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  card_number?: number | string;
  card_cvc?: number | string;
  card_date?: Date | number | string;
  branch?: {
    id: string;
    name: string;
  };
  role?: string;
  phone?: string | number;
  shiftStartTime?: string | Date;
  shiftEndTime?: string | Date;
  createdAt?: number | Date;
}

interface LoginPayload {
  email?: string;
  password?: string;
}

export const RegisterAuth = async ({ email, password }: any) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email as string, password as string);
  return userCredential.user;
};

export const registerUser = async ({
  email,
  password,
  name,
  address,
  country,
  city,
  zipCode,
  card_number,
  card_cvc,
  card_date,
  branch,
  phone,
  shiftStartTime,
  shiftEndTime,
  createdAt,
  role,
}: RegisterPayload) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email as string, password as string);

  await updateProfile(userCredential.user, { displayName: name });

  await setDoc(doc(db, "users", userCredential.user.uid), {
    id: userCredential.user.uid,
    name,
    email,
    address,
    country,
    city,
    zipCode,
    card_number,
    card_cvc,
    card_date,
    role: "manager",
    phone,
    shiftStartTime,
    shiftEndTime,
    branch: branch || { id: "", name: "" },
    createdAt: new Date(),
    userCode: password,
  });

  return userCredential.user;
};

export const loginUser = async ({ email = "", password = "" }: LoginPayload) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = () => signOut(auth);

export const onAuthStateChangedListener = (callback: (user: User | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

export const sendLoginLink = async (email: string) => {
  const actionCodeSettings = {
    url: "http://localhost:3000/create-password",
    handleCodeInApp: true,
  };
  try {
    const sendNOt = await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log(sendNOt, "sendNOt");
    toast.success("Sign-in link sent to " + email);
  } catch (error) {
    toast.error(`error:${error}`);
  }
};

export const updateStaffManage = async (uid: string, data: any) => {
  const docRef = doc(db, "staff_manage", uid);
  await setDoc(docRef, data, { merge: true });
};

export const reAuthenticateUser = async (password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const credential = EmailAuthProvider.credential(user.email!, password);

  return reauthenticateWithCredential(user, credential);
};

export const updateUserName = async (newName: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await updateProfile(user, {
      displayName: newName,
    });
  } catch (error: any) {
    throw new Error("Failed to update name");
  }

  await userService.update(user.uid, {
    name: newName,
  });

  await updateStaffManage(user.uid, {
    name: newName,
  });
};

export const updateUserEmail = async (newEmail: string, password?: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    if (password) await reAuthenticateUser(password);

    await updateEmail(user, newEmail);
  } catch (error: any) {
    if (error.code === "auth/requires-recent-login") {
      throw new Error("Please login again to update email");
    }
    throw error;
  }

  await userService.update(user.uid, {
    email: newEmail,
  });

  await updateStaffManage(user.uid, {
    email: newEmail,
  });
};

export const updateUserPassword = async (oldPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await reAuthenticateUser(oldPassword);
    await updatePassword(user, newPassword);
  } catch (error: any) {
    if (error.code === "auth/wrong-password") {
      throw new Error("Old password is incorrect");
    }
    throw error;
  }
};
