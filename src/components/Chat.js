import React, { useContext } from 'react'
import {BsFillCameraVideoFill,BsPersonFillAdd} from 'react-icons/bs'
import {LuMoreHorizontal} from 'react-icons/lu'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/chatContext'
const Chat = () => {

  const {data}=useContext(ChatContext);
  

  return (
    <div className='chat'>
      <div className='chatInfo'>
            <span>{data.user?.displayName}</span>
            <div className='chatIcons'>
                <BsFillCameraVideoFill/>
                <BsPersonFillAdd/>
                <LuMoreHorizontal/>
            </div>
       </div>
       <Messages/>
       <Input/>
    </div>
  )
}

export default Chat
