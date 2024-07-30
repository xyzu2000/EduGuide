import React, { useState } from 'react'
import Detail from "../detail/Detail"
import List from "../list/List"
import "./chatPage.css"
import CompleteChat from "./CompleteChat"
const ChatPage = () => {
    const [showDetail, setShowDetail] = useState(false);

    return (
        <div className="page-container">
            <div className='chat-container'>
                <List />
                <CompleteChat toggleDetail={() => setShowDetail(prev => !prev)} />
                {showDetail && <Detail />}
            </div>
        </div>
    )
}

export default ChatPage