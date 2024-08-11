import React from 'react'
import ChatList from "./chatList/ChatList"
import UserInfo from "./userInfo/UserInfo"
const List = () => {
    return (
        <div className='flex flex-col flex-1'>
            <UserInfo />
            <ChatList />
        </div>
    )
}

export default List