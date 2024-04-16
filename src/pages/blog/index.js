import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase';
<<<<<<< HEAD
import { useAuthState } from "react-firebase-hooks/auth"
import "./style.css"
import CommentForm from './comment-form';
import { useState } from 'react';
import firebase from 'firebase/compat/app';

export default function Blog() {
    const [user] = useAuthState(auth)
    const [values, loading, error] = useCollectionData(
        firestore.collection('blogs')
    );
    const [index, setIndex] = useState("")

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
            const updatedComments = [...currentComments, { ...params, id:Math.random()}];
            await blogRef.update({ comments: updatedComments });
            console.log("New comment added to blog with ID:", params.blogId);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }
    }
    
    
    



    // const addCommentToBlog = async (id) => {

    //     const blogRef = firestore.collection("blogs").doc(id);

    //     await blogRef.update({
    //         comments: FieldValue.arrayUnion({text:"commentTex"})
    //     });
    // }

    const addCommentToBlog = async (params) => {
        const blogRef = firestore.collection("blogs").doc(params.blogId);
        const blogSnapshot = await blogRef.get();
        const currentComments = blogSnapshot.data().comments || [];
        const updatedComments = [...currentComments, { text: params.text,  id: Math.random() }];
        await blogRef.update({ comments: updatedComments });
    }
console.log(user)
    return (
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
                                        <p>{comment.text}</p>
                                       {index.commentI === i && value.id === index.blogId ?  <CommentForm 
                                        handleSubmit={answerComment} 
                                        buttonText='Answer comment' 
                                        placeholder='answer comment'
                                        params={{blogId:value?.id, uid: user?.uid, parentId: comment?.id}}
                                        />:null}
                                    </div>
                                })}
                            </div>
                   
                            <CommentForm handleSubmit={addCommentToBlog} buttonText="Create Comment" params={{blogId:value?.id}}/>
                    </div>
                })
            }
=======

export default function Blog(){
    const [values, loading, error] = useCollectionData(
        firestore.collection('comments'));
console.log(values)
    const sendMessage =async ()=>{
        firestore.collection("comments").add({
            coment:"asdasd",
            id:Math.random()
        })
    }
    return (
        <section>
<button onClick={sendMessage}>send</button>
>>>>>>> 0a6632ee47082383f9db8c8bc7a784ab1857a076
        </section>
    )
}