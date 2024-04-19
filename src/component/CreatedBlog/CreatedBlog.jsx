import React, { useState } from 'react'
import styles from './styles.module.css'
import { SmileOutlined } from '@ant-design/icons';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tooltip, Modal } from 'antd';
import AddBlog from '../AddBlog/AddBlog';
import { getDayText } from '../../utilits/getData';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from "antd"

export default function CreatedBlog({ blog, deleteBlog, editBlog, user }) {
    const [isOpenModal, setIsOpenModal] = useState(false)

    const handleEditBlog = (params) => {
        editBlog(params);
        setIsOpenModal(false)
    }
    return (
        <div className={styles.main_container} >
            <div className={styles.blog_container}>
                    <span className={styles.user_info}>
                        <p>{blog?.photoURL ? <Avatar src={blog?.photoURL} size={44} /> : <Avatar size={44} icon={<UserOutlined />} />} <span>{blog.userName} </span></p>
                        {
                            user?.uid === blog.uid ? <div className={styles.icon_block}>
                                <Tooltip title="Delete yor blog" className={styles.delete_icon}>
                                    <DeleteOutlined onClick={() => deleteBlog(blog.id)} />
                                </Tooltip>
                                <Tooltip title="Edite your blog">
                                    <EditOutlined onClick={() => setIsOpenModal(true)} />
                                </Tooltip>
                            </div> : null
                        }
                        <span className={styles.date}>{getDayText(blog?.createdAt)}</span>
                    </span>
                <div className={styles.title} ><h3>{blog?.blogTitle}</h3></div>
                <div className={styles.text} >{blog?.blogText}</div>
            </div>
            <Modal open={isOpenModal} onCancel={() => setIsOpenModal(false)} footer={null}>
                <AddBlog onSubmit={handleEditBlog} blogId={blog.id} submitText='Edite blog' />
            </Modal>
        </div>
    )
}

