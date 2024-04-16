import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function SignIn() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
  
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    function signIn (e) {
      e.preventDefault()
      signInWithEmailAndPassword(auth, email, password).then((user) => {
        console.log(user)
        setEmail('')
        setPassword('')
        alert("All is ok.. Thank you")
      }).catch((error) => console.log(error))
    }
  return (
    <>
      <Button onClick={showModal}>
        Sign In
      </Button>
      <Modal title="Create an account" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <form>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email' 
            placeholder='Email'
            />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='password'
            />
          <button onClick={signIn}>Create</button>
        </form>
      </Modal>
    </>
  )
}
