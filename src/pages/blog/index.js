import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase';
import CommentForm from './comment-form';
import { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import "./style.css"



export default function Blog() {
    const [user] = useAuthState(auth)
    const [values, loading, error] = useCollectionData(
        firestore.collection('blogs')
    );
    const [index, setIndex] = useState("");
    const [openEdte, setOpenEdite] = useState(false)

    const createBlog = async () => {
        if (user) {
            const docRef = await firestore.collection("blogs").add({
                blogText: "blog text",
                blogTitle: "title",
                comments: [],
                uid: user.uid
            });
            const docId = docRef.id;
            await firestore.collection("blogs").doc(docId).update({
                id: docId
            });
        }
    }


    const answerComment = async (params) => {
    if(user){
        try {
            const blogRef = firestore.collection("blogs").doc(params.blogId);
            const blogSnapshot = await blogRef.get();
            const currentComments = blogSnapshot.data().comments || [];
            const updatedComments = [...currentComments, { ...params,  id:Math.random()}];
            await blogRef.update({ comments: updatedComments });
            console.log("New comment added to blog with ID:", params.blogId);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }
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
        const updatedComments = [...currentComments, { ...params,  id: Math.random() }];
        await blogRef.update({ comments: updatedComments });
    }
console.log(values)
return(
   <section>
        <button onClick={createBlog}>createBlog</button>
    {
        values && values.map((value,i) => {
           return <div key={value.id || i} className='blog'>
                <div className='blog-text' >
                    <h3>{value.blogTitle}</h3>
                    <p>{value.blogText}</p>
                </div>
                <div className='blog-comments'>
                        {value.comments.map((comment,i)=>{
                            return <div key={i} className='comment' onClick={(e)=> {
                                e.stopPropagation();
                                setIndex({blogId:value.id, commentI:i})
                            }}>
                                <div className='comment-text-block'>
                                <p className='comment-userName'>{comment.userName}</p>
                                <div className='comment-text-icon-block'>
                                    <p>{comment.text}</p>
    
                                   {user.uid === comment.uid ? <>
                                    <DeleteOutlined className='comment-delet-icon' onClick={(e)=> {
                                        e.stopPropagation()
                                        deleteComment(value.id, comment.id)

                                    }}/>
                                    <EditOutlined className='comment-edite-icon'  onClick={(e)=> {
                                        e.stopPropagation()
                                       setOpenEdite(!openEdte)

                                    }}/>
                                    {openEdte ?  <form className='edite-form' onSubmit={(e)=>editComment(e, value.id, comment.id, e.target.editeText.value)}>
                                        <input type='text' name='editeText'/>
                                        <button>Edite comment</button>
                                    </form>:null}
                                   </>:null}
                               </div>
                                </div>
                               {index.commentI === i && value.id === index.blogId ?  <CommentForm 
                                handleSubmit={answerComment} 
                                buttonText='Answer comment' 
                                placeholder='answer comment'
                                params={{blogId:value?.id, uid: user?.uid, parentId: comment?.id, userName:user.displayName}}
                                />:null}
                            </div>
                        })}
                    </div>
           
                    <CommentForm handleSubmit={addCommentToBlog} buttonText="Create Comment" params={{blogId:value?.id, uid:user.uid, userName:user.displayName}}/>
            </div>
        })
    }
   </section>
)
}

