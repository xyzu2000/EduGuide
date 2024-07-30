import bot from "../../assets/images/bot.png";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Message({ role, content }) {
  const { currentUser } = useContext(AuthContext)
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL)

  return (
    <div
      className={`flex ${role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
        } items-start min-h-[60px] p-5 mb-5`}
    >
      <div
        className={`flex items-center ${role === 'assistant' ? 'mr-2' : 'ml-2'
          }`}
      >
        <img
          src={role === 'assistant' ? bot : photoURL}
          className="w-[40px] h-[40px] rounded-[25%]"
          alt="profile avatar"
        />
      </div>
      <div
        className={`flex-1 ${role === 'assistant' ? 'text-left' : 'text-right'
          }`}
      >
        <div
          className={`inline-block ${role === 'assistant' ? 'bg-[#3b3b3d]' : 'bg-[#4a4a4a]'
            } p-3 rounded-[10px]`}
        >
          <p className="text-white">{content}</p>
        </div>
      </div>
    </div>
  );



}
