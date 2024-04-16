import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';

export default function RegistModal() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [copyPassword, setCopyPassword] = useState('')


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function registor (e) {
    e.preventDefault()
    if(copyPassword !== password){
      return
    }
    createUserWithEmailAndPassword(auth, email, password).then((user) => {
      setEmail('')
      setPassword('')
      setCopyPassword('')
    }).catch((error) => console.log(error))
  }


  return (
    <>
      <Button onClick={showModal}>
        Log In
      </Button>
      <Modal title="Create an account" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <form onSubmit={registor}>
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
          <input
            value={copyPassword}
            onChange={(e) => setCopyPassword(e.target.value)}
            type='password'
            placeholder='copyPassword'
            />
          <button>Create</button>
        </form>
      </Modal>
    </>
  )
}
