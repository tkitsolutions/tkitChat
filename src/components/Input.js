import React, { useContext, useState } from 'react'
import {BsImage} from 'react-icons/bs'
import {ImAttachment} from 'react-icons/im'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/chatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../Firebase';

const Input = () => {

  const [text,setText]=useState("");
  const [img,setImg]=useState(null);

  const currentUser=useContext(AuthContext);
  const {data}=useContext(ChatContext);

  const handleSend=async ()=>{
      if(img){

        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on('state_changed',
        ()=>{

        },
        (error) => {
          
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db,"chats",data.chatId),{
              messages:arrayUnion({
                id:uuid(),
                text,
                senderId:currentUser.uid,
                date:Timestamp.now(),
                img:downloadURL
              })
            })
          });          
        }
        );



      }else{
        await updateDoc(doc(db,"chats",data.chatId),{
          messages:arrayUnion({
            id:uuid(),
            text,
            senderId:currentUser.uid,
            date:Timestamp.now(),

          })
        })
      }

      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId+".lastMessage"]:{text,},
        [data.chatId+ ".date"]:serverTimestamp(),
      });

      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId+".lastMessage"]:{text,},
        [data.chatId+ ".date"]:serverTimestamp(),
      });

      setText("")
      setImg(null)
  }

  return (
    <div className='input'>
        <input type='text' placeholder='Type Something ...' value={text} onChange={e=>setText(e.target.value)}/>
        <div className='send'>
            <BsImage/>
            <input type='file' id='file'  onChange={e=>setImg(e.target.files[0])}/>
            <label htmlFor='file' >
                    <ImAttachment/>
            </label>
            <button onClick={handleSend}>Send</button>
        </div>
    </div>
  )
}

export default Input
