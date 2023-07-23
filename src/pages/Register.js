import React, { useState } from 'react';
import {FcAddImage} from 'react-icons/fc';
import {BsCheckCircleFill} from 'react-icons/bs';
import {BiError} from 'react-icons/bi';
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {storage,auth,db} from '../Firebase';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc,setDoc } from 'firebase/firestore';
import { useNavigate, Link} from 'react-router-dom';

const Register = () => {
  const navigate=useNavigate();
  const [error,setError]=useState(false);
  const [success,setSuccess]=useState(false);
  const [fileSelection,setFileSelection]=useState(false);
  const [filePath,setFilePath]=useState('');
    

    const handleFile=(e)=>{
      setFileSelection(true);
      setFilePath(URL.createObjectURL(e.target.files[0]));
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        const displayName=e.target[0].value;
        const email=e.target[1].value;
        const password=e.target[2].value;
        const file=e.target[3].files[0];

      try{
        const res= await createUserWithEmailAndPassword(auth, email, password);
        const storageRef = ref(storage, displayName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
        ()=>{

        },
        (error) => {
          setError(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
           await updateProfile(res.user,{
            displayName,
            photoURL:downloadURL
           });
           await setDoc(doc(db,"users",res.user.uid),{
            uid:res.user.uid,
            displayName,
            email,
            photoURL:downloadURL
          });
          await setDoc(
            doc(db,"userChats",res.user.uid),{}
          );
          navigate("/");
          });

          // setSuccess(true);
          
        }
        );
       
       

      }
    
      catch(e){
        setError(true);
      }
    }

    return ( 
            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='logo'>TKIT CHAT</span>
                    <span className='title'>Register</span>
                    <form onSubmit={handleSubmit}>
                        <input type='text' placeholder='display name'/>
                        <input type='email' placeholder='email'/>
                        <input type='password' placeholder='password'/>
                        <input type='file' id='file' onChange={handleFile}/>
                        <label htmlFor='file'>
                            <FcAddImage/>
                            <span>Add an avatar</span>
                            {fileSelection?<img src={filePath} alt={filePath}/>:
                          ''}
                        </label>                     
                        <button>Sign up</button>
                    </form>
                    {error&&<span className='error'><BiError/> Something gone wrong... !!!</span>}
                    {success&&<span className='success'><BsCheckCircleFill/> Registration Successful</span>}
                    <p>You do have an account? <Link to={"/login"}>Login</Link></p>
                </div>
            </div>
    );
}
 
export default Register;