import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";

const Userinfo = () => {

  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.avatar || "/image/avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="/image/more.png" alt="" />
        <img src="/image/video.png" alt="" />
        <img src="/image/edit.png" alt="" />
      </div>
    </div>
  )
}

export default Userinfo