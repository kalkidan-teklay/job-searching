import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    console.log('Searching for user with username:', username);

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const foundUser = querySnapShot.docs[0].data();
        console.log('User found:', foundUser);
        setUser(foundUser);
      } else {
        console.log('No user found with username:', username);
        setUser(null);
      }
    } catch (err) {
      console.error('Error during user search:', err);
    }
  };

  const handleAdd = async () => {
    if (!user) {
      console.error('No user selected to add.');
      return;
    }

    console.log('Adding chat with user:', user);

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      console.log('New chat created with ID:', newChatRef.id);

      const ensureUserChatDocExists = async (userId) => {
        const docRef = doc(userChatsRef, userId);
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            chats: []
          });
        }
  
        return docRef;
      };

      const currentUserChatDocRef = await ensureUserChatDocExists(currentUser.firebaseUID);
      const otherUserChatDocRef = await ensureUserChatDocExists(user.id);

      await updateDoc(otherUserChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.firebaseUID,
          updatedAt: Date.now(),
        }),
      });
      
      await updateDoc(currentUserChatDocRef,{
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      
      });

      console.log('Chat added to both users\' chat lists');
    } catch (err) {
      console.error('Error adding chat:', err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "/image/avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
