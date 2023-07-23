import React, { useContext, useState } from "react";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/chatContext";

const SearchBar = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const usersRef = collection(db, "users");

  const currentUser = useContext(AuthContext);
  const {dispatch}=useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(usersRef, where("displayName", "==", userName));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const keyHandle = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (u) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    // check the group exists or not
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create a chat in chat collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }


    } catch (error) {
      setErr(true);
    }

    setUser(null);
    setUserName("");
    dispatch({type:"CHANGE_USER",payload:u})
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search chats"
          onKeyDown={keyHandle}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
      </div>
      {err && <span>User Not Found !</span>}
      {user && (
        <div className="userChat" onClick={()=>handleSelect(user)}>
          <img src={user.photoURL} />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
