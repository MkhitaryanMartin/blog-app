import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import styles from './styles.module.css'

export default function RegistModal() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [copyPassword, setCopyPassword] = useState('')

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function registor(e) {
    e.preventDefault()
    if (copyPassword !== password) {
      return
    }
    createUserWithEmailAndPassword(auth, email, password).then((user) => {
      setEmail('')
      setPassword('')
      setCopyPassword('')
      handleCancel()
    }).catch((error) => console.log(error))
  }


  return (
    <>
      <Button onClick={showModal}>
        Regisor
      </Button>
      <Modal title="Create an account" open={isModalOpen} onCancel={handleCancel}>
        <form  className={styles.form_container} onSubmit={registor}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Email'
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='password'
          />
          <Input
            value={copyPassword}
            onChange={(e) => setCopyPassword(e.target.value)}
            type='password'
            placeholder='copyPassword'
          />
          <Button>Create</Button>
        </form>
      </Modal>
    </>
  )
}
