import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase';
import CommentForm from './comment-form';
import {useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { DeleteOutlined, EditOutlined, CommentOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import "./style.css"
import AddBlog from '../../component/AddBlog/AddBlog';



export default function Blog() {
    const [user] = useAuthState(auth)
    const [values, loading, error] = useCollectionData(
        firestore.collection('blogs')
    );
    const [index, setIndex] = useState("");
    const [openEdte, setOpenEdite] = useState(false);
    const [parentId, setParentId] = useState("")

    const answerComment = async (params) => {
        if (user) {
            try {
                const blogRef = firestore.collection("blogs").doc(params.blogId);
                const blogSnapshot = await blogRef.get();
                const currentComments = blogSnapshot.data().comments || [];
                const updatedComments = [...currentComments, { ...params, id: Math.random(), createdAt: new Date()}];
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

    const editComment = async (e, blogId, commentId, newText) => {
        e.preventDefault()
        try {
            const blogRef = firestore.collection("blogs").doc(blogId);
            const blogSnapshot = await blogRef.get();
            const currentComments = blogSnapshot.data().comments || [];

            const updatedComments = currentComments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, text: newText };
                }
                return comment;
            });

            await blogRef.update({ comments: updatedComments });

            console.log("Comment edited successfully:", commentId);
        } catch (error) {
            console.error("Error editing comment:", error);
        }
        setOpenEdite(false)
    }



    const addCommentToBlog = async (params) => {
        const blogRef = firestore.collection("blogs").doc(params.blogId);
        const blogSnapshot = await blogRef.get();
        const currentComments = blogSnapshot.data().comments || [];
        const updatedComments = [...currentComments, { ...params, id: Math.random(), createdAt: new Date()}];
        await blogRef.update({ comments: updatedComments });
    }


 
    return (
        <section>
            {user ? (<AddBlog />): ''}
            {
                values && values.map((value, i) => {
                    return <div key={value.id || i} className='blog'>
                        <div className='blog-text' >
                            <h3>{value.blogTitle}</h3>
                            <p>{value.blogText}</p>
                        </div>
                        <div className='blog-comments'>
                            {value.comments.map((comment, i) => {
                                return <div key={i} className={`comment ${parentId === comment.id?"active-comment":""} ${comment?.uid === user?.uid ? "user-comment":""}`} id={comment.id}>
                                    <div className='comment-text-block'>
                                        <p className='comment-userName'>{comment.userName}</p>
                                        <Tooltip title="comment that was replied to">
                                        <a onClick={(e)=>{
                                            e.stopPropagation()
                                            setParentId(comment.parentId)
                                            setTimeout(()=>{
                                                setParentId("")
                                            },5000)
                                        }} className='parent-comment' href={`#${comment.parentId}`}>{comment?.parentComment}</a>
                                        </Tooltip>
                                        <div className='comment-text-icon-block'>
                                            <p>{comment.text}</p>
                                            {user?.uid === comment.uid ? <>
                                                <Tooltip title="Delete">
                                                    <DeleteOutlined className='comment-delet-icon' onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteComment(value.id, comment.id)

                                                    }} />
                                                </Tooltip>
                                                <Tooltip title="Edite">
                                                    <EditOutlined className='comment-edite-icon' onClick={(e) => {
                                                        e.stopPropagation()
                                                        setOpenEdite(!openEdte)
                                                        setIndex({ commentI: i, blogId: value.id })

                                                    }} />
                                                </Tooltip>
                                               
                                            </> : null}
                                            {user ? <Tooltip title="Answer">
                                                    <CommentOutlined
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIndex({ blogId: value.id, commentI: i })
                                                            setOpenEdite(false)
                                                        }} />
                                                </Tooltip>:null}
                                        </div>
                                    </div>
                                    {index?.commentI === i && value?.id === index?.blogId && !openEdte ? <CommentForm
                                        handleSubmit={answerComment}
                                        buttonText='Answer comment'
                                        placeholder='Answer comment'
                                        params={{ blogId: value?.id, uid: user?.uid, parentId: comment?.id, userName: user?.displayName, parentComment: comment?.text }}
                                    /> : openEdte && i === index.commentI ? <form className='edite-form' onSubmit={(e) => editComment(e, value.id, comment.id, e.target.editeText.value)}>
                                        <input type='text' name='editeText' placeholder='Edite comment'/>
                                        <button>Edite comment</button>
                                    </form> : null}
                                </div>
                            })}
                        </div>

                        {user && <CommentForm handleSubmit={addCommentToBlog} buttonText="Create Comment" params={{ blogId: value?.id, uid: user?.uid, userName: user?.displayName }} />}
                    </div>
                })
            }
        </section>
    )
}

