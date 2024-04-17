import React from 'react'
import styles from './styles.module.css'
import { SmileOutlined } from '@ant-design/icons'

export default function CreatedBlog({ blog }) {

    return (
        <div className={styles.main_container} >
            <div className={styles.blog_container}>
                <div className={styles.user_info}>
                <SmileOutlined /> {blog.userName} 
                </div>
                <div className={styles.title} ><h3>{blog?.blogTitle}</h3></div>
                <div className={styles.text} >{blog?.blogText}</div>
            </div>
        </div>
    )
}
