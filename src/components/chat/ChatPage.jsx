import React, { useContext } from 'react'
import { AuthContext } from "../../context/AuthContext"
// import Detail from "../detail/Detail"
import List from "../list/List"
import LoadingSpinner from "../loadingPage/LoadingSpinner"
import CompleteChat from "./CompleteChat"

const ChatPage = () => {
    // const [showDetail, setShowDetail] = useState(false);
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        return <LoadingSpinner />
    }
    return (
        <div className="w-[80vw] h-[83vh] bg-background-chatLight dark:bg-background-chatDark rounded-[12px] border border-[rgba(255,255,255,0.125)] flex text-whitesmoke">
            <List />
            <CompleteChat />
            {/* <CompleteChat toggleDetail={() => setShowDetail(prev => !prev)} />
            {showDetail && <Detail />} */}
        </div>
    )

}

export default ChatPage