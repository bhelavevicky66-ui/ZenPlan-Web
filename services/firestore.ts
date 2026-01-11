import { db } from "../firebase";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { Task, WeeklyGoal, UserData, UserRole } from "../types";

export const saveUserProfile = async (user: any) => {
    // If db is not initialized (e.g. firestore not enabled), return fallback
    if (!db) {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "User",
            photoURL: user.photoURL || "",
            role: "user" as UserRole,
            createdAt: Date.now()
        } as UserData;
    }

    const userRef = doc(db, "users", user.uid);
    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const role: UserRole = user.email === "bhelavevicky66@gmail.com" ? "super_admin" : "user";
            const userData: UserData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "User",
                photoURL: user.photoURL || "",
                role: role,
                createdAt: Date.now()
            };
            await setDoc(userRef, userData);
            return userData;
        } else {
            return userSnap.data() as UserData;
        }
    } catch (error) {
        console.error("Firestore error:", error);
        // Return safe fallback
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "User",
            photoURL: user.photoURL || "",
            role: "user",
            createdAt: Date.now()
        } as UserData;
    }
};

export const syncTasks = async (userId: string, tasks: Task[]) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { tasks });
};

export const syncGoals = async (userId: string, goals: WeeklyGoal[]) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { weeklyGoals: goals });
};

export const getUserData = async (userId: string) => {
    if (!db) return null;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    }
    return null;
};

export const getAllUsers = async () => {
    if (!db) return [];
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as UserData);
};

export const updateUserRole = async (targetUserId: string, newRole: UserRole) => {
    if (!db) return;
    const userRef = doc(db, "users", targetUserId);
    await updateDoc(userRef, { role: newRole });
};
