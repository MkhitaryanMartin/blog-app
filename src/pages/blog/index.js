import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase';
import CommentForm from './comment-form';
import { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { DeleteOutlined, EditOutlined, CommentOutlined } from '@ant-design/icons';
import {Tooltip } from 'antd';
import AddBlog from '../../component/AddBlog/AddBlog';
import CreatedBlog from '../../component/CreatedBlog/CreatedBlog';
import { getDayText } from '../../utilits/getData';
import SignIn from '../../component/NavBar/SignIn/SignIn';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import "./style.css"
import Input from '../../component/Input/input';
import BlogFilter from '../../component/blog/blog-filter';



export default function Blog() {
    const [user] = useAuthState(auth)
    const [values, loading, error] = useCollectionData(
        firestore.collection('blogs').orderBy("createdAt", "desc")
    );
    const [index, setIndex] = useState("");
    const [openEdte, setOpenEdite] = useState(false);
    const [openAnswer, setOpenAnswer] = useState(false);
    const [parentId, setParentId] = useState("");
    const [searchBlog, setSearchBlog] = useState("")



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

    const deleteBlog = async (blogId) => {
        try {
            const blogRef = firestore.collection("blogs").doc(blogId);
            await blogRef.delete();
    
            console.log("Blog deleted successfully:", blogId);
        } catch (error) {
            console.error("Error deleting blog:", error);
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

    const editBlog = async (params) => {
        try {
            const blogRef = firestore.collection("blogs").doc(params.blogId);
            await blogRef.update({
                blogTitle: params.title,
                blogText: params.text
            });
    
            console.log("Blog edited successfully:", params.blogId);
        } catch (error) {
            console.error("Error editing blog:", error);
        }
    };

    const addCommentToBlog = async (params) => {
        const blogRef = firestore.collection("blogs").doc(params.blogId);
        const blogSnapshot = await blogRef.get();
        const currentComments = blogSnapshot.data().comments || [];
        const updatedComments = [...currentComments, { ...params, id: uuidv4(), createdAt: new Date() }];
        await blogRef.update({ comments: updatedComments });
    }

const createBlog = async (params)=>{
    if (user) {
        const docRef = await firestore.collection("blogs").add({
            blogText: params.text,
            blogTitle: params.title,
            comments: [],
            uid: user.uid,
            userName: user.displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        const docId = docRef.id;
        await firestore.collection("blogs").doc(docId).update({
            id: docId
        });
      
    }
}
const onChanSearch = (newValue) => {
    setSearchBlog(newValue);
}
const [selectedOption, setSelectedOption] = useState(null);

const handleOptionChange = (option) => {
  setSelectedOption(option);
};

console.log(selectedOption)
    return (
        <section>
            {user ? (<AddBlog  onSubmit={createBlog} submitText='Create blog'/>) : ''}
            <BlogFilter value={searchBlog} onChange={onChanSearch} onChangeRadio={handleOptionChange} valiuRadio={selectedOption} user={user}/>
            {
                values && values.filter((value)=>{
                   if(selectedOption){
                    return value?.blogTitle.toLowerCase().includes(searchBlog.toLowerCase()) && user?.uid === value.uid
                   }else{
                    console.log("else", selectedOption)
                    return value?.blogTitle.toLowerCase().includes(searchBlog.toLowerCase())
                   }
                }
            ).map((value, i) => {
                    return <div key={value.id || i} className='blog'>
                        <CreatedBlog blog={value} deleteBlog={deleteBlog} editBlog={editBlog} user={user}/>
                        <div className='blog-comments'>
                            {value.comments.map((comment, i) => {
                                return <div key={i} className={`comment ${parentId === comment.id ? "active-comment" : ""} ${comment?.uid === user?.uid ? "user-comment" : ""}`} id={comment.id}>
                                    <div className='comment-text-block'>
                                    <p className='comment-date'>{getDayText(comment.createdAt)}</p>
                                        <p className='comment-userName'>{comment.userName}</p>
                                        <Tooltip title="comment that was replied to">
                                            {comment.parentId ? <a onClick={(e) => {
                                                e.stopPropagation()
                                                setParentId(comment.parentId)
                                                setTimeout(() => {
                                                    setParentId("")
                                                }, 7000)
                                            }} className='parent-comment' href={`#${comment.parentId}`}>{comment?.parentComment}</a>:null}
                                        </Tooltip>
                                        <p>{comment.text}</p>
                                        <div className='comment-text-icon-block'>
                                            
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
                                                        setIndex({ commentI: i, blogId: value.id })
                                                        setOpenAnswer(false)
                                                        if(index.blogId === value.id && index.commentI === i){
                                                            setOpenEdite(!openEdte)
                                                        }else{
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
                                                        if(index.blogId === value.id && index.commentI === i){
                                                            setOpenAnswer(!openAnswer)
                                                        }else{
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
                                        params={{ blogId: value?.id, uid: user?.uid, parentId: comment?.id, userName: user?.displayName, parentComment: comment?.text.substring(0,10) }}
                                    /> : openEdte && !openAnswer && i === index.commentI && value.id === index.blogId ? <CommentForm
                                    mode='answer-form'
                                    params={{blogId:value.id, commentId:comment.id}}
                                    handleSubmit={editComment}
                                    placeholder="Edite comment"
                                    buttonText='Edite comment'
                                    /> : null}
                                </div>
                            })}
                        </div>

                        {user ? <CommentForm handleSubmit={addCommentToBlog} buttonText="Create Comment" params={{ blogId: value?.id, uid: user?.uid, userName: user?.displayName }} />: (
                            <div className='comment-signin'>
                                <p>Login to write a comment</p> 
                            <SignIn/>
                            </div>
                        ) }
                    </div>
                })
            }
        </section>
    )
}

                               
