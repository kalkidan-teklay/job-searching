import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

function getCurrentUserFromSession() {
  const cookies = document.cookie.split('; ');
  console.log('Cookies:', cookies); // Log all cookies
  const firebaseUID = cookies.find(row => row.startsWith('firebaseUID='));
  return firebaseUID ? firebaseUID.split('=')[1] : null;
}


const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    console.log('App component mounted');
    const firebaseUID = getCurrentUserFromSession();
    if (firebaseUID) {
      console.log("Firebase UID found:",firebaseUID);
      fetchUserInfo(firebaseUID);
    } else {
      console.error('No firebaseUID found, redirecting to login.'); 
    }
  }, [fetchUserInfo]);

  if (isLoading) {
    console.log('Still loading...');
    return <div className="loading">Loading...</div>;
  }
  console.log('Loading complete, rendering app with currentUser:', currentUser);

  return (
    <div className="container">
      {currentUser && (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      )}
      <Notification />
    </div>
  );
};

export default App;
