import bot from "../../assets/images/bot.png";

import { useContext, useState } from "react";
import styles from "../../assets/css/Message.module.css";
import { AuthContext } from "../../context/AuthContext";

export default function Message({ role, content }) {
  const { currentUser } = useContext(AuthContext)
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL)

  return (
    <div className={styles.wrapper}>
      <div>
        <img
          src={role === "assistant" ? bot : photoURL}
          className={styles.avatar}
          alt="profile avatar"
        />
      </div>
      <div>
        <p>{content}</p>
      </div>
    </div>
  );
}
