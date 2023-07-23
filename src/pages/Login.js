import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';
import {BiError} from 'react-icons/bi';

const Login = () => {
    const navigate=useNavigate();
    const [error,setError]=useState(false);

      
  
  
      const handleSubmit=async (e)=>{
          e.preventDefault();
          const email=e.target[0].value;
          const password=e.target[1].value;
          console.log(e.target[0].value);
          console.log(e.target[1].value);
        try{
          await signInWithEmailAndPassword(auth,email,password);
         navigate("/");
        }
      
        catch(e){
          setError(true);
        }
      }


    return ( 
            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='logo'>TKIT CHAT</span>
                    <span className='title'>Login</span>
                    <form onSubmit={handleSubmit}>
                        <input type='email' placeholder='email'/>
                        <input type='password' placeholder='password'/>
                        <button>Sign in</button>
                    </form>
                    {error&&<span className='error'><BiError/> Something gone wrong... !!!</span>}
                    <p>You do not have an account? <Link to={"/register"}>Register</Link></p>
                </div>
            </div>
    );
}
 
export default Login;