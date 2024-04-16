import React, { useState } from 'react'
import styles from './styles.module.css'
import { Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../firebase'

export default function AddBlog() {
    const [user] = useAuthState(auth)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const createBlog = async (e) => {
        e.preventDefault();
        if (user) {
            const docRef = await firestore.collection("blogs").add({
                blogText: text,
                blogTitle: title,
                comments: [],
                uid: user.uid
            });
            const docId = docRef.id;
            await firestore.collection("blogs").doc(docId).update({
                id: docId
            });
            setTitle('');
            setText('');
        }
    }


  return (
    <div className={styles.main_container} >
        <div className={styles.content_container} >
            <form className={styles.form_contrainer} onSubmit={createBlog} >
                <p>Title</p>
                <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type='text'
                />
                <p>Text</p>
                <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={styles.text_section} 
                rows={4} />
                <button className={styles.btn} >Add Blog</button>
            </form>
        </div>
    </div>
  )
}
