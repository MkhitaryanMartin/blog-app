import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase';
import styles from './styles.module.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import useEmailValidation from '../../../hooks/useEmailValidation';
import useErrorHandler from '../../../hooks/useErrorHandler';

export default function RegistModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [copyPassword, setCopyPassword] = useState('');
  const [userName, setUsername] = useState('');
  const [errorHandle, contextHolder] = useErrorHandler();
  const { email, setEmail, emailError, handleChange, validateEmail } = useEmailValidation();


  function registor(e) {
    e.preventDefault();
    if (copyPassword !== password || emailError) {
      errorHandle();
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: userName,
        }).then(() => {
          setEmail('');
          setPassword('');
          setUsername('');
          setIsModalOpen(false);
        }).catch((error) => {
          errorHandle(error.message);
        });
      })
      .catch((error) => errorHandle(error.message));
  }

  const handlePassword = (e) => {
    const { name, value } = e.target;
    console.log(value)
    if (value === " " || value !== value.trim()) {
        errorHandle("Password can not start with space or and")
        return
    }
    if (name === "password") {
      setPassword(value);
    } else if (name === "copyPassword") {
      setCopyPassword(value);
    }
};

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Register</Button>
      <Modal title="Create an account" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <form className={styles.form_container} onSubmit={registor}>
          <p className={styles.title_input} >Select your email</p>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            onBlur={validateEmail}
          />
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
          <p className={styles.title_input} >Select your name</p>
          <Input
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"

          />
          <p className={styles.title_input} >Select your password</p>
          <Input.Password
            className={styles.pass_input}
            placeholder="Input password"
            onChange={handlePassword}
            name='password'
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          <p className={styles.title_input} >Copy your password</p>
          <Input.Password
            className={styles.pass_input}
            placeholder="Copy password"
            name='copyPassword'
            onChange={handlePassword}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          {contextHolder}
          <button className={styles.btn}>Create</button>
        </form>
      </Modal>
    </>
  );
}
