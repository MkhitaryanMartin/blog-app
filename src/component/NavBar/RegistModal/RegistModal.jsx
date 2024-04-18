import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase';
import styles from './styles.module.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import useEmailValidation from '../../../hooks/useEmailValidation';
import useErrorHandler from '../../../hooks/useErrorHandler';
import { storage } from '../../../firebase';
import { ref, uploadString, getDownloadURL} from 'firebase/storage';
import { handleFileChange } from './utilits';


export default function RegistModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [copyPassword, setCopyPassword] = useState('');
  const [userName, setUsername] = useState('');
  const [errorHandle, contextHolder] = useErrorHandler();
  const { email, setEmail, emailError, handleChange, validateEmail } = useEmailValidation();
  const [switchErorr, setSwitchError] = useState(false)
  const [photo, setPhoto]= useState("")


  const registor = async (e) => {
    e.preventDefault();
  
    // Проверка условий для регистрации
    if (copyPassword !== password || emailError || userName.length < 1) {
      errorHandle(copyPassword !== password ? "Select the correct password" : "Fill all inputs");
      setSwitchError(true);
      return;
    }
  
    try {
      // Создание нового пользователя с помощью электронной почты и пароля
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Обновление профиля пользователя с именем пользователя
      await updateProfile(auth.currentUser, {
        displayName: userName,
        photoURL: null // Устанавливаем null, пока не получим URL фотографии
      });
  
      // Выполнение загрузки фотографии и получение URL фотографии
      const photoData = photo;
      const photoRef = ref(storage, 'userPhotos/photo.jpg');
      await uploadString(photoRef, photoData, 'data_url');
      const photoURL = await getDownloadURL(photoRef);
  
      // Обновление профиля пользователя с полученным URL фотографии
      await updateProfile(auth.currentUser, {
        photoURL: photoURL
      });
  
      // Сброс значений полей и закрытие модального окна
      setEmail('');
      setPassword('');
      setUsername('');
      setIsModalOpen(false);
    } catch (error) {
      // Обработка ошибок
      errorHandle(error.message);
    }
  }
  

  const handlePassword = (e) => {
    const { name, value } = e.target;
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
      <Button className={styles.customButton} onClick={() => setIsModalOpen(true)}>register</Button>
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
            onChange={(e) => {
              const trimmedValue = e.target.value.trim();
              if (trimmedValue.length <= 16 && !/\s/.test(trimmedValue)) {
                setUsername(trimmedValue);
                setSwitchError(false)
              }else {
                setSwitchError(true)
              }
            }}
            type="text"
            placeholder="Username"
          />
          {switchErorr === true ? <p style={{ color: 'red' }}>You cant add more than 16sibels</p> : ""}
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
          <input type='file'  onChange={(e)=>handleFileChange(e, setPhoto)}/>
          {contextHolder}
          <button className={styles.btn}>Create</button>
        </form>
      </Modal>
    </>
  );
}
