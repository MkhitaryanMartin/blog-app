import React, { useState } from 'react'
import styles from './styles.module.css'
import { SmileOutlined } from '@ant-design/icons';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tooltip,  Modal } from 'antd';
import AddBlog from '../AddBlog/AddBlog';
import { getDayText } from '../../utilits/getData';


export default function CreatedBlog({ blog, deleteBlog, editBlog }) {
    const [isOpenModal, setIsOpenModal]= useState(false)

const handleEditBlog=(params)=>{
    editBlog(params);
    setIsOpenModal(false)
}
    return (
        <div className={styles.main_container} >
            <div className={styles.blog_container}>
                <div className={styles.user_info}>
                    <span><SmileOutlined /> {blog.userName} <span>{getDayText(blog?.createdAt)}</span></span>
                    <div className={styles.icon_block}>
                        <Tooltip title="Delete yor blog" className={styles.delete_icon}>
                            <DeleteOutlined onClick={()=>deleteBlog(blog.id)}/>
                        </Tooltip>
                        <Tooltip title="Edite your blog">
                            <EditOutlined onClick={()=> setIsOpenModal(true)}/>
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.title} ><h3>{blog?.blogTitle}</h3></div>
                <div className={styles.text} >{blog?.blogText}</div>
            </div>
            <Modal open={isOpenModal} onCancel={()=> setIsOpenModal(false)} footer={null}>
                <AddBlog onSubmit={handleEditBlog} blogId={blog.id} submitText='Edite blog'/>
            </Modal>
        </div>
    )
}

