import React, { useState } from 'react';
import styles from './styles.module.css';
import { Button, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebase';
import useErrorHandler from '../../hooks/useErrorHandler';
import EmojiPicker from 'emoji-picker-react';
import {SmileTwoTone } from '@ant-design/icons'

export default function AddBlog() {
    const [user] = useAuthState(auth);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [errorHandle, contextHolder] = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const createBlog = async (e) => {
        e.preventDefault();
        if (!title || !text) {
            errorHandle();
            return;
        }
        if (user) {
            const docRef = await firestore.collection("blogs").add({
                blogText: text,
                blogTitle: title,
                comments: [],
                uid: user.uid,
                userName: user.displayName
            });
            const docId = docRef.id;
            await firestore.collection("blogs").doc(docId).update({
                id: docId
            });
            setTitle('');
            setText('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === " ") {
            errorHandle("Please fill in the field");
            return;
        }
        if (name === "title") {
            setTitle(value);
        } else if (name === "text") {
            setText(value);
        }
    };

    const handleEmojiClick = (emoji) => {
        setText(text + emoji.emoji);
        setIsModalOpen(false)
    };

    return (
        <div className={styles.main_container} >
            <div className={styles.content_container} >
                <form className={styles.form_contrainer}>
                    <p>Title</p>
                    <Input
                        value={title}
                        onChange={handleChange}
                        type='text'
                        name='title'
                    />
                    <p>Text</p>
                    <TextArea
                        value={text}
                        onChange={handleChange}
                        className={styles.text_section}
                        rows={4}
                        name='text'
                    />
                    <div className={styles.buttons_container} >
                        <button className={styles.btn} onClick={createBlog} >Add Blog</button>
                        <button className={styles.emoji_btn} onClick={(e) => {
                            e.preventDefault()
                            setIsModalOpen(true)
                        }} ><SmileTwoTone /></button>
                    </div>
                </form>

            </div>
            <Modal title="Emoji" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} style={{top: 350}} >
                <EmojiPicker onEmojiClick={handleEmojiClick} style={{height: "300px", width: "auto"}} />
            </Modal>
            {contextHolder}
        </div>
    );
}
