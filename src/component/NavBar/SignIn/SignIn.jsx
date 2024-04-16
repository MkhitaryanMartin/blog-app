import React, { useState } from 'react';
import { Button, Modal, Input, message } from 'antd';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './styles.module.css'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


export default function SignIn() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const errorHandle = (message) => {
        messageApi.open({
            type: 'error',
            content: message ? message : 'Please check your email or password',
        });
    };

    function signIn(e) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
            setEmail('');
            setPassword('');
            setIsModalOpen(false);
        }).catch((error) => errorHandle(error.message));
    }

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                Sign In
            </Button>
            <Modal title="Create an account" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <form className={styles.form_container}>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type='email'
                        placeholder='Email'
                    />
                    <Input.Password
                        className={styles.pass_input}
                        placeholder="input password"
                        onChange={(e) => setPassword(e.target.value)}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <button onClick={signIn} className={styles.btn} >Sign In</button>
                    {contextHolder}
                </form>
            </Modal>
        </>
    );
}
