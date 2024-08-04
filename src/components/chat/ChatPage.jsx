import React, { useContext, useState } from 'react'
import { AuthContext } from "../../context/AuthContext"
import Detail from "../detail/Detail"
import List from "../list/List"
import LoadingSpinner from "../loadingPage/LoadingSpinner"
import "./chatPage.css"
import CompleteChat from "./CompleteChat"

const ChatPage = () => {
    const [showDetail, setShowDetail] = useState(false);
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        return <LoadingSpinner />
    }
    return (
        <div className='chat-container'>
            <List />
            <CompleteChat toggleDetail={() => setShowDetail(prev => !prev)} />
            {showDetail && <Detail />}
        </div>
    )
}

export default ChatPage