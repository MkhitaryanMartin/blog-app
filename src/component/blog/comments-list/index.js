import { firestore } from '../../../firebase';
import CommentForm from '../../comment-form';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined, CommentOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { getDayText } from '../../../utilits/getData';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../../pages/blog/styles.module.css'


export default function CommentList({ value, user }) {
    const [index, setIndex] = useState("");
    const [openEdte, setOpenEdite] = useState(false);
    const [openAnswer, setOpenAnswer] = useState(false);
    const [parentId, setParentId] = useState("");


    const answerComment = async (params) => {
        if (user) {
            try {
                const blogRef = firestore.collection("blogs").doc(params.blogId);
                const blogSnapshot = await blogRef.get();
                const currentComments = blogSnapshot.data().comments || [];
                const updatedComments = [...currentComments, { ...params, id: uuidv4(), createdAt: new Date() }];
                await blogRef.update({ comments: updatedComments });
                console.log("New comment added to blog with ID:", params.blogId);
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
        setIndex({})
    }

    const deleteComment = async (blogId, commentId) => {
        try {
            const blogRef = firestore.collection("blogs").doc(blogId);
            const blogSnapshot = await blogRef.get();
            const currentComments = blogSnapshot.data().comments || [];
            const updatedComments = currentComments.filter(comment => comment.id !== commentId);
            await blogRef.update({ comments: updatedComments });

            console.log("Comment deleted successfully:", commentId);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    const editComment = async (params) => {
        try {
            const blogRef = firestore.collection("blogs").doc(params.blogId);
            const blogSnapshot = await blogRef.get();
            const currentComments = blogSnapshot.data().comments || [];

            const updatedComments = currentComments.map(comment => {
                if (comment.id === params.commentId) {
                    return { ...comment, text: params.text };
                }
                return comment;
            });

            await blogRef.update({ comments: updatedComments });

            console.log("Comment edited successfully:", params.commentId);
        } catch (error) {
            console.error("Error editing comment:", error);
        }
        setOpenEdite(false)
    }


 return (
        <div className={styles.blog_comments}>
            {value.comments.map((comment, i) => {
                return <div key={i} 
                className={`${styles.comment} ${parentId === comment.id ? styles.active_comment : ""}
                 ${comment?.uid === user?.uid ? styles.user_comment : ""}`} id={comment.id}>
                    
                    <div className={styles.comment_text_block}>
                        <p className={styles.comment_date}>{getDayText(comment.createdAt)}</p>
                        <p className={styles.comment_userName}>{comment.userName}</p>
                        <Tooltip title="comment that was replied to">
                            {comment.parentId ? <a onClick={(e) => {
                                e.stopPropagation()
                                setParentId(comment.parentId)
                                setTimeout(() => {
                                    setParentId("")
                                }, 7000)
                            }} className={styles.parent_comment} href={`#${comment.parentId}`}>{comment?.parentComment}</a> : null}
                        </Tooltip>
                        <p>{comment.text}</p>
                        <div className={styles.comment_text_icon_block}>

                            {user?.uid === comment.uid ? <>
                                <Tooltip title="Delete">
                                    <DeleteOutlined className={styles.comment_delet_icon} onClick={(e) => {
                                        e.stopPropagation()
                                        deleteComment(value.id, comment.id)

                                    }} />
                                </Tooltip>
                                <Tooltip title="Edite">
                                    <EditOutlined className={styles.comment_edite_icon} onClick={(e) => {
                                        e.stopPropagation()
                                        setIndex({ commentI: i, blogId: value.id })
                                        setOpenAnswer(false)
                                        if (index.blogId === value.id && index.commentI === i) {
                                            setOpenEdite(!openEdte)
                                        } else {
                                            setOpenEdite(true)
                                        }

                                    }} />
                                </Tooltip>

                            </> : null}
                            {user ? <Tooltip title="Answer">
                                <CommentOutlined
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIndex({ blogId: value.id, commentI: i })
                                        setOpenEdite(false)
                                        if (index.blogId === value.id && index.commentI === i) {
                                            setOpenAnswer(!openAnswer)
                                        } else {
                                            setOpenAnswer(true)
                                        }
                                    }} />
                            </Tooltip> : null}
                        </div>
                    </div>
                    {index?.commentI === i && value?.id === index?.blogId && !openEdte && openAnswer ? <CommentForm
                        mode='answer-form'
                        handleSubmit={answerComment}
                        buttonText='Answer comment'
                        placeholder='Answer comment'
                        params={{ blogId: value?.id, uid: user?.uid, parentId: comment?.id, userName: user?.displayName, parentComment: comment?.text.substring(0, 10) }}
                    /> : openEdte && !openAnswer && i === index.commentI && value.id === index.blogId ? <CommentForm
                        mode='answer-form'
                        params={{ blogId: value.id, commentId: comment.id }}
                        handleSubmit={editComment}
                        placeholder="Edite comment"
                        buttonText='Edite comment'
                    /> : null}
                </div>
            })}
        </div>


    )
}


