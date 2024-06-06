import bot from "../../assets/images/bot.png";
import user from "../../assets/images/user.png";

import styles from "../../assets/css/Message.module.css";

export default function Message({ role, content }) {
  return (
    <div className={styles.wrapper}>
      <div>
        <img
          src={role === "assistant" ? bot : user}
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
