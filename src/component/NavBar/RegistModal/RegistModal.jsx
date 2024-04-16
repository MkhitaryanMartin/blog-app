import React, { useState } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase';
import styles from './styles.module.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export default function RegistModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copyPassword, setCopyPassword] = useState('');
  const [userName, setUsername] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const errorHandle = (message) => {
    messageApi.open({
      type: 'error',
      content: message ? message : 'Please check your password or copy password',
    });
  };

  function registor(e) {
    e.preventDefault();
    if (copyPassword !== password) {
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


  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Register</Button>
      <Modal title="Create an account" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <form className={styles.form_container} onSubmit={registor}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <Input
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
          />
          <Input.Password
            className={styles.pass_input}
            placeholder="Input password"
            onChange={(e) => setPassword(e.target.value)}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          <Input.Password
            className={styles.pass_input}
            placeholder="Copy password"
            onChange={(e) => setCopyPassword(e.target.value)}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          {contextHolder}
          <button className={styles.btn}>Create</button>
        </form>
      </Modal>
    </>
  );
}
