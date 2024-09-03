import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    console.log('fetchUserInfo called with UID:', uid);
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('User document found:', docSnap.data());
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.log('No user document found for UID:', uid);
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
