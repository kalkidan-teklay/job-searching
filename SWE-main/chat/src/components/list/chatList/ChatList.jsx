import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.firebaseUID) {
      console.error('currentUser.uid is undefined');
      return;
    }
  
    console.log('Fetching chats for user:', currentUser.firebaseUID);
  
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.firebaseUID),
      async (res) => {
        const items =  res.data()?.chats || [];
        console.log('Fetched chats:', items);

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          if (!user) {
            console.warn('User data not found for receiverId:', item.receiverId);
            return item;
          }

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        console.log('Chats with user data:', chatData);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.firebaseUID]);

  const handleSelect = async (chat) => {
    console.log('Selected chat:', chat);
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
  
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
  
    userChats[chatIndex].isSeen = true;
  
    const userChatsRef = doc(db, "userchats", currentUser.firebaseUID);
  
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
  
      // Ensure `blocked` array is defined before calling `includes`
      if (chat.user.blocked && Array.isArray(chat.user.blocked)) {
        // Additional logic that depends on `blocked` array being defined
        if (!chat.user.blocked.includes(currentUser.firebaseUID)) {
          changeChat(chat.chatId, chat.user);
        } else {
          console.log("You are blocked by this user.");
        }
      } else {
        changeChat(chat.chatId, chat.user);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const filteredChats = chats.filter((c) => {
    if (!c.user || !c.user.username) {
      console.warn('Missing user or username in chat:', c);
      return false;
    }
    return c.user.username.toLowerCase().includes(input.toLowerCase());
  });
  

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="/image/search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "/image/minus.png" : "/image/plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "/image/avatar.png"
                : chat.user.avatar || "/image/avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
